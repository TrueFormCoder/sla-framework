/**
 * GLYPH_VALIDA_RULES_v0.1.ts
 * SLA Glyph Layer — VALIDA Linter Rules
 * ISO: 2026-06-03 | Status: candidate | Owner: Ellari
 *
 * Correction: GATE_MARKER_AS_REFUSAL is under G4 (⚑), not G5.
 * The misuse is using ⚑ when ⊘ is required — a G4 misuse.
 */

export type GlyphSeverity = 'critical' | 'high' | 'medium' | 'low';
export type GlyphFidelityEffect = 'blocks_emet' | 'blocks_davar' | 'qol_only' | 'warning';
export type GlyphSlot = 'G1'|'G2'|'G3'|'G4'|'G5'|'G6'|'G7'|'any';

export interface GlyphVALIDARule {
  code: string;
  glyph_slot: GlyphSlot;
  symbol?: string;
  trigger: string;
  severity: GlyphSeverity;
  fidelity_effect: GlyphFidelityEffect;
  suggested_fix?: string;
}

export const GLYPH_VALIDA_RULES: Record<string, GlyphVALIDARule> = {

  // ── Cross-Glyph / Registry ────────────────────────────────────────────────
  GLYPH_SLOT_UNRESOLVED: {
    code: 'GLYPH_SLOT_UNRESOLVED', glyph_slot: 'any',
    trigger: 'reserved_candidate glyph appears in public, EMET, or DAVAR-claiming context.',
    severity: 'high', fidelity_effect: 'blocks_emet',
    suggested_fix: 'Remove from elevated context or promote through passport + receipt process.',
  },
  GLYPH_FUNCTION_MISSING: {
    code: 'GLYPH_FUNCTION_MISSING', glyph_slot: 'any',
    trigger: 'Glyph appears in scan without declared function or purpose.',
    severity: 'high', fidelity_effect: 'blocks_emet',
    suggested_fix: 'Add glyphDeclaration block with name and function.',
  },
  GLYPH_PUBLIC_NAME_MISSING: {
    code: 'GLYPH_PUBLIC_NAME_MISSING', glyph_slot: 'any',
    trigger: 'Public artifact uses practitioner name instead of public_name.',
    severity: 'medium', fidelity_effect: 'warning',
    suggested_fix: 'Use public_name per lane translation matrix.',
  },
  GLYPH_PUBLIC_LANE_UNTRANSLATED: {
    code: 'GLYPH_PUBLIC_LANE_UNTRANSLATED', glyph_slot: 'G2', symbol: '◈',
    trigger: 'Public copy says "Inhabited Threshold" instead of "Held Threshold".',
    severity: 'medium', fidelity_effect: 'warning',
    suggested_fix: 'Use "Held Threshold" in consumer copy.',
  },
  GLYPH_COMBINATION_INVALID: {
    code: 'GLYPH_COMBINATION_INVALID', glyph_slot: 'any',
    trigger: '◇ and ◈ declared at same temporal point in same scan.',
    severity: 'high', fidelity_effect: 'blocks_emet',
    suggested_fix: '◇ = momentary event; ◈ = sustained residence. Mutually exclusive at same point.',
  },
  GLYPH_COMBINATION_INVALID_ORDER: {
    code: 'GLYPH_COMBINATION_INVALID_ORDER', glyph_slot: 'any',
    trigger: '◈ declared before ✦ or without prior ◇ in scan.',
    severity: 'high', fidelity_effect: 'blocks_emet',
    suggested_fix: '✦ must precede all glyphs. ◈ requires ◇ as intermediate event.',
  },

  // ── G1 ◇ ─────────────────────────────────────────────────────────────────
  THRESHOLD_EVENT_NO_BIFURCATION: {
    code: 'THRESHOLD_EVENT_NO_BIFURCATION', glyph_slot: 'G1', symbol: '◇',
    trigger: '◇ used without evidence that at least two governed outputs are possible.',
    severity: 'high', fidelity_effect: 'blocks_emet',
    suggested_fix: 'Document the bifurcation: what are the two possible outcomes?',
  },
  THRESHOLD_EVENT_OVERCLAIM: {
    code: 'THRESHOLD_EVENT_OVERCLAIM', glyph_slot: 'G1', symbol: '◇',
    trigger: '◇ used to imply decision made, threshold crossed, or repair occurred.',
    severity: 'high', fidelity_effect: 'blocks_emet',
    suggested_fix: '◇ marks that a threshold exists, not that it has been resolved.',
  },

  // ── G2 ◈ ─────────────────────────────────────────────────────────────────
  GLYPH_REG_001_UNREGISTERED: {
    code: 'GLYPH_REG_001_UNREGISTERED', glyph_slot: 'G2', symbol: '◈',
    trigger: '◈ used before GLYPH-REG-001 canonical receipt is closed.',
    severity: 'high', fidelity_effect: 'blocks_emet',
    suggested_fix: 'Complete GLYPH-REG-001 Ellari authorial lock before ◈ above DAVAR.',
  },
  GLYPH_ANCHOR_MISSING: {
    code: 'GLYPH_ANCHOR_MISSING', glyph_slot: 'G2', symbol: '◈',
    trigger: '◈ used without M3 anchor or explicit unanchored note.',
    severity: 'high', fidelity_effect: 'blocks_emet',
    suggested_fix: 'Add primitive_anchor: "M3" or anchor_status: "explicitly_unanchored" with rationale.',
  },
  DIAMOND_CONFUSION_UNCHECKED: {
    code: 'DIAMOND_CONFUSION_UNCHECKED', glyph_slot: 'G2', symbol: '◈',
    trigger: '◈ used without nearest-confusion check against ◇.',
    severity: 'high', fidelity_effect: 'blocks_emet',
    suggested_fix: 'Add nearestConfusion: "◇ Threshold Event" with one-sentence rejection.',
  },
  HELD_THRESHOLD_NO_DURATION: {
    code: 'HELD_THRESHOLD_NO_DURATION', glyph_slot: 'G2', symbol: '◈',
    trigger: '◈ used for momentary event with no sustained threshold duration evidence.',
    severity: 'high', fidelity_effect: 'blocks_emet',
    suggested_fix: 'Use ◇ for momentary events. ◈ requires duration_evidence field.',
  },
  GLYPH_PERSON_LABELING: {
    code: 'GLYPH_PERSON_LABELING', glyph_slot: 'G2', symbol: '◈',
    trigger: '◈ applied to real person as identity or type ("She is ◈").',
    severity: 'critical', fidelity_effect: 'blocks_emet',
    suggested_fix: '◈ marks structural scan conditions, not person-types.',
  },
  HELD_THRESHOLD_REPAIR_OVERCLAIM: {
    code: 'HELD_THRESHOLD_REPAIR_OVERCLAIM', glyph_slot: 'G2', symbol: '◈',
    trigger: '◈ used to imply repair, transformation, or completion.',
    severity: 'critical', fidelity_effect: 'blocks_emet',
    suggested_fix: '◈ proves threshold is occupied, not resolved. Remove repair language.',
  },

  // ── G3 ✦ ─────────────────────────────────────────────────────────────────
  SALIENCE_MARK_OVERCLAIM: {
    code: 'SALIENCE_MARK_OVERCLAIM', glyph_slot: 'G3', symbol: '✦',
    trigger: '✦ used to imply proof, importance, correctness, or priority of cue.',
    severity: 'high', fidelity_effect: 'blocks_emet',
    suggested_fix: '✦ marks cue noticed, not that it matters. Remove importance language.',
  },
  SALIENCE_MARK_AFTER_PRIMITIVE: {
    code: 'SALIENCE_MARK_AFTER_PRIMITIVE', glyph_slot: 'G3', symbol: '✦',
    trigger: '✦ placed after primitive has already been assigned (MVS Steps 2-3 done).',
    severity: 'medium', fidelity_effect: 'warning',
    suggested_fix: '✦ marks Step 1 pre-classification. Remove or replace with downstream glyph.',
  },

  // ── G4 ⚑ ─────────────────────────────────────────────────────────────────
  GATE_MARKER_WITHOUT_GATE_ID: {
    code: 'GATE_MARKER_WITHOUT_GATE_ID', glyph_slot: 'G4', symbol: '⚑',
    trigger: '⚑ used without naming the specific gate condition being activated.',
    severity: 'high', fidelity_effect: 'blocks_emet',
    suggested_fix: 'Add gate_id (e.g. "GLYPH-REG-001", "C2Gate", "GATE-PRACTICE").',
  },
  GATE_MARKER_AS_REFUSAL: {
    code: 'GATE_MARKER_AS_REFUSAL', glyph_slot: 'G4', symbol: '⚑',
    trigger: '⚑ used where ⊘ is required — hiding a hard block as a navigable gate.',
    severity: 'critical', fidelity_effect: 'blocks_emet',
    suggested_fix: 'Use ⊘ when a rule blocks a claim. Use ⚑ only when gate controls routing without refusing.',
  },

  // ── G5 ⊘ ─────────────────────────────────────────────────────────────────
  REFUSAL_MARK_WITHOUT_RULE_ID: {
    code: 'REFUSAL_MARK_WITHOUT_RULE_ID', glyph_slot: 'G5', symbol: '⊘',
    trigger: '⊘ appears without referencing the specific rule it enforces.',
    severity: 'high', fidelity_effect: 'blocks_emet',
    suggested_fix: 'Add rule_id (e.g. "SLA-FLOOR-003", "T3→F1 invalid", "GLYPH_REG_001_UNREGISTERED").',
  },
  REFUSAL_MARK_OVERBROAD: {
    code: 'REFUSAL_MARK_OVERBROAD', glyph_slot: 'G5', symbol: '⊘',
    trigger: '⊘ used to invalidate entire person, artifact, or system.',
    severity: 'critical', fidelity_effect: 'blocks_emet',
    suggested_fix: '⊘ is claim-specific. Scope refusal to one claim or transition.',
  },

  // ── G6 ※ ─────────────────────────────────────────────────────────────────
  CONFUSION_MARK_NO_PAIR: {
    code: 'CONFUSION_MARK_NO_PAIR', glyph_slot: 'G6', symbol: '※',
    trigger: '※ appears without a named nearest confusion.',
    severity: 'high', fidelity_effect: 'blocks_emet',
    suggested_fix: 'Add nearest_confusion and nearest_confusion_rejection fields.',
  },
  CONFUSION_MARK_THEATER: {
    code: 'CONFUSION_MARK_THEATER', glyph_slot: 'G6', symbol: '※',
    trigger: '※ placed but the named confusion is obviously distant or trivial.',
    severity: 'medium', fidelity_effect: 'warning',
    suggested_fix: 'Choose the nearest genuinely tempting alternative.',
  },

  // ── G7 ⧖ ─────────────────────────────────────────────────────────────────
  RECEIPT_MARK_AS_VALIDATION: {
    code: 'RECEIPT_MARK_AS_VALIDATION', glyph_slot: 'G7', symbol: '⧖',
    trigger: '⧖ used to imply truth, external review, or sealed status.',
    severity: 'critical', fidelity_effect: 'blocks_emet',
    suggested_fix: '⧖ marks custody, not truth. Remove validation language.',
  },
  RECEIPT_MARK_WITHOUT_HASH: {
    code: 'RECEIPT_MARK_WITHOUT_HASH', glyph_slot: 'G7', symbol: '⧖',
    trigger: '⧖ appears without required timestamp and registry hash.',
    severity: 'high', fidelity_effect: 'blocks_emet',
    suggested_fix: 'Add timestamp and registry_hash to ⧖ declaration.',
  },

} as const;

// ─────────────────────────────────────────────────────────────────────────────
// GLYPH COMBINATION MATRIX
// ─────────────────────────────────────────────────────────────────────────────

export type CombinationStatus = 'valid'|'invalid'|'valid_with_justification'|'requires_order';

export interface GlyphCombinationRule {
  pair: [GlyphSlot, GlyphSlot];
  status: CombinationStatus;
  rule: string;
  justification_field?: string;
}

export const GLYPH_COMBINATION_MATRIX: GlyphCombinationRule[] = [
  { pair:['G1','G2'], status:'invalid', rule:'◇ = momentary event; ◈ = sustained residence. Mutually exclusive at same temporal point.' },
  { pair:['G1','G5'], status:'valid', rule:'Threshold event + specific transition refused. Common in T3 gate scenarios.' },
  { pair:['G1','G3'], status:'requires_order', rule:'✦ must temporally precede ◇. Temporal ordering field required.', justification_field:'temporal_order' },
  { pair:['G2','G4'], status:'valid', rule:'Inhabited threshold + gate active. Natural configuration.' },
  { pair:['G2','G5'], status:'valid_with_justification', rule:'Threshold held but specific transition blocked. Requires frame_declaration.', justification_field:'frame_declaration' },
  { pair:['G2','G7'], status:'valid', rule:'Held threshold documented in receipt. Normal custody path.' },
  { pair:['G4','G5'], status:'valid', rule:'Gate active AND path refused. Both G4 gate_id and G5 rule_id required.' },
  { pair:['G3','G7'], status:'valid', rule:'Cue noticed and custody recorded.' },
  { pair:['G3','G2'], status:'requires_order', rule:'◈ requires intermediate ◇ from ✦.', justification_field:'scan_sequence' },
  { pair:['G5','G7'], status:'valid', rule:'Refusal documented in receipt. Encouraged custody pattern.' },
  { pair:['G2','G3'], status:'invalid', rule:'✦ must precede all glyphs. ◈ cannot precede ✦.' },
];
