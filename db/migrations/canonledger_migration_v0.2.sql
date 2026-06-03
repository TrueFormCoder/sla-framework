-- canonledger_migration_v0.2.sql
-- CanonLedger D1 Schema → Harness v5.1 Quorum Attestation Upgrade
-- Version: 0.2
-- Owner: Ellari Institute
-- Date: 2026-06-03
--
-- PURPOSE:
--   Adds external witness fields to canon_ledger per HARNESS_GOVERNANCE_BRIDGE_v0.1.
--   Existing entries start at quorum_state='local_green' — they are not invalidated,
--   they are accurately labeled.
--
-- GOVERNANCE PRINCIPLE ENCODED:
--   "Authority requires external witness. Self-certification is QOL ceiling maximum."
--   quorum_state maps to SLA fidelity tiers:
--     local_green    = QOL  (self-certified only)
--     witnessed_green = DAVAR (at least one external attestation)
--     quorum_green   = EMET  (threshold attestations met)
--
-- APPLY TO: Cloudflare D1 database (eleos-state)
-- WORKER:   sla-artifacts-api.ellari.workers.dev
--
-- PRE-FLIGHT CHECKLIST:
--   [ ] Back up existing canon_ledger table
--   [ ] Confirm D1 database ID in wrangler.toml
--   [ ] Test on staging before production
--   [ ] Verify Worker still reads entries after migration (nulls are handled)

-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 1: Add witness_nodes column
-- Stores JSON array of thread/reviewer IDs that have attested this entry.
-- Format: ["Thread_A_VANTA", "Thread_B_Claude", "Reviewer_<id>"]
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE canon_ledger
  ADD COLUMN witness_nodes TEXT NOT NULL DEFAULT '[]';

-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 2: Add quorum_id column
-- References the quorum event that confirmed promotion, if any.
-- Format: "QUORUM-{YYYYMMDD}-{SEQ}" or NULL if self-certified only.
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE canon_ledger
  ADD COLUMN quorum_id TEXT;

-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 3: Add attestation_hash column
-- SHA-256 hash of the combined attestation record.
-- NULL until external witness is present.
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE canon_ledger
  ADD COLUMN attestation_hash TEXT;

-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 4: Add quorum_state column
-- Maps to SLA fidelity tiers and Harness v5.1 trust states.
-- All existing entries default to 'local_green' — accurate, not degraded.
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE canon_ledger
  ADD COLUMN quorum_state TEXT NOT NULL DEFAULT 'local_green'
  CHECK (quorum_state IN (
    'local_green',       -- SLA: QOL   | Harness: Local Green
    'witnessed_green',   -- SLA: DAVAR | Harness: Witnessed Green
    'quorum_green',      -- SLA: EMET  | Harness: Quorum Green
    'disputed_amber',    -- SLA: DAVAR ceiling frozen | Harness: Disputed Amber
    'frozen_red',        -- SLA: BLOCKED | Harness: Frozen Red
    'revoked_black'      -- SLA: BLOCKED + WEAP-001 | Harness: Revoked Black
  ));

-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 5: Create quorum_events table (new)
-- Records each quorum event that affected canon_ledger entries.
-- Append-only: do not UPDATE or DELETE rows.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS quorum_events (
  id              TEXT PRIMARY KEY,
  -- Format: QUORUM-{YYYYMMDD}-{SEQ}

  canon_entry_id  TEXT NOT NULL REFERENCES canon_ledger(id),
  -- The CanonLedger entry this quorum event governs

  event_type      TEXT NOT NULL
    CHECK (event_type IN (
      'witness_confirmation',   -- external attestation received
      'promotion_to_davar',     -- witnessed_green threshold met
      'promotion_to_emet',      -- quorum_green threshold met
      'dispute_opened',         -- challenge filed
      'dispute_resolved',       -- challenge resolved
      'freeze_applied',         -- frozen_red state applied
      'revocation'              -- revoked_black state applied
    )),

  initiating_thread   TEXT NOT NULL,
  -- 'Thread_A_VANTA' | 'Thread_B_Claude' | 'External_<id>'

  attesting_nodes TEXT NOT NULL DEFAULT '[]',
  -- JSON array of nodes that contributed to this quorum event

  quorum_threshold    TEXT,
  -- '2/3' | '3/5' | '5/7' etc — NULL for single-witness events

  quorum_passed       INTEGER,
  -- 1 = passed, 0 = failed, NULL = pending

  payload_hash        TEXT,
  -- SHA-256 of the governance payload that triggered this event

  dispute_id          TEXT,
  -- References dispute_records.id if this is a dispute event

  created_at          TEXT NOT NULL DEFAULT (datetime('now')),

  notes               TEXT
);

-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 6: Create dispute_records table (new)
-- Formal challenges that can freeze promotion.
-- Maps to Governance Debt Register items with severity:critical.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS dispute_records (
  id                TEXT PRIMARY KEY,
  -- Format: DISPUTE-{YYYYMMDD}-{SEQ}

  canon_entry_id    TEXT REFERENCES canon_ledger(id),
  -- NULL if the dispute covers the entire registry (e.g. count discrepancy)

  challenger        TEXT NOT NULL,
  -- Thread ID, reviewer ID, or 'Ellari'

  reason            TEXT NOT NULL,
  -- Plain-language description of the challenge

  severity          TEXT NOT NULL
    CHECK (severity IN ('low', 'medium', 'high', 'critical')),

  promotion_freeze  INTEGER NOT NULL DEFAULT 0,
  -- 1 = freeze all promotion on this entry until resolved

  status            TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'resolved', 'escalated', 'withdrawn')),

  resolution_type   TEXT
    CHECK (resolution_type IN ('v_correct', 'thread_b_correct', 'ellari_decides', 'withdrawn')),

  resolved_by       TEXT,
  resolved_at       TEXT,
  created_at        TEXT NOT NULL DEFAULT (datetime('now')),
  notes             TEXT
);

-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 7: EMET promotion gate trigger
-- Prevents any entry from reaching quorum_state='quorum_green' without
-- at least one Thread A (VANTA) attestation AND one non-Thread attestation.
-- This is the CORDIA/SIGLER two-signature rule encoded in SQL.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TRIGGER IF NOT EXISTS enforce_emet_quorum
  BEFORE UPDATE OF quorum_state ON canon_ledger
  WHEN NEW.quorum_state = 'quorum_green'
BEGIN
  SELECT CASE
    WHEN json_array_length(NEW.witness_nodes) < 2
    THEN RAISE(ABORT, 'EMET_GATE: quorum_green requires at least 2 witness nodes')
    WHEN NEW.quorum_id IS NULL
    THEN RAISE(ABORT, 'EMET_GATE: quorum_green requires a quorum_id')
    WHEN NEW.attestation_hash IS NULL
    THEN RAISE(ABORT, 'EMET_GATE: quorum_green requires an attestation_hash')
  END;
END;

-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 8: DAVAR promotion gate trigger
-- Prevents witnessed_green without at least one witness node.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TRIGGER IF NOT EXISTS enforce_davar_witness
  BEFORE UPDATE OF quorum_state ON canon_ledger
  WHEN NEW.quorum_state = 'witnessed_green'
BEGIN
  SELECT CASE
    WHEN json_array_length(NEW.witness_nodes) < 1
    THEN RAISE(ABORT, 'DAVAR_GATE: witnessed_green requires at least 1 witness node')
  END;
END;

-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 9: Freeze protection trigger
-- Prevents promotion updates on entries with active critical disputes.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TRIGGER IF NOT EXISTS enforce_dispute_freeze
  BEFORE UPDATE OF quorum_state ON canon_ledger
BEGIN
  SELECT CASE
    WHEN EXISTS (
      SELECT 1 FROM dispute_records
      WHERE canon_entry_id = NEW.id
        AND status = 'open'
        AND severity = 'critical'
        AND promotion_freeze = 1
    )
    THEN RAISE(ABORT, 'DISPUTE_FREEZE: critical dispute open — promotion blocked')
  END;
END;

-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 10: Seed EMET promotion criteria view
-- Readable view of what each entry needs to reach each quorum state.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE VIEW IF NOT EXISTS canon_ledger_promotion_status AS
SELECT
  cl.id,
  cl.canon_id,
  cl.title,
  cl.status AS content_status,
  cl.quorum_state,
  CASE cl.quorum_state
    WHEN 'local_green'    THEN 'QOL'
    WHEN 'witnessed_green' THEN 'DAVAR'
    WHEN 'quorum_green'   THEN 'EMET'
    WHEN 'disputed_amber' THEN 'DAVAR (frozen)'
    WHEN 'frozen_red'     THEN 'BLOCKED'
    WHEN 'revoked_black'  THEN 'BLOCKED'
    ELSE                       'UNKNOWN'
  END AS sla_fidelity_tier,
  CASE
    WHEN cl.quorum_state = 'quorum_green' THEN 'EMET-eligible'
    WHEN cl.quorum_state = 'witnessed_green' AND json_array_length(cl.witness_nodes) >= 2 THEN 'Ready for quorum_green'
    WHEN cl.quorum_state = 'local_green' THEN 'Needs external witness'
    ELSE 'Blocked or disputed'
  END AS next_step,
  json_array_length(cl.witness_nodes) AS witness_count,
  cl.quorum_id,
  cl.attestation_hash IS NOT NULL AS has_attestation
FROM canon_ledger cl;

-- ─────────────────────────────────────────────────────────────────────────────
-- ROLLBACK SCRIPT (if migration needs reverting)
-- ─────────────────────────────────────────────────────────────────────────────

-- To rollback:
-- DROP VIEW IF EXISTS canon_ledger_promotion_status;
-- DROP TRIGGER IF EXISTS enforce_dispute_freeze;
-- DROP TRIGGER IF EXISTS enforce_davar_witness;
-- DROP TRIGGER IF EXISTS enforce_emet_quorum;
-- DROP TABLE IF EXISTS dispute_records;
-- DROP TABLE IF EXISTS quorum_events;
-- ALTER TABLE canon_ledger DROP COLUMN quorum_state;
-- ALTER TABLE canon_ledger DROP COLUMN attestation_hash;
-- ALTER TABLE canon_ledger DROP COLUMN quorum_id;
-- ALTER TABLE canon_ledger DROP COLUMN witness_nodes;
-- NOTE: Cloudflare D1 may not support DROP COLUMN directly —
--       if so, recreate the table without the new columns.

-- ─────────────────────────────────────────────────────────────────────────────
-- MIGRATION RECEIPT
-- ─────────────────────────────────────────────────────────────────────────────

-- After running this migration, insert this governance receipt:
-- INSERT INTO quorum_events (
--   id, canon_entry_id, event_type, initiating_thread, attesting_nodes,
--   payload_hash, notes
-- ) VALUES (
--   'QUORUM-20260603-001',
--   'MIGRATION-V0.2',
--   'witness_confirmation',
--   'Thread_B_Claude',
--   '["Thread_B_Claude"]',
--   '[sha256 of this file]',
--   'CanonLedger v0.2 migration — added witness_nodes, quorum_id, attestation_hash, quorum_state. All existing entries set to local_green. EMET now requires quorum_green state.'
-- );
