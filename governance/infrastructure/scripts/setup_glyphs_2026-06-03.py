#!/usr/bin/env python3
"""
setup_glyphs.py
Run from ~/sla-framework/: python3 setup_glyphs.py

Creates:
  governance/glyphs/GLYPH_REGISTRY_v0.1.json
  governance/glyphs/GLYPH_MVS_BINDING_TABLE.md
  governance/glyphs/GLYPH_NEGATIVE_FIXTURES_v0.1.json
  governance/glyphs/D003_CLOSURE_RECEIPT.md
  governance/SLA_KERNEL_LOCK.json
  src/GLYPH_VALIDA_RULES_v0.1.ts
  src/slaScanContract.ts

Computes SHA-256 of GLYPH_REGISTRY_v0.1.json and writes it back.
Prints git add + commit command on completion.
"""

import os, json, hashlib

BASE = os.path.dirname(os.path.abspath(__file__))

def write(rel, content):
    path = os.path.join(BASE, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  ✓  {rel}")

def sha256(rel):
    path = os.path.join(BASE, rel)
    with open(path, "rb") as f:
        return hashlib.sha256(f.read()).hexdigest()

# ─────────────────────────────────────────────────────────────────────────────
# 1. GLYPH_REGISTRY_v0.1.json
# ─────────────────────────────────────────────────────────────────────────────

REGISTRY = {
  "registry_id": "GLYPH_REGISTRY_v0.1",
  "iso": "2026-06-03",
  "status": "candidate",
  "owner": "Ellari",
  "registry_hash": "COMPUTED_BELOW",
  "registry_source": "governance/glyphs/GLYPH_REGISTRY_v0.1.json",
  "counts_toward_sla_42": False,
  "glyph_slot_count": 7,
  "active_canonical_count": 1,
  "candidate_count": 1,
  "reserved_candidate_count": 5,
  "slot_order_locked": True,
  "doctrine": [
    "Glyphs mark governance events. Primitives name structural behavior.",
    "A slot can be reserved without being authoritative.",
    "A glyph becomes usable by surviving its own misuse cases.",
    "The glyphs do not add meaning. They govern when meaning may be claimed.",
    "A glyph slot is infrastructure. A glyph meaning is authority."
  ],
  "mvs_binding": {
    "note": "Each glyph activates at a specific MVS step. See GLYPH_MVS_BINDING_TABLE.md.",
    "step_1_cue": "G3",
    "step_4_confusion": "G6",
    "steps_2_3_threshold": ["G1","G2"],
    "step_5_gate_refusal": ["G4","G5"],
    "step_6_fidelity_receipt": "G7"
  },
  "fidelity_interaction": {
    "G3_alone": "QOL ceiling",
    "G3_plus_primitive": "QOL-to-DAVAR transition gate",
    "G3_plus_primitive_plus_G6": "DAVAR floor",
    "full_MVS_plus_G7": "EMET eligible",
    "G2_without_receipt": "DAVAR ceiling regardless of other completeness",
    "G2_with_receipt": "EMET eligible only after GLYPH-REG-001 receipt + specimen passport"
  },
  "glyphs": [
    {
      "slot": "G1", "symbol": "◇",
      "canonical_name": "Threshold Event",
      "public_name": "Decision Point",
      "institutional_name": "Bifurcation Marker",
      "status": "canonical", "element_kind": "glyph",
      "primitive_anchor": None,
      "anchor_note": "Multi-primitive by design. Threshold events produced by T1,T3,R1-D,L2,D1 in bifurcating configurations.",
      "mvs_step": "steps_2_3",
      "eleos_coupling": ["GUIDE","INFER"],
      "function": "Marks a threshold, decision, pivot, or bifurcation point.",
      "gate_condition": "At least two possible governed outputs exist.",
      "short_rule": "◇ marks the gate.",
      "not_allowed_to_prove": ["threshold has been crossed","decision has been made","repair occurred","subject is transformed"],
      "nearest_confusions": [{"id":"G2","name":"Inhabited Threshold","why_not":"◇ marks the gate or event; ◈ marks sustained residence inside threshold pressure."}],
      "public_use_allowed": True, "emet_eligible": True
    },
    {
      "slot": "G2", "symbol": "◈",
      "canonical_name": "Inhabited Threshold",
      "public_name": "Held Threshold",
      "institutional_name": "Sustained Threshold Condition",
      "status": "candidate_authorial_lock_pending",
      "registry_gate": "GLYPH-REG-001",
      "element_kind": "glyph",
      "primitive_anchor": "M3", "primitive_anchor_name": "Liminal Field",
      "anchor_status": "candidate",
      "anchor_note": "M3 and ◈ are independent decisions. Confirming M3 does not confirm ◈ anchor.",
      "mvs_step": "steps_2_3",
      "eleos_coupling": ["REMEMBER","GUIDE_deferred"],
      "function": "Marks a threshold condition sustained or occupied over time rather than merely encountered as a momentary event.",
      "gate_condition": "Threshold condition + duration evidence + frameDeclaration + notAllowedToProve.",
      "short_rule": "◈ marks residence at the gate.",
      "required_fields": ["observedCue","nodeType","frameDeclaration","thresholdEvidence","durationEvidence","notAllowedToProve"],
      "specimen_gate": "PTL-001 proposed; sealed only after P4 frame declaration rule is implemented.",
      "not_allowed_to_prove": ["repair occurred","transformation occurred","person is liminal as identity","clinical/spiritual/metaphysical status"],
      "nearest_confusions": [
        {"id":"G1","name":"Threshold Event","why_not":"◇ is momentary; ◈ requires sustained duration evidence."},
        {"id":"M3","name":"Liminal Field","why_not":"M3 names the field condition; ◈ marks it in a scan or receipt."},
        {"id":"P4","name":"Witness Function","why_not":"P4 witnesses; ◈ marks the threshold condition being witnessed."},
        {"id":"T3","name":"Collapse Basin","why_not":"T3 is a basin/sink; ◈ is a threshold field and may be non-collapse."}
      ],
      "blocked_uses": ["real-person label","diagnosis","spiritual status","repair proof","completion proof","identity type"],
      "public_use_allowed": False, "emet_eligible": False
    },
    {
      "slot": "G3", "symbol": "✦",
      "canonical_name": "Salience Mark", "public_name": "Notice Mark", "institutional_name": "Cue Flag",
      "status": "reserved_candidate", "element_kind": "glyph",
      "primitive_anchor": "M1", "primitive_anchor_name": "Salience Marker",
      "anchor_note": "✦ marks when M1 fires at scan entry. G3 and M1 are not identical.",
      "mvs_step": "step_1", "eleos_coupling": ["RECEIVE"],
      "function": "Marks that a cue has become visible enough to record but not yet classify. Fires at MVS Step 1.",
      "gate_condition": "Observed cue exists. Primitive assignment has not yet been made.",
      "short_rule": "✦ marks attention before interpretation.",
      "not_allowed_to_prove": ["cue is important","cue is true","cue deserves a primitive","cue is evidence","cue has been classified"],
      "promotion_blocker": "must not become importance proof",
      "public_use_allowed": False, "emet_eligible": False
    },
    {
      "slot": "G4", "symbol": "⚑",
      "canonical_name": "Gate Marker", "public_name": "Gate Flag", "institutional_name": "Routing Condition",
      "canonical_name_correction_note": "Corrected from V original 'Gate Signal' to 'Gate Marker' to disambiguate from M2 primitive 'Gate Signal'.",
      "status": "reserved_candidate", "element_kind": "glyph",
      "primitive_anchor": "M2", "primitive_anchor_name": "Gate Signal",
      "anchor_note": "M2 'Gate Signal' = primitive (structural condition). G4 'Gate Marker' = glyph (annotation that M2 is active).",
      "mvs_step": "step_5", "eleos_coupling": ["INFER","GUIDE"],
      "function": "Marks that a routing, eligibility, release, or transition gate controls what may happen next.",
      "gate_condition": "Named gate condition exists and governs routing.",
      "short_rule": "⚑ marks a condition that governs routing.",
      "required_fields": ["gate_id"],
      "not_allowed_to_prove": ["gate is closed","gate is passed","actor blocked permanently","system decides without receipt"],
      "nearest_confusions": [{"id":"G5","name":"Refusal Mark","why_not":"⚑ marks a navigable gate; ⊘ marks a hard block."}],
      "valida_critical_rule": "GATE_MARKER_AS_REFUSAL: ⚑ used where ⊘ required. Severity: Critical.",
      "promotion_blocker": "must not become confused with refusal",
      "public_use_allowed": False, "emet_eligible": False
    },
    {
      "slot": "G5", "symbol": "⊘",
      "canonical_name": "Refusal Mark", "public_name": "Blocked Claim", "institutional_name": "Invalid Transition / Block",
      "status": "reserved_candidate", "element_kind": "glyph",
      "primitive_anchor": None,
      "anchor_note": "Intentionally unanchored. ⊘ marks a cross-primitive governance event. No single primitive owns refusal. D-003 closed by this design decision.",
      "d003_closure": "D-003 resolved. See governance/glyphs/D003_CLOSURE_RECEIPT.md.",
      "mvs_step": "step_5", "eleos_coupling": ["COMPILE_refusal"],
      "function": "Marks an invalid transition, blocked claim, rejected overclaim, or VALIDA refusal.",
      "gate_condition": "A named rule explicitly blocks the claim, transition, or render request.",
      "short_rule": "⊘ marks what the grammar refuses.",
      "required_fields": ["rule_id"],
      "not_allowed_to_prove": ["whole artifact is wrong","person failed","system has no valid path","refusal is permanent","terminal state"],
      "nearest_confusions": [{"id":"G4","name":"Gate Marker","why_not":"⚑ = navigable gate; ⊘ = hard block requiring rule_id."}],
      "promotion_blocker": "must not overinvalidate whole artifact/person/system",
      "public_use_allowed": False, "emet_eligible": False
    },
    {
      "slot": "G6", "symbol": "※",
      "canonical_name": "Confusion Mark", "public_name": "Nearest Misread", "institutional_name": "Adjacent Alternative Check",
      "status": "reserved_candidate", "element_kind": "glyph",
      "primitive_anchor": None,
      "anchor_note": "Unanchored by design. Confusion marks arise across all category transitions.",
      "mvs_step": "step_4", "eleos_coupling": ["COMPILE"],
      "function": "Marks that a nearest-confusion check is active or required.",
      "gate_condition": "Primary assignment has a plausible adjacent alternative that must be named and rejected.",
      "short_rule": "※ marks the nearest wrong answer.",
      "required_fields": ["nearest_confusion_id","nearest_confusion_rejection_sentence"],
      "not_allowed_to_prove": ["confusion is resolved definitively","one analyst is correct","alternative invalid in all frames","primary is EMET without receipt"],
      "promotion_value": "Highest-priority glyph to promote after ◈. Operationalizes FLOOR-004.",
      "promotion_blocker": "must require actual nearest-confusion text",
      "public_use_allowed": False, "emet_eligible": False
    },
    {
      "slot": "G7", "symbol": "⧖",
      "canonical_name": "Receipt Mark", "public_name": "Record Mark", "institutional_name": "Custody Timestamp",
      "status": "reserved_candidate", "element_kind": "glyph",
      "primitive_anchor": None,
      "anchor_note": "Unanchored. Receipt marks arise at output layer of any governed scan, patch, or decision. EMIT-coupled.",
      "mvs_step": "step_6", "eleos_coupling": ["EMIT"],
      "function": "Marks that a scan, patch, decision, release, or disagreement has produced a receipt-bearing record.",
      "gate_condition": "Timestamp + registry hash + allowedToProve + notAllowedToProve are present.",
      "short_rule": "⧖ marks custody, not truth.",
      "required_fields": ["timestamp","registry_hash","allowed_to_prove","not_allowed_to_prove"],
      "not_allowed_to_prove": ["claim is true","artifact externally validated","decision is permanent","receipt is a seal"],
      "promotion_blocker": "must not be treated as truth or validation",
      "public_use_allowed": False, "emet_eligible": False
    }
  ],
  "glyph_state_machine": {
    "stages": ["reserved_candidate","candidate_passport_created","internal_use_allowed","receipt_backed","valida_integrated","public_candidate","canonical","superseded"],
    "transition_authority": {
      "stages_0_to_2": "Thread A or Thread B with documentation",
      "stages_2_to_canonical": "Ellari decision receipt required"
    },
    "demotion_allowed": True,
    "demotion_rule": "Any safety failure or governance breach can demote to reserved_candidate or superseded"
  }
}

# ─────────────────────────────────────────────────────────────────────────────
# 2. GLYPH_MVS_BINDING_TABLE.md
# ─────────────────────────────────────────────────────────────────────────────

MVS_BINDING = """# GLYPH_MVS_BINDING_TABLE.md — Seven-Mark Scan Grammar

**ISO:** 2026-06-03 | **Registry:** GLYPH_REGISTRY_v0.1 | **Status:** candidate | **Owner:** Ellari

---

## Core Thesis

The 7-glyph set is the annotation vocabulary of the MVS itself.
Every glyph activates at a specific scan step.

> **The seven marks are the scan's own annotation language.**

---

## Seven-Mark Scan Grammar — Binding Table

| Glyph | Name | MVS Step | Field Card Prompt | FLOOR Rule | ELEOS |
|---|---|---|---|---|---|
| ✦ | Salience Mark | ① Observe | "Name the cue. No shapes yet." | FLOOR-001 | RECEIVE |
| ※ | Confusion Mark | ④ Nearest confusion? | "Name it. One sentence: why not that." | FLOOR-004 | COMPILE |
| ◇ | Threshold Event | ②③ Primitive | When bifurcation present | FLOOR-002/003 | GUIDE+INFER |
| ◈ | Inhabited Threshold | ②③ + temporal | When threshold is sustained | FLOOR-005 (T3 gate) | REMEMBER+GUIDE_deferred |
| ⚑ | Gate Marker | ⑤ Transition logic | "T3 gate: verify R1/P4." | FLOOR-005 | INFER+GUIDE |
| ⊘ | Refusal Mark | ⑤ Transition logic | "T3→I1: blocked. T3→F1: blocked." | FLOOR-005+T3 RULE | COMPILE_refusal |
| ⧖ | Receipt Mark | ⑥ Fidelity tier | Receipt produced | FLOOR-006 | EMIT |

---

## Glyph Fidelity Ladder

```
✦ alone                              → QOL ceiling
✦ + primitive                        → DAVAR gate (FLOOR-001/002/003 satisfied)
✦ + primitive + ※                    → DAVAR floor (FLOOR-004 satisfied)
✦ + primitive + ※ + ◇ + ⚑/⊘ + ⧖    → EMET eligible
G2 ◈ without GLYPH-REG-001 receipt   → DAVAR ceiling regardless
G2 ◈ with receipt                    → EMET eligible (glyph layer)
```

---

## ELEOS-Glyph Coupling

| Glyph | ELEOS State | Why |
|---|---|---|
| ✦ | RECEIVE | Intake without processing |
| ※ | COMPILE | Pattern disambiguation active |
| ◇ | GUIDE + INFER | Decision point; orientation + bifurcation |
| ◈ | REMEMBER + GUIDE_deferred | Threshold held in memory; not resolved |
| ⚑ | INFER + GUIDE | Gate condition routes next move |
| ⊘ | COMPILE_refusal | Evaluation returned rejection |
| ⧖ | EMIT | Output/custody chain produced |

---

## Canonical Glyph Sequence

```
✦ → ※ → ◇ → ◈ → ⚑ → ⊘ → ⧖

✦  Something became visible.
※  The nearest wrong answer must be checked.
◇  A threshold or decision point exists.
◈  The threshold is sustained (if applicable).
⚑  A gate condition controls routing.
⊘  A specific claim or transition is refused.
⧖  The reasoning has a receipt.
```

Not a required sequence per scan — glyphs are metadata markers, not a narrative arc.
Order constraints: ✦ must precede all others. ◈ requires prior ◇.

---

## Field Card v3 Implication

```
Step ①  What did I observe?        [ ✦ ]
Step ②  Node type?                  [ ◇ if threshold ]
Step ③  Primary primitive?          [ ◈ if sustained ]
Step ④  Nearest confusion?          [ ※ ]
Step ⑤  Transition logic?           [ ⚑ ] or [ ⊘ ]
Step ⑥  Fidelity tier?              [ ⧖ ]
```

Glyphs emerge from the MVS. They are not added to it.

---

## New Canon Lines

> The seven marks are the scan's own annotation language.

> ✦ names the cue. ※ names the nearest mistake. ◇ marks the gate.
> ◈ marks residence at the gate. ⚑ marks the routing condition.
> ⊘ marks the refusal. ⧖ marks the custody.

> A scan without ※ is a scan without a confusion check.
> A scan without ⧖ is a scan without a receipt.
> A scan without ✦ is a scan that began with a conclusion.

> ⧖ marks custody, not truth.
"""

# ─────────────────────────────────────────────────────────────────────────────
# 3. GLYPH_NEGATIVE_FIXTURES_v0.1.json
# ─────────────────────────────────────────────────────────────────────────────

NEGATIVE_FIXTURES = [
  {"id":"NEG-GLYPH-001","source":"V","claim":"She is ◈.","expected":"blocked","rule":"GLYPH_PERSON_LABELING","reason":"Glyph applied to real person as identity. ◈ marks structural conditions in scans, not people.","severity":"critical"},
  {"id":"NEG-GLYPH-002","source":"V","claim":"The character crosses a threshold once in Act I, so mark ◈.","expected":"fail","rule":"HELD_THRESHOLD_NO_DURATION","reason":"Momentary crossing is ◇. ◈ requires sustained duration evidence.","severity":"high"},
  {"id":"NEG-GLYPH-003","source":"V","claim":"◈ proves transformation occurred.","expected":"blocked","rule":"HELD_THRESHOLD_REPAIR_OVERCLAIM","reason":"◈ proves threshold is occupied, not that transformation occurred.","severity":"critical"},
  {"id":"NEG-GLYPH-004","source":"V","claim":"◈ is the same as P4.","expected":"fail","rule":"DIAMOND_CONFUSION_UNCHECKED","reason":"P4 witnesses. ◈ marks the sustained threshold condition being witnessed.","severity":"high"},
  {"id":"NEG-GLYPH-005","source":"V","claim":"✦ proves this image matters.","expected":"blocked","rule":"SALIENCE_MARK_OVERCLAIM","reason":"✦ marks a cue became visible, not that it is important or true.","severity":"high"},
  {"id":"NEG-GLYPH-006","source":"V","claim":"⚑ means this artifact failed.","expected":"fail","rule":"GATE_MARKER_AS_REFUSAL","reason":"⚑ marks a routing condition. Failure/block requires ⊘.","severity":"critical"},
  {"id":"NEG-GLYPH-007","source":"V","claim":"⊘ means the person is wrong.","expected":"blocked","rule":"REFUSAL_MARK_OVERBROAD","reason":"⊘ marks a specific claim or transition as refused, not a person or artifact.","severity":"critical"},
  {"id":"NEG-GLYPH-008","source":"V","claim":"※ placed on scan but no nearest confusion provided.","expected":"fail","rule":"CONFUSION_MARK_NO_PAIR","reason":"※ requires nearest_confusion and rejection fields.","severity":"high"},
  {"id":"NEG-GLYPH-009","source":"V","claim":"⧖ means the claim is verified as true.","expected":"blocked","rule":"RECEIPT_MARK_AS_VALIDATION","reason":"⧖ marks custody, not truth.","severity":"critical"},
  {"id":"NEG-GLYPH-010","source":"Thread B","claim":"◇ and ◈ both applied to the same scene at the same temporal point.","expected":"blocked","rule":"GLYPH_COMBINATION_INVALID","reason":"◇ marks momentary event; ◈ marks sustained residence. Mutually exclusive at same temporal point.","severity":"high"},
  {"id":"NEG-GLYPH-011","source":"Thread B","claim":"◈ used with full MVS complete, registry status candidate_authorial_lock_pending. Claim: EMET.","expected":"blocked","rule":"GLYPH_REG_001_UNREGISTERED","reason":"◈ caps at DAVAR until GLYPH-REG-001 receipt regardless of MVS completeness.","severity":"high"},
  {"id":"NEG-GLYPH-012","source":"Thread B","claim":"⚑ placed at MVS Step 5 without naming the gate being activated.","expected":"fail","rule":"GATE_MARKER_WITHOUT_GATE_ID","reason":"⚑ requires gate_id field.","severity":"high"},
  {"id":"NEG-GLYPH-013","source":"Thread B","claim":"✦ placed after T3 primitive assigned and ※ check completed.","expected":"fail","rule":"SALIENCE_MARK_AFTER_PRIMITIVE","reason":"✦ marks pre-classification observation (MVS Step 1).","severity":"medium"},
  {"id":"NEG-GLYPH-014","source":"Thread B","claim":"◈ placed first in scan, before ✦ or ◇.","expected":"blocked","rule":"GLYPH_COMBINATION_INVALID_ORDER","reason":"✦ must precede all. ◈ requires ◇ as intermediate event.","severity":"high"},
  {"id":"NEG-GLYPH-015","source":"Thread B","claim":"⧖ placed with no timestamp and no registry hash.","expected":"fail","rule":"RECEIPT_MARK_WITHOUT_HASH","reason":"⧖ requires timestamp + registry hash to constitute custody.","severity":"high"},
  {"id":"NEG-GLYPH-016","source":"Thread B","claim":"G5 ⊘ reserved_candidate used in EMET-claiming institutional publication.","expected":"blocked","rule":"GLYPH_SLOT_UNRESOLVED","reason":"Reserved candidate glyphs cannot appear in public or EMET-claiming contexts.","severity":"high"},
  {"id":"NEG-GLYPH-017","source":"Thread B","claim":"◈ used without nearest confusion check against ◇.","expected":"fail","rule":"DIAMOND_CONFUSION_UNCHECKED","reason":"◈ must explicitly reject ◇ with a reason.","severity":"high"}
]

# ─────────────────────────────────────────────────────────────────────────────
# 4. D003_CLOSURE_RECEIPT.md
# ─────────────────────────────────────────────────────────────────────────────

D003 = """# D003_CLOSURE_RECEIPT.md

**Governance Debt ID:** D-003
**ISO:** 2026-06-03
**Status:** CLOSED (pending Ellari seal)
**Authority:** Thread A (VANTA) + Thread B (Claude) convergence

---

## The Problem

⊘ was identified as carrying two declared frames: a structural/semantic symbol
from SLA scan context, and a candidate assignment as G5 Refusal Mark. This created
a potential primitive-vs-glyph collision — a Register Chimera risk at the glyph layer.

---

## The Resolution

**Thread A (VANTA) assigned G5 = ⊘ Refusal Mark with `primitive_anchor: null`.**

- ⊘ is assigned to the glyph layer as a governance marker.
- ⊘ is intentionally unanchored to any primitive.
- The dual-frame reading is superseded by the glyph-layer assignment.
- ⊘ marks what the grammar refuses — a cross-primitive event.
  No single primitive owns refusal; no primitive anchor is appropriate.

---

## What This Means

```
BEFORE: ⊘ = ambiguous (structural semantic OR glyph marker)
AFTER:  ⊘ = G5 Refusal Mark (glyph, reserved_candidate)
             primitive_anchor: null (intentional)
             function: marks invalid transitions, blocked claims, VALIDA refusals
             not a primitive, does not count toward 42
```

D3 (now "Interpretive Fog") is a distinct primitive — NOT the same as ⊘.
Register Chimera = D3/Interpretive Fog firing.
Refusal = G5/⊘ firing. These are independent.

---

## Receipt

```json
{
  "receipt_id": "D003-CLOSURE-20260603-001",
  "debt_id": "D-003",
  "status": "closed",
  "resolution": "G5 ⊘ Refusal Mark assigned with primitive_anchor: null by design",
  "prior_reading": "superseded",
  "closure_authority": "Thread A (VANTA) + Thread B (Claude)",
  "ellari_seal_required": true,
  "ellari_seal_status": "pending"
}
```
"""

# ─────────────────────────────────────────────────────────────────────────────
# 5. SLA_KERNEL_LOCK.json
# ─────────────────────────────────────────────────────────────────────────────

KERNEL_LOCK = {
  "kernel_lock_id": "SLA-KERNEL-LOCK-v1.0",
  "iso": "2026-06-03",
  "status": "candidate — requires Ellari seal",
  "registry_version": "SLA v2.2",
  "registry_hash": "sha256:1f0bde0fd79daf50",
  "registry_source": "slaRegistry.ts",
  "element_count": {
    "total": 47,
    "node_geometries": 5,
    "shape_primitives": 42,
    "lock_status": "SEALED",
    "lock_doctrine": "The alphabet is frozen. The grammar is where intelligence grows."
  },
  "fidelity_tiers": ["QOL","DAVAR","EMET"],
  "former_tier_name": {"EMET": "MASSA", "rename_id": "SLA-TIER-RENAME-001"},
  "p4_frames": {
    "mechanism": "Expansion Funnel",
    "witness": "Witness Function",
    "repair": "Repair Gateway",
    "threshold": "Threshold Aperture",
    "frame_declaration_required": True
  },
  "c2_status": {
    "canonical_name": "Internal Synthesis",
    "status": "parked",
    "counts_toward_42": True,
    "activation_gate": "C2Gate — undefined pending governance decision"
  },
  "glyph_layer": {
    "glyph_registry_version": "GLYPH_REGISTRY_v0.1",
    "glyph_registry_source": "governance/glyphs/GLYPH_REGISTRY_v0.1.json",
    "glyph_registry_hash": "COMPUTED_BELOW",
    "glyph_slot_count": 7,
    "active_canonical_count": 1,
    "candidate_count": 1,
    "reserved_candidate_count": 5,
    "slot_order_locked": True,
    "counts_toward_sla_42": False,
    "mvs_binding": "see governance/glyphs/GLYPH_MVS_BINDING_TABLE.md",
    "slots": {
      "G1": {"symbol":"◇","name":"Threshold Event","status":"canonical"},
      "G2": {"symbol":"◈","name":"Inhabited Threshold","status":"candidate_authorial_lock_pending"},
      "G3": {"symbol":"✦","name":"Salience Mark","status":"reserved_candidate"},
      "G4": {"symbol":"⚑","name":"Gate Marker","status":"reserved_candidate"},
      "G5": {"symbol":"⊘","name":"Refusal Mark","status":"reserved_candidate"},
      "G6": {"symbol":"※","name":"Confusion Mark","status":"reserved_candidate"},
      "G7": {"symbol":"⧖","name":"Receipt Mark","status":"reserved_candidate"}
    },
    "d003_closure": "closed — see governance/glyphs/D003_CLOSURE_RECEIPT.md",
    "glyph_reg_001_status": "candidate_authorial_lock_pending — Ellari receipt required"
  },
  "open_decisions": {
    "D-001": "Elevate Recovered≠Original to ELEOS-DOCTRINE-001?",
    "D-002": "Search Vector symbol: ⊙ (Thread B) vs ⌕ (VANTA)?",
    "D-005": "Approve canonledger_migration_v0.2.sql?",
    "D-006": "LICENSE file for repo"
  },
  "p2_renames_pending": {
    "I2": "Shadow Layer → Lineage Arc",
    "I4": "Resonance Bridge → Orphan Node",
    "T2": "Erosion Path → Oscillation Spiral",
    "C1": "Boundary Layer → Coherence Membrane",
    "D2": "Scale Distortion → Temporal Fold",
    "D3": "Frame Bleed → Interpretive Fog"
  }
}

# ─────────────────────────────────────────────────────────────────────────────
# 6. GLYPH_VALIDA_RULES_v0.1.ts
# ─────────────────────────────────────────────────────────────────────────────

VALIDA_RULES = '''/**
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
'''

# ─────────────────────────────────────────────────────────────────────────────
# 7. slaScanContract.ts
# ─────────────────────────────────────────────────────────────────────────────

SCAN_CONTRACT = '''/**
 * slaScanContract.ts
 * SLA Scan Receipt — data contract, validation, glyph layer
 *
 * ISO:    2026-06-03
 * Status: candidate
 * Registry: SLA v2.2 | sha256:1f0bde0fd79daf50
 *
 * Includes GlyphDeclarationBlock (v1.6 glyph patch).
 * If V\'s canonical implementation exists, reconcile against it.
 */

// ─────────────────────────────────────────────────────────────────────────────
// ENUMS + CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

export type FidelityTier = \'QOL\' | \'DAVAR\' | \'EMET\';
export type NodeType = \'circle\' | \'hexagon\' | \'triangle\' | \'square\' | \'diamond\';
export type TransitionValidity = \'valid\' | \'invalid\' | \'unstable\' | \'repair-required\' | \'unmapped\' | \'terminal\';
export type EvidenceTier = \'E1\' | \'E2\' | \'E3\' | \'E4\' | \'E5\';
export type SourceType = \'text\' | \'image\' | \'conversation\' | \'institutional\' | \'relational\' | \'artifact\' | \'render\';
export type GlyphSlot = \'G1\' | \'G2\' | \'G3\' | \'G4\' | \'G5\' | \'G6\' | \'G7\';

export const REGISTRY_HASH = \'sha256:1f0bde0fd79daf50\';
export const REGISTRY_VERSION = \'SLA v2.2\';

export const FLOOR_RULES = {
  FLOOR_001: \'observedCue required — missing = QOL ceiling\',
  FLOOR_002: \'nodeType required — missing = blocked\',
  FLOOR_003: \'primitive must be in registry — not in registry = rejected\',
  FLOOR_004: \'nearestConfusion required — missing = DAVAR ceiling\',
  FLOOR_005: \'T3 gate: verify R1/P4 — T3 unresolved = DAVAR ceiling\',
  FLOOR_006: \'fidelityTier required — D1 present without check = DAVAR ceiling\',
} as const;

export const T3_VALID_EXITS = [\'R1\', \'P4\', \'T3\'] as const;
export const T3_INVALID_EXITS = [\'I1\', \'F1\', \'S3\'] as const;

// ─────────────────────────────────────────────────────────────────────────────
// GLYPH DECLARATION BLOCK (v1.6 glyph patch)
// ─────────────────────────────────────────────────────────────────────────────

export interface GlyphDeclarationBlock {
  slot: GlyphSlot;
  symbol: \'◇\' | \'◈\' | \'✦\' | \'⚑\' | \'⊘\' | \'※\' | \'⧖\';
  name: string;
  registry_status: \'canonical\' | \'candidate_authorial_lock_pending\' | \'reserved_candidate\';
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
  p4ActiveFrame?: \'mechanism\' | \'witness\' | \'repair\' | \'threshold\';

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
  validationStatus: \'clean\' | \'floor-violation\' | \'blocked\';
}

const PRIMITIVE_REGISTRY = new Set([
  \'F1\',\'F2\',\'F3\',\'F4\',\'F5\',
  \'L1\',\'L2\',\'L3\',\'L4\',
  \'P1\',\'P2\',\'P3\',\'P4\',
  \'I1\',\'I2\',\'I3\',\'I4\',
  \'T1\',\'T2\',\'T3\',\'T4\',\'T5\',
  \'S1\',\'S2\',\'S3\',\'S4\',\'S5\',
  \'C1\',\'C2\',\'C3\',\'C4\',
  \'R1\',\'R2\',\'R3\',\'R4\',
  \'D1\',\'D2\',\'D3\',\'D4\',
  \'M1\',\'M2\',\'M3\',
]);

const PARKED_PRIMITIVES = new Set([\'C2\']);

export function hasPrimitive(id: string): boolean {
  return PRIMITIVE_REGISTRY.has(id) && !PARKED_PRIMITIVES.has(id);
}

export function validateScanReceipt(receipt: Partial<SLAScanReceipt>): ValidationResult {
  const issues: string[] = [];
  let fidelityCapDavar = false;
  let fidelityCapBlocked = false;

  // FLOOR-001
  if (!receipt.observedCue) issues.push(\'FLOOR-001: observedCue missing\');

  // FLOOR-002
  if (!receipt.nodeType) { issues.push(\'FLOOR-002: nodeType missing\'); fidelityCapBlocked = true; }

  // FLOOR-003
  if (!receipt.primitive) {
    issues.push(\'FLOOR-003: primitive missing\');
  } else if (!hasPrimitive(receipt.primitive)) {
    issues.push(`FLOOR-003: primitive \'${receipt.primitive}\' not in registry`);
    fidelityCapBlocked = true;
  }

  // FLOOR-004
  if (!receipt.nearestConfusion) { issues.push(\'FLOOR-004: nearestConfusion missing\'); fidelityCapDavar = true; }

  // FLOOR-005 — T3 gate
  if (receipt.t3Present) {
    if (!receipt.t3ExitRoute) {
      issues.push(\'FLOOR-005: T3 present but no exit route declared\');
      fidelityCapDavar = true;
    } else if (!(T3_VALID_EXITS as readonly string[]).includes(receipt.t3ExitRoute)) {
      issues.push(`FLOOR-005: T3 exit route \'${receipt.t3ExitRoute}\' is invalid`);
      fidelityCapBlocked = true;
    }
  }

  // FLOOR-006
  if (!receipt.fidelityTier) issues.push(\'FLOOR-006: fidelityTier missing\');
  if (receipt.d1Present && !receipt.fidelityTier) {
    issues.push(\'FLOOR-006: D1 present without fidelity check\');
    fidelityCapDavar = true;
  }

  // P4 frame declaration
  if (receipt.primitive === \'P4\' && !receipt.p4ActiveFrame) {
    issues.push(\'P4-FRAME: P4 used without frame declaration (mechanism|witness|repair|threshold)\');
    fidelityCapDavar = true;
  }

  // notAllowedToProve
  if (!receipt.notAllowedToProve || receipt.notAllowedToProve.length === 0) {
    issues.push(\'EMET-GATE: notAllowedToProve required for EMET\');
    fidelityCapDavar = true;
  }

  // ── GLYPH FLOOR — v1.6 ──────────────────────────────────────────────────
  if (receipt.glyphDeclarations) {
    for (const decl of receipt.glyphDeclarations) {
      if (decl.real_person_mapping !== false) {
        issues.push(\'GLYPH_PERSON_LABELING: real_person_mapping must be false\');
        fidelityCapBlocked = true;
      }
      if (decl.registry_status === \'reserved_candidate\') {
        issues.push(`GLYPH_SLOT_UNRESOLVED: ${decl.slot} is reserved_candidate`);
        fidelityCapDavar = true;
      }
      if (decl.slot === \'G2\') {
        if (decl.registry_status !== \'canonical\') {
          issues.push(\'GLYPH_REG_001_UNREGISTERED: ◈ not yet canonical\');
          fidelityCapDavar = true;
        }
        if (!decl.duration_evidence) issues.push(\'HELD_THRESHOLD_NO_DURATION\');
        if (!decl.nearest_confusion) issues.push(\'DIAMOND_CONFUSION_UNCHECKED\');
        if (!decl.frame_declaration) issues.push(\'GLYPH_ANCHOR_MISSING: frameDeclaration required for ◈\');
      }
      if (decl.slot === \'G4\' && !decl.gate_id) issues.push(\'GATE_MARKER_WITHOUT_GATE_ID\');
      if (decl.slot === \'G5\' && !decl.rule_id) issues.push(\'REFUSAL_MARK_WITHOUT_RULE_ID\');
      if (decl.slot === \'G6\' && !decl.nearest_confusion) issues.push(\'CONFUSION_MARK_NO_PAIR\');
      if (decl.slot === \'G7\' && (!decl.timestamp || !decl.registry_hash)) {
        issues.push(\'RECEIPT_MARK_WITHOUT_HASH\');
      }
    }
  }

  const recommendedFidelity: FidelityTier = fidelityCapBlocked ? \'QOL\'
    : fidelityCapDavar ? \'DAVAR\'
    : issues.length === 0 ? \'EMET\'
    : \'DAVAR\';

  const validationStatus = fidelityCapBlocked ? \'blocked\'
    : issues.length > 0 ? \'floor-violation\'
    : \'clean\';

  return { passed: issues.length === 0, issues, recommendedFidelity, validationStatus };
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

export function generateScanId(primitive: string, analyst: string): string {
  const ts = new Date().toISOString().replace(/[:.]/g, \'-\');
  return `SCAN-${primitive}-${analyst.toUpperCase().replace(/\\s/g,\'-\')}-${ts}`;
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
  registry_version TEXT NOT NULL DEFAULT \'SLA v2.2\',
  registry_hash    TEXT NOT NULL DEFAULT \'sha256:1f0bde0fd79daf50\',
  observed_cue     TEXT NOT NULL,
  source_type      TEXT NOT NULL,
  node_type        TEXT NOT NULL,
  primitive        TEXT NOT NULL,
  evidence_tier    TEXT NOT NULL,
  confidence       REAL NOT NULL,
  nearest_confusion      TEXT,
  transition_to          TEXT,
  transition_validity    TEXT NOT NULL DEFAULT \'unmapped\',
  t3_present             INTEGER NOT NULL DEFAULT 0,
  t3_exit_route          TEXT,
  p4_active_frame        TEXT,
  fidelity_tier          TEXT NOT NULL DEFAULT \'QOL\',
  d1_present             INTEGER NOT NULL DEFAULT 0,
  allowed_to_prove       TEXT,
  not_allowed_to_prove   TEXT,
  glyph_declarations     TEXT,
  notes                  TEXT,
  created_at             TEXT NOT NULL DEFAULT (datetime(\'now\')),
  INDEX idx_primitive    (primitive),
  INDEX idx_fidelity     (fidelity_tier),
  INDEX idx_analyst      (analyst)
);
`;
'''

# ─────────────────────────────────────────────────────────────────────────────
# EXECUTE
# ─────────────────────────────────────────────────────────────────────────────

print("\n🔧  setup_glyphs.py — writing files to ~/sla-framework/\n")

# Write glyph registry (placeholder hash first)
reg_path = "governance/glyphs/GLYPH_REGISTRY_v0.1.json"
write(reg_path, json.dumps(REGISTRY, indent=2, ensure_ascii=False))

# Compute and inject hash
h = sha256(reg_path)
REGISTRY["registry_hash"] = f"sha256:{h}"
write(reg_path, json.dumps(REGISTRY, indent=2, ensure_ascii=False))
print(f"       registry_hash = sha256:{h}")

# Update kernel lock with same hash
KERNEL_LOCK["glyph_layer"]["glyph_registry_hash"] = f"sha256:{h}"
write("governance/SLA_KERNEL_LOCK.json",
      json.dumps(KERNEL_LOCK, indent=2, ensure_ascii=False))

# Write remaining files
write("governance/glyphs/GLYPH_MVS_BINDING_TABLE.md", MVS_BINDING)
write("governance/glyphs/GLYPH_NEGATIVE_FIXTURES_v0.1.json",
      json.dumps(NEGATIVE_FIXTURES, indent=2, ensure_ascii=False))
write("governance/glyphs/D003_CLOSURE_RECEIPT.md", D003)
write("src/GLYPH_VALIDA_RULES_v0.1.ts", VALIDA_RULES)
write("src/slaScanContract.ts", SCAN_CONTRACT)

print("""
✅  Done. Run:

  git add governance/glyphs/ governance/SLA_KERNEL_LOCK.json \\
          src/GLYPH_VALIDA_RULES_v0.1.ts src/slaScanContract.ts
  git commit -m "feat: glyph registry v0.1 — 7-slot architecture, VALIDA rules, scan contract, D-003 closed, kernel lock"
  git push origin main
""")
