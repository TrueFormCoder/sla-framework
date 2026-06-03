# Shape Language Alphabet(TM)

SLA v2.2 candidate | Registry: sha256:1f0bde0fd79daf50
Site: https://sla-framework.vercel.app
Status: see RELEASE_STATE.md

## Structure
- root: static site HTML, deployed to Vercel
- src/: slaRegistry.ts, slaArcPatterns.ts, receiptAdapter.ts + tests
- governance/architecture/: five-layer runtime, Harness bridge
- governance/arcs/: arc grammar patterns, lit nominations
- governance/crossDomain/: SLA-CROSS-002 filing
- governance/products/lmi/: LMI classifier schema, arc taxonomy
- governance/products/mirrorbloom/: arc map, routing rules, gate spec
- governance/products/p2l/: defense depletion table, scene patch
- governance/infrastructure/: public surface firewall config
- db/: canon ledger + migrations
- sync/: Thread A <-> Thread B sync artifacts (SLA-SYNC-001-v1.1)
- patches/: transitional patches, apply then delete

## Run
  npm install && npm run typecheck && npm run test:run

## Authority
Ellari Institute / Ellari Ventures LLC
ORCID: 0009-0009-7943-1498 | OSF: osf.io/mhpuz
