/**
 * slaArcPatterns.ts
 * Shape Language Alphabet™ — Grammar Arc Pattern Layer
 * Version: 0.1 (candidate)
 *
 * This file extends slaRegistry.ts with arc-level grammar types.
 * Arc patterns are composed of primitives. They do not modify the registry.
 * Import from slaRegistry.ts; this file reads from it, does not replace it.
 *
 * GOVERNING RULE: Arc patterns are grammar, not diagnosis.
 * Identifying an arc is a structural observation. Not a prescription.
 * T3 WEAP-001 applies at the arc level.
 */

import {
  SLAPrimitive,
  FidelityTier,
  getPrimitive,
  hasPrimitive,
  getTransitionValidity,
} from "./slaRegistry";

// ─────────────────────────────────────────────────────────────────────────────
// ARC PATTERN TYPES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * How disorder functions within this arc.
 * Maps to V's "Role of Chaos" comparative axis dimension.
 * Must be declared at DAVAR tier when arc contains D1.
 */
export type ChaosRole =
  | "instrumental"     // chaos serves the arc's purpose (Ordeal)
  | "revelatory"       // chaos forces recognition (Recognition Collapse)
  | "structural"       // chaos IS the operating condition (Basin Clearance)
  | "moral_imbalance"  // chaos = contested truth without center (Polycentric)
  | "deviational"      // chaos = departure from established order (Covenant)
  | "instructional"    // chaos is the teacher (Spiral Refinement)
  | "generative"       // chaos produces new structure (Generative Rupture)
  | "necessary";       // chaos is the integration medium (Shadow Integration)

/**
 * How truth/knowledge arrives in this arc.
 * Maps to V's "Truth Mechanism" axis.
 */
export type TruthMechanism =
  | "discovered"    // truth is found through the arc (Ordeal)
  | "forced"        // truth is imposed at collapse (Tragic)
  | "known"         // truth is declared cosmologically (Basin Clearance)
  | "relational"    // truth is positional, not absolute (Polycentric)
  | "guided"        // truth is given by authority (Covenant)
  | "accumulated"   // truth builds through repetition (Pilgrimage)
  | "emergent"      // truth arises from disorder (Trickster)
  | "constructed";  // truth is built from internal material (Psychological)

/**
 * What constitutes completion for this arc.
 * Maps to V's "Resolution Type" axis.
 */
export type ResolutionType =
  | "reintegration"       // entity returns to order, enlarged (Ordeal)
  | "collapse"            // entity does not exit T3 (Type B Closure)
  | "renewal"             // new S3 from basin clearance (Basin Clearance)
  | "partial_equilibrium" // T3 stabilizes without exit (Polycentric)
  | "sustained_order"     // L2 governing correction cycles (Covenant)
  | "alignment"           // I1 enlarged through refinement (Pilgrimage)
  | "adaptation"          // new S3 from S1/S2 collision (Trickster)
  | "individuation";      // I1 enlarged through shadow integration (Psychological)

/** T3 mode declaration — required when T3 is in the arc sequence */
export type T3ModeDeclaration =
  | "transient"          // T3 is developmental, R1 is the target exit
  | "structural_home"    // T3 is the precondition; S4 emergence is the target
  | "unresolved_basin"   // T3 persists as governed complexity; no single R1
  | "not_applicable";    // T3 not present in this arc

/** Arc pattern governance status */
export type ArcPatternStatus =
  | "candidate"     // Thread B reconstruction; unconfirmed
  | "grounded"      // one confirmed corpus specimen
  | "confirmed"     // two+ corpus specimens across independent domains
  | "sealed";       // Gate 3 complete, canonical

// ─────────────────────────────────────────────────────────────────────────────
// CORE INTERFACES
// ─────────────────────────────────────────────────────────────────────────────

export interface SLAArcPattern {
  readonly arcId:             string;          // e.g. "SLA-ARC-001"
  readonly name:              string;          // e.g. "Ordeal Arc"
  readonly sourceFramework:   string;          // V's symbolic storytelling framework
  readonly canonLine:         string;          // governing statement

  /** Canonical primitive sequence for this arc */
  readonly primitiveSequence: string[];

  /** ELEOS cognitive sequence (narrative description) */
  readonly eleosNarrative:    string;

  /** V's comparative axis mappings */
  readonly chaosRole:         ChaosRole;
  readonly truthMechanism:    TruthMechanism;
  readonly resolutionType:    ResolutionType;
  readonly t3Mode:            T3ModeDeclaration;

  /** Terminal primitive state for this arc */
  readonly terminalPrimitive: string;

  /** Level 1 primitives that appear in this arc */
  readonly level1Present:     string[];

  /** The most dangerous arc confusion — what this arc is mistaken for */
  readonly nearestArcConfusion: {
    arcId:  string;
    arcName: string;
    test:   string; // one-sentence disambiguation test
  };

  /** Bestiary creature(s) associated with this arc */
  readonly bestiary:          string[];

  /** Nominated corpus specimens */
  readonly specimenNominations: Array<{
    specimenId:  string;
    scale:       "personal" | "literary" | "mythic" | "cultural" | "clinical";
    status:      "candidate" | "confirmed" | "sealed";
  }>;

  readonly status:            ArcPatternStatus;
  readonly fidelityCeiling:   FidelityTier;

  /** Whether this arc can involve multiple agents simultaneously */
  readonly multiAgentCapable: boolean;

  /** Evidence tier for arc-level claims */
  readonly evidenceTier:      "E1" | "E2" | "E3" | "E4" | "E5";

  readonly governanceNotes?:  string;
}

export interface SLAMultiArcScan {
  readonly specimenId:    string;
  readonly primaryArc:    string;   // arcId
  readonly secondaryArc:  string;   // arcId
  readonly scaleOfPrimary:   string;
  readonly scaleOfSecondary: string;
  readonly interactionNote:  string; // how the two arcs relate
  readonly fidelityCeiling:  FidelityTier; // most constraining of the two arcs
}

// ─────────────────────────────────────────────────────────────────────────────
// ARC RECEIPT EXTENSION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Extension to the standard SLA scan receipt for arc-level claims.
 * Cannot be used without a valid primitive-level receipt already filed.
 */
export interface SLAArcReceiptExtension {
  readonly baseScanReceiptId: string;  // the primitive-level receipt this extends
  readonly arcId:             string;
  readonly arcSequenceObserved:  string[];  // actual primitives detected in order
  readonly arcSequenceExpected:  string[];  // canonical arc sequence
  readonly arcDeviationNote:     string;    // where specimen diverges (if any)
  readonly multiArc:             boolean;
  readonly secondArcId?:         string;
  readonly arcFidelityTier:      FidelityTier;
  readonly chaosRoleDeclared:    ChaosRole;   // required when D1 present in arc
  readonly t3ModeDeclared?:      T3ModeDeclaration; // required when T3 present
  readonly warnIfUsed?:          string;     // anti-weaponization note if applicable
}

// ─────────────────────────────────────────────────────────────────────────────
// ARC PATTERN REGISTRY  (8 patterns)
// ─────────────────────────────────────────────────────────────────────────────

export const SLA_ARC_PATTERNS: readonly SLAArcPattern[] = [
  {
    arcId:           "SLA-ARC-001",
    name:            "Ordeal Arc",
    sourceFramework: "Initiatory Spiral (Campbell)",
    canonLine:       "Suffering transforms only when the entity survives and returns with structural difference.",
    primitiveSequence: ["F1", "T1", "T3", "R1", "I1", "F1"],
    eleosNarrative:  "EMIT disrupted → COMPILE fails → GUIDE lost → REMEMBER under pressure → GUIDE re-emerges (R1 trigger) → COMPILE restores → EMIT restored",
    chaosRole:         "instrumental",
    truthMechanism:    "discovered",
    resolutionType:    "reintegration",
    t3Mode:            "transient",
    terminalPrimitive: "I1",
    level1Present:     ["F1", "T1", "T3", "R1", "I1"],
    nearestArcConfusion: {
      arcId:  "SLA-ARC-002",
      arcName: "Recognition Collapse",
      test:   "Does avoidance reduce or increase the collapse rate? In Ordeal, T3 is transient and R1 exits it. In Recognition Collapse, avoidance accelerates convergence.",
    },
    bestiary:          ["El-Aetheris (R1-D + I1[unshakable])"],
    specimenNominations: [
      { specimenId: "PTL-001", scale: "personal",  status: "candidate" },
      { specimenId: "SLA-STORY-001", scale: "literary", status: "candidate" },
    ],
    status:            "grounded",
    fidelityCeiling:   "DAVAR",
    multiAgentCapable: false,
    evidenceTier:      "E2",
    governanceNotes:   "T3 WEAP-001 applies. R1-C dressed as R1-D is the most common arc fraud — beautiful return without structural difference.",
  },
  {
    arcId:           "SLA-ARC-002",
    name:            "Recognition Collapse",
    sourceFramework: "Tragic Convergence (Sophocles / Oedipus)",
    canonLine:       "Awareness arrives only at the moment it can no longer change the outcome.",
    primitiveSequence: ["L2", "P2", "F4", "T1", "T3"],
    eleosNarrative:  "COMPILE failing → GUIDE absent → REMEMBER reconstructing toward recognition → single COMPILE flash (anagnorisis) → immediate T3 basin; P4 witnesses from outside",
    chaosRole:         "revelatory",
    truthMechanism:    "forced",
    resolutionType:    "collapse",
    t3Mode:            "structural",
    terminalPrimitive: "T3",
    level1Present:     ["L2", "T1", "T3", "P1", "D1"],
    nearestArcConfusion: {
      arcId:  "SLA-ARC-001",
      arcName: "Ordeal Arc",
      test:   "Is R1 structurally available? In Ordeal Arc, T3 is transient and R1 exits it. In Recognition Collapse, R1 is R1-A type (structurally unavailable) — escape attempts accelerate convergence.",
    },
    bestiary:          ["The Sealed Triangle (T3[sealed] → T3[implosion])"],
    specimenNominations: [
      { specimenId: "PTL-001",       scale: "personal",  status: "sealed"    },
      { specimenId: "AONL-001",      scale: "personal",  status: "sealed"    },
      { specimenId: "SLA-LIT-001",   scale: "literary",  status: "candidate" },
    ],
    status:            "confirmed",
    fidelityCeiling:   "DAVAR",
    multiAgentCapable: false,
    evidenceTier:      "E3",
    governanceNotes:   "T3 WEAP-001 applies with maximum force. Type B Closure = T3 + P4 active, R1 structurally unavailable. The ◈ glyph marks this state.",
  },
  {
    arcId:           "SLA-ARC-003",
    name:            "Basin Clearance",
    sourceFramework: "Cataclysmic Renewal (Ragnarök)",
    canonLine:       "Some systems must complete their collapse before new structure can emerge. The basin is not the problem — it is the condition.",
    primitiveSequence: ["S3", "T2", "T3", "S4", "S3"],
    eleosNarrative:  "All six ELEOS primitives degrading in T3 dismantling sequence → T3 reaches maximum depth → RECEIVE reactivates → COMPILE constructs from basin residue → new S3 forms",
    chaosRole:         "structural",
    truthMechanism:    "known",
    resolutionType:    "renewal",
    t3Mode:            "structural_home",
    terminalPrimitive: "S3",
    level1Present:     ["S3", "T1", "T3", "S1"],
    nearestArcConfusion: {
      arcId:  "SLA-ARC-001",
      arcName: "Ordeal Arc",
      test:   "Can the original attractor hub (S3) be restored? Ordeal Arc: yes. Basin Clearance: no — attempting restoration prevents the new S3 from forming.",
    },
    bestiary:          [
      "The First Distorter completing its role (T3[structural_home] cycling)",
      "The Witness Faction emerging as new S3 (S3[residue])",
    ],
    specimenNominations: [
      { specimenId: "SLA-MYTH-001", scale: "mythic", status: "candidate" },
    ],
    status:            "candidate",
    fidelityCeiling:   "DAVAR",
    multiAgentCapable: true,
    evidenceTier:      "E2",
    governanceNotes:   "The governance target is S4 emergence from the basin — NOT R1. Premature R1 attempts abort the emergence. T3 structural_home non-pathologizing doctrine applies.",
  },
  {
    arcId:           "SLA-ARC-004",
    name:            "Polycentric Field",
    sourceFramework: "Dharma Field (Mahabharata)",
    canonLine:       "Truth is positional, not absolute. Conflict resolves imbalance but generates new ambiguity.",
    primitiveSequence: ["S1", "S2", "D1", "T3"],
    eleosNarrative:  "Multi-agent — each agent runs their own ELEOS configuration; system-level COMPILE cannot synthesize because truth is positional",
    chaosRole:         "moral_imbalance",
    truthMechanism:    "relational",
    resolutionType:    "partial_equilibrium",
    t3Mode:            "unresolved_basin",
    terminalPrimitive: "T3",
    level1Present:     ["S1", "S3", "T3", "D1"],
    nearestArcConfusion: {
      arcId:  "SLA-ARC-005",
      arcName: "Covenant Loop",
      test:   "Does the arc have a governing center that makes correction possible? Covenant Loop: yes (L2 + I1 + C4). Polycentric Field: no — each correction generates new ambiguity.",
    },
    bestiary:          [
      "The Weaponized Triangle (S1 → T3 at scale)",
      "The Fractured Axis (D1[intensified])",
    ],
    specimenNominations: [],
    status:            "candidate",
    fidelityCeiling:   "DAVAR",
    multiAgentCapable: true,
    evidenceTier:      "E1",
    governanceNotes:   "Highest Register Chimera (D3) risk of all arcs. Multiple agents using same SLA vocabulary from different positional frames = D3 at system scale.",
  },
  {
    arcId:           "SLA-ARC-005",
    name:            "Covenant Loop",
    sourceFramework: "Covenant Recursion (Book of Exodus)",
    canonLine:       "Order is contractual, not inherent. The system persists not by perfection but by iteration under constraint.",
    primitiveSequence: ["T3", "F1", "R1", "I1", "C4", "T1", "R1", "I1"],
    eleosNarrative:  "REMEMBER governs the arc — collective memory of the covenant is the correction mechanism. Without REMEMBER, each deviation is a fresh T3 rather than a correctable T1",
    chaosRole:         "deviational",
    truthMechanism:    "guided",
    resolutionType:    "sustained_order",
    t3Mode:            "structural_home",
    terminalPrimitive: "L2",
    level1Present:     ["T3", "F1", "R1", "I1", "T1", "L2"],
    nearestArcConfusion: {
      arcId:  "SLA-ARC-003",
      arcName: "Basin Clearance",
      test:   "Does the restoration mechanism require total collapse or only correction? Covenant Loop can return to origin. Basin Clearance cannot.",
    },
    bestiary:          [
      "The Roles (S1 + R1-C[performed]) constrained by Law (C4)",
      "El-Aetheris as the covenant's living version (R1-D, never R1-C)",
    ],
    specimenNominations: [],
    status:            "candidate",
    fidelityCeiling:   "DAVAR",
    multiAgentCapable: true,
    evidenceTier:      "E2",
  },
  {
    arcId:           "SLA-ARC-006",
    name:            "Spiral Refinement",
    sourceFramework: "Iterative Pilgrimage (Journey to the West)",
    canonLine:       "Growth is not linear. Each obstacle is the same obstacle at a different altitude.",
    primitiveSequence: ["F1", "L3", "R1", "I1"],
    eleosNarrative:  "INFER dominant — pattern accumulated through repetition; understanding arrives through repetition, not revelation",
    chaosRole:         "instructional",
    truthMechanism:    "accumulated",
    resolutionType:    "alignment",
    t3Mode:            "not_applicable",
    terminalPrimitive: "I1",
    level1Present:     ["F1", "L2", "R1", "I1"],
    nearestArcConfusion: {
      arcId:  "SLA-ARC-005",
      arcName: "Covenant Loop",
      test:   "Does completion restore origin state or produce an elevated I1? Covenant returns to the same covenant. Spiral Refinement produces an I1 with greater capacity.",
    },
    bestiary:          ["Field Memory / Micro-Axes (S3[residue])"],
    specimenNominations: [],
    status:            "candidate",
    fidelityCeiling:   "DAVAR",
    multiAgentCapable: true,
    evidenceTier:      "E2",
  },
  {
    arcId:           "SLA-ARC-007",
    name:            "Generative Rupture",
    sourceFramework: "Trickster Disruption Matrix",
    canonLine:       "Innovation emerges from illegitimate moves. The boundary violation is not the problem — it is the method.",
    primitiveSequence: ["C3", "S1", "S2", "S4", "S3"],
    eleosNarrative:  "INFER dominant — emergent structure read from collision; COMPILE processes emergence after INFER detects the pattern",
    chaosRole:         "generative",
    truthMechanism:    "emergent",
    resolutionType:    "adaptation",
    t3Mode:            "not_applicable",
    terminalPrimitive: "S3",
    level1Present:     ["S1", "S3", "D1"],
    nearestArcConfusion: {
      arcId:  "SLA-ARC-003",
      arcName: "Basin Clearance",
      test:   "Does the arc pass through a T3 basin or through an S1/S2 intersection? Basin Clearance requires T3 completion. Generative Rupture moves S1→S2→S4→new S3 without requiring collapse.",
    },
    bestiary:          [
      "The Parallax (L2 personified — sees both axes simultaneously)",
      "The Linebender (D1 — bends truth to create new structure)",
    ],
    specimenNominations: [],
    status:            "candidate",
    fidelityCeiling:   "DAVAR",
    multiAgentCapable: false,
    evidenceTier:      "E1",
  },
  {
    arcId:           "SLA-ARC-008",
    name:            "Shadow Integration",
    sourceFramework: "Inward Symbolic Process (Jung / Man and His Symbols)",
    canonLine:       "The shadow does not dissolve by being ignored. It integrates by being witnessed.",
    primitiveSequence: ["I1", "I2", "D1", "T1", "I4", "I1"],
    eleosNarrative:  "REMEMBER governs — arc is about what is held vs excluded from REMEMBER's active field; integration is REMEMBER expanding its boundary",
    chaosRole:         "necessary",
    truthMechanism:    "constructed",
    resolutionType:    "individuation",
    t3Mode:            "not_applicable",
    terminalPrimitive: "I1",
    level1Present:     ["I1", "D1", "T1", "R1"],
    nearestArcConfusion: {
      arcId:  "SLA-ARC-001",
      arcName: "Ordeal Arc",
      test:   "Is the rupture at the fracture of external structure (T1-external, Ordeal Arc) or at the fracture of internal self-perception (T1-internal, Shadow Integration)?",
    },
    bestiary:          [
      "The Witness Faction (S3) — emerges only after this arc completes",
    ],
    specimenNominations: [],
    status:            "candidate",
    fidelityCeiling:   "DAVAR",
    multiAgentCapable: false,
    evidenceTier:      "E2",
    governanceNotes:   "LMI / MemorySeal™ product layer connection: MemorySeal functions as the I4 (Resonance Bridge) — the artifact that holds the connection between acknowledged self and complete record.",
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// MULTI-ARC SCAN REGISTRY
// ─────────────────────────────────────────────────────────────────────────────

export const SLA_MULTI_ARC_SCANS: readonly SLAMultiArcScan[] = [
  {
    specimenId:        "PTL-001",  // Pulled Too Late
    primaryArc:        "SLA-ARC-002",  // Recognition Collapse
    secondaryArc:      "SLA-ARC-008",  // Shadow Integration
    scaleOfPrimary:    "narrative/event scale",
    scaleOfSecondary:  "character interiority scale",
    interactionNote:   "Recognition Collapse governs the external arc (what happened to Will's daughter). Shadow Integration governs the internal arc (what Will carries that he cannot see). The voicemail is simultaneously an event artifact (ARC-002: inadvertent evidence at collapse point) and an interiority artifact (ARC-008: D1 — the record captures what Will could not see about himself).",
    fidelityCeiling:   "DAVAR",
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// LOOKUP UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

export function getArcPattern(arcId: string): SLAArcPattern | undefined {
  return SLA_ARC_PATTERNS.find(a => a.arcId === arcId);
}

export function getArcsByT3Mode(
  mode: T3ModeDeclaration
): SLAArcPattern[] {
  return SLA_ARC_PATTERNS.filter(a => a.t3Mode === mode);
}

export function getArcsByChaosRole(role: ChaosRole): SLAArcPattern[] {
  return SLA_ARC_PATTERNS.filter(a => a.chaosRole === role);
}

/** Returns arcs containing a specific primitive in their canonical sequence */
export function getArcsByPrimitive(primitiveId: string): SLAArcPattern[] {
  return SLA_ARC_PATTERNS.filter(a =>
    a.primitiveSequence.includes(primitiveId)
  );
}

/** Returns the arc(s) that a given arc is most commonly confused with */
export function getNearestConfusionArcs(arcId: string): SLAArcPattern[] {
  return SLA_ARC_PATTERNS.filter(
    a => a.arcId !== arcId &&
    SLA_ARC_PATTERNS.find(b => b.arcId === arcId)
      ?.nearestArcConfusion.arcId === a.arcId
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CI INVARIANTS
// ─────────────────────────────────────────────────────────────────────────────

export function assertArcPatternInvariants(): void {
  if (SLA_ARC_PATTERNS.length !== 8)
    throw new Error(`[SLA CI] arcPatternCount must be 8, got ${SLA_ARC_PATTERNS.length}`);

  // All arc IDs are unique
  const ids = SLA_ARC_PATTERNS.map(a => a.arcId);
  if (new Set(ids).size !== ids.length)
    throw new Error(`[SLA CI] Duplicate arc IDs detected`);

  // All primitives in arc sequences exist in the registry
  for (const arc of SLA_ARC_PATTERNS) {
    for (const primId of arc.primitiveSequence) {
      if (!hasPrimitive(primId))
        throw new Error(`[SLA CI] Arc ${arc.arcId} references unknown primitive: ${primId}`);
    }
    for (const primId of arc.level1Present) {
      if (!hasPrimitive(primId))
        throw new Error(`[SLA CI] Arc ${arc.arcId} level1Present references unknown: ${primId}`);
    }
  }

  // Recognition Collapse (Type B Closure) must be confirmed status
  const arc002 = getArcPattern("SLA-ARC-002");
  if (!arc002 || arc002.status !== "confirmed")
    throw new Error(`[SLA CI] SLA-ARC-002 (Recognition Collapse) must be status 'confirmed' — two sealed specimens exist`);

  // All arcs with T3 in sequence must have t3Mode !== "not_applicable"
  for (const arc of SLA_ARC_PATTERNS) {
    if (arc.primitiveSequence.includes("T3") && arc.t3Mode === "not_applicable")
      throw new Error(`[SLA CI] Arc ${arc.arcId} contains T3 but t3Mode is not_applicable`);
  }
}

export default {
  arcPatterns:    SLA_ARC_PATTERNS,
  multiArcScans:  SLA_MULTI_ARC_SCANS,
  getArcPattern,
  getArcsByT3Mode,
  getArcsByChaosRole,
  getArcsByPrimitive,
  getNearestConfusionArcs,
  assertArcPatternInvariants,
};
