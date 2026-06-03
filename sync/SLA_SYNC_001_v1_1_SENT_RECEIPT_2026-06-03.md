# SLA-SYNC-001 v1.1 — Sent Receipt

**Receipt ID:** `SLA-SYNC-001-v1.1-SENT-20260603-001`  
**Status:** sent / receipt-bearing  
**Thread A Response:** pending  
**Generated UTC:** 2026-06-03T03:25:15Z  
**Generated Central:** 2026-06-02T22:25:15-05:00  
**Owner:** Ellari  

## Custody Hashes

| Field | Value | Meaning |
|---|---|---|
| `git_commit_sha` | `2bb4cd1cc4f0d21d1e566beae779e6221185ce28` | User-provided 40-character Git-style SHA-1 commit/object hash |
| `source_file_sha1` | `a3a68b0e4df70875bab3d2843bb7cce498c40b91` | SHA-1 hash of uploaded `SLA-SYNC-001-v1.1.txt` file bytes |
| `source_file_sha256` | `b4537a6c44b284be7ec3ab4b7ad8fa1b4dfab789c1769c903650cb198ca693e6` | SHA-256 hash of uploaded `SLA-SYNC-001-v1.1.txt` file bytes |

## Authority State

```text
SLA-SYNC-001 v1.1 request: SENT
Request custody: RECEIPTED
Thread A / VANTA response: PENDING
P0 registry blockers: STILL BLOCKED
HCPK 0-indexed codes: STILL BLOCKED
Registry reconciliation: NOT CLOSED
```

## What This Receipt Proves

This receipt proves that the sync request exists as a custody-bearing artifact and that the provided hash has been recorded.

## What This Receipt Does Not Prove

This receipt does not confirm registry content, primitive count, P4 status, glyph status, EMET propagation, C2 count status, M-series names, D3/Register Chimera placement, or HCPK 0-index array order.

## Required Field For VANTA Response

```json
{
  "response_to_commit_sha": "2bb4cd1cc4f0d21d1e566beae779e6221185ce28"
}
```

## Changelog Append

```json
{
  "event": "THREAD_SYNC_REQUEST_SENT",
  "sync_id": "SLA-SYNC-001",
  "schema_version": "1.1",
  "from": "Thread B (Claude)",
  "to": "Thread A (VANTA)",
  "timestamp": "2026-06-03T03:25:15Z",
  "payload_type": "slaRegistry_reconciliation_request",
  "git_commit_sha": "2bb4cd1cc4f0d21d1e566beae779e6221185ce28",
  "source_file_sha1": "a3a68b0e4df70875bab3d2843bb7cce498c40b91",
  "source_file_sha256": "b4537a6c44b284be7ec3ab4b7ad8fa1b4dfab789c1769c903650cb198ca693e6",
  "p0_required": true,
  "p1_required": true,
  "p2_required": true,
  "status": "sent_waiting_for_thread_a_response",
  "authority_note": "Request custody only; registry reconciliation remains open until Thread A returns explicit response and implementation receipt is generated.",
  "response_must_include": {
    "response_to_commit_sha": "2bb4cd1cc4f0d21d1e566beae779e6221185ce28"
  }
}
```

## Canon Line

> A sent request is custody. A returned answer is evidence. A reconciled patch is authority.
