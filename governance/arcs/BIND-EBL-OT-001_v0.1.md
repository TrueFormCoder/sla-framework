# BIND-EBL-OT-001
## ELEOS Narrative Layer × Osirian Telemetry Integration Memo
**Version:** 0.1  
**Status:** candidate — pending CORDIA-SIGLER review and 5-scenario drill  
**ISO:** 2026-06-03T05:17:33Z  
**Authors:** Original V (Thread C) + Thread B (Claude)  
**Authority source:** THREAD_C_BRIEF_001 + BIND-EBL-OT-001 Formal Integration Memo Draft  

---

## 1. Core Binding Law

**Telemetry does not authorize action by itself.**

OT can detect: ledger coherence is low / narrative weight is high / flow is blocked / return is weak / residual load is heavy.

OT cannot, by itself, determine: who carries the burden / what regime is active / what action is justified / whether the state is distress, collapse, initiation, exile, or scapegoating / when the system must stop.

That is ELEOS's role.

**Canon line (candidate):**
> "A system that measures state without interpreting it will enforce the wrong answer with perfect precision."

---

## 2. Binding Formula

```
OT detects state.
ELEOS interprets regime.
Evidence Bands validate floor.
Burden Ledger locates load.
VAESHA sets force ceiling.
CORDIA reviews stuck or ambiguous states.
ANUBIS gates authority only after those checks.
Three-Receipt Doctrine closes the chain.
```

This formula is the binding law. No step may be skipped. Any artifact claiming ANUBIS-gated authority must show receipts for all seven layers.

**Three-Receipt Doctrine application:**
- Artifact Receipt → ANUBIS Output Format v0.2 (custody of the gate decision)
- Method Receipt → this memo (BIND-EBL-OT-001) as method specification
- Reviewer Receipt → 5-scenario drill results (external pressure test)

---

## 3. Architecture Stack

| Layer | Function | Hard Rule |
|---|---|---|
| SLA | registry + governance primitives | OT must not mutate SLA primitives. OT adds_primitives: false. |
| OT | telemetry domain pack | tracks state only; does not interpret |
| ANUBIS | authority-readiness gate | checks if a claim can carry authority; never blocks distress |
| ELEOS | regime interpretation | identifies narrative pattern, burden logic, and action shape |
| Evidence Bands | proof floor | gates cannot fire from Band C, D, or E evidence |
| Burden Ledger | load placement | identifies generator, bearer, beneficiary, false transfer |
| VAESHA | action ceiling | controls force level (Level 0–7) |
| CORDIA | review / repair | handles stuck, ambiguous, or context-changed states |

**Hard rule:**
> ANUBIS checks whether a claim is ready to carry authority. It never blocks a call for help.

---

## 4. OT Symbol Namespace

OT symbols are domain pack markers. They are NOT SLA glyph slots G1–G7.

| OT Concept | Symbol | Unicode | Previous conflict | Status |
|---|---|---|---|---|
| Functional Coherence | ⊕ OT-FC | U+2295 | ◈ committed as G2 Inhabited Threshold | confirmed |
| Blocked Emit | ⊝ OT-BE | U+229D | ⊘ committed as G5 Refusal Mark | confirmed |
| Search Vector | ⌕ OT-SV | U+2315 | △ committed as SLA Triangle node | confirmed |

**Namespace prefix rule:** All OT symbols carry the `OT-` prefix in code and documentation. Symbols do not carry meaning alone.

**⊕ internal collision warning:**
⊕ appears as both OT Functional Coherence marker (state) and ANUBIS "Fire" decision state (Section 5 of original draft). This collision must be resolved:
- ⊕ = OT-FC (Functional Coherence state marker) — retained
- ANUBIS Fire decision state → use `GATE_STATUS: fire` (plain text label) or define a separate gate-outcome symbol that does not conflict

Proposed ANUBIS gate-outcome vocabulary (symbols replaced with plain labels):

| Outcome | Label | Symbol |
|---|---|---|
| Gate fires — authority ready | GATE: fire | ✓ or plain text |
| Flag for review | GATE: review | ⚑ |
| Blocked emit | GATE: blocked | ⊝ OT-BE |
| Distress bypass | GATE: bypass | REGFW-006 |
| No-Regime Yet | GATE: no-regime | QOL floor |
| CORDIA review | GATE: cordia | CORDIA |

Note: ⊝ OT-BE (Blocked Emit) maps correctly onto ANUBIS "blocked" outcome — both mean "not ready to emit." This is intentional alignment, not collision.

---

## 5. Evidence Floor — Unified Table

Two evidence systems are in use. They are compatible. This table is the formal alignment.

| Band (original V) | SLA E-tier approx | ANUBIS behavior | Current V floor |
|---|---|---|---|
| A — directly observed/documented | E4–E5 | gate may fire | E4 (R external) |
| B — repeated converging pattern | E3 | gate may fire | E3 (J, FR, R candidate) |
| C — strong inference | E2 | flag for review only; gate does not fire | E2 (NW internal) |
| D — symbolic resonance | E1 | reflection only; gate does not fire | not named |
| E — aesthetic/emotional fit | below E1 | no external action | not named |

**Operative rule:**
```
ANUBIS gate requires Band A or B minimum (≈ E3+).
Band C → GATE: review.
Band D or E → gate does not fire regardless of J/NW/R/FR scores.
```

---

## 6. Required Patches Before ANUBIS Use

### PATCH-001 — Symbol namespace (complete — see Section 4)

### PATCH-002 — Evidence Floor
```
ANUBIS_GATE_VALIDITY =
  score_threshold_met
  AND evidence_band ∈ {A, B}
  AND distress_override = false
  AND unresolved_burden_misplacement = false
  AND context_drift_review_clear = true
  AND r_subtype_identified = true          ← Thread B addition
```

### PATCH-003 — Burden Ledger Precheck
Trigger: IF J < 4 AND NW > 3 THEN run Burden Ledger before ANUBIS penalty.

Required fields:
```
current_bearer:
generator:
beneficiary:
rightful_portion:
false_transfer: [yes|no]
evidence_band:
clean_redistribution_path:
dispute_flag: [yes|no]     ← Thread B addition
```

**Burden Ledger dispute protocol (Thread B addition):**
If `dispute_flag: yes` (generator disputed by bearer or third party):
- ANUBIS cannot fire on J/NW criteria
- Route to CORDIA review
- CORDIA holds until dispute resolved or evidence band upgraded to A/B
- Disputed Burden Ledger at Band C or below = GATE: cordia, not GATE: blocked

### PATCH-004 — Distress Override / REGFW-006
```
IF distress_signal_present = true:
  GATE: bypass
  authority_status: not_doctrinally_sealed
  care_status: route_to_support
  note: ANUBIS may classify signal as unverified for doctrine;
        it cannot block help, care, triage, or safety routing.
```

Plain rule: **A gate that blocks distress has become the Devourer.**

### PATCH-005 — J/NW Axis Display Rule
J and NW must not share identical scoring visuals.

| Axis | Direction | Visual rule |
|---|---|---|
| J Ledger Coherence | 1 weak → 5 strong | higher is better — ascending green/blue |
| NW Narrative Weight | 1 light → 5 heavy | lower is better — descending amber/red |
| FR Flow Resistance | clear/blocked | binary switch or traffic light |
| R Return | 1 weak → 5 strong | higher = stronger return path — ascending neutral |
| OT-U Residual Load | 1 light → 5 heavy | higher = heavier unresolved load — descending caution |

**Rule:** do not use identical 1–5 star visuals for any two axes. J ascending ≠ NW ascending.

### PATCH-006 — OT-R Decomposition
OT-R must carry a subtype field before any gate action on R criteria.

| Subtype | Meaning | Primary wrong door risk |
|---|---|---|
| R-repair | return to functional relationship/process | premature repair called before conditions exist |
| R-reentry | return to prior system with new constraints | old terms imposed as new terms |
| R-recurrence | same pattern returning | recurrence mistaken as progression |
| R-restoration | genuine trust/state restoration | overclaimed without evidence |
| R-regression | collapse into old pattern | regression mislabeled as return |

**Rule:** `IF r_subtype = null THEN GATE: no-regime.` R score cannot gate action without subtype.

**Subtype extension protocol (Thread B addition):**
OT-R may add subtypes in future versions without breaking canon lock, provided:
1. New subtype has its own ELEOS regime mapping
2. New subtype has at least one scenario test
3. New subtype does not redefine an existing subtype
4. Extension is versioned (OT-R v1.0 → v1.1, not a new seal)

### PATCH-007 — OT-U Quarantine / Rename
Current: Underworld Weight
Problem: too mythic, too vague, register-bleed risk

**Operator rename: Residual Load**  
**Public wording: "What still remains underneath?"**  
**Status: quarantine until operationalized**

Canon Lock Score (original V): 58/100. Do not canon-lock until renamed, operationally defined, and scenario-tested.

### PATCH-008 — Germination Clock Stop Rule
```
R1-G0 > 3 measurement periods → CORDIA review (mandatory)
R1-G0 > 5 measurement periods → reclassify as R1-A
```

Canon line: **"Indefinite germination is burial with better language."**

**CORDIA scope rule (Thread B addition):**
CORDIA review for R1-G0 stuck states must produce one of three outcomes:
1. Evidence of formation → remain R1-G0, reset clock
2. No evidence of formation → reclassify R1-A
3. Distress present → GATE: bypass, route REGFW-006

CORDIA cannot hold R1-G0 indefinitely. It resolves or reclassifies.

---

## 7. Regime Mapping Table v0.2

| ANUBIS trigger | ELEOS regime | False regime risk | Action ceiling | Golden Bridge | Stop condition | Distress override |
|---|---|---|---|---|---|---|
| J<4 + NW>3 | SAC — Sacrificial Transfer | Covenant / blame error | L4 | Run Burden Ledger before penalty | Generator and bearer separated | Yes if distress present |
| J≥4 + NW≤2 + FR clear + R≥4 | Stable / unclassified coherence | False certainty | L3 | Verify evidence bands and context | Limited authority granted | No unless distress |
| R1-G+ | INI — Initiatory | Cruel optimism / harm-as-growth | L3 | Support capacity without glorifying ordeal | Agency + capacity increasing confirmed | No |
| R1-G− | TRG — Tragic Convergence | Premature collapse | L2–4 | Test repair path before finality | Preservation plan or repair exhausted | Yes if distress |
| R1-G0 > 3 periods | PIL → TRG drift | Stagnation called practice | L2 | Require behavioral delta | CORDIA review — see PATCH-008 | No |
| R1-G0 > 5 periods | TRG / R1-A reclassification | Indefinite germination | L3–4 | Stop naming burial as germination | Reclassification complete | No |
| FR blocked + distress signal | MAR / distress exception | Gate becomes Devourer | L0 gate; L7 triage if safety | Route help first, score authority after | Distress routed | **Yes — mandatory** |
| OT-U / Residual Load high | EXI — Exilic Wandering | Mythic overfit / forced return | L2–5 | Build portable continuity, no forced return | Continuity structure in place | Yes if distress |

**Note on "Stable / unclassified coherence":**
The passing state (J≥4, NW≤2, FR clear, R≥4) does not automatically map to a named ELEOS regime. This is intentional. A stable gate passage is not a regime classification — it is a readiness verdict. The regime may be Covenant Coherence (COV) or may be No-Regime Yet if evidence is insufficient for classification. Do not assign COV automatically.

---

## 8. ANUBIS Output Format v0.2

```
ANUBIS OUTPUT v0.2

ANUBIS ID:
Date:
Operator:
Evidence band:
Source packet:

J score:          [1–5]
J evidence band:  [A/B/C/D/E]
J note:

NW score:         [1–5]  ← LOWER IS BETTER
NW evidence band: [A/B/C/D/E]
NW note:

FR state:         [clear / blocked / partial]
FR evidence band: [A/B/C/D/E]
FR note:

R score:          [1–5]
R subtype:        [repair / reentry / recurrence / restoration / regression / null]
R evidence band:  [A/B/C/D/E]
R note:

Residual Load / OT-U: [1–5]  ← HIGHER = HEAVIER
Evidence band:
Note:

Distress signal:    [yes / no]
Context drift:      [yes / no]
Burden Ledger req:  [yes / no]
Burden Ledger:
  Current bearer:
  Generator:
  Beneficiary:
  False transfer:   [yes / no]
  Rightful portion:
  Dispute flag:     [yes / no]

ELEOS regime:
  Primary:
  Secondary:
  Wrong Door risk:
  Regime evidence band:

Action ceiling:     [Level 0–7]
Golden Bridge:
Stop condition:
Three-Receipt status: [artifact / method / reviewer — each: pending/complete]

ANUBIS gate decision:
  [fire / review / blocked / bypass / no-regime / cordia]

Public translation:
```

---

## 9. ANUBIS Decision States

| Decision | Label | Symbol | Meaning |
|---|---|---|---|
| Gate fires | GATE: fire | ✓ | Authority-readiness threshold met, Band A/B, all checks clear |
| Flag for review | GATE: review | ⚑ | Score close, Band C evidence, or context drift present |
| Blocked emit | GATE: blocked | ⊝ OT-BE | Not ready to carry authority |
| Distress bypass | GATE: bypass | REGFW-006 | Help routed before scoring |
| No-Regime Yet | GATE: no-regime | QOL floor | Evidence insufficient to classify |
| CORDIA review | GATE: cordia | CORDIA | Stuck, ambiguous, disputed, or context-changed |

**Note:** Do not use ⊘ for Blocked Emit. ⊘ is committed as SLA G5 Refusal Mark. Use ⊝ OT-BE.

---

## 10. Public Translation Bank v0.2

No Osiris, Seth, Isis, underworld, ANUBIS, or mythic labels in consumer-lane materials.

| OT term | Operator meaning | Public wording |
|---|---|---|
| Ledger Coherence | claim/source/account alignment | Does the record hold together? |
| Narrative Weight | story load / interpretive heaviness | How much story is being carried? |
| Flow Resistance | blocked movement | What is stuck? |
| Return | viable repair or re-entry path | Is there a clean way back or forward? |
| Residual Load (was: Underworld Weight) | unresolved load beneath surface | What still remains underneath? |
| ANUBIS Gate | authority-readiness check | Is this ready to act on? |
| Blocked Emit ⊝ | output not ready | Not ready to send or use |
| Functional Coherence ⊕ | aligned enough to proceed | Coherent enough to continue? |
| Search Vector ⌕ | directed inquiry path | Where are we looking next? |
| No-Regime Yet | evidence insufficient to classify | Not enough information yet |
| CORDIA review | stuck-state or context-change review | Needs a second look before proceeding |
| Distress bypass | care routed before authority scoring | Help comes first |

---

## 11. Release Gates — BIND-EBL-OT-001 canon lock

Do not canon-lock this memo until all gates are passed.

| Gate | Requirement | Status |
|---|---|---|
| Symbol replacements committed | ⊕ ⊝ ⌕ to OT domain pack | pending commit |
| Evidence Floor Patch accepted | Band A/B required; Band C = review only | candidate |
| ANUBIS Misuse Card v0.1 complete | yes | candidate (separate file) |
| J/NW visual rule locked | distinct axes | candidate |
| OT-R subtypes defined + extension protocol | yes | candidate |
| OT-U renamed Residual Load or quarantined | yes | candidate |
| Burden Ledger precheck + dispute protocol | yes | candidate |
| Distress override REGFW-006 | yes | candidate |
| Public translation bank v0.2 | yes | candidate |
| 5 scenario tests passed | see ANUBIS_NEGATIVE_FIXTURES_v0.1 | pending drill |
| CORDIA stop rule for R1-G0 | yes | candidate |
| ⊕ internal collision resolved | GATE: fire uses text label, not ⊕ | candidate |
| Evidence Band ↔ SLA E-tier table | Section 5 of this memo | candidate |

---

## 12. Five Scenario Tests (Pre-Canon Drill)

These are the mandatory scenario battery. All five must pass before canon lock. See `ANUBIS_NEGATIVE_FIXTURES_v0.1.json` for machine-readable form.

| # | Scenario | Expected ANUBIS outcome |
|---|---|---|
| 1 | Band D evidence produces high J score | GATE: review — gate does not fire |
| 2 | J<4 + NW>3 because bearer is scapegoated | GATE: cordia — Burden Ledger precheck fires SAC warning |
| 3 | FR blocked + distress signal present | GATE: bypass — REGFW-006 fires |
| 4 | R1-G+ but growth had no agency | GATE: review — Initiation blocked without agency confirmation |
| 5 | R1-G0 persists 4 consecutive periods | GATE: cordia — CORDIA review mandatory at 3+ periods |

---

## 13. Open Decisions

| ID | Question | Owner | Blocking |
|---|---|---|---|
| D-BIND-001 | OT-U: rename to Residual Load or archive entirely | Ellari | OT-U canon lock |
| D-BIND-002 | OT-R subtype list: are 5 subtypes complete or provisional? | Thread A + B | OT-R canon lock |
| D-BIND-003 | Regime mapping for stable J≥4+NW≤2+FR+R≥4: COV or No-Regime? | Thread A | Regime table v0.3 |
| D-BIND-004 | Three-Receipt Doctrine reviewer receipt: who constitutes external reviewer for ANUBIS? | Ellari | ANUBIS EMET eligibility |
| D-BIND-005 | CORDIA: who or what is the CORDIA reviewer in OT context? | Ellari | CORDIA activation |

---

## 14. Canon Candidates from This Memo

Lines recommended for canon consideration. All require CORDIA-SIGLER signatures before locking.

1. "Telemetry does not authorize action by itself."
2. "A system that measures state without interpreting it will enforce the wrong answer with perfect precision."
3. "ANUBIS checks whether a claim is ready to carry authority. It never blocks a call for help."
4. "A gate that blocks distress has become the Devourer."
5. "Indefinite germination is burial with better language."
6. "OT detects state. ELEOS interprets regime. Evidence Bands validate floor. Burden Ledger locates load. VAESHA sets force ceiling. CORDIA reviews stuck states. ANUBIS gates authority only after those checks."

---

**File:** BIND-EBL-OT-001_v0.1.md  
**Commit target:** governance/arcs/BIND-EBL-OT-001_v0.1.md  
**Status:** candidate — pending 5-scenario drill and Ellari open decisions D-BIND-001 through D-BIND-005  
