cat > governance/surfaces/SIGWELL_SURFACE_MAP_v0.1.md <<'EOF'

# Sigwell Surface Map v0.1

**Author:** Compiler V / Thread A

**Owner:** Ellari

**ISO:** 2026-06-03T21:43:28-05:00

**Status:** candidate

**Governs:** Sigwell deployment surfaces, domains, workers, D1 table groups, and operational lanes.

**Current Repo HEAD:** c8f95b5

**SLA-SYNC-003 Anchor:** 2aeea03

---

## Purpose

Sigwell has multiple live or legacy surfaces with overlapping names. This map prevents namespace confusion by assigning every surface to a lane, status, domain, data scope, and canonical replacement path.

This file answers:

- What is this surface?

- Where is it deployed?

- What domain owns it?

- What data does it touch?

- Is it portfolio ops or franchise deal stack?

- Is it current, legacy, deprecated, or redirect-only?

---

## Lane Vocabulary

| Lane | Meaning |

|---|---|

| franchise_deal_stack | SBA/Zaxby’s deal execution, lender portal, PFS, Brei access, deal room, sw_* operational data |

| portfolio_ops | entity, real estate, insurance, compliance, ownership, filings, entity-level dashboards |

| shared_infra | D1, R2, API, access control, shared components used by multiple Sigwell surfaces |

| legacy | old but possibly still useful; do not delete until replacement verified |

| deprecated | superseded; should redirect or archive |

---

## Status Vocabulary

| Status | Meaning |

|---|---|

| current | canonical active surface |

| active_auxiliary | active but not canonical home |

| legacy_hold | preserve until replacement verified |

| redirect_pending | should redirect to canonical surface |

| deprecated | no longer used; archive only |

| unknown | needs investigation |

---

## Surface Inventory

| Surface | Type | Lane | Status | Domain / URL | CF Project / Worker | D1 Scope | Canonical Replacement | Notes |

|---|---|---|---|---|---|---|---|---|

| Sigwell Command Center | CF Pages app | franchise_deal_stack | current | sigwell.ellari.dev | sigwell-command-center | state, access_log, cr_archive, pfs_*, lender Q&A, change requests | none | Canonical SBA/Zaxby’s command center with lender portal, role access, PFS module, and D1-backed functions. |

| Sigwell Lender Portal | CF Access-protected role view | franchise_deal_stack | current | sigwell.ellari.dev | sigwell-command-center | lender-visible curated data only | none | Brei / Live Oak external view. Must remain CF Access protected. |

| Sigwell PFS Suite | In-app module + CF Functions | franchise_deal_stack | current | sigwell.ellari.dev / PFS Assets tab | sigwell-command-center | pfs_guarantors, pfs_accounts, pfs_summary, Plaid pending | none | Supports screenshot/PDF extraction and planned Plaid balance sync. |

| Sigwell Ops Cockpit | CF Pages app | portfolio_ops | legacy_hold | ops.ellari.dev | sigwell-command | sw_* or legacy ops tables | TBD: ops.ellari.dev unified cockpit OR sigwell.ellari.dev | Older ops cockpit. Do not delete until feature parity is confirmed. |

| Sigwell Dashboard | CF Pages app | portfolio_ops | redirect_pending | dash.ellari.dev | sigwell-dash | unknown | ops.ellari.dev or sigwell.ellari.dev | Old dashboard surface. Needs audit before redirect. |

| Sigwell Portfolio API | Worker/API | portfolio_ops | current_candidate | TBD / API route | sigwell-portfolio-api | portfolio, entities, properties, insurance, compliance | ops.ellari.dev/api/* | Should power portfolio ops, not SBA deal stack. Needs canonical route. |

| Sigwell Ops API | Worker/API | shared_infra | legacy_hold | workers.dev or ops route | sigwell-ops-api | unknown | sigwell-portfolio-api or same-origin Pages Functions | Needs audit. Do not expose public workers.dev if Access is required. |

| Sigwell Portfolio Cron | Worker/Cron | portfolio_ops | current_candidate | none | sigwell-portfolio-cron | alert snapshots, insurance/risk refresh | none | Should write alerts and refresh status, not serve UI. |

| sigwell-ops D1 | D1 database | shared_infra | current | Cloudflare D1 | sigwell-ops | build_*, sw_*, pfs_*, state, access_log, cr_archive, project_threads | none | Shared operational database. Needs stricter table ownership map. |

| eleos-context R2 | R2 bucket | shared_infra | current | private only | eleos-context | project thread archive | none | Private context archive. Never attach public domain. |

| eleos-mesh-artifacts R2 | R2 bucket/CDN | shared_infra | current | assets.ellari.dev | eleos-mesh-artifacts | public assets only | none | Public CDN for logos/assets. No sensitive transcripts. |

| Live Oak / Brei Access | CF Access policy | franchise_deal_stack | pending_or_current | sigwell.ellari.dev | Zero Trust Access app | external lender session | none | Must be email-OTP protected before lender sharing. |

| old pages.dev preview URLs | CF Pages previews | legacy | deprecated | *.pages.dev | multiple | varies | custom domains only | Should not be shared externally except for testing. |

---

## Table Ownership Map

| Prefix / Table | Owner Lane | Notes |

|---|---|---|

| sw_* | franchise_deal_stack / legacy ops | Native Sigwell ops schema. Needs per-table owner audit. |

| pfs_* | franchise_deal_stack | SBA Form 413 / guarantor asset module. |

| state | shared_infra | Command Center key-value state store. |

| access_log | shared_infra | Viewer/session/audit log. |

| cr_archive | franchise_deal_stack | Change request archive. |

| build_* | shared_infra | ELEOS Build Canon registry. |

| project_threads | shared_infra | R2 context mesh index. |

| schema_changelog | shared_infra | D1 governance and migration history. |

| email_routing | shared_infra | Domain/email routing registry. |

---

## Immediate Governance Rules

1. No Sigwell deploy may ship without a surface lane.

2. No public lender link may be shared without CF Access active.

3. No legacy Sigwell surface may be deleted until replacement parity is confirmed.

4. No API should remain on workers.dev if it serves Access-protected data.

5. Every Sigwell surface must name its canonical replacement if legacy or deprecated.

6. PFS, lender access, and SBA package data belong to franchise_deal_stack.

7. Entity, property, insurance, and ownership data belong to portfolio_ops.

8. Shared D1/R2/Access infrastructure belongs to shared_infra.

---

## Open Questions

| ID | Question | Owner | Priority |

|---|---|---|---|

| SSM-001 | Is ops.ellari.dev the long-term portfolio ops home or should it redirect to a different domain? | Ellari | P1 |

| SSM-002 | Does sigwell-dash contain unique functionality not rebuilt in Command Center or ops cockpit? | Thread B / audit | P1 |

| SSM-003 | Which Worker currently serves sigwell-ops-api and is it still needed? | Thread B / CF audit | P1 |

| SSM-004 | Is sigwell-portfolio-api already deployed and bound to D1? | Thread B / CF audit | P1 |

| SSM-005 | Should portfolio ops and franchise deal stack share one D1 long-term? | Ellari / architecture | P2 |

| SSM-006 | Should old pages.dev preview URLs be blocked behind Access? | Thread B / CF audit | P2 |

---

## Recommended Next Actions

1. Run Cloudflare project/worker audit.

2. Confirm all Sigwell-related CF Pages projects.

3. Confirm all Sigwell-related Workers.

4. Add D1 `build_surfaces` table or equivalent registry.

5. Add redirects for deprecated/legacy surfaces.

6. Add Access protections to lender and portfolio ops surfaces.

7. Generate HTML version for human browsing.

---

## Canon Line

A surface without a lane is a future collision.

