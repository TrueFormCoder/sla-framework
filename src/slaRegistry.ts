/**
 * slaRegistry.ts
 * Shape Language Alphabet™ — Canonical Registry
 * Version: 2.2 (Thread B candidate)
 * Owner: Ellari (Ellari Institute / Ellari Ventures LLC)
 *
 * STATUS: CANDIDATE — Thread B reconstruction from corpus evidence.
 * This file must be reconciled with Thread A (VANTA) slaRegistry.ts
 * before the hash sha256:1f0bde0fd79daf50 can be confirmed or superseded.
 *
 * GOVERNING RULE: No SLA surface owns the registry. Every SLA surface reads it.
 * ALPHABET LAW:   5 node types + 42 shape primitives = 47 locked elements (SIP-000).
 *                 Count does not change by argument, discovery, or consensus.
 *
 * FIDELITY TIERS: QOL / DAVAR / EMET  (EMET formerly MASSA — SLA-TIER-RENAME-001)
 */

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

/** Structural polarity of a primitive */
export type SLAPolarity =
  | "coherence"   // state of organised function
  | "failure"     // state of structural breakdown
  | "repair"      // state of movement toward coherence
  | "neutral"     // neither coherence nor failure inherently
  | "threshold";  // gate / bifurcation / decision event

/** Which ELEOS cognitive primitive(s) anchor this SLA primitive */
export type ELEOSAnchor =
  | "EMIT"
  | "RECEIVE"
  | "COMPILE"
  | "GUIDE"
  | "REMEMBER"
  | "INFER"
  | "COMPILE+GUIDE"
  | "REMEMBER+GUIDE"
  | "all_six_gate_dependent";

/** Governance status of a registry entry */
export type RegistryStatus =
  | "canonical"      // confirmed in governed corpus; counts toward 47
  | "grounded"       // confirmed with evidence; awaiting formal seal
  | "provisional"    // inferred from structural logic; requires corpus confirmation
  | "reference"      // reference state for the grammar; not a behavioural primitive
  | "parked"         // reserved candidate; must not be activated until gate clears
  | "deprecated";    // superseded; kept for backwards compatibility only

/**
 * What kind of object this entry is.
 * Prevents type collapse when non-primitive entries share the ID namespace.
 */
export type ElementKind =
  | "node_geometry"  // Level 0 — entity type classifier
  | "primitive"      // Level 1 — behavioural/structural state descriptor
  | "glyph"          // Special operator / marker — not counted in 42 primitives
  | "metric"         // Measurement construct (e.g. CSR, Coherence Score)
  | "macro";         // Composite gesture / compound pattern

/** Fidelity ceiling triggered by this primitive when present */
export type FidelityCeiling =
  | "EMET"   // no ceiling imposed by this primitive alone
  | "DAVAR"  // caps at DAVAR until resolution condition is met
  | "QOL"    // caps at QOL
  | "BLOCKED";

/** Transition validity between primitives */
export type TransitionValidity =
  | "valid"             // confirmed valid transition
  | "invalid"           // hard blocked — never valid
  | "context_required"  // valid only with additional conditions declared
  | "repair_required"   // only valid after a repair step
  | "unmapped"          // not yet documented; do NOT treat as terminal
  | "terminal";         // legitimately no further transitions from this state

/** Fidelity tiers — canonical names post SLA-TIER-RENAME-001 */
export type FidelityTier = "QOL" | "DAVAR" | "EMET";

// ─────────────────────────────────────────────────────────────────────────────
// CORE INTERFACES
// ─────────────────────────────────────────────────────────────────────────────

export interface SLANodeGeometry {
  readonly id:          string;
  readonly symbol:      string;
  readonly name:        string;
  readonly entityClass: string;
  readonly description: string;
  readonly elementKind: "node_geometry";
}

export interface SLATransitionRule {
  readonly toId:     string;
  readonly validity: TransitionValidity;
  readonly note?:    string;
}

export interface SLAPrimitive {
  readonly id:             string;
  readonly name:           string;
  readonly category:       string;         // single letter: F L P I T S C R D M
  readonly categoryName:   string;
  readonly polarity:       SLAPolarity;
  readonly eleosAnchor:    ELEOSAnchor;
  readonly elementKind:    ElementKind;
  readonly status:         RegistryStatus;
  readonly isLevel1:       boolean;        // part of the 10-entry practitioner set
  readonly fidelityCeiling:FidelityCeiling;

  /** Nearest confusion — the most common misassignment */
  readonly nearestConfusion?: {
    id:     string;
    reason: string;
  };

  /** Transitions from this primitive (partial; grammar layer extends this) */
  readonly transitions: SLATransitionRule[];

  /** Governance flags specific to this primitive */
  readonly governanceFlags?: {
    requiresBifurcationGate?:  boolean;  // D1-meta; instrument-level distortion
    antiWeaponizationRule?:    string;   // T3 WEAP-001
    modeDeclarationRequired?:  boolean;  // L2 modes; T3 modes
    p4StatusUnresolved?:       boolean;  // ambiguity: primitive vs. glyph vs. operator
    culturalIntegrityRequired?: boolean; // any naming decision at governance tier
    parkedReason?:             string;   // if status === 'parked'
  };
}

export interface SLAGlyph {
  readonly symbol:      string;
  readonly name:        string;
  readonly elementKind: "glyph";
  readonly status:      RegistryStatus;
  readonly function:    string;
  readonly gateCondition: string;
  readonly nearestConfusion?: string;
}

export interface SLARegistryMetadata {
  readonly version:           string;
  readonly threadAHash:       string;   // V's canonical hash — authoritative
  readonly threadBHash:       string;   // Thread B candidate hash — pending reconciliation
  readonly nodeTypeCount:     number;   // MUST equal 5
  readonly primitiveCount:    number;   // MUST equal 42
  readonly totalCount:        number;   // MUST equal 47
  readonly level1Count:       number;   // MUST equal 10
  readonly glyphCount:        number;   // 7 total glyphs
  readonly alphabetFrozen:    boolean;  // always true post SIP-000
  readonly fidelityTiers:     FidelityTier[];
  readonly emetFormerlyKnownAs: string;
  readonly renameId:          string;
  readonly canonLine:         string;
  readonly lastUpdated:       string;
  readonly owner:             string;
}

// ─────────────────────────────────────────────────────────────────────────────
// METADATA
// ─────────────────────────────────────────────────────────────────────────────

export const SLA_REGISTRY_METADATA: SLARegistryMetadata = {
  version:              "2.2",
  threadAHash:          "sha256:1f0bde0fd79daf50",  // V's registry — authoritative
  threadBHash:          "sha256:PENDING_V_RECONCILIATION",
  nodeTypeCount:        5,
  primitiveCount:       42,
  totalCount:           47,
  level1Count:          10,
  glyphCount:           7,
  alphabetFrozen:       true,
  fidelityTiers:        ["QOL", "DAVAR", "EMET"],
  emetFormerlyKnownAs:  "MASSA",
  renameId:             "SLA-TIER-RENAME-001",
  canonLine:            "No SLA surface owns the registry. Every SLA surface reads the registry.",
  lastUpdated:          "2026-06-02",
  owner:                "Ellari / Ellari Institute",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// LEVEL 0 — NODE GEOMETRIES  (5 total)
// ─────────────────────────────────────────────────────────────────────────────

export const SLA_NODE_GEOMETRIES: readonly SLANodeGeometry[] = [
  {
    id:          "circle",
    symbol:      "○",
    name:        "Circle",
    entityClass: "self / agent / person",
    description: "A self-referential entity with a bounded interior capable of experience. Contains its own centre; inside is structurally distinguishable from outside.",
    elementKind: "node_geometry",
  },
  {
    id:          "hexagon",
    symbol:      "⬡",
    name:        "Hexagon",
    entityClass: "system / institution / field",
    description: "A structured collective maintained by more than one participating element. Geometric regularity reflects organisational structure, not a single agent.",
    elementKind: "node_geometry",
  },
  {
    id:          "triangle",
    symbol:      "△",
    name:        "Triangle",
    entityClass: "claim / argument / force",
    description: "A directed force or assertion. Carries tension and direction; can be aimed. Has a top (point of force) and a base (grounding in evidence).",
    elementKind: "node_geometry",
  },
  {
    id:          "square",
    symbol:      "□",
    name:        "Square",
    entityClass: "rule / constraint / container",
    description: "A stable container. Does not move on its own. Provides boundaries within which other nodes operate. Regularity is its primary structural property.",
    elementKind: "node_geometry",
  },
  {
    id:          "diamond",
    symbol:      "◇",
    name:        "Diamond",
    entityClass: "threshold / decision / pivot",
    description: "A bifurcation point. Must have ≥2 outputs to function as a threshold. A diamond with one output is T3 pretending to be a decision.",
    elementKind: "node_geometry",
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// LEVEL 1 — SHAPE PRIMITIVES  (42 total across 10 category families)
//
// Category letters: F L P I T S C R D M
// Level 1 entry set (learn first): F1 L2 P1 I1 T1 T3 S1 S3 R1 D1
//
// THREAD B STATUS CODES:
//   status:"canonical"   = confirmed in governed corpus
//   status:"grounded"    = confirmed with evidence; pending formal seal
//   status:"provisional" = inferred from structural logic; verify against slaRegistry.ts
//   status:"parked"      = reserved; must not be activated until gate clears
// ─────────────────────────────────────────────────────────────────────────────

export const SLA_PRIMITIVES: readonly SLAPrimitive[] = [

  // ── F — CAUSAL FLOWS (5)  ──────────────────────────────────────────────────
  {
    id: "F1", name: "Linear Flow",
    category: "F", categoryName: "Causal Flows",
    polarity: "coherence", eleosAnchor: "EMIT",
    elementKind: "primitive", status: "canonical", isLevel1: true,
    fidelityCeiling: "EMET",
    nearestConfusion: { id: "L2", reason: "F1 has no return path; L2 feeds output back as input." },
    transitions: [
      { toId: "L2", validity: "valid" },
      { toId: "P1", validity: "valid" },
      { toId: "I1", validity: "valid" },
      { toId: "T1", validity: "valid" },
      { toId: "T3", validity: "context_required", note: "Requires documented disruption event." },
      { toId: "S3", validity: "valid" },
    ],
  },
  {
    id: "F2", name: "Bifurcation",
    category: "F", categoryName: "Causal Flows",
    polarity: "threshold", eleosAnchor: "EMIT",
    elementKind: "primitive", status: "provisional", isLevel1: false,
    fidelityCeiling: "DAVAR",
    nearestConfusion: { id: "F1", reason: "F1 is directed/single-path; F2 forces a split into two paths." },
    transitions: [
      { toId: "F1", validity: "valid", note: "Path taken after bifurcation resolves." },
      { toId: "T3", validity: "context_required", note: "If no path is taken the gate collapses." },
    ],
  },
  {
    id: "F3", name: "Convergent Flow",
    category: "F", categoryName: "Causal Flows",
    polarity: "coherence", eleosAnchor: "RECEIVE",
    elementKind: "primitive", status: "grounded", isLevel1: false,
    fidelityCeiling: "EMET",
    nearestConfusion: { id: "S2", reason: "S2 is two-domain intersection creating new meaning; F3 is multiple inputs collapsing into one synthesis point." },
    transitions: [
      { toId: "S2", validity: "valid" },
      { toId: "I1", validity: "valid" },
    ],
  },
  {
    id: "F4", name: "Interrupted Flow",
    category: "F", categoryName: "Causal Flows",
    polarity: "failure", eleosAnchor: "EMIT",
    elementKind: "primitive", status: "grounded", isLevel1: false,
    fidelityCeiling: "DAVAR",
    nearestConfusion: { id: "T1", reason: "T1 is a fracture through a structure; F4 is a flow that fails to reach its target. T1 breaks; F4 stops." },
    transitions: [
      { toId: "T1", validity: "context_required" },
      { toId: "T3", validity: "context_required", note: "If interruption is sustained." },
    ],
  },
  {
    id: "F5", name: "Retrograde Flow",
    category: "F", categoryName: "Causal Flows",
    polarity: "failure", eleosAnchor: "EMIT",
    elementKind: "primitive", status: "provisional", isLevel1: false,
    fidelityCeiling: "DAVAR",
    nearestConfusion: { id: "R1", reason: "R1 is structured return toward coherence; F5 is movement against natural direction without a repair arc." },
    transitions: [
      { toId: "T3", validity: "context_required" },
      { toId: "D1", validity: "context_required" },
    ],
  },

  // ── L — RECURSION & LOOPS (4)  ────────────────────────────────────────────
  {
    id: "L1", name: "Simple Loop",
    category: "L", categoryName: "Recursion & Loops",
    polarity: "neutral", eleosAnchor: "INFER",
    elementKind: "primitive", status: "provisional", isLevel1: false,
    fidelityCeiling: "DAVAR",
    nearestConfusion: { id: "L2", reason: "L1 is a closed circuit with no net change per cycle; L2 modifies its own input." },
    transitions: [
      { toId: "L2", validity: "context_required", note: "If loop begins modifying its own input." },
      { toId: "F1", validity: "valid", note: "If loop resolves into directed output." },
    ],
  },
  {
    id: "L2", name: "Feedback Loop",
    category: "L", categoryName: "Recursion & Loops",
    polarity: "neutral", eleosAnchor: "INFER",
    elementKind: "primitive", status: "canonical", isLevel1: true,
    fidelityCeiling: "DAVAR",
    nearestConfusion: { id: "S3", reason: "S3 organises other elements via attractor pull; L2 routes its own output back as input. S3 faces outward; L2 loops internally." },
    transitions: [
      { toId: "F1", validity: "valid" },
      { toId: "T3", validity: "context_required", note: "When L2 mode is degrading and basin accumulates." },
      { toId: "S3", validity: "context_required", note: "Declare frame: mechanism vs. steady_state before assigning both." },
    ],
    governanceFlags: {
      modeDeclarationRequired: true,
      // L2 mode must be declared: "amplifying" | "dampening" | "degrading"
      // Loop mode (L2 governing COMPILE) ≠ Sharpen mode (COMPILE governing L2)
      // Undeclared mode = DAVAR ceiling; mode required for EMET
    },
  },
  {
    id: "L3", name: "Spiral",
    category: "L", categoryName: "Recursion & Loops",
    polarity: "neutral", eleosAnchor: "INFER",
    elementKind: "primitive", status: "provisional", isLevel1: false,
    fidelityCeiling: "DAVAR",
    nearestConfusion: { id: "L2", reason: "L2 returns to the same origin; L3 displaces the origin with each pass — similar path, progressive shift." },
    transitions: [
      { toId: "T3", validity: "context_required", note: "If spiral is tightening toward collapse." },
      { toId: "R1", validity: "context_required", note: "If spiral is expanding toward recovery." },
    ],
  },
  {
    id: "L4", name: "Oscillation",
    category: "L", categoryName: "Recursion & Loops",
    polarity: "neutral", eleosAnchor: "INFER",
    elementKind: "primitive", status: "provisional", isLevel1: false,
    fidelityCeiling: "DAVAR",
    nearestConfusion: { id: "R1", reason: "R1 is directed movement toward coherence; L4 alternates between two states without a net direction. Do not mistake L4 for R1 in progress." },
    transitions: [
      { toId: "F1", validity: "context_required", note: "If oscillation dampens to stable flow." },
      { toId: "T3", validity: "context_required", note: "If oscillation amplitude increases and basin forms." },
    ],
  },

  // ── P — PROJECTION & COMPRESSION (4)  ────────────────────────────────────
  {
    id: "P1", name: "Projection Cone",
    category: "P", categoryName: "Projection & Compression",
    polarity: "neutral", eleosAnchor: "RECEIVE",
    elementKind: "primitive", status: "canonical", isLevel1: true,
    fidelityCeiling: "EMET",
    nearestConfusion: { id: "F1", reason: "F1 is directed toward a specific target; P1 fans out across a field from a single source." },
    transitions: [
      { toId: "I1", validity: "valid" },
      { toId: "D1", validity: "context_required", note: "If projection is distorted by affect." },
    ],
  },
  {
    id: "P2", name: "Distortion Ridge",
    category: "P", categoryName: "Projection & Compression",
    polarity: "failure", eleosAnchor: "RECEIVE",
    elementKind: "primitive", status: "grounded", isLevel1: false,
    fidelityCeiling: "DAVAR",
    nearestConfusion: { id: "D1", reason: "D1 is the affective cause of the warp; P2 is the structural result — the ridge where expected pattern shapes incoming signal. They co-occur but are distinct." },
    transitions: [
      { toId: "D1", validity: "valid" },
      { toId: "T1", validity: "context_required" },
    ],
  },
  {
    id: "P3", name: "Compression Point",
    category: "P", categoryName: "Projection & Compression",
    polarity: "failure",  eleosAnchor: "RECEIVE",
    elementKind: "primitive", status: "provisional", isLevel1: false,
    fidelityCeiling: "DAVAR",
    nearestConfusion: { id: "T3", reason: "T3 is a gravitational sink from accumulated failure; P3 is pressure concentrated at a focal point without yet forming a basin." },
    transitions: [
      { toId: "T3", validity: "context_required", note: "If compression sustains and a basin forms." },
      { toId: "F2", validity: "context_required", note: "If compression forces a bifurcation." },
    ],
  },
  {
    id: "P4", name: "Expansion Funnel",
    category: "P", categoryName: "Projection & Compression",
    polarity: "repair", eleosAnchor: "RECEIVE",
    elementKind: "primitive", status: "grounded", isLevel1: false,
    fidelityCeiling: "DAVAR",
    nearestConfusion: { id: "P1", reason: "P1 projects outward from a source; P4 opens a widening field from a constraint point — the direction is similar but P4 follows restriction, P1 does not." },
    transitions: [
      { toId: "R1", validity: "valid", note: "P4 opening can initiate return arc." },
      { toId: "F1", validity: "context_required" },
    ],
    governanceFlags: {
      p4StatusUnresolved: true,
      // OPEN QUESTION: P4 appears as "Expansion Funnel" in transition rules
      // AND as "Witness Function" in ELEOS/P2L corpus.
      // Decision required: is P4 a single primitive holding both roles,
      // or should P4a/P4b be split?
      // T3→P4 is a confirmed valid transition (T3 Rule hard gate).
      // Freeze all P4 EMET claims until this is resolved.
    },
  },

  // ── I — IDENTITY & MEMORY (4)  ───────────────────────────────────────────
  {
    id: "I1", name: "Identity Shell",
    category: "I", categoryName: "Identity & Memory",
    polarity: "coherence", eleosAnchor: "REMEMBER",
    elementKind: "primitive", status: "canonical", isLevel1: true,
    fidelityCeiling: "EMET",
    nearestConfusion: { id: "S3", reason: "I1 defines what the entity is (self-boundary facing inward); S3 defines what draws others in (facing outward). I1 is a shell; S3 is a gravitational centre." },
    transitions: [
      { toId: "F1", validity: "valid" },
      { toId: "T1", validity: "valid", note: "Shell fracture." },
      // T3→I1 is INVALID — hard gate. Do not list it here as incoming.
    ],
  },
  {
    id: "I2", name: "Shadow Layer",
    category: "I", categoryName: "Identity & Memory",
    polarity: "failure", eleosAnchor: "REMEMBER",
    elementKind: "primitive", status: "provisional", isLevel1: false,
    fidelityCeiling: "DAVAR",
    nearestConfusion: { id: "I1", reason: "I1 is an intact shell; I2 is I1 with content suppressed below the acknowledged boundary. The shell is present; the interior is not owned." },
    transitions: [
      { toId: "T1", validity: "context_required", note: "If shadow content erupts." },
      { toId: "D1", validity: "valid" },
    ],
  },
  {
    id: "I3", name: "Memory Imprint",
    category: "I", categoryName: "Identity & Memory",
    polarity: "neutral", eleosAnchor: "REMEMBER",
    elementKind: "primitive", status: "provisional", isLevel1: false,
    fidelityCeiling: "DAVAR",
    nearestConfusion: { id: "L2", reason: "L2 is an active feedback loop modifying the present; I3 is a past state persisting as structural trace without active recursion." },
    transitions: [
      { toId: "I1", validity: "valid", note: "Imprint integrates into current shell." },
      { toId: "D1", validity: "context_required", note: "If imprint is warping present perception." },
    ],
  },
  {
    id: "I4", name: "Resonance Bridge",
    category: "I", categoryName: "Identity & Memory",
    polarity: "repair", eleosAnchor: "REMEMBER",
    elementKind: "primitive", status: "provisional", isLevel1: false,
    fidelityCeiling: "DAVAR",
    nearestConfusion: { id: "R1", reason: "R1 is directional movement toward coherence; I4 is the connection between two memory states that enables continuity — it is the bridge, not the arc." },
    transitions: [
      { toId: "R1", validity: "valid" },
      { toId: "I1", validity: "valid" },
    ],
  },

  // ── T — TRAUMA & INSTABILITY (5)  ────────────────────────────────────────
  {
    id: "T1", name: "Fracture Line",
    category: "T", categoryName: "Trauma & Instability",
    polarity: "failure", eleosAnchor: "COMPILE",
    elementKind: "primitive", status: "canonical", isLevel1: true,
    fidelityCeiling: "DAVAR",
    nearestConfusion: { id: "S1", reason: "S1 is lateral sliding between layers; T1 is a break through material. S1 produces displacement; T1 produces rupture." },
    transitions: [
      { toId: "T3", validity: "valid" },
      { toId: "R1", validity: "valid", note: "If repair is initiated at the fracture point." },
      { toId: "T4", validity: "valid", note: "If fracture becomes acute rupture." },
    ],
  },
  {
    id: "T2", name: "Erosion Path",
    category: "T", categoryName: "Trauma & Instability",
    polarity: "failure", eleosAnchor: "COMPILE",
    elementKind: "primitive", status: "provisional", isLevel1: false,
    fidelityCeiling: "DAVAR",
    nearestConfusion: { id: "T1", reason: "T1 is an acute break event; T2 is gradual degradation over time without a single rupture point." },
    transitions: [
      { toId: "T1", validity: "valid", note: "Erosion can reach fracture threshold." },
      { toId: "T3", validity: "valid" },
    ],
  },
  {
    id: "T3", name: "Collapse Basin",
    category: "T", categoryName: "Trauma & Instability",
    polarity: "failure", eleosAnchor: "COMPILE+GUIDE",
    elementKind: "primitive", status: "canonical", isLevel1: true,
    fidelityCeiling: "DAVAR",
    nearestConfusion: { id: "S3", reason: "Both have visible centres. T3's centre is a sink — things fall in. S3's centre is an attractor — things orbit and maintain coherence. Test: does proximity produce organisation (S3) or accumulation without exit (T3)?" },
    transitions: [
      { toId: "R1", validity: "valid",    note: "Return arc initiated — valid exit." },
      { toId: "P4", validity: "valid",    note: "Expansion funnel / Witness Function — valid exit." },
      { toId: "T3", validity: "valid",    note: "Remains in basin — honest." },
      { toId: "I1", validity: "invalid",  note: "HARD GATE: collapse ≠ identity without repair." },
      { toId: "F1", validity: "invalid",  note: "HARD GATE: collapse ≠ flow without return." },
      { toId: "S3", validity: "invalid",  note: "HARD GATE: collapse ≠ organisation directly." },
    ],
    governanceFlags: {
      modeDeclarationRequired: true,
      antiWeaponizationRule:
        "SLA-WEAP-001: T3 Rule may not be applied to demand R1 demonstration as condition of care, safety, or recognition.",
      // T3 mode: "transient" | "structural_home" | "unresolved_basin"
      // structural_home = T3-like depth is native state (e.g. Raga Darbari);
      //   NOT pathological; exit to F1 is not the governance target.
      // Undeclared mode = DAVAR ceiling for EMET claims.
    },
  },
  {
    id: "T4", name: "Rupture Point",
    category: "T", categoryName: "Trauma & Instability",
    polarity: "failure", eleosAnchor: "COMPILE",
    elementKind: "primitive", status: "provisional", isLevel1: false,
    fidelityCeiling: "DAVAR",
    nearestConfusion: { id: "T1", reason: "T1 is a fracture line that may persist; T4 is acute sudden structural failure — an event, not a state." },
    transitions: [
      { toId: "T3", validity: "valid" },
    ],
  },
  {
    id: "T5", name: "Stress Band",
    category: "T", categoryName: "Trauma & Instability",
    polarity: "failure", eleosAnchor: "COMPILE",
    elementKind: "primitive", status: "provisional", isLevel1: false,
    fidelityCeiling: "DAVAR",
    nearestConfusion: { id: "S1", reason: "S1 is active lateral displacement; T5 is concentrated pressure along a boundary that has not yet produced fracture or displacement." },
    transitions: [
      { toId: "T2", validity: "valid", note: "Stress becomes gradual erosion." },
      { toId: "T1", validity: "context_required", note: "If stress exceeds threshold." },
    ],
  },

  // ── S — COMPLEX SYSTEMS (5)  ──────────────────────────────────────────────
  {
    id: "S1", name: "Shearing Planes",
    category: "S", categoryName: "Complex Systems",
    polarity: "failure", eleosAnchor: "INFER",
    elementKind: "primitive", status: "canonical", isLevel1: true,
    fidelityCeiling: "DAVAR",
    nearestConfusion: { id: "T1", reason: "T1 is a break through material; S1 is lateral sliding between layers. S1 displaces; T1 ruptures." },
    transitions: [
      { toId: "T1", validity: "valid", note: "Shearing can produce fracture." },
      { toId: "S3", validity: "context_required", note: "Only if shearing resolves into stable attractor configuration." },
    ],
  },
  {
    id: "S2", name: "Domain Intersection",
    category: "S", categoryName: "Complex Systems",
    polarity: "coherence", eleosAnchor: "COMPILE",
    elementKind: "primitive", status: "grounded", isLevel1: false,
    fidelityCeiling: "EMET",
    nearestConfusion: { id: "F3", reason: "F3 is multiple flows converging to a single point; S2 is two distinct domains overlapping to produce new emergent meaning in the intersection zone." },
    transitions: [
      { toId: "S3", validity: "valid" },
      { toId: "I1", validity: "context_required" },
    ],
  },
  {
    id: "S3", name: "Attractor Hub",
    category: "S", categoryName: "Complex Systems",
    polarity: "coherence", eleosAnchor: "GUIDE",
    elementKind: "primitive", status: "canonical", isLevel1: true,
    fidelityCeiling: "EMET",
    nearestConfusion: { id: "I1", reason: "I1 defines what the entity is (self-boundary); S3 defines what draws others in (field-organising pull). I1 faces inward; S3 faces outward." },
    transitions: [
      { toId: "L2", validity: "valid", note: "Attractor hubs commonly generate feedback loops." },
    ],
  },
  {
    id: "S4", name: "Emergence Layer",
    category: "S", categoryName: "Complex Systems",
    polarity: "coherence", eleosAnchor: "INFER",
    elementKind: "primitive", status: "provisional", isLevel1: false,
    fidelityCeiling: "DAVAR",
    nearestConfusion: { id: "S2", reason: "S2 is two known domains intersecting; S4 is properties arising from component interaction that were not predictable from the parts." },
    transitions: [
      { toId: "S3", validity: "valid" },
      { toId: "F1", validity: "context_required" },
    ],
  },
  {
    id: "S5", name: "Dissipation Field",
    category: "S", categoryName: "Complex Systems",
    polarity: "failure", eleosAnchor: "INFER",
    elementKind: "primitive", status: "provisional", isLevel1: false,
    fidelityCeiling: "DAVAR",
    nearestConfusion: { id: "T3", reason: "T3 is a gravitational sink accumulating failure; S5 is organised energy gradually dispersing — the system is losing its organising force, not forming a basin." },
    transitions: [
      { toId: "T3", validity: "context_required", note: "If dissipation completes and a basin forms." },
      { toId: "F5", validity: "context_required" },
    ],
  },

  // ── C — COHERENCE STRUCTURES (4)  ────────────────────────────────────────
  //
  // C2 is parked — see governanceFlags.
  // ELEOS context confirms C1/C2/C3/C4 configurations are distinct.
  // These are the structural states COMPILE produces when functional.
  //
  {
    id: "C1", name: "Boundary Layer",
    category: "C", categoryName: "Coherence Structures",
    polarity: "coherence", eleosAnchor: "COMPILE",
    elementKind: "primitive", status: "provisional", isLevel1: false,
    fidelityCeiling: "DAVAR",
    nearestConfusion: { id: "I1", reason: "I1 is the self-boundary of an agent; C1 is a well-defined structural limit separating two domains — it applies to systems, not only persons." },
    transitions: [
      { toId: "F1", validity: "valid" },
      { toId: "C2", validity: "valid" },
    ],
  },
  {
    id: "C2", name: "Internal Synthesis",
    category: "C", categoryName: "Coherence Structures",
    polarity: "coherence", eleosAnchor: "COMPILE",
    elementKind: "primitive", status: "parked", isLevel1: false,
    fidelityCeiling: "BLOCKED",
    nearestConfusion: { id: "S2", reason: "S2 is intersection of two external domains; C2 is synthesis of disparate elements inside a bounded system." },
    transitions: [],
    governanceFlags: {
      parkedReason:
        "C2Gate — C2_SLA is a reserved candidate. Do not activate until C2Gate promotion criteria are met. Do not add to active scan receipts. See MHGG thread: 'Do not add C2_SLA to production slaRegistry.'",
    },
  },
  {
    id: "C3", name: "Structural Persistence",
    category: "C", categoryName: "Coherence Structures",
    polarity: "coherence", eleosAnchor: "COMPILE",
    elementKind: "primitive", status: "provisional", isLevel1: false,
    fidelityCeiling: "DAVAR",
    nearestConfusion: { id: "L1", reason: "L1 is a closed circuit that returns to origin; C3 is a pattern maintaining itself over time without active recursion — it endures, not loops." },
    transitions: [
      { toId: "I1", validity: "valid" },
      { toId: "S3", validity: "context_required" },
    ],
  },
  {
    id: "C4", name: "Field Cohesion",
    category: "C", categoryName: "Coherence Structures",
    polarity: "coherence", eleosAnchor: "COMPILE",
    elementKind: "primitive", status: "provisional", isLevel1: false,
    fidelityCeiling: "DAVAR",
    nearestConfusion: { id: "S3", reason: "S3 coheres through a central attractor; C4 coheres through distributed rule-following with no central hub. Many governance systems are C4 structures." },
    transitions: [
      { toId: "S3", validity: "context_required", note: "If a centre emerges from distributed coherence." },
      { toId: "T1", validity: "context_required", note: "If distributed cohesion fractures." },
    ],
  },

  // ── R — RETURN & REPAIR (4)  ──────────────────────────────────────────────
  {
    id: "R1", name: "Return Arc",
    category: "R", categoryName: "Return & Repair",
    polarity: "repair", eleosAnchor: "REMEMBER+GUIDE",
    elementKind: "primitive", status: "canonical", isLevel1: true,
    fidelityCeiling: "DAVAR",
    nearestConfusion: { id: "F1", reason: "F1 originates from baseline; R1 originates from a failure state. Both are directional — the difference is origin and purpose." },
    transitions: [
      { toId: "F1", validity: "valid" },
      { toId: "I1", validity: "valid" },
    ],
    // R1 TYPE TAXONOMY — required when T3 is present and R1 is claimed:
    // R1-A: Structurally unavailable — conditions for return do not yet exist
    // R1-B: Missed window — return was possible but threshold passed
    // R1-C: False return — claimed without structural evidence (AUTO-FAIL)
    // R1-D: Genuine return without claimed arrival
  },
  {
    id: "R2", name: "Repair Suture",
    category: "R", categoryName: "Return & Repair",
    polarity: "repair", eleosAnchor: "REMEMBER",
    elementKind: "primitive", status: "provisional", isLevel1: false,
    fidelityCeiling: "DAVAR",
    nearestConfusion: { id: "R1", reason: "R1 is a whole-system return arc; R2 is localised mending of a specific breach. R2 may be a component of R1 or standalone." },
    transitions: [
      { toId: "R1", validity: "context_required" },
      { toId: "C1", validity: "valid" },
    ],
  },
  {
    id: "R3", name: "Reintegration Path",
    category: "R", categoryName: "Return & Repair",
    polarity: "repair", eleosAnchor: "REMEMBER+GUIDE",
    elementKind: "primitive", status: "provisional", isLevel1: false,
    fidelityCeiling: "DAVAR",
    nearestConfusion: { id: "R1", reason: "R1 is return of a single entity toward coherence; R3 is the reintegration of separated elements back into a coherent whole — includes the exile." },
    transitions: [
      { toId: "I1", validity: "valid" },
      { toId: "S3", validity: "valid" },
    ],
  },
  {
    id: "R4", name: "Reconstitution Zone",
    category: "R", categoryName: "Return & Repair",
    polarity: "repair", eleosAnchor: "GUIDE",
    elementKind: "primitive", status: "provisional", isLevel1: false,
    fidelityCeiling: "DAVAR",
    nearestConfusion: { id: "R1", reason: "R1 returns to what was; R4 constructs new structural integrity where the previous structure cannot be restored. R1 returns; R4 reconstitutes." },
    transitions: [
      { toId: "F1", validity: "context_required" },
      { toId: "C2", validity: "context_required", note: "C2 parked — do not use until C2Gate." },
    ],
  },

  // ── D — DISTORTION (4)  ───────────────────────────────────────────────────
  {
    id: "D1", name: "Affect Warp",
    category: "D", categoryName: "Distortion",
    polarity: "failure", eleosAnchor: "RECEIVE",
    elementKind: "primitive", status: "canonical", isLevel1: true,
    fidelityCeiling: "DAVAR",
    nearestConfusion: { id: "P1", reason: "P1 is projection that honestly narrows onto a target; D1 is the bending of the perceptual field by emotional charge. P1 projects outward; D1 warps reception." },
    transitions: [
      { toId: "P2", validity: "valid" },
      { toId: "T3", validity: "valid" },
    ],
    governanceFlags: {
      requiresBifurcationGate: true,
      // D1 can operate at object level (thing being scanned is warped) OR
      // at instrument level (analyst's own affect warps the scan — D1-meta).
      // D1-meta is the more dangerous form; it is invisible from inside the scan.
      // FLOOR-006: D1 present without bifurcation gate = DAVAR ceiling maximum.
    },
  },
  {
    id: "D2", name: "Scale Distortion",
    category: "D", categoryName: "Distortion",
    polarity: "failure", eleosAnchor: "RECEIVE",
    elementKind: "primitive", status: "provisional", isLevel1: false,
    fidelityCeiling: "DAVAR",
    nearestConfusion: { id: "D1", reason: "D1 is affective warp; D2 is scale misrepresentation — the subject is shown at the wrong size relative to its structural significance." },
    transitions: [
      { toId: "D1", validity: "context_required" },
    ],
  },
  {
    id: "D3", name: "Frame Bleed",
    category: "D", categoryName: "Distortion",
    polarity: "failure", eleosAnchor: "RECEIVE",
    elementKind: "primitive", status: "provisional", isLevel1: false,
    fidelityCeiling: "DAVAR",
    nearestConfusion: { id: "D1", reason: "D1 is affective warp on a single frame; D3 is contamination across frame boundaries — content from one register leaks into another (Register Chimera)." },
    transitions: [
      { toId: "D1", validity: "context_required" },
    ],
    // D3 is the structural name for Register Chimera.
    // Black Label vocabulary in consumer-tier output = D3.
    // Lane Translation Matrix is the operational control.
  },
  {
    id: "D4", name: "Signal Noise",
    category: "D", categoryName: "Distortion",
    polarity: "failure", eleosAnchor: "RECEIVE",
    elementKind: "primitive", status: "provisional", isLevel1: false,
    fidelityCeiling: "DAVAR",
    nearestConfusion: { id: "D1", reason: "D1 warps the field through emotion; D4 degrades the signal through interference that is not primarily affective." },
    transitions: [
      { toId: "T1", validity: "context_required" },
    ],
  },

  // ── M — THRESHOLD & SALIENCE (3)  ────────────────────────────────────────
  //
  // Category letter M confirmed from CI code: F/L/P/I/T/S/R/D/C/M.
  // "Threshold & Salience" — the 10th category governs gate events,
  // bifurcation markers, and perceptual salience anchors.
  // May overlap with the glyph system (◇, ◈, etc.) — pending reconciliation.
  //
  {
    id: "M1", name: "Salience Marker",
    category: "M", categoryName: "Threshold & Salience",
    polarity: "threshold", eleosAnchor: "all_six_gate_dependent",
    elementKind: "primitive", status: "provisional", isLevel1: false,
    fidelityCeiling: "DAVAR",
    nearestConfusion: { id: "F1", reason: "F1 is directed flow; M1 marks where attention is drawn before any primitive is assigned — it is pre-primitive salience." },
    transitions: [
      { toId: "F2", validity: "context_required" },
    ],
  },
  {
    id: "M2", name: "Gate Signal",
    category: "M", categoryName: "Threshold & Salience",
    polarity: "threshold", eleosAnchor: "all_six_gate_dependent",
    elementKind: "primitive", status: "provisional", isLevel1: false,
    fidelityCeiling: "DAVAR",
    nearestConfusion: { id: "F2", reason: "F2 is the bifurcation itself; M2 is the signal that a threshold is active and a bifurcation is imminent." },
    transitions: [
      { toId: "F2", validity: "valid" },
    ],
  },
  {
    id: "M3", name: "Liminal Field",
    category: "M", categoryName: "Threshold & Salience",
    polarity: "threshold", eleosAnchor: "all_six_gate_dependent",
    elementKind: "primitive", status: "provisional", isLevel1: false,
    fidelityCeiling: "DAVAR",
    nearestConfusion: { id: "T3", reason: "T3 is sustained collapse; M3 is sustained threshold residence — the entity lives at the gate without crossing. M3 is not broken; T3 is sunk." },
    transitions: [
      { toId: "R1", validity: "context_required", note: "If liminality resolves into movement." },
      { toId: "T3", validity: "context_required", note: "If liminal state collapses into a basin." },
    ],
    // M3 is the candidate primitive for the ◈ glyph (Inhabited Threshold).
    // Pending ◈ canonical lock (SLA-GLYPH-007-◈-SPEC.md).
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// SPECIAL GLYPHS  (7 total — NOT counted in the 42 primitives)
// ─────────────────────────────────────────────────────────────────────────────

export const SLA_GLYPHS: readonly SLAGlyph[] = [
  {
    symbol:       "◇",
    name:         "Threshold Event",
    elementKind:  "glyph",
    status:       "canonical",
    function:     "Marks a Diamond-node decision point with ≥2 valid outputs.",
    gateCondition:"Required at Diamond node boundaries.",
    nearestConfusion: "◈ — ◇ marks the gate; ◈ marks residence at the gate.",
  },
  {
    symbol:       "◈",
    name:         "Inhabited Threshold",  // CANDIDATE NAME — pending lock
    elementKind:  "glyph",
    status:       "provisional",
    function:     "Candidate: marks an entity residing at a threshold state — not before, not through, but in it. T3 or P4 co-presence required.",
    gateCondition:"GLYPH-REG-001 active — requires CORDIA/SIGLER dual signature before canonical use.",
    nearestConfusion: "◇ — ◇ marks the gate; ◈ marks living at the gate.",
  },
  // 5 additional glyphs — IDs pending slaRegistry.ts reconciliation with V
  { symbol: "[G3]", name: "Glyph 3", elementKind: "glyph", status: "provisional", function: "Pending V reconciliation.", gateCondition: "Unknown." },
  { symbol: "[G4]", name: "Glyph 4", elementKind: "glyph", status: "provisional", function: "Pending V reconciliation.", gateCondition: "Unknown." },
  { symbol: "[G5]", name: "Glyph 5", elementKind: "glyph", status: "provisional", function: "Pending V reconciliation.", gateCondition: "Unknown." },
  { symbol: "[G6]", name: "Glyph 6", elementKind: "glyph", status: "provisional", function: "Pending V reconciliation.", gateCondition: "Unknown." },
  { symbol: "[G7]", name: "Glyph 7", elementKind: "glyph", status: "provisional", function: "Pending V reconciliation.", gateCondition: "Unknown." },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// HARD RULES  (machine-readable governance constants)
// ─────────────────────────────────────────────────────────────────────────────

export const SLA_HARD_RULES = {
  T3_GATE: {
    valid:   ["T3->R1", "T3->P4", "T3->T3"] as const,
    invalid: ["T3->I1", "T3->F1", "T3->S3"] as const,
    canon:   "Collapse does not become coherence without a return process.",
  },
  ALPHABET_FREEZE: {
    locked:          true,
    changeProtocol:  "7-gate review + independent E4+ evidence in ≥3 domains + canon authorisation",
    countAssertion:  "5 node types + 42 shape primitives = 47 locked elements",
  },
  ANTI_WEAPONISATION: {
    "SLA-WEAP-001":
      "The T3 Rule may not be applied to demand R1 demonstration as a condition of care, safety, or recognition from a person in T3.",
  },
  BEAUTY_AS_PROOF: {
    rule:    "BEAUTY_AS_PROOF",
    effect:  "AUTO_FAIL — aesthetic quality is not structural evidence.",
    floor:   "QOL ceiling maximum.",
  },
  MISSING_TRANSITION_IS_NOT_TERMINAL: {
    rule:   "Missing transition entries must display as UNMAPPED not TERMINAL.",
    reason: "F4:[] means intentionally terminal/blocked; missing P3 transitions means not yet mapped. These are different states.",
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// LOOKUP UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

/** Returns the primitive for a given ID, or undefined. */
export function getPrimitive(id: string): SLAPrimitive | undefined {
  return SLA_PRIMITIVES.find(p => p.id === id);
}

/** Returns true only if the ID exists in the registry AND is not parked. */
export function hasPrimitive(id: string): boolean {
  const p = getPrimitive(id);
  return p !== undefined && p.status !== "parked";
}

/** Returns all canonical + grounded primitives (active, non-parked). */
export function getActivePrimitives(): SLAPrimitive[] {
  return SLA_PRIMITIVES.filter(p => p.status !== "parked" && p.status !== "deprecated");
}

/** Returns the 10 Level 1 entry primitives. */
export function getLevel1Primitives(): SLAPrimitive[] {
  return SLA_PRIMITIVES.filter(p => p.isLevel1);
}

/** Returns primitives for a given category letter. */
export function getPrimitivesByCategory(letter: string): SLAPrimitive[] {
  return SLA_PRIMITIVES.filter(p => p.category === letter);
}

/**
 * Returns the validity of a transition from -> to.
 * CRITICAL: returns "unmapped" (not "terminal") when no rule exists.
 * This preserves the grammar bug fix — unmapped ≠ terminal.
 */
export function getTransitionValidity(
  fromId: string,
  toId:   string
): TransitionValidity {
  const prim = getPrimitive(fromId);
  if (!prim) return "unmapped";
  const rule = prim.transitions.find(t => t.toId === toId);
  return rule ? rule.validity : "unmapped"; // unmapped, NOT terminal
}

/** Returns true if the transition is hard-blocked. */
export function isTransitionInvalid(fromId: string, toId: string): boolean {
  return getTransitionValidity(fromId, toId) === "invalid";
}

// ─────────────────────────────────────────────────────────────────────────────
// CI INVARIANTS  (run these in slaRegistry.test.ts)
// ─────────────────────────────────────────────────────────────────────────────

export function assertRegistryInvariants(): void {
  const active    = getActivePrimitives();
  const all42     = SLA_PRIMITIVES.filter(p => p.elementKind === "primitive");
  const nodeCount = SLA_NODE_GEOMETRIES.length;
  const primCount = all42.length;
  const total     = nodeCount + primCount;
  const l1Count   = getLevel1Primitives().length;
  const glyphCnt  = SLA_GLYPHS.length;

  if (nodeCount !== 5)
    throw new Error(`[SLA CI] nodeCount must be 5, got ${nodeCount}`);
  if (primCount !== 42)
    throw new Error(`[SLA CI] primitiveCount must be 42, got ${primCount}`);
  if (total !== 47)
    throw new Error(`[SLA CI] totalCount must be 47, got ${total}`);
  if (l1Count !== 10)
    throw new Error(`[SLA CI] level1Count must be 10, got ${l1Count}`);
  if (glyphCnt !== 7)
    throw new Error(`[SLA CI] glyphCount must be 7, got ${glyphCnt}`);
  if (!SLA_REGISTRY_METADATA.alphabetFrozen)
    throw new Error(`[SLA CI] alphabetFrozen must be true`);

  // SLA-FLOOR-003: every transition target must exist in the registry
  for (const p of SLA_PRIMITIVES) {
    for (const t of p.transitions) {
      const target = getPrimitive(t.toId);
      if (!target)
        throw new Error(`[SLA CI] Transition ${p.id}->${t.toId}: target not in registry`);
    }
  }

  // T3 hard gate
  for (const inv of SLA_HARD_RULES.T3_GATE.invalid) {
    const [from, to] = inv.split("->") as [string, string];
    if (!isTransitionInvalid(from, to))
      throw new Error(`[SLA CI] T3 hard gate violated: ${inv} must be invalid`);
  }

  // No hardcoded "47" outside of this file — enforced by linter, not here
}

// ─────────────────────────────────────────────────────────────────────────────
// ELEOS CROSSWALK  (SLA primitive → ELEOS state map)
// ─────────────────────────────────────────────────────────────────────────────

export const ELEOS_SLA_CROSSWALK = {
  EMIT: {
    successForm:     ["F1"],
    failureForm:     ["F4"],
    degradedForm:    ["P2", "D1"],
  },
  RECEIVE: {
    successForm:     ["F3", "P1"],
    failureForm:     ["P2"],
    warpedForm:      ["D1"],
    collapsedForm:   ["T3"],
  },
  COMPILE: {
    successForm:     ["S2", "C1", "C2", "C3", "C4"],
    failureForm:     ["T1"],
    collapsedForm:   ["T3"],
    loopingForm:     ["L2"],  // L2-degrading governs COMPILE = Loop mode
  },
  GUIDE: {
    successForm:     ["S3"],
    absentForm:      ["T3"],
    observingForm:   ["P4"],  // Type B Closure: GUIDE watching, not selecting
    falseForm:       ["I1"],  // I1-false governing lie
  },
  REMEMBER: {
    intactForm:      ["I1"],
    imprintedForm:   ["I3"],
    bridgingForm:    ["I4", "R1"],
    degradedForm:    ["I2"],
    collapsedForm:   ["T3"],
  },
  INFER: {
    activeForm:      ["L2", "S1"],
    loopingForm:     ["L2"],
    blindForm:       ["T3"],
    restoringForm:   ["R1"],
  },
  // T3 ELEOS DISMANTLING SEQUENCE (sealed from PTL corpus):
  // COMPILE fails first → GUIDE → REMEMBER → INFER → EMIT
  // R1 RESTORATION SEQUENCE (reverse):
  // RECEIVE first → GUIDE → COMPILE → REMEMBER → INFER → EMIT
  T3_DISMANTLING_SEQUENCE: ["COMPILE", "GUIDE", "REMEMBER", "INFER", "EMIT"] as const,
  R1_RESTORATION_SEQUENCE: ["RECEIVE", "GUIDE", "COMPILE", "REMEMBER", "INFER", "EMIT"] as const,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// FIDELITY CEILING RULES  (consolidated; supplements per-primitive flags)
// ─────────────────────────────────────────────────────────────────────────────

export const FIDELITY_CEILING_RULES: Array<{
  code:    string;
  trigger: string;
  ceiling: FidelityTier | "BLOCKED";
}> = [
  { code: "FLOOR-001", trigger: "Missing observed cue",                               ceiling: "QOL"     },
  { code: "FLOOR-002", trigger: "Missing node type",                                  ceiling: "BLOCKED" },
  { code: "FLOOR-003", trigger: "Primitive not in registry (use hasPrimitive())",      ceiling: "BLOCKED" },
  { code: "FLOOR-004", trigger: "Missing confusion check",                             ceiling: "DAVAR"   },
  { code: "FLOOR-005", trigger: "T3 present without confirmed R1 or P4",              ceiling: "DAVAR"   },
  { code: "FLOOR-006", trigger: "D1 present without bifurcation gate",                ceiling: "DAVAR"   },
  { code: "SLA-FRAME-001", trigger: "Nested EMET without frameDeclaration",           ceiling: "DAVAR"   },
  { code: "SLA-MODE-001",  trigger: "L2 without mode declared; T3 without mode",      ceiling: "DAVAR"   },
  { code: "SLA-PROV-002",  trigger: "Image/render EMET without exact-source",         ceiling: "DAVAR"   },
  { code: "SLA-PROOF-001", trigger: "Public lane without proof boundaries",           ceiling: "DAVAR"   },
  { code: "SLA-PROOF-002", trigger: "EMET receipt missing notAllowedToProve",         ceiling: "DAVAR"   },
  { code: "P4-UNRESOLVED", trigger: "P4 in EMET claim pending registry status lock",  ceiling: "DAVAR"   },
  { code: "GLYPH-REG-001", trigger: "◈ used without canonical definition locked",     ceiling: "DAVAR"   },
  { code: "BEAUTY_AS_PROOF",trigger: "Beauty used as evidence",                       ceiling: "BLOCKED" },
  { code: "SLA-WEAP-001", trigger: "T3 Rule applied coercively",                      ceiling: "BLOCKED" },
];

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT EXPORT
// ─────────────────────────────────────────────────────────────────────────────

const slaRegistry = {
  metadata:            SLA_REGISTRY_METADATA,
  nodeGeometries:      SLA_NODE_GEOMETRIES,
  primitives:          SLA_PRIMITIVES,
  glyphs:              SLA_GLYPHS,
  hardRules:           SLA_HARD_RULES,
  eleosCrosswalk:      ELEOS_SLA_CROSSWALK,
  fidelityCeilings:    FIDELITY_CEILING_RULES,
  getPrimitive,
  hasPrimitive,
  getActivePrimitives,
  getLevel1Primitives,
  getPrimitivesByCategory,
  getTransitionValidity,
  isTransitionInvalid,
  assertRegistryInvariants,
} as const;

export default slaRegistry;
