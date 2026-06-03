/**
 * receiptAdapter.ts
 * Shape Language Alphabet™ — Receipt Serialization & Usability Layer
 *
 * Fixes the transition enum drift between TypeScript (underscore) and
 * scan receipt JSON format (hyphen).
 * Provides lane-aware primitive usability — prevents provisional primitives
 * from leaking into public or high-risk surfaces.
 * Provides arc-level fidelity evaluators.
 */

import {
  TransitionValidity,
  FidelityTier,
  SLAPrimitive,
  getPrimitive,
  hasPrimitive,
  FIDELITY_CEILING_RULES,
} from "./slaRegistry";
import {
  SLAArcPattern,
  getArcPattern,
  SLAArcReceiptExtension,
  ChaosRole,
} from "./slaArcPatterns";

// ─────────────────────────────────────────────────────────────────────────────
// ENUM SERIALIZATION  (resolves Thread B underscore ↔ V hyphen drift)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Converts TypeScript TransitionValidity (underscore) to scan receipt format (hyphen).
 * TypeScript convention uses underscore. SLA scan contracts use hyphen.
 * This adapter is the canonical bridge. Never change the TypeScript enum;
 * always use this function when serializing to JSON or scan receipt output.
 */
export function serializeValidity(v: TransitionValidity): string {
  return v.replace(/_/g, "-");
}

/**
 * Parses a scan receipt validity string (hyphen) back to TypeScript enum.
 * Used when deserializing receipts from external sources (V's scan contract, JSX).
 */
export function deserializeValidity(s: string): TransitionValidity {
  return s.replace(/-/g, "_") as TransitionValidity;
}

/** Roundtrip test — must pass in CI */
export function assertSerializationRoundtrip(v: TransitionValidity): void {
  const serialized   = serializeValidity(v);
  const deserialized = deserializeValidity(serialized);
  if (deserialized !== v)
    throw new Error(`Serialization roundtrip failed for: ${v}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// LANE-AWARE USABILITY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The register/surface tier a primitive is being used in.
 * Prevents provisional primitives from appearing on high-risk or public surfaces.
 */
export type PrimitiveUseLane =
  | "internal"      // Thread B / Thread A governance work — all non-parked primitives usable
  | "practitioner"  // Certified practitioner contexts — canonical + grounded
  | "institutional" // Institutional partners / academic — canonical + grounded
  | "public"        // Consumer-facing products (MindMirror™, R-MAP, public SLA) — canonical only
  | "high_risk";    // Clinical, legal, or high-stakes contexts — canonical only

/**
 * Returns true if this primitive can be used in the given lane.
 * This is the governance control that prevents provisional primitives
 * from leaking into public or high-risk surfaces.
 *
 * Usage pattern:
 *   if (!canUsePrimitive("M3", "public")) {
 *     throw new Error("M3 is provisional — cannot appear on public surface");
 *   }
 */
export function canUsePrimitive(
  id:   string,
  lane: PrimitiveUseLane = "internal"
): boolean {
  const p = getPrimitive(id);
  if (!p) return false;
  if (p.status === "parked" || p.status === "deprecated") return false;

  switch (lane) {
    case "public":
    case "high_risk":
      return p.status === "canonical";

    case "institutional":
    case "practitioner":
      return p.status === "canonical" || p.status === "grounded";

    case "internal":
    default:
      return true; // all non-parked, non-deprecated primitives
  }
}

/**
 * Returns which primitives from a list are blocked at a given lane.
 * Use at scan contract validation time.
 */
export function getBlockedPrimitives(
  ids:  string[],
  lane: PrimitiveUseLane
): string[] {
  return ids.filter(id => !canUsePrimitive(id, lane));
}

/**
 * Returns the maximum lane at which a primitive can be used.
 * Canonical → public; grounded → practitioner; provisional → internal only.
 */
export function maxLane(id: string): PrimitiveUseLane | "parked" {
  const p = getPrimitive(id);
  if (!p || p.status === "parked" || p.status === "deprecated") return "parked";
  if (p.status === "canonical")    return "public";
  if (p.status === "grounded")     return "institutional";
  return "internal"; // provisional, reference
}

// ─────────────────────────────────────────────────────────────────────────────
// FIDELITY EVALUATION
// ─────────────────────────────────────────────────────────────────────────────

export type FidelityEvalResult = {
  ceiling:    FidelityTier | "BLOCKED";
  blockers:   string[];   // floor rule codes that apply
  warnings:   string[];   // governance flags that apply
};

/**
 * Evaluates the fidelity ceiling achievable for a given primitive
 * in a given context. Returns the most restrictive ceiling and all
 * applicable floor rules and governance flags.
 */
export function evaluatePrimitiveUse(
  id:      string,
  context: {
    d1Present?:              boolean;
    t3Present?:              boolean;
    t3ModeDeclaration?:      string;
    l2ModeDeclaration?:      string;
    confusionCheckPresent?:  boolean;
    transitionDeclared?:     boolean;
    nodeTypeDeclared?:       boolean;
    observedCueDeclared?:    boolean;
  }
): FidelityEvalResult {
  const blockers: string[] = [];
  const warnings: string[] = [];
  let ceiling: FidelityTier | "BLOCKED" = "EMET";

  const p = getPrimitive(id);
  if (!p) {
    return { ceiling: "BLOCKED", blockers: ["FLOOR-003"], warnings: [] };
  }
  if (p.status === "parked") {
    return { ceiling: "BLOCKED", blockers: ["FLOOR-003", "C2Gate"], warnings: [] };
  }

  // Node type check
  if (!context.nodeTypeDeclared) {
    blockers.push("FLOOR-002");
    ceiling = "BLOCKED";
  }

  // Observed cue check
  if (!context.observedCueDeclared) {
    blockers.push("FLOOR-001");
    if (ceiling !== "BLOCKED") ceiling = "QOL";
  }

  // Confusion check
  if (!context.confusionCheckPresent) {
    blockers.push("FLOOR-004");
    if (ceiling !== "BLOCKED" && ceiling !== "QOL") ceiling = "DAVAR";
  }

  // Transition declared
  if (!context.transitionDeclared) {
    blockers.push("FLOOR-005");
    if (ceiling !== "BLOCKED" && ceiling !== "QOL") ceiling = "DAVAR";
  }

  // D1 bifurcation gate
  if (context.d1Present && p.governanceFlags?.requiresBifurcationGate) {
    warnings.push("FLOOR-006");
    if (ceiling !== "BLOCKED" && ceiling !== "QOL") ceiling = "DAVAR";
  }

  // T3 mode declaration
  if (context.t3Present) {
    if (!context.t3ModeDeclaration) {
      blockers.push("SLA-MODE-001");
      if (ceiling !== "BLOCKED" && ceiling !== "QOL") ceiling = "DAVAR";
    }
  }

  // L2 mode declaration
  if (id === "L2" && p.governanceFlags?.modeDeclarationRequired) {
    if (!context.l2ModeDeclaration) {
      blockers.push("SLA-MODE-001");
      if (ceiling !== "BLOCKED" && ceiling !== "QOL") ceiling = "DAVAR";
    }
  }

  // P4 unresolved
  if (p.governanceFlags?.p4StatusUnresolved) {
    warnings.push("P4-UNRESOLVED");
    if (ceiling === "EMET") ceiling = "DAVAR";
  }

  // Provisional primitive → DAVAR max regardless
  if (p.status === "provisional" && ceiling === "EMET") {
    ceiling = "DAVAR";
    warnings.push("SLA-PROV-002");
  }

  return { ceiling, blockers, warnings };
}

// ─────────────────────────────────────────────────────────────────────────────
// ARC-LEVEL FIDELITY EVALUATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns the fidelity ceiling achievable for an arc-level claim.
 * Arc ceiling is the most restrictive of all primitive ceilings in the arc sequence.
 * Arc claims require a valid primitive-level base receipt — this enforces that.
 */
export function evaluateArcClaim(
  arcId:              string,
  baseScanReceiptId:  string | null | undefined,
  options: {
    chaosRoleDeclared?:  boolean;
    t3ModeDeclared?:     boolean;
    provisionalPresent?: boolean;
  } = {}
): FidelityEvalResult {
  const blockers: string[] = [];
  const warnings: string[] = [];
  let ceiling: FidelityTier | "BLOCKED" = "DAVAR";

  const arc = getArcPattern(arcId);
  if (!arc) {
    return { ceiling: "BLOCKED", blockers: ["ARC-UNKNOWN"], warnings: [] };
  }

  // Base primitive receipt is required
  if (!baseScanReceiptId) {
    blockers.push("ARC-BASE-RECEIPT-REQUIRED");
    return { ceiling: "BLOCKED", blockers, warnings };
  }

  // Grammar layer arcs are DAVAR ceiling by default
  // They cannot exceed their most constraining primitive's ceiling
  if (arc.fidelityCeiling === "QOL") ceiling = "QOL";

  // T3 present without mode declaration
  if (arc.primitiveSequence.includes("T3") && !options.t3ModeDeclared) {
    blockers.push("SLA-MODE-001");
    ceiling = "DAVAR";
  }

  // D1 present without chaos role declaration
  if (arc.primitiveSequence.includes("D1") && !options.chaosRoleDeclared) {
    blockers.push("ARC-D1-MODE-001");
    ceiling = "DAVAR";
  }

  // Provisional primitives in arc sequence
  if (options.provisionalPresent) {
    warnings.push("SLA-PROV-002");
    // ceiling stays DAVAR — provisional primitives cannot reach EMET
  }

  return { ceiling, blockers, warnings };
}

/**
 * Returns the more constraining fidelity ceiling between two arcs.
 * Used to calculate the ceiling for a multi-arc scan.
 */
export function getMultiArcCeiling(
  arcId1: string,
  arcId2: string
): FidelityTier | "BLOCKED" {
  const tiers: Array<FidelityTier | "BLOCKED"> = ["BLOCKED", "QOL", "DAVAR", "EMET"];
  const arc1 = getArcPattern(arcId1);
  const arc2 = getArcPattern(arcId2);
  if (!arc1 || !arc2) return "BLOCKED";

  const idx1 = tiers.indexOf(arc1.fidelityCeiling);
  const idx2 = tiers.indexOf(arc2.fidelityCeiling);
  return tiers[Math.min(idx1, idx2)] ?? "BLOCKED";
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC SURFACE FIREWALL  (enforces D3 / Register Chimera at runtime)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * D3 (Frame Bleed) is the SLA primitive for Register Chimera.
 * Register Chimera = D3 (Frame Bleed primitive) + lane-boundary violation (macro).
 * This firewall is the runtime enforcement of that macro.
 */
const RESTRICTED_TERMS: Array<{ term: string; severity: "blocker" | "warning"; lane: PrimitiveUseLane }> = [
  // Restricted at all public surfaces
  { term: "MASSA",          severity: "blocker",  lane: "public" },
  { term: "Black Label",    severity: "blocker",  lane: "public" },
  { term: "VAESHA",         severity: "blocker",  lane: "public" },
  { term: "VANTA",          severity: "blocker",  lane: "public" },
  { term: "ORAYA",          severity: "blocker",  lane: "public" },
  { term: "CORDIA",         severity: "blocker",  lane: "public" },
  { term: "SIGLER",         severity: "blocker",  lane: "public" },
  { term: "ELLARI entity",  severity: "blocker",  lane: "public" },
  // Restricted at practitioner and above
  { term: "clinical protocol",  severity: "blocker",  lane: "practitioner" },
  { term: "clinically proven",  severity: "blocker",  lane: "practitioner" },
  { term: "scientifically proven", severity: "blocker", lane: "practitioner" },
  { term: "therapy protocol",   severity: "blocker",  lane: "practitioner" },
  // Warnings at all lanes
  { term: "proof",          severity: "warning",  lane: "internal" },
  { term: "confirmed",      severity: "warning",  lane: "internal" },
  { term: "validated",      severity: "warning",  lane: "internal" },
];

export type FirewallResult = {
  term:     string;
  severity: "blocker" | "warning";
  rule:     string;
  repair:   string;
};

/**
 * Checks text for Register Chimera violations (D3 firing).
 * Returns an array of violations; empty array = clean.
 */
export function publicSurfaceFirewall(
  text:    string,
  lane:    PrimitiveUseLane = "public"
): FirewallResult[] {
  const violations: FirewallResult[] = [];
  const laneRank: Record<PrimitiveUseLane, number> = {
    "internal": 0, "practitioner": 1, "institutional": 2, "public": 3, "high_risk": 4,
  };

  for (const rule of RESTRICTED_TERMS) {
    if (laneRank[lane] >= laneRank[rule.lane]) {
      if (text.toLowerCase().includes(rule.term.toLowerCase())) {
        violations.push({
          term:     rule.term,
          severity: rule.severity,
          rule:     "D3-Register-Chimera",
          repair:   `Remove or replace '${rule.term}' before publishing to ${lane} lane. This is a D3 (Frame Bleed) violation — higher-register vocabulary in lower-register output.`,
        });
      }
    }
  }
  return violations;
}

// ─────────────────────────────────────────────────────────────────────────────
// SCAN RECEIPT SERIALIZER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Serializes a scan receipt for output to JSON.
 * Normalizes enum values to hyphenated form for compatibility
 * with V's scan contract and the JSX receipt component.
 */
export function serializeScanReceipt(receipt: Record<string, unknown>): string {
  const normalized = JSON.parse(JSON.stringify(receipt, (_key, value) => {
    // Normalize transition validity strings
    if (
      typeof value === "string" &&
      ["valid", "invalid", "context_required", "repair_required",
       "unmapped", "terminal"].includes(value)
    ) {
      return serializeValidity(value as TransitionValidity);
    }
    return value;
  }));
  return JSON.stringify(normalized, null, 2);
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export default {
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
};
