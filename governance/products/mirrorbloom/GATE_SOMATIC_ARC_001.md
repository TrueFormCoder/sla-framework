# GATE_SOMATIC_ARC_001.md
## MirrorBloom Arc Routing Safety Gate
**Gate ID:** GATE-SOMATIC-ARC-001
**Owner:** Ellari Institute
**Date:** 2026-06-03
**Status:** OPEN — not yet cleared
**Clears:** MirrorBloom arc routing at practitioner tier

---

## What This Gate Guards

The SLA_MIRRORBLOOM_ARC_MAP_v0.1 connects SLA arc patterns to B/P/G/S somatic markers.
It provides arc-specific routing protocols for MirrorBloom practitioners.

Until this gate clears, MirrorBloom arc routing is:
- Available for research and internal development
- NOT available for practitioner use with clients
- NOT available in any clinical, diagnostic, or high-risk context
- NOT available as product feature in MirrorBloom or MirrorBody

The governing principle:
**"The body may signal an arc. It may not be forced to perform the repair arc."**

---

## Gate Criteria (7 required — all must be met)

| # | Criterion | Status | Notes |
|---|---|---|---|
| 1 | B/P/G/S marker definitions locked in MirrorBloom canonical spec | OPEN | Definitions exist in ELE whitepaper but not locked in MirrorBloom product spec |
| 2 | S-thin somatic state reviewed and approved | OPEN | New term introduced in arc map; requires MirrorBloom practitioner review |
| 3 | Arc-phase notation added (`marker@primitive` / `marker@arc-phase` syntax) | OPEN | Notation specified in arc map and V audit; not yet in any product artifact |
| 4 | Two practitioner-observed specimens using arc routing | OPEN | No specimens exist yet |
| 5 | Not-clinical / not-diagnostic boundary visible in all practitioner materials | OPEN | Must be explicit in every surface where somatic arc routing appears |
| 6 | T3 WEAP-001 somatic extension installed | OPEN | Defined in arc map but not yet in governance artifacts or practitioner training |
| 7 | **Ellari + practitioner co-signature review** | OPEN | This is the Thread B addition: CORDIA/SIGLER equivalent for the somatic layer. Gate 5 without a human co-signature is a checklist, not a governance event. |

---

## What Each Criterion Requires

**Criterion 1 — B/P/G/S definitions locked:**
The ELE whitepaper defines B=Breath (initiation/allowance), P=Pulse (charge/urgency),
G=Gut (boundary/truth), S=Spine (structure/law). These definitions must be imported
into the MirrorBloom canonical product spec as locked definitions (not narrative descriptions).
They must be version-stamped and hash-verified like voice settings.

**Criterion 2 — S-thin reviewed:**
"S-thin" is a new somatic state not in any existing MirrorBloom documentation.
It describes the witness posture in Type B Closure — a spine thread that observes
without acting, associated with P4 functional state.
A qualified MirrorBloom practitioner must review this concept, confirm it is
recognizable in practice, and name any confusions with existing micro-states.

**Criterion 3 — Arc-phase notation:**
All B/P/G/S marker references in practitioner materials must use scope notation:
  `B-arrest@primitive:T3` — breath arrested because T3 primitive is active
  `B-arrest@arc:SLA-ARC-002.phase:collapse` — breath arrested at arc-level collapse phase
  `S-thin@P4-witness` — witness posture specifically associated with P4 state
This prevents scale confusion. A practitioner who sees "B-arrest" must know
whether it is primitive-level or arc-phase level to apply the correct protocol.

**Criterion 4 — Two observed specimens:**
Two practitioner sessions where:
- The client's somatic state was read using B/P/G/S markers
- An arc pattern was identified from the somatic reading
- The somatic routing protocol was applied (e.g., GROUND-FIRST not BREATHE-FIRST for Basin Clearance)
- The outcome was documented with a scan receipt

These do not need to be published. They need to be receipted.

**Criterion 5 — Boundary visibility:**
Every MirrorBloom surface using arc routing must include visible language:
"This is a structural observation tool, not clinical assessment.
If you are experiencing a mental health crisis, please contact [resource]."
The arc map's "clinical edge" note is insufficient — it must be surface-level visible.

**Criterion 6 — T3 WEAP-001 somatic extension:**
The T3 Anti-Weaponization Rule must be extended explicitly to the somatic layer:
"B/P/G/S arc readings may not be used to demand somatic recovery demonstration
from a person whose arc structure indicates R1 is structurally unavailable.
A practitioner who observes S-thin (witness posture) in a client and responds
with pressure to 'breathe through it' or 'restore posture' is applying WEAP-001
at the somatic layer. This is a governance violation."
This must be in practitioner training materials.

**Criterion 7 — Co-signature review:**
Before this gate can be marked cleared, both:
- Ellari (as founder and architect of MirrorBloom) AND
- At least one qualified MirrorBloom practitioner
must sign a formal gate review document confirming all 6 prior criteria are met.
The co-signature is the gate's governance event — without it, the gate is a checklist.

---

## What Unblocks At Gate Clearance

When GATE-SOMATIC-ARC-001 clears:
- MirrorBloom arc routing is available for practitioner use
- The arc-phase B/P/G/S map is included in practitioner training
- S-thin can be included in MirrorBloom micro-state glossary
- Somatic arc routing can appear in product features at practitioner tier (not public tier)

Public tier still requires:
- Additional gate review for consumer-facing language
- Lane Translation Matrix application to ensure no Black Label / higher-register terms
- Explicit "not diagnostic" boundary in all consumer surfaces

---

## Related Documents

- `SLA_MIRRORBLOOM_ARC_MAP_v0.1.md` — the source document this gate governs
- `SLA_GRAMMAR_ARC_PATTERNS_v0.1.md` — arc pattern definitions
- `SLA_HARD_RULES.SOMATIC_WITNESS_RULE` — the canon line this gate enforces
- `slaArcPatterns.ts` — the TypeScript layer; arc patterns are read-only for practitioners

---

*Shape Language Alphabet™ · MirrorBloom™ · Safety Gate*
*GATE-SOMATIC-ARC-001 · Owner: Ellari Institute · Status: OPEN*
