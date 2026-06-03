# GLYPH_MVS_BINDING_TABLE.md — Seven-Mark Scan Grammar

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
