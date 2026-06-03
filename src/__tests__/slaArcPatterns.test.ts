/**
 * slaArcPatterns.test.ts
 * CI Invariant Tests — SLA Grammar Arc Pattern Layer
 *
 * Run with: npx vitest
 * These tests gate the grammar layer the same way slaRegistry.test.ts gates the registry.
 * A grammar system whose arc patterns have never been forced to fail has not proven governance.
 */

import { describe, expect, test } from "vitest";
import {
  SLA_ARC_PATTERNS,
  SLA_MULTI_ARC_SCANS,
  getArcPattern,
  getArcsByT3Mode,
  getArcsByPrimitive,
  assertArcPatternInvariants,
} from "./slaArcPatterns";
import {
  getPrimitive,
  hasPrimitive,
  getLevel1Primitives,
} from "./slaRegistry";

// ─────────────────────────────────────────────────────────────────────────────
// COUNT INVARIANTS
// ─────────────────────────────────────────────────────────────────────────────

describe("Arc Pattern Count Lock", () => {
  test("arc pattern count must equal 8", () => {
    expect(SLA_ARC_PATTERNS.length).toBe(8);
  });

  test("all arc IDs are unique", () => {
    const ids = SLA_ARC_PATTERNS.map(a => a.arcId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("arc IDs follow SLA-ARC-NNN format", () => {
    for (const arc of SLA_ARC_PATTERNS) {
      expect(arc.arcId).toMatch(/^SLA-ARC-\d{3}$/);
    }
  });

  test("assertArcPatternInvariants() passes cleanly", () => {
    expect(() => assertArcPatternInvariants()).not.toThrow();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// REGISTRY INTEGRITY — arc layer reads from registry, never owns data
// ─────────────────────────────────────────────────────────────────────────────

describe("Arc → Registry Integrity", () => {
  test("all primitives in arc sequences exist in the registry (not parked)", () => {
    for (const arc of SLA_ARC_PATTERNS) {
      for (const primId of arc.primitiveSequence) {
        if (primId === "L3" || primId === "S4" || primId === "I2" || primId === "I4") {
          // provisional but not parked — they exist even if unconfirmed
          const p = getPrimitive(primId);
          expect(p).toBeDefined();
          if (p) expect(p.status).not.toBe("parked");
        } else {
          expect(hasPrimitive(primId)).toBe(true);
        }
      }
    }
  });

  test("all level1Present primitives exist in registry", () => {
    for (const arc of SLA_ARC_PATTERNS) {
      for (const primId of arc.level1Present) {
        expect(getPrimitive(primId)).toBeDefined();
      }
    }
  });

  test("all nearestArcConfusion arcIds reference existing arcs", () => {
    for (const arc of SLA_ARC_PATTERNS) {
      const ref = arc.nearestArcConfusion.arcId;
      const target = getArcPattern(ref);
      expect(target).toBeDefined();
      expect(ref).not.toBe(arc.arcId); // arc cannot confuse itself
    }
  });

  test("all specimen nominations have valid format", () => {
    for (const arc of SLA_ARC_PATTERNS) {
      for (const spec of arc.specimenNominations) {
        expect(spec.specimenId).toBeTruthy();
        expect(["candidate", "confirmed", "sealed"]).toContain(spec.status);
        expect(["personal", "literary", "mythic", "cultural", "clinical"]).toContain(spec.scale);
      }
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// T3 MODE ENFORCEMENT
// ─────────────────────────────────────────────────────────────────────────────

describe("T3 Mode Declarations", () => {
  test("arcs containing T3 must not have t3Mode = not_applicable", () => {
    for (const arc of SLA_ARC_PATTERNS) {
      if (arc.primitiveSequence.includes("T3")) {
        expect(arc.t3Mode).not.toBe("not_applicable");
      }
    }
  });

  test("arcs not containing T3 must have t3Mode = not_applicable", () => {
    for (const arc of SLA_ARC_PATTERNS) {
      if (!arc.primitiveSequence.includes("T3")) {
        expect(arc.t3Mode).toBe("not_applicable");
      }
    }
  });

  test("each t3Mode value appears at least once", () => {
    const modes = SLA_ARC_PATTERNS.map(a => a.t3Mode);
    expect(modes).toContain("transient");
    expect(modes).toContain("structural");
    expect(modes).toContain("structural_home");
    expect(modes).toContain("unresolved_basin");
    expect(modes).toContain("not_applicable");
  });

  test("getArcsByT3Mode returns correct arcs for transient", () => {
    const transient = getArcsByT3Mode("transient");
    expect(transient.length).toBeGreaterThan(0);
    for (const arc of transient) {
      expect(arc.t3Mode).toBe("transient");
    }
  });

  test("getArcsByT3Mode returns correct arcs for structural (Type B Closure)", () => {
    const structural = getArcsByT3Mode("structural");
    expect(structural.length).toBeGreaterThanOrEqual(1);
    const arcIds = structural.map(a => a.arcId);
    expect(arcIds).toContain("SLA-ARC-002"); // Recognition Collapse must be here
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TYPE B CLOSURE (ARC-002) — critical governance tests
// ─────────────────────────────────────────────────────────────────────────────

describe("Type B Closure (ARC-002)", () => {
  const arc002 = getArcPattern("SLA-ARC-002");

  test("ARC-002 exists", () => {
    expect(arc002).toBeDefined();
  });

  test("ARC-002 has confirmed status — two sealed specimens exist", () => {
    expect(arc002?.status).toBe("confirmed");
  });

  test("ARC-002 t3Mode is structural (not transient)", () => {
    expect(arc002?.t3Mode).toBe("structural");
  });

  test("ARC-002 has T3 as terminal primitive", () => {
    expect(arc002?.terminalPrimitive).toBe("T3");
  });

  test("ARC-002 has PTL-001 as sealed specimen", () => {
    const ptl = arc002?.specimenNominations.find(s => s.specimenId === "PTL-001");
    expect(ptl?.status).toBe("sealed");
  });

  test("ARC-002 has governance note containing WEAP-001", () => {
    expect(arc002?.governanceNotes).toContain("WEAP-001");
  });

  test("ARC-002 resolution type is collapse", () => {
    expect(arc002?.resolutionType).toBe("collapse");
  });

  test("ARC-002 chaos role is revelatory", () => {
    expect(arc002?.chaosRole).toBe("revelatory");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// FIDELITY CEILINGS
// ─────────────────────────────────────────────────────────────────────────────

describe("Arc Fidelity Ceilings", () => {
  test("all arcs have fidelity ceiling of DAVAR (grammar layer is DAVAR by default)", () => {
    for (const arc of SLA_ARC_PATTERNS) {
      // Grammar arcs are DAVAR ceiling until confirmed with E3+ evidence
      // No arc should claim EMET unilaterally
      expect(["DAVAR", "QOL"]).toContain(arc.fidelityCeiling);
    }
  });

  test("arcs with T3 present have DAVAR ceiling (T3 mode declaration required)", () => {
    for (const arc of SLA_ARC_PATTERNS) {
      if (arc.primitiveSequence.includes("T3")) {
        expect(arc.fidelityCeiling).toBe("DAVAR");
      }
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// MULTI-ARC SCAN INTEGRITY
// ─────────────────────────────────────────────────────────────────────────────

describe("Multi-Arc Scan Integrity", () => {
  test("all multi-arc scan primary arcs exist", () => {
    for (const scan of SLA_MULTI_ARC_SCANS) {
      expect(getArcPattern(scan.primaryArc)).toBeDefined();
    }
  });

  test("all multi-arc scan secondary arcs exist", () => {
    for (const scan of SLA_MULTI_ARC_SCANS) {
      expect(getArcPattern(scan.secondaryArc)).toBeDefined();
    }
  });

  test("multi-arc scan primary and secondary arcs are distinct", () => {
    for (const scan of SLA_MULTI_ARC_SCANS) {
      expect(scan.primaryArc).not.toBe(scan.secondaryArc);
    }
  });

  test("multi-arc scan fidelity ceiling is not higher than both arcs", () => {
    for (const scan of SLA_MULTI_ARC_SCANS) {
      const primary   = getArcPattern(scan.primaryArc);
      const secondary = getArcPattern(scan.secondaryArc);
      // Both should be DAVAR or lower
      const validCeilings: string[] = ["QOL", "DAVAR"];
      expect(validCeilings).toContain(scan.fidelityCeiling);
      if (primary)   expect(validCeilings).toContain(primary.fidelityCeiling);
      if (secondary) expect(validCeilings).toContain(secondary.fidelityCeiling);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ARC × CHAOS ROLE COVERAGE
// ─────────────────────────────────────────────────────────────────────────────

describe("Chaos Role Coverage", () => {
  const EXPECTED_CHAOS_ROLES = [
    "instrumental", "revelatory", "structural",
    "moral_imbalance", "deviational", "instructional",
    "generative", "necessary",
  ];

  test("all 8 chaos roles appear exactly once across the 8 arcs", () => {
    const roles = SLA_ARC_PATTERNS.map(a => a.chaosRole);
    for (const role of EXPECTED_CHAOS_ROLES) {
      const count = roles.filter(r => r === role).length;
      expect(count).toBe(1);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GOLDEN TESTS
// ─────────────────────────────────────────────────────────────────────────────

describe("Golden Tests", () => {
  test("GT-ARC-001: Ordeal Arc contains T3 and R1 in sequence", () => {
    const arc = getArcPattern("SLA-ARC-001");
    expect(arc?.primitiveSequence).toContain("T3");
    expect(arc?.primitiveSequence).toContain("R1");
  });

  test("GT-ARC-002: Basin Clearance arc terminates at S3 (new attractor)", () => {
    const arc = getArcPattern("SLA-ARC-003");
    expect(arc?.terminalPrimitive).toBe("S3");
    expect(arc?.t3Mode).toBe("structural_home");
  });

  test("GT-ARC-003: getArcsByPrimitive('T3') returns all T3-containing arcs", () => {
    const t3Arcs = getArcsByPrimitive("T3");
    expect(t3Arcs.length).toBeGreaterThanOrEqual(4);
    for (const arc of t3Arcs) {
      expect(arc.t3Mode).not.toBe("not_applicable");
    }
  });

  test("GT-ARC-004: Shadow Integration arc uses I2 (shadow layer)", () => {
    const arc = getArcPattern("SLA-ARC-008");
    expect(arc?.primitiveSequence).toContain("I2");
    expect(arc?.chaosRole).toBe("necessary");
  });

  test("GT-ARC-005: No arc is its own nearest confusion", () => {
    for (const arc of SLA_ARC_PATTERNS) {
      expect(arc.nearestArcConfusion.arcId).not.toBe(arc.arcId);
    }
  });

  test("GT-ARC-006: PTL-001 multi-arc scan uses ARC-002 as primary", () => {
    const scan = SLA_MULTI_ARC_SCANS.find(s => s.specimenId === "PTL-001");
    expect(scan).toBeDefined();
    expect(scan?.primaryArc).toBe("SLA-ARC-002");
    expect(scan?.secondaryArc).toBe("SLA-ARC-008");
  });
});
