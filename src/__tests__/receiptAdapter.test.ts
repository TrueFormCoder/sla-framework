/**
 * receiptAdapter.test.ts
 * CI Tests — Receipt Adapter Layer
 * Covers: serialization, lane usability, fidelity evaluation,
 *         arc evaluation, multi-arc ceiling, firewall enforcement.
 *
 * V explicitly listed this file as missing.
 * Without it, the adapter has no verification layer.
 */

import { describe, expect, test } from "vitest";
import {
  serializeValidity,
  deserializeValidity,
  assertSerializationRoundtrip,
  canUsePrimitive,
  getBlockedPrimitives,
  maxLane,
  evaluatePrimitiveUse,
  evaluateArcClaim,
  getMultiArcCeiling,
  publicSurfaceFirewall,
  serializeScanReceipt,
  type PrimitiveUseLane,
} from "./receiptAdapter";

// ─────────────────────────────────────────────────────────────────────────────
// SERIALIZATION (enum drift: TypeScript underscore ↔ JSON hyphen)
// ─────────────────────────────────────────────────────────────────────────────

describe("serializeValidity / deserializeValidity", () => {
  test("context_required → context-required", () => {
    expect(serializeValidity("context_required")).toBe("context-required");
  });

  test("repair_required → repair-required", () => {
    expect(serializeValidity("repair_required")).toBe("repair-required");
  });

  test("valid → valid (no underscores; passthrough)", () => {
    expect(serializeValidity("valid")).toBe("valid");
  });

  test("invalid → invalid", () => {
    expect(serializeValidity("invalid")).toBe("invalid");
  });

  test("unmapped → unmapped", () => {
    expect(serializeValidity("unmapped")).toBe("unmapped");
  });

  test("context-required → context_required (roundtrip)", () => {
    expect(deserializeValidity("context-required")).toBe("context_required");
  });

  test("repair-required → repair_required (roundtrip)", () => {
    expect(deserializeValidity("repair-required")).toBe("repair_required");
  });

  test("assertSerializationRoundtrip does not throw for valid", () => {
    expect(() => assertSerializationRoundtrip("valid")).not.toThrow();
    expect(() => assertSerializationRoundtrip("context_required")).not.toThrow();
    expect(() => assertSerializationRoundtrip("repair_required")).not.toThrow();
    expect(() => assertSerializationRoundtrip("unmapped")).not.toThrow();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// LANE-AWARE USABILITY
// ─────────────────────────────────────────────────────────────────────────────

describe("canUsePrimitive — lane enforcement", () => {
  // Canonical primitives
  test("canonical primitive is usable at public lane", () => {
    expect(canUsePrimitive("F1", "public")).toBe(true);
    expect(canUsePrimitive("T3", "public")).toBe(true);
    expect(canUsePrimitive("R1", "public")).toBe(true);
    expect(canUsePrimitive("L2", "public")).toBe(true);
  });

  test("canonical primitive is usable at high_risk lane", () => {
    expect(canUsePrimitive("T1", "high_risk")).toBe(true);
    expect(canUsePrimitive("I1", "high_risk")).toBe(true);
  });

  test("canonical primitive is usable at all lanes", () => {
    const lanes: PrimitiveUseLane[] = ["internal", "practitioner", "institutional", "public", "high_risk"];
    for (const lane of lanes) {
      expect(canUsePrimitive("F1", lane)).toBe(true);
    }
  });

  // Provisional primitives
  test("provisional primitive is blocked at public lane", () => {
    expect(canUsePrimitive("M1", "public")).toBe(false);
    expect(canUsePrimitive("M2", "public")).toBe(false);
    expect(canUsePrimitive("M3", "public")).toBe(false);
  });

  test("provisional primitive is blocked at high_risk lane", () => {
    expect(canUsePrimitive("I2", "high_risk")).toBe(false);
    expect(canUsePrimitive("I4", "high_risk")).toBe(false);
  });

  test("provisional primitive is blocked at institutional and practitioner lanes", () => {
    expect(canUsePrimitive("I2", "institutional")).toBe(false);
    expect(canUsePrimitive("I2", "practitioner")).toBe(false);
  });

  test("provisional primitive IS usable at internal lane", () => {
    expect(canUsePrimitive("I2", "internal")).toBe(true);
    expect(canUsePrimitive("M3", "internal")).toBe(true);
  });

  // Parked primitives
  test("parked primitive C2 is blocked at all lanes", () => {
    const lanes: PrimitiveUseLane[] = ["internal", "practitioner", "institutional", "public", "high_risk"];
    for (const lane of lanes) {
      expect(canUsePrimitive("C2", lane)).toBe(false);
    }
  });

  // Nonexistent primitives
  test("nonexistent primitive is blocked at all lanes", () => {
    expect(canUsePrimitive("XX", "internal")).toBe(false);
    expect(canUsePrimitive("Z9", "public")).toBe(false);
  });
});

describe("getBlockedPrimitives", () => {
  test("returns empty array when all primitives are canonical at public lane", () => {
    const blocked = getBlockedPrimitives(["F1", "T3", "R1", "L2"], "public");
    expect(blocked).toEqual([]);
  });

  test("returns provisional primitives as blocked at public lane", () => {
    const blocked = getBlockedPrimitives(["F1", "I2", "M1", "T3"], "public");
    expect(blocked).toContain("I2");
    expect(blocked).toContain("M1");
    expect(blocked).not.toContain("F1");
    expect(blocked).not.toContain("T3");
  });

  test("returns C2 as blocked even at internal lane", () => {
    const blocked = getBlockedPrimitives(["C2", "F1"], "internal");
    expect(blocked).toContain("C2");
    expect(blocked).not.toContain("F1");
  });
});

describe("maxLane", () => {
  test("canonical primitives have maxLane = public", () => {
    expect(maxLane("F1")).toBe("public");
    expect(maxLane("T3")).toBe("public");
    expect(maxLane("P4")).toBe("public");
  });

  test("parked primitive has maxLane = parked", () => {
    expect(maxLane("C2")).toBe("parked");
  });

  test("provisional primitives have maxLane = internal", () => {
    expect(maxLane("M1")).toBe("internal");
    expect(maxLane("I2")).toBe("internal");
    expect(maxLane("I4")).toBe("internal");
  });

  test("nonexistent primitive has maxLane = parked", () => {
    expect(maxLane("XX")).toBe("parked");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// FIDELITY EVALUATION (every floor rule code)
// ─────────────────────────────────────────────────────────────────────────────

const VALID_CONTEXT = {
  d1Present:              false,
  t3Present:              false,
  t3ModeDeclaration:      "transient",
  l2ModeDeclaration:      "loop",
  confusionCheckPresent:  true,
  transitionDeclared:     true,
  nodeTypeDeclared:       true,
  observedCueDeclared:    true,
};

describe("evaluatePrimitiveUse — floor rules", () => {
  test("F1 with valid context returns EMET ceiling", () => {
    const result = evaluatePrimitiveUse("F1", VALID_CONTEXT);
    expect(result.ceiling).toBe("EMET");
    expect(result.blockers).toHaveLength(0);
  });

  test("missing nodeTypeDeclared → FLOOR-002 → BLOCKED", () => {
    const result = evaluatePrimitiveUse("F1", {
      ...VALID_CONTEXT, nodeTypeDeclared: false
    });
    expect(result.ceiling).toBe("BLOCKED");
    expect(result.blockers).toContain("FLOOR-002");
  });

  test("missing observedCueDeclared → FLOOR-001 → QOL ceiling", () => {
    const result = evaluatePrimitiveUse("F1", {
      ...VALID_CONTEXT, observedCueDeclared: false
    });
    expect(result.ceiling).toBe("QOL");
    expect(result.blockers).toContain("FLOOR-001");
  });

  test("missing confusionCheck → FLOOR-004 → DAVAR ceiling", () => {
    const result = evaluatePrimitiveUse("F1", {
      ...VALID_CONTEXT, confusionCheckPresent: false
    });
    expect(result.ceiling).toBe("DAVAR");
    expect(result.blockers).toContain("FLOOR-004");
  });

  test("missing transitionDeclared → FLOOR-005 → DAVAR ceiling", () => {
    const result = evaluatePrimitiveUse("F1", {
      ...VALID_CONTEXT, transitionDeclared: false
    });
    expect(result.ceiling).toBe("DAVAR");
    expect(result.blockers).toContain("FLOOR-005");
  });

  test("T3 present without t3ModeDeclaration → SLA-MODE-001 blocker", () => {
    const result = evaluatePrimitiveUse("T3", {
      ...VALID_CONTEXT,
      t3Present: true,
      t3ModeDeclaration: undefined,
    });
    expect(result.blockers).toContain("SLA-MODE-001");
    expect(["DAVAR", "BLOCKED"]).toContain(result.ceiling);
  });

  test("L2 without l2ModeDeclaration → SLA-MODE-001 blocker", () => {
    const result = evaluatePrimitiveUse("L2", {
      ...VALID_CONTEXT,
      l2ModeDeclaration: undefined,
    });
    expect(result.blockers).toContain("SLA-MODE-001");
  });

  // P4 governance flag: p4StatusUnresolved = true
  test("P4 with valid context returns DAVAR max (p4StatusUnresolved)", () => {
    const result = evaluatePrimitiveUse("P4", VALID_CONTEXT);
    expect(result.ceiling).toBe("DAVAR");
    expect(result.warnings).toContain("P4-UNRESOLVED");
  });

  // C2 is parked
  test("C2 returns BLOCKED regardless of context", () => {
    const result = evaluatePrimitiveUse("C2", VALID_CONTEXT);
    expect(result.ceiling).toBe("BLOCKED");
    expect(result.blockers).toContain("C2Gate");
  });

  // Nonexistent
  test("nonexistent primitive returns BLOCKED with FLOOR-003", () => {
    const result = evaluatePrimitiveUse("XX", VALID_CONTEXT);
    expect(result.ceiling).toBe("BLOCKED");
    expect(result.blockers).toContain("FLOOR-003");
  });

  // D1 bifurcation gate
  test("D1 present with requiresBifurcationGate → FLOOR-006 warning", () => {
    const result = evaluatePrimitiveUse("D1", {
      ...VALID_CONTEXT, d1Present: true
    });
    expect(result.warnings).toContain("FLOOR-006");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ARC CLAIM EVALUATION
// ─────────────────────────────────────────────────────────────────────────────

describe("evaluateArcClaim", () => {
  test("missing baseScanReceiptId → BLOCKED with ARC-BASE-RECEIPT-REQUIRED", () => {
    const result = evaluateArcClaim("SLA-ARC-002", null, {
      t3ModeDeclared: true,
      chaosRoleDeclared: true,
    });
    expect(result.ceiling).toBe("BLOCKED");
    expect(result.blockers).toContain("ARC-BASE-RECEIPT-REQUIRED");
  });

  test("unknown arcId → BLOCKED", () => {
    const result = evaluateArcClaim("SLA-ARC-999", "receipt-001");
    expect(result.ceiling).toBe("BLOCKED");
    expect(result.blockers).toContain("ARC-UNKNOWN");
  });

  test("ARC-002 with receipt and mode declared → DAVAR ceiling", () => {
    const result = evaluateArcClaim("SLA-ARC-002", "PTL-001-SCAN-RECEIPT", {
      t3ModeDeclared: true,
      chaosRoleDeclared: true,
    });
    expect(result.ceiling).toBe("DAVAR");
    expect(result.blockers).toHaveLength(0);
  });

  test("ARC-002 without t3ModeDeclared → SLA-MODE-001 blocker", () => {
    const result = evaluateArcClaim("SLA-ARC-002", "PTL-001-SCAN-RECEIPT", {
      t3ModeDeclared: false,
    });
    expect(result.blockers).toContain("SLA-MODE-001");
  });

  test("arc with provisional primitives → SLA-PROV-002 warning", () => {
    const result = evaluateArcClaim("SLA-ARC-008", "receipt-001", {
      t3ModeDeclared: true,
      provisionalPresent: true,
    });
    expect(result.warnings).toContain("SLA-PROV-002");
  });

  test("no arc can claim EMET at grammar layer (DAVAR max)", () => {
    // Grammar arcs are DAVAR ceiling by design — they require external witness for EMET
    for (const arcId of ["SLA-ARC-001", "SLA-ARC-002", "SLA-ARC-003", "SLA-ARC-008"]) {
      const result = evaluateArcClaim(arcId, "receipt-001", {
        t3ModeDeclared: true,
        chaosRoleDeclared: true,
      });
      expect(result.ceiling).not.toBe("EMET");
    }
  });
});

describe("getMultiArcCeiling", () => {
  test("DAVAR + DAVAR → DAVAR", () => {
    const ceiling = getMultiArcCeiling("SLA-ARC-001", "SLA-ARC-002");
    expect(ceiling).toBe("DAVAR");
  });

  test("unknown arc → BLOCKED", () => {
    const ceiling = getMultiArcCeiling("SLA-ARC-001", "SLA-ARC-999");
    expect(ceiling).toBe("BLOCKED");
  });

  test("ceiling is commutative: arc1+arc2 == arc2+arc1", () => {
    const c1 = getMultiArcCeiling("SLA-ARC-001", "SLA-ARC-008");
    const c2 = getMultiArcCeiling("SLA-ARC-008", "SLA-ARC-001");
    expect(c1).toBe(c2);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC SURFACE FIREWALL (D3 / Register Chimera enforcement)
// ─────────────────────────────────────────────────────────────────────────────

describe("publicSurfaceFirewall", () => {
  test("clean text returns no violations", () => {
    const violations = publicSurfaceFirewall("This is a structural observation tool.", "public");
    expect(violations).toHaveLength(0);
  });

  test("MASSA in public text is a blocker (FW-001)", () => {
    const violations = publicSurfaceFirewall("This is MASSA tier validation.", "public");
    const blocker = violations.find(v => v.term === "MASSA");
    expect(blocker).toBeDefined();
    expect(blocker?.severity).toBe("blocker");
  });

  test("VANTA in public text is a blocker (FW-004)", () => {
    const violations = publicSurfaceFirewall("Reviewed by VANTA.", "public");
    const blocker = violations.find(v => v.term === "VANTA");
    expect(blocker).toBeDefined();
    expect(blocker?.severity).toBe("blocker");
  });

  test("EMET in public text is a warning (FW-013)", () => {
    const violations = publicSurfaceFirewall("This record is EMET level.", "public");
    const warning = violations.find(v => v.term === "EMET");
    expect(warning).toBeDefined();
    expect(warning?.severity).toBe("warning");
  });

  test("CORDIA in internal text returns no violation (threshold is public)", () => {
    const violations = publicSurfaceFirewall("CORDIA reviews this.", "internal");
    // At internal lane, CORDIA's threshold (public) is not met — no violation
    expect(violations.filter(v => v.term === "CORDIA")).toHaveLength(0);
  });

  test("clinically proven is a blocker at practitioner lane (FW-010)", () => {
    const violations = publicSurfaceFirewall(
      "This has been clinically proven to work.", "practitioner"
    );
    const blocker = violations.find(v => v.term.includes("clinically proven"));
    expect(blocker).toBeDefined();
    expect(blocker?.severity).toBe("blocker");
  });

  test("all violations include a repair suggestion", () => {
    const violations = publicSurfaceFirewall("MASSA VANTA EMET", "public");
    for (const v of violations) {
      expect(v.repair).toBeTruthy();
      expect(v.repair.length).toBeGreaterThan(10);
    }
  });

  test("case-insensitive match: 'massa' matches FW-001", () => {
    const violations = publicSurfaceFirewall("The massa tier is highest.", "public");
    expect(violations.some(v => v.term === "MASSA")).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SCAN RECEIPT SERIALIZATION
// ─────────────────────────────────────────────────────────────────────────────

describe("serializeScanReceipt", () => {
  test("normalizes context_required → context-required in receipt output", () => {
    const receipt = {
      specimenId: "PTL-001",
      transition: "context_required",
    };
    const serialized = serializeScanReceipt(receipt);
    const parsed = JSON.parse(serialized);
    expect(parsed.transition).toBe("context-required");
  });

  test("does not mutate non-validity string values", () => {
    const receipt = {
      specimenId: "PTL-001",
      arcId: "SLA-ARC-002",
      status: "confirmed_by_thread_b",
    };
    const serialized = serializeScanReceipt(receipt);
    const parsed = JSON.parse(serialized);
    expect(parsed.arcId).toBe("SLA-ARC-002");
    // status should not be altered — it is not a TransitionValidity value
    expect(parsed.status).toBe("confirmed_by_thread_b");
  });

  test("produces valid JSON", () => {
    const receipt = { id: "test", validity: "repair_required" };
    expect(() => JSON.parse(serializeScanReceipt(receipt))).not.toThrow();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GOLDEN TESTS — integration scenarios
// ─────────────────────────────────────────────────────────────────────────────

describe("Golden Tests — integration scenarios", () => {
  test("GT-ADAPTER-001: P2L voicemail as Type 2 Witness Record — full evaluation chain", () => {
    // The voicemail primitive context
    const voicemailContext = {
      d1Present:              false,
      t3Present:              true,
      t3ModeDeclaration:      "structural", // Type B Closure — terminal
      l2ModeDeclaration:      "loop",       // L2 was accumulating
      confusionCheckPresent:  true,
      transitionDeclared:     true,
      nodeTypeDeclared:       true,
      observedCueDeclared:    true,
    };

    // P4 primitive ceiling
    const p4Result = evaluatePrimitiveUse("P4", voicemailContext);
    expect(p4Result.ceiling).toBe("DAVAR");      // p4StatusUnresolved
    expect(p4Result.warnings).toContain("P4-UNRESOLVED");

    // T3 primitive ceiling
    const t3Result = evaluatePrimitiveUse("T3", voicemailContext);
    expect(["EMET", "DAVAR"]).toContain(t3Result.ceiling);

    // Arc claim evaluation
    const arcResult = evaluateArcClaim(
      "SLA-ARC-002",
      "PTL-001-SCAN-RECEIPT",
      { t3ModeDeclared: true, chaosRoleDeclared: true }
    );
    expect(arcResult.ceiling).toBe("DAVAR");
    expect(arcResult.blockers).toHaveLength(0);

    // Public surface firewall passes on clean LMI framing
    const lmiText = "This record preserves structural evidence of a moment when change was no longer possible.";
    const firewallResult = publicSurfaceFirewall(lmiText, "public");
    expect(firewallResult.filter(v => v.severity === "blocker")).toHaveLength(0);
  });

  test("GT-ADAPTER-002: multiArcCeiling for PTL-001 dual-arc scan is DAVAR", () => {
    const ceiling = getMultiArcCeiling("SLA-ARC-002", "SLA-ARC-008");
    expect(ceiling).toBe("DAVAR");
  });
});
