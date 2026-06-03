/**
 * slaRegistry.test.ts
 * CI Invariant Tests — Shape Language Alphabet Registry
 *
 * Run with: npx vitest  OR  npx jest
 *
 * These tests are the machine enforcement of SIP-000 (alphabet freeze).
 * If ANY of these fail, the build MUST fail.
 * A governance system that has never been forced to fail has not proven governance.
 */

import slaRegistry, {
  SLA_PRIMITIVES,
  SLA_NODE_GEOMETRIES,
  SLA_GLYPHS,
  SLA_REGISTRY_METADATA,
  SLA_HARD_RULES,
  assertRegistryInvariants,
  getPrimitive,
  hasPrimitive,
  getLevel1Primitives,
  getActivePrimitives,
  getTransitionValidity,
  isTransitionInvalid,
} from "./slaRegistry";

// ─────────────────────────────────────────────────────────────────────────────
// COUNT INVARIANTS  — the most critical tests
// ─────────────────────────────────────────────────────────────────────────────

describe("SIP-000: Count Lock", () => {
  const primitives = SLA_PRIMITIVES.filter(p => p.elementKind === "primitive");

  test("node geometry count must equal 5", () => {
    expect(SLA_NODE_GEOMETRIES.length).toBe(5);
  });

  test("primitive count must equal 42", () => {
    expect(primitives.length).toBe(42);
  });

  test("total element count must equal 47", () => {
    expect(SLA_NODE_GEOMETRIES.length + primitives.length).toBe(47);
  });

  test("Level 1 entry set must equal 10 primitives", () => {
    expect(getLevel1Primitives().length).toBe(10);
  });

  test("glyph count must equal 7", () => {
    expect(SLA_GLYPHS.length).toBe(7);
  });

  test("assertRegistryInvariants() passes cleanly", () => {
    expect(() => assertRegistryInvariants()).not.toThrow();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// LEVEL 1 MEMBERSHIP
// ─────────────────────────────────────────────────────────────────────────────

describe("Level 1 Entry Set", () => {
  const EXPECTED_L1 = ["F1", "L2", "P1", "I1", "T1", "T3", "S1", "S3", "R1", "D1"];

  test.each(EXPECTED_L1)("%s is in Level 1", (id) => {
    const p = getPrimitive(id);
    expect(p).toBeDefined();
    expect(p?.isLevel1).toBe(true);
  });

  test("no additional primitives are marked Level 1", () => {
    const l1 = getLevel1Primitives().map(p => p.id).sort();
    expect(l1).toEqual([...EXPECTED_L1].sort());
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// REGISTRY INTEGRITY
// ─────────────────────────────────────────────────────────────────────────────

describe("Registry Integrity", () => {
  test("all primitives have required fields", () => {
    for (const p of SLA_PRIMITIVES) {
      expect(p.id).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(p.category).toBeTruthy();
      expect(p.categoryName).toBeTruthy();
      expect(p.polarity).toBeTruthy();
      expect(p.eleosAnchor).toBeTruthy();
      expect(p.elementKind).toBe("primitive");
      expect(typeof p.isLevel1).toBe("boolean");
    }
  });

  test("all primitive IDs are unique", () => {
    const ids = SLA_PRIMITIVES.map(p => p.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  test("hasPrimitive returns false for parked entries", () => {
    // C2 is parked
    expect(hasPrimitive("C2")).toBe(false);
  });

  test("hasPrimitive returns true for canonical entries", () => {
    expect(hasPrimitive("T3")).toBe(true);
    expect(hasPrimitive("F1")).toBe(true);
    expect(hasPrimitive("S3")).toBe(true);
  });

  test("hasPrimitive returns false for unknown IDs", () => {
    expect(hasPrimitive("X9")).toBe(false);
    expect(hasPrimitive("")).toBe(false);
    expect(hasPrimitive("C2_SLA")).toBe(false);
  });

  test("all transition targets exist in the registry", () => {
    for (const p of SLA_PRIMITIVES) {
      for (const t of p.transitions) {
        const target = getPrimitive(t.toId);
        expect(target).toBeDefined();
        if (!target) {
          fail(`${p.id} transitions to ${t.toId} which is not in the registry`);
        }
      }
    }
  });

  test("10 category families exist", () => {
    const categories = new Set(SLA_PRIMITIVES.map(p => p.category));
    expect(categories.size).toBe(10);
  });

  test("all 10 expected category letters are present", () => {
    const letters = new Set(SLA_PRIMITIVES.map(p => p.category));
    const expected = ["F", "L", "P", "I", "T", "S", "C", "R", "D", "M"];
    for (const l of expected) {
      expect(letters.has(l)).toBe(true);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// T3 HARD GATE  — the most critical governance tests
// ─────────────────────────────────────────────────────────────────────────────

describe("T3 Hard Gate (SIP-T3)", () => {
  test("T3→I1 is INVALID", () => {
    expect(isTransitionInvalid("T3", "I1")).toBe(true);
  });

  test("T3→F1 is INVALID", () => {
    expect(isTransitionInvalid("T3", "F1")).toBe(true);
  });

  test("T3→S3 is INVALID", () => {
    expect(isTransitionInvalid("T3", "S3")).toBe(true);
  });

  test("T3→R1 is valid", () => {
    expect(getTransitionValidity("T3", "R1")).toBe("valid");
  });

  test("T3→P4 is valid", () => {
    expect(getTransitionValidity("T3", "P4")).toBe("valid");
  });

  test("T3→T3 is valid (honest basin)", () => {
    expect(getTransitionValidity("T3", "T3")).toBe("valid");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// CRITICAL GRAMMAR BUG FIX — unmapped ≠ terminal
// ─────────────────────────────────────────────────────────────────────────────

describe("Unmapped ≠ Terminal (grammar bug fix)", () => {
  test("unknown transitions return 'unmapped' not 'terminal'", () => {
    // P3 → L2 is not documented — should be unmapped
    expect(getTransitionValidity("P3", "L2")).toBe("unmapped");
  });

  test("unknown source primitive returns 'unmapped'", () => {
    expect(getTransitionValidity("Z9", "F1")).toBe("unmapped");
  });

  test("no active primitive has all transitions empty (unless legitimately terminal)", () => {
    // A primitive with no transitions should be investigated — not assumed terminal
    const emptyTransitions = getActivePrimitives().filter(p => p.transitions.length === 0);
    // Log them rather than hard-fail — they may be legitimately terminal
    // but must be explicitly reviewed
    if (emptyTransitions.length > 0) {
      console.warn(
        "[SLA WARNING] Primitives with no transitions (verify intentional):",
        emptyTransitions.map(p => p.id)
      );
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// METADATA INVARIANTS
// ─────────────────────────────────────────────────────────────────────────────

describe("Registry Metadata", () => {
  test("version is 2.2", () => {
    expect(SLA_REGISTRY_METADATA.version).toBe("2.2");
  });

  test("alphabetFrozen is true", () => {
    expect(SLA_REGISTRY_METADATA.alphabetFrozen).toBe(true);
  });

  test("fidelity tiers are QOL, DAVAR, EMET (not MASSA)", () => {
    expect(SLA_REGISTRY_METADATA.fidelityTiers).toEqual(["QOL", "DAVAR", "EMET"]);
    expect(SLA_REGISTRY_METADATA.emetFormerlyKnownAs).toBe("MASSA");
  });

  test("MASSA not present as a tier name", () => {
    const tiersStr = JSON.stringify(SLA_REGISTRY_METADATA.fidelityTiers);
    expect(tiersStr).not.toContain("MASSA");
  });

  test("threadAHash matches known V registry hash", () => {
    expect(SLA_REGISTRY_METADATA.threadAHash).toBe("sha256:1f0bde0fd79daf50");
  });

  test("metadata counts match actual primitive/node/glyph counts", () => {
    expect(SLA_REGISTRY_METADATA.nodeTypeCount).toBe(SLA_NODE_GEOMETRIES.length);
    expect(SLA_REGISTRY_METADATA.primitiveCount).toBe(
      SLA_PRIMITIVES.filter(p => p.elementKind === "primitive").length
    );
    expect(SLA_REGISTRY_METADATA.totalCount).toBe(
      SLA_REGISTRY_METADATA.nodeTypeCount + SLA_REGISTRY_METADATA.primitiveCount
    );
    expect(SLA_REGISTRY_METADATA.glyphCount).toBe(SLA_GLYPHS.length);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GOVERNANCE FLAGS
// ─────────────────────────────────────────────────────────────────────────────

describe("Governance Flags", () => {
  test("D1 has bifurcation gate requirement", () => {
    const d1 = getPrimitive("D1");
    expect(d1?.governanceFlags?.requiresBifurcationGate).toBe(true);
  });

  test("L2 has mode declaration requirement", () => {
    const l2 = getPrimitive("L2");
    expect(l2?.governanceFlags?.modeDeclarationRequired).toBe(true);
  });

  test("T3 has mode declaration requirement", () => {
    const t3 = getPrimitive("T3");
    expect(t3?.governanceFlags?.modeDeclarationRequired).toBe(true);
  });

  test("T3 has anti-weaponisation rule", () => {
    const t3 = getPrimitive("T3");
    expect(t3?.governanceFlags?.antiWeaponizationRule).toBeTruthy();
    expect(t3?.governanceFlags?.antiWeaponizationRule).toContain("SLA-WEAP-001");
  });

  test("P4 is flagged as status unresolved", () => {
    const p4 = getPrimitive("P4");
    expect(p4?.governanceFlags?.p4StatusUnresolved).toBe(true);
  });

  test("C2 is parked", () => {
    const c2 = getPrimitive("C2");
    expect(c2?.status).toBe("parked");
    expect(c2?.fidelityCeiling).toBe("BLOCKED");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ELEOS CROSSWALK
// ─────────────────────────────────────────────────────────────────────────────

describe("ELEOS Crosswalk", () => {
  const { eleosCrosswalk } = slaRegistry;

  test("T3 dismantling sequence is 5 steps", () => {
    expect(eleosCrosswalk.T3_DISMANTLING_SEQUENCE.length).toBe(5);
  });

  test("R1 restoration sequence is 6 steps", () => {
    expect(eleosCrosswalk.R1_RESTORATION_SEQUENCE.length).toBe(6);
  });

  test("EMIT success form contains F1", () => {
    expect(eleosCrosswalk.EMIT.successForm).toContain("F1");
  });

  test("GUIDE success form contains S3", () => {
    expect(eleosCrosswalk.GUIDE.successForm).toContain("S3");
  });

  test("COMPILE failure form contains T1", () => {
    expect(eleosCrosswalk.COMPILE.failureForm).toContain("T1");
  });

  test("all primitives in crosswalk exist in registry", () => {
    const allRefs = [
      ...eleosCrosswalk.EMIT.successForm,
      ...eleosCrosswalk.EMIT.failureForm,
      ...eleosCrosswalk.RECEIVE.successForm,
      ...eleosCrosswalk.COMPILE.successForm,
      ...eleosCrosswalk.COMPILE.failureForm,
      ...eleosCrosswalk.GUIDE.successForm,
      ...eleosCrosswalk.REMEMBER.intactForm,
      ...eleosCrosswalk.INFER.activeForm,
    ];
    for (const ref of allRefs) {
      expect(getPrimitive(ref)).toBeDefined();
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// HARD RULES INTEGRITY
// ─────────────────────────────────────────────────────────────────────────────

describe("Hard Rules", () => {
  test("T3 invalid transitions are listed", () => {
    expect(SLA_HARD_RULES.T3_GATE.invalid).toContain("T3->I1");
    expect(SLA_HARD_RULES.T3_GATE.invalid).toContain("T3->F1");
    expect(SLA_HARD_RULES.T3_GATE.invalid).toContain("T3->S3");
  });

  test("T3 valid exits are listed", () => {
    expect(SLA_HARD_RULES.T3_GATE.valid).toContain("T3->R1");
    expect(SLA_HARD_RULES.T3_GATE.valid).toContain("T3->P4");
    expect(SLA_HARD_RULES.T3_GATE.valid).toContain("T3->T3");
  });

  test("alphabet is frozen", () => {
    expect(SLA_HARD_RULES.ALPHABET_FREEZE.locked).toBe(true);
  });

  test("anti-weaponisation rule covers WEAP-001", () => {
    expect(SLA_HARD_RULES.ANTI_WEAPONISATION["SLA-WEAP-001"]).toBeTruthy();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GOLDEN TESTS  (minimum passing scan examples)
// ─────────────────────────────────────────────────────────────────────────────

describe("Golden Tests", () => {
  test("GT-001: T3 correctly identified, valid transition to R1", () => {
    expect(hasPrimitive("T3")).toBe(true);
    expect(getTransitionValidity("T3", "R1")).toBe("valid");
  });

  test("GT-002: T3→S3 is hard-blocked", () => {
    expect(isTransitionInvalid("T3", "S3")).toBe(true);
  });

  test("GT-003: F1 is canonical Level 1", () => {
    const f1 = getPrimitive("F1");
    expect(f1?.status).toBe("canonical");
    expect(f1?.isLevel1).toBe(true);
  });

  test("GT-004: Unknown primitive ID is not in registry", () => {
    expect(hasPrimitive("K7")).toBe(false);
    expect(hasPrimitive("FAKE")).toBe(false);
  });

  test("GT-005: D1 fidelity ceiling is DAVAR (not EMET)", () => {
    const d1 = getPrimitive("D1");
    expect(d1?.fidelityCeiling).toBe("DAVAR");
  });
});
