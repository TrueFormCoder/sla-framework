/**
 * slaScanContract.ts
 * SLA Scan Receipt — data contract, validation, glyph layer
 *
 * ISO:    2026-06-03
 * Status: candidate
 * Registry: SLA v2.2 | sha256:1f0bde0fd79daf50
 *
 * Includes GlyphDeclarationBlock (v1.6 glyph patch).
 * If V's canonical implementation exists, reconcile against it.
 */

// ─────────────────────────────────────────────────────────────────────────────
// ENUMS + CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

export type FidelityTier = 'QOL' | 'DAVAR' | 'EMET';
export type NodeType = 'circle' | 'hexagon' | 'triangle' | 'square' | 'diamond';
export type TransitionValidity = 'valid' | 'invalid' | 'unstable' | 'repair-required' | 'unmapped' | 'terminal';
export type EvidenceTier = 'E1' | 'E2' | 'E3' | 'E4' | 'E5';
export type SourceType = 'text' | 'image' | 'conversation' | 'institutional' | 'relational' | 'artifact' | 'render';
export type GlyphSlot = 'G1' | 'G2' | 'G3' | 'G4' | 'G5' | 'G6' | 'G7';

export const REGISTRY_HASH = 'sha256:1f0bde0fd79daf50';
export const REGISTRY_VERSION = 'SLA v2.2';

export const FLOOR_RULES = {
  FLOOR_001: 'observedCue required — missing = QOL ceiling',
  FLOOR_002: 'nodeType required — missing = blocked',
  FLOOR_003: 'primitive must be in registry — not in registry = rejected',
  FLOOR_004: 'nearestConfusion required — missing = DAVAR ceiling',
  FLOOR_005: 'T3 gate: verify R1/P4 — T3 unresolved = DAVAR ceiling',
  FLOOR_006: 'fidelityTier required — D1 present without check = DAVAR ceiling',
} as const;

export const T3_VALID_EXITS = ['R1', 'P4', 'T3'] as const;
export const T3_INVALID_EXITS = ['I1', 'F1', 'S3'] as const;

// ─────────────────────────────────────────────────────────────────────────────
// GLYPH DECLARATION BLOCK (v1.6 glyph patch)
// ─────────────────────────────────────────────────────────────────────────────

export interface GlyphDeclarationBlock {
  slot: GlyphSlot;
  symbol: '◇' | '◈' | '✦' | '⚑' | '⊘' | '※' | '⧖';
  name: string;
  registry_status: 'canonical' | 'candidate_authorial_lock_pending' | 'reserved_candidate';
  primitive_anchor?: string;
  frame_declaration?: string;     // required for ◈
  duration_evidence?: string;     // required for ◈
  gate_id?: string;               // required for ⚑
  rule_id?: string;               // required for ⊘
  nearest_confusion?: string;     // required for ◈ and ※
  nearest_confusion_rejection?: string;
  timestamp?: string;             // required for ⧖
  registry_hash?: string;         // required for ⧖
  real_person_mapping: false;     // must always be false
  note?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// SCAN RECEIPT INTERFACE
// ─────────────────────────────────────────────────────────────────────────────

export interface SLAScanReceipt {
  // ── Identity ──────────────────────────────────────────────────────────────
  scanId: string;
  iso: string;
  analyst: string;
  registryVersion: string;
  registryHash: string;

  // ── Observation (FLOOR-001) ───────────────────────────────────────────────
  observedCue: string;
  sourceType: SourceType;

  // ── Node (FLOOR-002) ──────────────────────────────────────────────────────
  nodeType: NodeType;

  // ── Primitive (FLOOR-003) ─────────────────────────────────────────────────
  primitive: string;
  evidenceTier: EvidenceTier;
  confidence: number; // 0–1

  // ── Confusion (FLOOR-004) ─────────────────────────────────────────────────
  nearestConfusion: string;
  nearestConfusionRejection: string;

  // ── Transition (FLOOR-005) ────────────────────────────────────────────────
  transitionTo?: string;
  transitionValidity: TransitionValidity;
  t3Present: boolean;
  t3ExitRoute?: typeof T3_VALID_EXITS[number] | null;

  // ── P4 Frame Declaration ──────────────────────────────────────────────────
  p4ActiveFrame?: 'mechanism' | 'witness' | 'repair' | 'threshold';

  // ── Fidelity (FLOOR-006) ──────────────────────────────────────────────────
  fidelityTier: FidelityTier;
  d1Present: boolean;
  allowedToProve: string[];
  notAllowedToProve: string[];

  // ── Glyph Layer (v1.6) ────────────────────────────────────────────────────
  glyphDeclarations?: GlyphDeclarationBlock[];

  // ── Output ────────────────────────────────────────────────────────────────
  notes?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

export interface ValidationResult {
  passed: boolean;
  issues: string[];
  recommendedFidelity: FidelityTier;
  validationStatus: 'clean' | 'floor-violation' | 'blocked';
}

const PRIMITIVE_REGISTRY = new Set([
  'F1','F2','F3','F4','F5',
  'L1','L2','L3','L4',
  'P1','P2','P3','P4',
  'I1','I2','I3','I4',
  'T1','T2','T3','T4','T5',
  'S1','S2','S3','S4','S5',
  'C1','C2','C3','C4',
  'R1','R2','R3','R4',
  'D1','D2','D3','D4',
  'M1','M2','M3',
]);

const PARKED_PRIMITIVES = new Set(['C2']);

export function hasPrimitive(id: string): boolean {
  return PRIMITIVE_REGISTRY.has(id) && !PARKED_PRIMITIVES.has(id);
}

export function validateScanReceipt(receipt: Partial<SLAScanReceipt>): ValidationResult {
  const issues: string[] = [];
  let fidelityCapDavar = false;
  let fidelityCapBlocked = false;

  // FLOOR-001
  if (!receipt.observedCue) issues.push('FLOOR-001: observedCue missing');

  // FLOOR-002
  if (!receipt.nodeType) { issues.push('FLOOR-002: nodeType missing'); fidelityCapBlocked = true; }

  // FLOOR-003
  if (!receipt.primitive) {
    issues.push('FLOOR-003: primitive missing');
  } else if (!hasPrimitive(receipt.primitive)) {
    issues.push(`FLOOR-003: primitive '${receipt.primitive}' not in registry`);
    fidelityCapBlocked = true;
  }

  // FLOOR-004
  if (!receipt.nearestConfusion) { issues.push('FLOOR-004: nearestConfusion missing'); fidelityCapDavar = true; }

  // FLOOR-005 — T3 gate
  if (receipt.t3Present) {
    if (!receipt.t3ExitRoute) {
      issues.push('FLOOR-005: T3 present but no exit route declared');
      fidelityCapDavar = true;
    } else if (!(T3_VALID_EXITS as readonly string[]).includes(receipt.t3ExitRoute)) {
      issues.push(`FLOOR-005: T3 exit route '${receipt.t3ExitRoute}' is invalid`);
      fidelityCapBlocked = true;
    }
  }

  // FLOOR-006
  if (!receipt.fidelityTier) issues.push('FLOOR-006: fidelityTier missing');
  if (receipt.d1Present && !receipt.fidelityTier) {
    issues.push('FLOOR-006: D1 present without fidelity check');
    fidelityCapDavar = true;
  }

  // P4 frame declaration
  if (receipt.primitive === 'P4' && !receipt.p4ActiveFrame) {
    issues.push('P4-FRAME: P4 used without frame declaration (mechanism|witness|repair|threshold)');
    fidelityCapDavar = true;
  }

  // notAllowedToProve
  if (!receipt.notAllowedToProve || receipt.notAllowedToProve.length === 0) {
    issues.push('EMET-GATE: notAllowedToProve required for EMET');
    fidelityCapDavar = true;
  }

  // ── GLYPH FLOOR — v1.6 ──────────────────────────────────────────────────
  if (receipt.glyphDeclarations) {
    for (const decl of receipt.glyphDeclarations) {
      if (decl.real_person_mapping !== false) {
        issues.push('GLYPH_PERSON_LABELING: real_person_mapping must be false');
        fidelityCapBlocked = true;
      }
      if (decl.registry_status === 'reserved_candidate') {
        issues.push(`GLYPH_SLOT_UNRESOLVED: ${decl.slot} is reserved_candidate`);
        fidelityCapDavar = true;
      }
      if (decl.slot === 'G2') {
        if (decl.registry_status !== 'canonical') {
          issues.push('GLYPH_REG_001_UNREGISTERED: ◈ not yet canonical');
          fidelityCapDavar = true;
        }
        if (!decl.duration_evidence) issues.push('HELD_THRESHOLD_NO_DURATION');
        if (!decl.nearest_confusion) issues.push('DIAMOND_CONFUSION_UNCHECKED');
        if (!decl.frame_declaration) issues.push('GLYPH_ANCHOR_MISSING: frameDeclaration required for ◈');
      }
      if (decl.slot === 'G4' && !decl.gate_id) issues.push('GATE_MARKER_WITHOUT_GATE_ID');
      if (decl.slot === 'G5' && !decl.rule_id) issues.push('REFUSAL_MARK_WITHOUT_RULE_ID');
      if (decl.slot === 'G6' && !decl.nearest_confusion) issues.push('CONFUSION_MARK_NO_PAIR');
      if (decl.slot === 'G7' && (!decl.timestamp || !decl.registry_hash)) {
        issues.push('RECEIPT_MARK_WITHOUT_HASH');
      }
    }
  }

  const recommendedFidelity: FidelityTier = fidelityCapBlocked ? 'QOL'
    : fidelityCapDavar ? 'DAVAR'
    : issues.length === 0 ? 'EMET'
    : 'DAVAR';

  const validationStatus = fidelityCapBlocked ? 'blocked'
    : issues.length > 0 ? 'floor-violation'
    : 'clean';

  return { passed: issues.length === 0, issues, recommendedFidelity, validationStatus };
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

export function generateScanId(primitive: string, analyst: string): string {
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  return `SCAN-${primitive}-${analyst.toUpperCase().replace(/\s/g,'-')}-${ts}`;
}

export function exportScanReceiptJSON(receipt: SLAScanReceipt): string {
  return JSON.stringify({ ...receipt, registryHash: REGISTRY_HASH }, null, 2);
}

// ─────────────────────────────────────────────────────────────────────────────
// D1 SQL SCHEMA
// ─────────────────────────────────────────────────────────────────────────────

export const SLA_SCAN_RECEIPTS_SQL = `
CREATE TABLE IF NOT EXISTS sla_scan_receipts (
  scan_id          TEXT PRIMARY KEY,
  iso              TEXT NOT NULL,
  analyst          TEXT NOT NULL,
  registry_version TEXT NOT NULL DEFAULT 'SLA v2.2',
  registry_hash    TEXT NOT NULL DEFAULT 'sha256:1f0bde0fd79daf50',
  observed_cue     TEXT NOT NULL,
  source_type      TEXT NOT NULL,
  node_type        TEXT NOT NULL,
  primitive        TEXT NOT NULL,
  evidence_tier    TEXT NOT NULL,
  confidence       REAL NOT NULL,
  nearest_confusion      TEXT,
  transition_to          TEXT,
  transition_validity    TEXT NOT NULL DEFAULT 'unmapped',
  t3_present             INTEGER NOT NULL DEFAULT 0,
  t3_exit_route          TEXT,
  p4_active_frame        TEXT,
  fidelity_tier          TEXT NOT NULL DEFAULT 'QOL',
  d1_present             INTEGER NOT NULL DEFAULT 0,
  allowed_to_prove       TEXT,
  not_allowed_to_prove   TEXT,
  glyph_declarations     TEXT,
  notes                  TEXT,
  created_at             TEXT NOT NULL DEFAULT (datetime('now')),
  INDEX idx_primitive    (primitive),
  INDEX idx_fidelity     (fidelity_tier),
  INDEX idx_analyst      (analyst)
);
`;
