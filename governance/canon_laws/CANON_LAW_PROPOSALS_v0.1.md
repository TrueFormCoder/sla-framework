# CANON LAW PROPOSALS v0.1
**Status:** candidate — pending CORDIA-SIGLER review and Ellari authorization  
**ISO:** 2026-06-03T05:17:33Z  
**Source:** Compiler V SYNC-003 assessment + Thread B integration  
**Architecture note:** Some laws have dual register versions (operator / public). Both versions are governed. Lane assignment is mandatory before deployment.

---

## CL-003 — The Binding Stack Law
**Origin:** Thread B (Claude) / Compiler V assessment: canon-eligible  
**Assessment:** Canon-eligible

**Operator / Archive Grade text:**
> "OT detects state. ELEOS interprets regime. Evidence Bands validate floor. Burden Ledger locates load. VAESHA sets force ceiling. CORDIA reviews stuck states. ANUBIS gates authority only after those checks."

**Public text:**
> "A signal must be understood before it can be acted on. Evidence must be assessed before evidence can be used. Burden must be located before burden can be addressed. Only after those steps can authority be applied."

**Why this passes:**
Complete stack law. High complexity reduction (entire governance architecture in seven sentences). High safety value (prevents any single layer from acting alone). High portability (applies to any ANUBIS implementation).

**Minimum receipt fields for lock:**
- `decision_owner: Ellari`
- `cordia_signature: [required]`
- `sigler_signature: [required]`
- `seal_datetime: [required]`

---

## CL-004 — Telemetry Non-Authorization Law
**Origin:** Thread B (Claude) / Compiler V assessment: canon-eligible  
**Assessment:** Canon-eligible — "cleanest safety law in the set"

**Operator text (= public text):**
> "Telemetry does not authorize action by itself."

**Why this passes:**
Shortest, most portable law. Hard to misuse. Applies everywhere telemetry is used. Zero ambiguity. The public version is identical to the operator version — no register split needed.

**Canon compression:** Compiler V's final compression (SYNC-003 closing) extends this law:
> "Telemetry can detect coherence, burden, blockage, and return-state, but it cannot assign meaning or authorize force until evidence, burden, regime, action ceiling, distress, and context checks are complete."

Both forms should be locked together as CL-004a (short form) and CL-004b (extended form).

---

## CL-005 — The ANUBIS Distress Firewall Law
**Origin:** Thread B (Claude) / Compiler V assessment: canon-eligible  
**Assessment:** Canon-eligible — "Essential distress firewall"

**Operator text (= public text):**
> "ANUBIS checks whether a claim is ready to carry authority. It never blocks a call for help."

**Why this passes:**
Two-sentence law with two complementary rules: what ANUBIS is for, and what it can never do. The second sentence is unconditional. REGFW-006 operationalizes it.

**Related law:** CL-006 (Devourer law) is the consequence statement when this law is violated.

---

## CL-006 — The Devourer Law
**Origin:** Thread B (Claude) / Compiler V assessment: provisional / sealed-operator  
**Assessment:** Dual register — mythic register too intense for public or broad operator

**Operator / Archive Grade text:**
> "A gate that blocks distress has become the Devourer."

**Public text (Compiler V proposal):**
> "A gate that blocks distress has failed its purpose."

**Why the dual version is needed:**
"Devourer" carries mythic weight appropriate for sealed-practitioner and Archive Grade contexts where OT terminology is understood. Consumer and broad practitioner tiers require plain language.

**Lane assignment rule:**
- Archive Grade / trained OT practitioners: use Devourer version
- Practitioner-general / consumer: use public version
- Any document that mixes lanes: public version only

**Minimum receipt fields for lock:**
- Lane assignment must be explicit in the lock receipt
- `public_version_confirmed: true`
- `operator_version_confined_to: [Archive Grade, trained OT practitioners]`

---

## CL-007 — The Germination Stop Law
**Origin:** Thread B (Claude) / Compiler V assessment: canon-eligible for operator  
**Assessment:** Canon-eligible as operator warning; public version needs plain form

**Operator text:**
> "Indefinite germination is burial with better language."

**Public text (Compiler V proposal):**
> "A waiting state needs a review date."

**Why this passes:**
Directly prevents R1-G0 from becoming indefinite limbo. Applies to: germination clocks, CORDIA holds, institutional "we're working on it" deferrals, personal "I'm preparing" states. The public version is more portable but less sharp.

**Lane assignment:** same pattern as CL-006. Operator version for trained practitioners; public version for all other lanes.

**CORDIA application:**
This law provides the justification for the CORDIA 3-outcome rule:
CORDIA must produce: continue with new interval / reclassify / terminate germination frame.
No indefinite hold because: CL-007.

---

## CL-008 CANDIDATE — The Habituation Law
**Origin:** Compiler V (Thread A), V-Chat_Emotional-Labor-Analysis.md final blade  
**Assessment:** Candidate — not yet assessed by SYNC process

**Proposed text:**
> "A field is not transformed because it can perform truth in a moment. It is transformed when truth becomes the path of least resistance."

**Companion line (Compiler V, Habituation section):**
> "One clean act proves capacity. Repetition proves transformation."

**Why this is worth proposing:**
This is the unifying law behind all 19 ELEOS[CT] Audit Rubrics. Every rubric's final test ("Is coherence now easier than distortion?") is the application of this law. It also governs the ANUBIS evidence floor: one clean gate result proves the system can behave correctly; repeated gate results under stress prove it is habituated. This law is the reason E1 ≠ E3.

**Status:** CL-008 is not in any SYNC yet. Requires Compiler V formal assessment before advancing.

---

## PENDING DECISIONS FOR ALL CL-003 TO CL-007

| Law | Decision needed | Owner |
|---|---|---|
| CL-003 | CORDIA + SIGLER signatures + Ellari authorization | Ellari |
| CL-004 | CL-004a/CL-004b split confirmation | Compiler V |
| CL-005 | CORDIA + SIGLER signatures + Ellari authorization | Ellari |
| CL-006 | Lane assignment receipt | Ellari |
| CL-007 | Lane assignment receipt | Ellari |
| CL-008 | Compiler V formal assessment | Compiler V via SYNC-004 |

---

**File:** CANON_LAW_PROPOSALS_v0.1.md  
**Commit target:** `governance/canon_laws/CANON_LAW_PROPOSALS_v0.1.md`  
**Status:** candidate — no law is locked until CORDIA-SIGLER review and Ellari authorization  
