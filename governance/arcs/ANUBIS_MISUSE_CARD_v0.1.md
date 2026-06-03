# ANUBIS MISUSE CARD v0.1
**Status:** candidate  
**ISO:** 2026-06-03T05:17:33Z  
**Authority:** BIND-EBL-OT-001 v0.1, REGFW-006  

---

## WHAT ANUBIS IS

ANUBIS checks whether a claim is ready to carry authority.

---

## WHAT ANUBIS IS NOT

ANUBIS does not decide whether a person deserves care.  
ANUBIS does not block a call for help.  
ANUBIS does not turn weak evidence into action.  
ANUBIS does not punish the absorber of displaced burden.  
ANUBIS does not force return.  
ANUBIS does not call harm initiation.  
ANUBIS does not score mythic weight as doctrine.  

---

## PRE-FIRE CHECKLIST

Before ANUBIS fires, check all eight:

```
1. Evidence Band A or B?
   NO → GATE: review (Band C) or no-regime (Band D/E)

2. Distress signal absent?
   NO → GATE: bypass — REGFW-006 — route help first

3. Burden Ledger clear?
   NO (J<4 + NW>3) → Run Burden Ledger precheck
   If bearer ≠ generator → SAC warning → GATE: cordia

4. Context drift absent?
   UNCLEAR → GATE: cordia — route to CORDIA review

5. J/NW axes interpreted correctly?
   (J: higher is better. NW: LOWER is better.)
   MISREAD → stop, re-score

6. Return subtype identified?
   NULL → GATE: no-regime — R score cannot gate action without subtype

7. Golden Bridge named?
   MISSING → flag — gate decision is incomplete

8. Stop condition defined?
   MISSING → flag — gate decision is incomplete
```

---

## DECISION TREE

```
ANUBIS FIRE DECISION TREE

START
  │
  ├─ Distress signal present?
  │    YES → GATE: bypass (REGFW-006)
  │          Route care/help/safety FIRST
  │          Do not gate. Do not score.
  │          Authority verdict can come after.
  │
  ├─ Evidence Band D or E?
  │    YES → GATE: no-regime
  │          Reflection only. No external action.
  │
  ├─ Evidence Band C?
  │    YES → GATE: review
  │          Flag for CORDIA. Do not fire.
  │
  ├─ J<4 AND NW>3?
  │    YES → Run Burden Ledger precheck
  │          ├─ Bearer = Generator? → proceed to gate logic
  │          └─ Bearer ≠ Generator? → GATE: cordia (SAC warning)
  │               Dispute flag? → GATE: cordia (cannot resolve)
  │
  ├─ Context drift present?
  │    YES → GATE: cordia
  │
  ├─ R subtype = null?
  │    YES → GATE: no-regime
  │
  ├─ R1-G0 > 3 periods?
  │    YES → GATE: cordia (germination clock stop rule)
  │
  ├─ All checks clear AND Band A/B evidence?
  │    YES → GATE: fire
  │
  └─ Threshold close but not met?
       YES → GATE: review (⚑ flag for human review)
```

---

## OUTCOME → ACTION MAP

| Gate outcome | Action | Symbol |
|---|---|---|
| GATE: fire | Authority claim may proceed at licensed tier | ✓ |
| GATE: review | Human review required before action | ⚑ |
| GATE: blocked | Not ready; resubmit when evidence improves | ⊝ OT-BE |
| GATE: bypass | Help routed first; authority verdict deferred | REGFW-006 |
| GATE: no-regime | Insufficient evidence to classify | QOL floor |
| GATE: cordia | CORDIA review activated; gate suspended | CORDIA |

---

## ESCALATION PATHS

| If GATE is: | Then: |
|---|---|
| fire | Proceed. Log receipt. |
| review | Route to designated human reviewer. Await verdict. |
| blocked | Notify submitter. Specify what evidence would upgrade to Band A/B. |
| bypass | Activate care/support protocol. ANUBIS scores after care, not before. |
| no-regime | Request: evidence upgrade, or explicit acknowledgment that claim is Band D/E only. |
| cordia | CORDIA must produce one of: proceed / reclassify / dispute resolution. Cannot hold indefinitely. |

---

## HARD LIMITS (cannot be overridden by score)

1. **No gate can block distress.** REGFW-006 is unconditional.
2. **No gate fires on Band D or E evidence.** Score does not override evidence floor.
3. **No gate penalizes absorbed burden without Burden Ledger clearance.**
4. **No R-score gates action without a named subtype.**
5. **No R1-G0 beyond 5 periods without reclassification.** Germination is not indefinite.

---

## CANON LINE

> A gate that blocks distress has become the Devourer.

---

**File:** ANUBIS_MISUSE_CARD_v0.1.md  
**Commit target:** governance/arcs/ANUBIS_MISUSE_CARD_v0.1.md  
**Related:** BIND-EBL-OT-001_v0.1.md, REGFW-006  
