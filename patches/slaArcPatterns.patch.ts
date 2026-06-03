/**
 * slaArcPatterns.patch.ts
 * V-confirmed structural patches for the SLA Arc Grammar Layer
 * ISO: 2026-06-03
 *
 * PATCHES IN THIS FILE (V priority order):
 *   PATCH-1: T3ModeDeclaration — add "structural" variant
 *   PATCH-2: deriveArcStatus() — receipt-derived status, not author-authored
 *   PATCH-3: claimBoundary field — machine-readable allowedToProve / notAllowedToProve
 *   PATCH-4: provisionalPrimitivesPresent / provisionalPrimitives fields
 *   PATCH-5: arcMaturity field — structural coherence separate from governance clearance
 *   PATCH-6: requiresVConfirmation flag — marks pre-reconciliation status claims
 *   PATCH-7: Unused import cleanup
 *   PATCH-8: New canon lines → SLA_HARD_RULES
 *
 * APPLY BY: replacing the corresponding sections in slaArcPatterns.ts
 * Do NOT copy this file wholesale — it is a patch file, not a replacement.
 */

// ─────────────────────────────────────────────────────────────────────────────
// PATCH-1: T3ModeDeclaration — CRITICAL COMPILE FIX
//
// Previous type caused compile error: ARC-002 used "structural" which was
// not a member of the discriminated union.
// V confirmed this via local tsc check.
// ─────────────────────────────────────────────────────────────────────────────

export type T3ModeDeclaration =
  | "transient"
  // ↑ T3 is a developmental stage; R1 is the target exit.
  | "structural"
  // ↑ T3 is the terminal structure of the arc — the arc ends in T3.
  //   The system was not designed to live here, but arrives here and cannot exit.
  //   PRIMARY CASE: ARC-002 Recognition Collapse (Type B Closure).
  //   FUTURE REFACTOR: this will split into primitiveT3Mode / arcT3Role.
  //   DEPRECATION NOTICE: "structural" is a bridge value until that refactor ships.
  | "structural_home"
  // ↑ T3-like depth is the native operating condition or necessary precondition
  //   for emergence. Exit to F1 is NOT the governance target.
  //   PRIMARY CASE: ARC-003 Basin Clearance (Ragnarök).
  | "unresolved_basin"
  // ↑ T3 persists as governed complexity state — no single R1 is possible.
  //   PRIMARY CASE: ARC-004 Polycentric Field.
  | "not_applicable";
  // ↑ T3 is not present in this arc's canonical sequence.

// DISTINCTION BETWEEN structural AND structural_home:
// structural:      T3 is where the arc ends. The system arrived here from coherence.
//                  The system was not designed to live in T3. It just cannot exit.
// structural_home: T3-like depth is the operating baseline OR
//                  the precondition for emergence. The system may be native to T3.
//
// FUTURE REFACTOR TARGET (do not do now — add "structural" and ship):
//   primitiveT3Mode: "transient" | "structural_home" | "unresolved_basin"
//   arcT3Role:       "stage" | "terminal" | "origin_condition" | "field_condition"
//   ARC-002: primitiveT3Mode="unresolved_basin", arcT3Role="terminal"
//   ARC-003: primitiveT3Mode="structural_home",  arcT3Role="origin_condition"

// ─────────────────────────────────────────────────────────────────────────────
// PATCH-2: Arc Status Derivation — arc status is receipt-derived, not authored
// ─────────────────────────────────────────────────────────────────────────────

export type ArcPatternStatus =
  | "candidate"     // no confirmed specimens; structurally coherent but unwitnessed
  | "grounded"      // one sealed or confirmed specimen
  | "confirmed"     // two or more specimens across independent domains
  | "sealed";       // Gate 3 complete; V and Ellari co-signature; canonical

export interface ArcSpecimenNomination {
  readonly specimenId:  string;
  readonly scale:       "personal" | "literary" | "mythic" | "cultural" | "clinical";
  readonly status:      "candidate" | "confirmed" | "sealed";
}

/**
 * Derives arc status from specimen receipts.
 *
 * GOVERNANCE PRINCIPLE: Arc status must be receipt-derived, not author-authored.
 * An arc cannot self-declare its confirmation; it must count sealed receipts.
 *
 * NOTE: ARC-002 currently has two sealed specimens (PTL-001, AONL-001) and
 * returns "confirmed" via this function. If V's reconciliation determines AONL-001
 * does not qualify, the status will downgrade automatically to "grounded".
 * That is the correct behavior — the function enforces it.
 */
export function deriveArcStatus(
  specimens: readonly ArcSpecimenNomination[]
): ArcPatternStatus {
  const sealed    = specimens.filter(s => s.status === "sealed").length;
  const confirmed = specimens.filter(s => s.status === "confirmed").length;
  const qualified = sealed + confirmed;

  if (qualified >= 2) return "confirmed";
  if (qualified === 1) return "grounded";
  return "candidate";
}

// ─────────────────────────────────────────────────────────────────────────────
// PATCH-3: claimBoundary field — machine-readable proof boundaries
//
// Prose governance notes are human-readable but VALIDA-opaque.
// Each arc must have explicit machine-readable allowedToProve / notAllowedToProve
// before arc-level claims can enter the scan contract.
// ─────────────────────────────────────────────────────────────────────────────

export interface ArcClaimBoundary {
  /**
   * What this arc is allowed to prove structurally when identified in a specimen.
   * E2 = structural pattern observed; E3 = cross-domain alignment confirmed.
   */
  readonly allowedToProve: string[];

  /**
   * What this arc cannot prove, even when correctly identified.
   * These are the overclaim surfaces VALIDA should block.
   */
  readonly notAllowedToProve: string[];
}

// Claim boundaries for all 8 arcs:
export const ARC_CLAIM_BOUNDARIES: Record<string, ArcClaimBoundary> = {
  "SLA-ARC-001": {
    allowedToProve: [
      "T3 (transient mode) is present and R1 initiation is structurally observable",
      "The primitive sequence T1→T3→R1→I1 is active in this specimen",
      "The entity demonstrates structural difference from origin state (I1 enlarged)",
    ],
    notAllowedToProve: [
      "The person has healed or recovered",
      "R1 is complete (R1-D requires evidence; R1-C is the default false positive)",
      "The ordeal was necessary or purposeful — that is narrative, not structural",
      "The pattern applies to anyone else in a similar situation",
    ],
  },
  "SLA-ARC-002": {
    allowedToProve: [
      "T3 (structural mode) is present with P4 active and R1 structurally unavailable (R1-A type)",
      "Type B Closure pattern: T3+P4 without R1 exit is structurally present",
      "The arc terminates in T3 — this is honest structural state, not a failure",
    ],
    notAllowedToProve: [
      "R1 will eventually arrive — structural unavailability is not temporary absence",
      "The person failed to return — R1-A type is not a moral or behavioral failure",
      "This is pathological — Type B Closure is a structurally honest terminal state",
      "Knowing the arc predicts the outcome for any individual case",
    ],
  },
  "SLA-ARC-003": {
    allowedToProve: [
      "T3 (structural_home mode) is present as the necessary precondition for emergence",
      "The Basin Clearance sequence T2→T3→S4→new S3 is structurally observable",
      "S4 emergence following T3 basin represents genuine new structure, not restored origin",
    ],
    notAllowedToProve: [
      "The collapse was necessary or good — that is theological, not structural",
      "All T3 states lead to S4 emergence — Basin Clearance is not the only T3 arc",
      "The new S3 is better than the origin S3 — that is evaluative, not structural",
    ],
  },
  "SLA-ARC-004": {
    allowedToProve: [
      "Multi-strand S1/S2 field is active with D1 present across agents",
      "T3 (unresolved_basin mode) is present as the honest terminal state of polycentric conflict",
      "Truth is positionally distributed in this specimen — no single agent holds the full account",
    ],
    notAllowedToProve: [
      "Any one agent's account is the correct account",
      "The field could be resolved if parties tried harder",
      "Structural complexity justifies any particular party's position",
    ],
  },
  "SLA-ARC-005": {
    allowedToProve: [
      "L2 is governing the arc as correction mechanism with I1/C4 as the anchor",
      "T1 deviation and R1 correction are both structurally present",
      "The covenant (I1+C4 configuration) persists across correction cycles",
    ],
    notAllowedToProve: [
      "The covenant should persist — whether a covenant should persist is ethical, not structural",
      "All deviations are correctable — some deviations produce T3 instead of T1",
    ],
  },
  "SLA-ARC-006": {
    allowedToProve: [
      "L3 (spiral) governs the arc with I1 elevating across passes",
      "The same structural challenge is present at different intensities across the arc",
    ],
    notAllowedToProve: [
      "Growth is guaranteed — L3 can also spiral downward",
      "The entity has reached its final I1 state — Spiral Refinement has no declared terminal",
    ],
  },
  "SLA-ARC-007": {
    allowedToProve: [
      "S1→S2→S4→new S3 sequence is structurally observable",
      "The disruption (S1) produced a domain intersection (S2) that generated new structure (S4)",
    ],
    notAllowedToProve: [
      "Disruption is justified by its outcomes — the arc is structural, not moral",
      "Any disruption produces generative rupture — S1 can produce T3 instead of S2",
    ],
  },
  "SLA-ARC-008": {
    allowedToProve: [
      "I2 (shadow layer) is structurally present — I1 with content below acknowledged boundary",
      "I4 (resonance bridge) indicates integration underway or complete",
      "The entity's acknowledged identity boundary has expanded",
    ],
    notAllowedToProve: [
      "The integration is complete — I4 is a bridge, not an arrival",
      "The shadow content was pathological — I2 is structural, not diagnostic",
      "This arc applies to anyone with observable suppression patterns",
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// PATCH-4: provisionalPrimitivesPresent / provisionalPrimitives fields
// ─────────────────────────────────────────────────────────────────────────────

// Add these fields to the SLAArcPattern interface:
//
//   readonly provisionalPrimitivesPresent: boolean;
//   readonly provisionalPrimitives: string[];
//
// Set on each arc:
//   ARC-001: false, []
//   ARC-002: false, []
//   ARC-003: true,  ["S4"]
//   ARC-004: false, []
//   ARC-005: true,  ["C4"]
//   ARC-006: true,  ["L3"]
//   ARC-007: true,  ["S4", "C3"]
//   ARC-008: true,  ["I2", "I4"]
//
// When provisionalPrimitivesPresent = true:
//   evaluateArcClaim() must set ceiling to DAVAR regardless of other factors.
//   The evaluator must read this field from the arc object, not from a parameter.

// ─────────────────────────────────────────────────────────────────────────────
// PATCH-5: arcMaturity field — separate structural quality from governance state
// ─────────────────────────────────────────────────────────────────────────────

export type ArcMaturity =
  | "structurally_coherent"
  // Internal logic is sound; all primitives in sequence are valid;
  // arc transitions are coherent.
  // Advancement condition: passes assertArcPatternInvariants()
  | "specimen_supported"
  // At least one corpus specimen can be structurally scanned and arc identified.
  // Advancement condition: one passing arc scan receipt filed.
  | "reviewed"
  // V confirmation or practitioner review completed.
  // Advancement condition: V export confirms arc; OR Gate 2 practitioner review.
  | "sealed";
  // CORDIA/SIGLER co-signature; canonical; immutable.
  // Advancement condition: Gate 3 complete.

// Maturity for current 8 arcs:
// ARC-001: "specimen_supported" — ordeal specimens exist in general corpus
// ARC-002: "specimen_supported" — PTL-001 + AONL-001 sealed specimens
// ARC-003: "structurally_coherent" — no corpus specimens yet
// ARC-004: "structurally_coherent" — no corpus specimens yet
// ARC-005: "structurally_coherent" — no corpus specimens yet
// ARC-006: "structurally_coherent" — no corpus specimens yet
// ARC-007: "structurally_coherent" — no corpus specimens yet
// ARC-008: "specimen_supported" — Jung/psychology corpus is broad but ungoverned

// ─────────────────────────────────────────────────────────────────────────────
// PATCH-6: requiresVConfirmation flag
// ─────────────────────────────────────────────────────────────────────────────

// Add to SLAArcPattern interface:
//   readonly requiresVConfirmation: boolean;
//
// Set to true on arcs where:
//   - status was determined before V reconciliation
//   - primitive sequences include provisional entries not yet confirmed by V
//   - the arc's claim boundary overlaps with V's governance territory
//
// Current settings:
//   ARC-001: true  — Ordeal arc not yet confirmed by V
//   ARC-002: true  — confirmed via Thread B corpus; V must verify AONL-001 status
//   ARC-003: true  — "structural_home" mode not yet V-confirmed
//   ARC-004: true  — all provisional
//   ARC-005: true  — all provisional
//   ARC-006: true  — all provisional (uses L3 which is provisional)
//   ARC-007: true  — all provisional (uses S4, C3)
//   ARC-008: true  — all provisional (uses I2, I4)

// ─────────────────────────────────────────────────────────────────────────────
// PATCH-7: Unused import cleanup (from V's tsc analysis)
// ─────────────────────────────────────────────────────────────────────────────

// In slaArcPatterns.ts, REMOVE these unused imports:
//   SLAPrimitive
//   getPrimitive       (only used inside hasPrimitive which is imported)
//   getTransitionValidity
//
// In receiptAdapter.ts, REMOVE these unused imports:
//   SLAPrimitive
//   FIDELITY_CEILING_RULES
//   SLAArcPattern
//   SLAArcReceiptExtension
//   ChaosRole
//
// NOTE: hasPrimitive() should remain — it IS used in canUsePrimitive()

// ─────────────────────────────────────────────────────────────────────────────
// PATCH-8: New canon lines → SLA_HARD_RULES extension
// ─────────────────────────────────────────────────────────────────────────────

// Add to SLA_HARD_RULES in slaRegistry.ts:
export const SLA_ARC_HARD_RULES = {
  PRIMITIVE_VS_ARC: {
    rule:   "A primitive names a state. An arc names a governed movement.",
    layer:  "grammar",
    effect: "Arc patterns extend but do not modify the primitive registry.",
  },
  SOMATIC_WITNESS_RULE: {
    rule:   "The body may signal an arc. It may not be forced to perform the repair arc.",
    layer:  "somatic",
    effect: "B/P/G/S markers identify arc position; they do not prescribe arc progression.",
    weapNote: "T3 WEAP-001 applies at somatic layer: demanding somatic recovery demonstration from a body in B-arrest = violation.",
  },
  WITNESS_RECORD_RULE: {
    rule:   "A witness record is not memorial fuel.",
    layer:  "LMI",
    effect: "Type 2 Witness Records (T3+P4, no R1) may not be used for synthetic voice, interactive memorial, or resurrection-adjacent features without explicit pre-mortem consent.",
  },
  SELF_CERTIFICATION_CEILING: {
    rule:   "Authority requires external witness. Self-certification is QOL ceiling maximum.",
    layer:  "governance",
    effect: "Any artifact claiming governing authority without external witness cannot exceed QOL.",
    ceiling: "QOL",
    canonLedgerMapping: "quorum_state:local_green = QOL; quorum_state:witnessed_green = DAVAR; quorum_state:quorum_green = EMET",
  },
  ARC_STATUS_DERIVATION: {
    rule:   "Arc status must be receipt-derived, not author-authored.",
    layer:  "arc_governance",
    effect: "Use deriveArcStatus(specimenNominations) — do not hardcode arc status.",
  },
  HARNESS_CONVERGENCE: {
    rule:   "Convergence between architectures is E3 evidence. It is not mutual validation.",
    layer:  "institutional",
    effect: "SLA-CROSS-002 (Harness Bridge) is a cross-domain alignment specimen. It proves independent derivation, not external verification of either system.",
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// ARC-002 WITH ALL PATCHES APPLIED (reference — shows final shape)
// ─────────────────────────────────────────────────────────────────────────────

const ARC_002_PATCHED = {
  arcId:           "SLA-ARC-002",
  name:            "Recognition Collapse",
  sourceFramework: "Tragic Convergence (Sophocles / Oedipus)",
  canonLine:       "Awareness arrives only at the moment it can no longer change the outcome.",
  primitiveSequence: ["L2", "P2", "F4", "T1", "T3"],
  eleosNarrative:  "COMPILE failing → GUIDE absent → REMEMBER reconstructing → single flash → immediate T3 basin; P4 witnesses from outside",
  chaosRole:         "revelatory"          as const,
  truthMechanism:    "forced"              as const,
  resolutionType:    "collapse"            as const,
  t3Mode:            "structural"          as const,  // PATCH-1: was missing from union
  terminalPrimitive: "T3",
  level1Present:     ["L2", "T1", "T3", "P1", "D1"],
  nearestArcConfusion: {
    arcId:  "SLA-ARC-001",
    arcName: "Ordeal Arc",
    test:   "Does avoidance reduce or increase the collapse rate?",
  },
  bestiary:          ["The Sealed Triangle (T3[sealed] → T3[implosion])"],
  specimenNominations: [
    { specimenId: "PTL-001",     scale: "personal" as const, status: "sealed"    as const },
    { specimenId: "AONL-001",    scale: "personal" as const, status: "sealed"    as const },
    { specimenId: "SLA-LIT-001", scale: "literary" as const, status: "candidate" as const },
  ],
  // PATCH-2: status is receipt-derived, not authored
  get status() { return deriveArcStatus(this.specimenNominations); },
  // PATCH-5: arcMaturity
  arcMaturity:       "specimen_supported"  as const,
  // PATCH-6: V confirmation flag
  requiresVConfirmation: true,
  fidelityCeiling:   "DAVAR"              as const,
  multiAgentCapable: false,
  evidenceTier:      "E3"                 as const,
  // PATCH-3: machine-readable claim boundary
  claimBoundary:     ARC_CLAIM_BOUNDARIES["SLA-ARC-002"],
  // PATCH-4: provisional primitives
  provisionalPrimitivesPresent: false,
  provisionalPrimitives:        [] as string[],
  governanceNotes:   "T3 WEAP-001 applies with maximum force. T3 WEAP-001 also applies at somatic layer (do not demand B-deepen demonstration). Type B Closure = T3 + P4 active, R1 structurally unavailable. The ◈ glyph marks this state.",
} as const;

export { ARC_002_PATCHED };
