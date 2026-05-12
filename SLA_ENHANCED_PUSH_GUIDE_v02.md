# SLA Full Push Sequence — Complete Guide v0.2
## Incorporates: sla-artifacts R2, sla-api-proxy Worker, sla-artifacts-api Worker, all fixes

**ISO:** 2026-05-12  
**Replaces:** REPO_PUSH_GUIDE.md (which is still valid for Steps 1–7; this adds Steps 0 and 8–11)  
**Prerequisite:** Have the REPO_PUSH_GUIDE.md open alongside this. Run them in the order below.

---

## Execution order (do in this sequence — deps flow forward)

```
Step A  →  sla-api-proxy deploy       (unblocks what-shape-is-this.html)
Step B  →  sla-artifacts-api deploy   (unblocks R2 upload)
Step C  →  R2 artifact upload         (75 artifacts into sla-artifacts bucket)
Step D  →  Governance vault push      (receipts, tags — before code push)
Step E  →  sla-framework push         (REPO_PUSH_GUIDE.md Steps 0–7, patched)
Step F  →  sigwell-ops-api push       (REPO_PUSH_GUIDE.md Step 7)
Step G  →  what-shape-is-this patch   (update API endpoint in the HTML)
```

---

## STEP A — Deploy sla-api-proxy (10 min)

Fixes the API key exposure blocker before the repo push makes the file public.

```bash
cd ~/path/to/sla_api_proxy    # wherever you saved the Worker files

# Deploy
npx wrangler deploy

# Set the API key (paste when prompted — never in wrangler.toml)
npx wrangler secret put ANTHROPIC_API_KEY

# Optional: rate limiting KV
# npx wrangler kv:namespace create sla-proxy-ratelimit
# Add the id to wrangler.toml, then redeploy

# Test
curl https://sla-api-proxy.ellari.workers.dev/health
# Expected: {"status":"ok","worker":"sla-api-proxy"}
```

Note the live URL: `https://sla-api-proxy.ellari.workers.dev`

---

## STEP B — Deploy sla-artifacts-api (10 min)

```bash
cd ~/path/to/sla_artifacts_worker

npx wrangler deploy
npx wrangler secret put API_KEY    # set a strong random string

# Test
curl https://sla-artifacts-api.ellari.workers.dev/health
# Expected: {"status":"ok","bucket":"sla-artifacts",...}
```

Record the API key — you'll need it for Step C.

---

## STEP C — Upload 75 artifacts to R2 (5 min)

```bash
# The upload script assumes outputs are at $OUTPUTS
# Replace with your actual outputs directory:
export API_KEY=your_sla_artifacts_api_key
export OUTPUTS=/mnt/user-data/outputs    # or ~/Downloads/sla-outputs if you copied them

# Fix the API base URL in the script first
sed -i '' 's|https://sla-artifacts-api.ellari.workers.dev|https://sla-artifacts-api.ellari.workers.dev|g' \
  upload_sla_artifacts.sh

# Run upload
bash upload_sla_artifacts.sh

# Verify
curl "https://sla-artifacts-api.ellari.workers.dev/" \
  -H "X-API-Key: $API_KEY" | python3 -m json.tool | grep '"count"'
# Expected: something close to 75
```

**Important: The fixture files are FLAT in the outputs directory, not in a nested `fixtures/` subdirectory.** The REPO_PUSH_GUIDE.md copy command:
```bash
cp "$SRC/fixtures/v1.6/active/"*.json ...
```
will fail. The actual fixture files are named with their full names at the top level of outputs:
```bash
# Correct copy for fixtures:
cp "$OUTPUTS/f1-valid-coherent-flow.json"              src/contracts/sla/fixtures/v1.6/active/
cp "$OUTPUTS/t3-missing-route-floor-005.json"          src/contracts/sla/fixtures/v1.6/active/
cp "$OUTPUTS/t3-direct-coherence-blocked.json"         src/contracts/sla/fixtures/v1.6/active/
cp "$OUTPUTS/t3-valid-routed-r1.json"                  src/contracts/sla/fixtures/v1.6/active/
cp "$OUTPUTS/nested-massa-no-frame.json"               src/contracts/sla/fixtures/v1.6/active/
cp "$OUTPUTS/public-lane-no-proof-boundaries.json"     src/contracts/sla/fixtures/v1.6/active/
cp "$OUTPUTS/s3-valid-public-proof.json"               src/contracts/sla/fixtures/v1.6/active/
cp "$OUTPUTS/c2-valid-cascade.json"                    src/contracts/sla/fixtures/parked-c2/
```

---

## STEP D — Governance vault push (5 min)

Push before the code push — governance precedes implementation.

```bash
cd "/Users/ellari/Documents/ellari.ai — Governance Vault"

# Add the SLA control packet artifacts that were written to vault this session
git add "PROD-042-SLA/" "ELEOS/"
git add "40 Audit Receipts/"

git commit -m "feat: SLA control packet v0.1/v0.2 + Ifá bridge
- SLA_ISSUE_CODE_REGISTRY_v0.1.md
- SLA_V1_6_PROMOTION_GATE_v0.2.json
- C2_PARKED_FIXTURE_POLICY_v0.1.md
- IFA_SLA_BRIDGE_v0.1.md (updated with Pass 4 triangulation)
- AIRTABLE_PASS4_COLUMN_SPEC_v0.1.md
RESONANCE session artifacts in sla-artifacts R2 bucket (see sla-artifacts-api)"

git tag -a "2026-05-12-sla-control-packet-v0.2" \
  -m "SLA Control Packet v0.2 — all V findings addressed, 0/10 PASSED, ready to push"

git push origin main
git push origin "2026-05-12-sla-control-packet-v0.2"
```

---

## STEP E — sla-framework push (20 min)

Follow REPO_PUSH_GUIDE.md Steps 0–7 with these corrections:

**Correction 1 — Source path.** Replace all occurrences of:
```bash
SRC=~/Downloads
```
with:
```bash
SRC=/mnt/user-data/outputs    # or wherever you saved the Claude outputs
```

**Correction 2 — Fixture copy.** Replace the fixture section with the corrected commands from Step C above.

**Correction 3 — Add vercel.json.** Before committing, add the vercel.json file:
```bash
cp ~/path/to/sla_framework_vercel/vercel.json .
```

**Correction 4 — No API key in what-shape-is-this.html.** Before committing, confirm the HTML uses the proxy endpoint (Step G patches this).

**Add to the commit message:**
```
- vercel.json: /wst route rewrite + CSP headers
- sla-artifacts: R2 bucket live at sla-artifacts-api.ellari.workers.dev
```

**After push, add a git tag:**
```bash
git tag -a "sla-control-packet-v0.2" \
  -m "SLA Control Packet v0.2 — repo push complete, CI baseline set"
git push origin "sla-control-packet-v0.2"
```

---

## STEP F — sigwell-ops-api push

No changes from REPO_PUSH_GUIDE.md Step 7. Run it as written after Step E.

---

## STEP G — Patch what-shape-is-this.html (2 min)

After the proxy is deployed (Step A), update the HTML to use it:

```bash
# In your sla-framework local checkout:
sed -i '' \
  's|https://api.anthropic.com/v1/messages|https://sla-api-proxy.ellari.workers.dev/v1/messages|g' \
  public/what-shape-is-this.html

# Also remove the x-api-key header line from the fetch options:
# Before:
#   "x-api-key": ANTHROPIC_API_KEY,
#   "anthropic-version": "2023-06-01",
#
# After:
#   "anthropic-version": "2023-06-01",
# (key is now added server-side by the proxy)

git add public/what-shape-is-this.html
git commit -m "security: route what-shape-is-this through sla-api-proxy

Removes client-side API key. All Anthropic calls now proxied via
sla-api-proxy.ellari.workers.dev which adds the key server-side."
git push origin main
```

---

## Post-push verification checklist

```
[ ] sla-api-proxy.ellari.workers.dev/health → {"status":"ok"}
[ ] sla-artifacts-api.ellari.workers.dev/health → {"status":"ok"}
[ ] GET sla-artifacts-api.ellari.workers.dev/ → ~75 objects
[ ] sla-framework.vercel.app auto-deploys after push
[ ] /wst route loads what-shape-is-this.html
[ ] what-shape-is-this.html scan runs without console errors
[ ] View source: no "anthropic" or "x-api-key" in the HTML
[ ] Dashboard reads gate JSON: 2/10 PASSED after gate update
[ ] CI checks pass locally
[ ] Governance vault tag pushed
[ ] sla-framework git tag pushed
```

---

## Repo declaration (updated)

```
repo_name:       TrueFormCoder/sla-framework
entity_owner:    Ellari Ventures LLC
ELEOS_tier:      L5
commit_iso:      2026-05-12
linked_domains:  sla.ellari.institute + sla-framework.vercel.app
CF_workers:      sla-api-proxy, sla-artifacts-api
R2_buckets:      sla-artifacts (75 artifacts, ENAM)
D1_db:           eleos-state (receipts via sigwell-ops-api)
proxy_endpoint:  sla-api-proxy.ellari.workers.dev/v1/messages
```
