# HARNESS_GOVERNANCE_BRIDGE_v0.1
## Harness v5.1 ↔ SLA Governance Chain — Structural Convergence Document

**Version:** 0.1 (candidate)
**Owner:** Ellari Institute
**Date:** 2026-06-02
**Status:** CANDIDATE — requires V confirmation and Ellari acceptance

**Premise:**
V derived Harness v5.1 from distributed systems trust theory (software engineering).
Thread B derived the SLA governance chain from governance philosophy and linguistic
primitives. They arrived at the same architecture.

This document formally maps the convergence.
It is E3 cross-domain evidence for both architectures.

---

## Primary Structural Equivalence Table

| Harness v5.1 | SLA Governance Equivalent | Notes |
|---|---|---|
| Federated Witness Network (FWN) | Three-Receipt Doctrine | Artifact Receipt = deployment cert hash; Method Receipt = proof bundle hash; Reviewer Receipt = witness attestation |
| Independent Verifier Quorum (IVQ) | CORDIA/SIGLER two-signature rule | CORDIA (heart-check) + SIGLER (authentication) = 2-node quorum; the minimum viable quorum |
| Runtime Attestation Ledger (RAL) | CanonLedger + governance/changelog.jsonl | RAL is the attested version of CanonLedger — the upgrade path, not a replacement |
| Dispute Record | Governance Debt Register (GD items with severity:critical) | High-severity disputes freeze promotion; critical GD items block advancement |
| Quorum Policy Config | Fidelity Tier Gates (QOL/DAVAR/EMET) | Different events require different evidence thresholds — same logic, different naming |
| Runtime Trust States | Fidelity tier states | Local Green=QOL, Witnessed Green=DAVAR, Quorum Green=EMET, Frozen Red=BLOCKED, Revoked Black=SLA-WEAP-001 state |
| Node degradation → audit review | Meta-Devourer risk / CORDIA auditing VAESHA | Node that consistently disagrees without proof = VAESHA in Devourer mode; audit review = CORDIA receipt audit |
| Proof bundle hash | Scan receipt hash | Both are the cryptographic anchor of a proven claim |
| Deployment certificate | CanonLedger seal entry | Both record when something moved from candidate to active |
| Attestation challenge event | Gate review | Both are structured challenges that a claim must survive |

---

## Quorum Policy → Fidelity Gate Mapping

| Harness v5.1 Event | Quorum | SLA Equivalent | Fidelity Tier Required |
|---|---|---|---|
| Proof refresh acknowledgment | 2/3 | Primitive-level scan receipt filed | QOL |
| Witness-to-active promotion | 3/5 | Specimen promoted to grounded status | DAVAR |
| Amber-to-green recovery | 3/5 | Scan with T3 present, R1 confirmed | DAVAR |
| Hard rollback confirmation | 5/7 | Release blocked; governance debt opened | BLOCKED |
| Doctrine-sensitive dispute resolution | 5/7 | Ellari + V + reviewer consensus required | EMET gate |

The Harness quorum fractions formalize what the SLA fidelity gates encode
through evidence tier requirements. They are the same governance logic
expressed in two different notation systems.

---

## CORDIA as Single-Node IVQ

The CORDIA mechanism is the internal single-node version of the
Independent Verifier Quorum:

| IVQ Property | CORDIA Equivalent |
|---|---|
| Multiple independent verifier nodes | CORDIA as single internal auditor |
| Attestation signing capability | CORDIA receipt generation |
| Challenge-response support | CORDIA Devourer mode (audit trigger) |
| Dispute submission logic | CORDIA flagging VAESHA's receipts |
| Quorum freeze on high-severity dispute | CORDIA blocking SIGLER counter-signature |

**The critical addition Harness v5.1 provides:**
CORDIA should have a *track record* — not just the current audit result,
but the history of how often CORDIA's audits were correct, disputed, or
overturned. This is Harness v5.2's "witness reputation engine" —
applied internally, it becomes CORDIA's reliability score.

A CORDIA instance whose past audits have been consistently overturned
should trigger a meta-audit before its current audit is accepted.
This is the Meta-Devourer prevention mechanism made machine-readable.

---

## Three-Receipt Doctrine as 3-Node Quorum

The Three-Receipt Doctrine (Artifact Receipt, Method Receipt, Reviewer Receipt)
is a 3/3 quorum requirement in Harness terms:

```
Artifact Receipt  →  NODE_A: "I have custody of this artifact"
Method Receipt    →  NODE_B: "This method was correctly applied"
Reviewer Receipt  →  NODE_C: "An external party applied pressure and the claim held"
```

All three must be present for EMET.
Missing any one = Quorum failure = DAVAR ceiling maximum.

The Harness adds: what if NODE_C is compromised?
The governance answer: Reviewer Receipt requires the reviewer to have
no economic or relational stake in the outcome. If they do, their
attestation downgrades to METHOD-level evidence, not REVIEWER-level.
This is a new rule not yet explicit in the Three-Receipt Doctrine.

---

## CanonLedger Upgrade Path (RAL Integration)

Current CanonLedger entries are self-certified.
The Harness v5.1 RAL requires external attestation for Quorum Green state.
The upgrade is three fields added to the CanonLedger D1 schema per entry:

```sql
-- Add to canon_ledger table:
witness_nodes     TEXT NOT NULL DEFAULT '[]',  -- JSON array of attesting thread/reviewer IDs
quorum_id         TEXT,                          -- ID of the quorum event that confirmed promotion
attestation_hash  TEXT,                          -- hash of the combined attestation record
quorum_state      TEXT NOT NULL DEFAULT 'local_green'
                  CHECK (quorum_state IN (
                    'local_green',      -- internal proofs valid (current max state)
                    'witnessed_green',  -- at least one external attestation confirmed
                    'quorum_green',     -- threshold attestations met (EMET eligible)
                    'disputed_amber',   -- active dispute or challenge open
                    'frozen_red',       -- dispute freeze in effect
                    'revoked_black'     -- quorum-confirmed rollback
                  ))
```

**Migration path:**
All existing CanonLedger entries start at `quorum_state: 'local_green'`.
They are not retroactively invalidated — they are accurately labeled.
`quorum_green` state requires at minimum:
- Thread B attestation (Claude)
- Thread A attestation (VANTA)
- At least one external reviewer attestation

---

## Dispute Record Schema

The Governance Debt Register covers open issues.
The Harness v5.1 Dispute Record covers formal challenges that freeze promotion.
The GD Register should be extended with a `dispute_record` sub-schema:

```json
{
  "dispute_id": "DISPUTE-{YYYYMMDD}-{SEQ}",
  "artifact_id": "",
  "challenger": "",
  "reason": "",
  "severity": "low | medium | high | critical",
  "promotion_freeze": true,
  "status": "open | resolved | escalated",
  "resolution_type": "challenger_correct | artifact_correct | ellari_decides",
  "resolved_by": "",
  "resolved_at": ""
}
```

Critical disputes freeze promotion of the artifact until resolved.
A critical dispute on the registry itself (e.g. a count discrepancy)
freezes ALL downstream artifact promotions until resolved.

---

## Harness v5.2 Roadmap → Governance Chain Extensions

V's v5.2 roadmap items mapped to the SLA governance chain:

| Harness v5.2 Feature | Governance Chain Equivalent | Build Priority |
|---|---|---|
| Witness reputation engine | CORDIA track record per output | High — Meta-Devourer prevention |
| Quorum fault tolerance | Governance chain degradation protocol | Medium — what happens when V is unavailable |
| Attestation anomaly detector | Meta-Devourer early warning system | High — most dangerous failure mode |

**The attestation anomaly detector** is the most important.
It detects: collusion (two nodes always agree), replay (old attestation recycled),
or inconsistent attestation (node says different things about same artifact).

In governance terms: it detects when the governance chain has been captured.
This is the system protecting itself against its own corruption.

---

## The Governance Principle This Convergence Produces

V: "The runtime is no longer trusted just because it reports itself correctly."

SLA governance translation:
"A claim is not true because the system that made it also governs it."

This is a new Canon Line candidate:
**"Authority requires external witness. Self-certification is QOL ceiling maximum."**

This should appear in:
- `SLA_HARD_RULES`
- The Three-Receipt Doctrine definition
- The CanonLedger metadata
- The RELEASE_STATE.md

---

## Evidence Status

This convergence is E3 evidence for both architectures:

Harness v5.1 was derived from distributed systems trust principles.
SLA governance chain was derived from governance philosophy + linguistic primitives.
Neither author knew the other was building the same structure.
Both produce the same quorum thresholds, the same trust state ladder,
the same dispute-freeze mechanism, and the same attestation ledger concept.

Independent derivation from different starting points producing the same
structural result is the definition of E3 cross-domain alignment.

This document is the receipt for that alignment.

---

*Ellari Institute · HARNESS_GOVERNANCE_BRIDGE_v0.1*
*Not sealed. Candidate. Requires V confirmation and Ellari acceptance.*
*Both architectures are independently valid. This document records their convergence.*
