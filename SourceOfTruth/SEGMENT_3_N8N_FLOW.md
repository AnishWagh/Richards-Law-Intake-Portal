# SEGMENT 3 — N8N FLOW BUILD
# Prerequisite: Segments 1 and 2 complete
# Time estimate: 3–4 hours
# Human involvement: Review verification form, approve flow

---

## WHAT THIS SEGMENT DELIVERS

By the end of Segment 3, ALL of these must be true:
- [ ] n8n running at localhost:5678
- [ ] All 21 nodes built and named correctly
- [ ] Webhook accepts PDF upload and returns response
- [ ] Claude extraction node working inside n8n
- [ ] Verification form displays correctly
- [ ] Clio PATCH updates matter fields correctly
- [ ] SOL calendar entry created correctly
- [ ] Document automation triggered and polled
- [ ] Seasonal URL logic working
- [ ] Email sends with PDF attached
- [ ] Error handling on all critical nodes
- [ ] n8n_blueprint/final_workflow.json exported

---

## PROMPT TO START SEGMENT 3

```
Read SOURCE_OF_TRUTH.md Section 8 (N8N Flow Node Sequence),
skills/n8n_patterns.md, and skills/clio_api_patterns.md before starting.

We are now in Segment 3: N8N Flow Build.

IMPORTANT: Read prompts/extraction_schema.json first.
The schema locked in Segment 2 is the contract for all nodes.

## TASK 3.1 — VERIFY N8N IS RUNNING

```bash
# Check if n8n is running
curl -s http://localhost:5678/healthz

# If not running, start it:
n8n start
```

Get the n8n API key from UI: Settings > API > Create key
Save as N8N_API_KEY in .env

## TASK 3.2 — SET ENVIRONMENT VARIABLES IN N8N

In n8n UI: Settings > Environment Variables
Add all variables from .env that nodes will need:
- ANTHROPIC_API_KEY
- CLIO_ACCESS_TOKEN
- CLIO_MATTER_ID
- CLIO_TEMPLATE_ID
- CLIO_ATTORNEY_ID
- All CLIO_FIELD_ID_* variables
- BOOKING_LINK_IN_OFFICE
- BOOKING_LINK_VIRTUAL

Also add the extraction prompt as an environment variable:
EXTRACTION_PROMPT = [paste full content of prompts/pdf_extraction_prompt.md]

## TASK 3.3 — BUILD THE FLOW

Build all nodes from SOURCE_OF_TRUTH.md Section 8.
Use the exact node names listed there.
Use code snippets from skills/n8n_patterns.md.

Build in this order:
1. Node 01 (Webhook) → test it accepts POST
2. Node 02 (Claude HTTP) → test with GUILLERMO_REYES base64
3. Node 03 (Parse Code) → test JSON parsing
4. Node 04 (Form) → test verification form displays
5. Node 05 (IF) → test both approval and rejection paths
6. Nodes 06-08 (Clio update + fetch) → test field update
7. Node 09 (Calendar) → test SOL entry creation
8. Nodes 10-13 (Document automation) → test full generation
9. Nodes 14-15 (Seasonal URL + Email compose) → test logic
10. Node 16 (Gmail send) → test email delivery
11. Nodes 17-19 (Responses) → test webhook responses
12. Nodes 20-21 (Error handler) → test error capture

## TASK 3.4 — VERIFICATION FORM CONFIGURATION

The n8n Form node (Node 04) must:
- Title: "Review Extracted Police Report Data"
- Pre-fill all fields from Node 03 output
- Show a warning banner for low_confidence_fields
- Show missing_fields in red
- Include approval_status dropdown: Approve / Reject
- Include reviewer_notes textarea (optional)

Reference agents/n8n_architect.md Node 5 section for full spec.

⚠️ HUMAN ACTION REQUIRED:
After building Node 04, run a test submission through the webhook
up to the form node. The form will pause waiting for input.
Open the form URL and verify all fields display correctly.
Tell me if anything looks wrong before I wire the approval path.

## TASK 3.5 — TEST THE COMPLETE HAPPY PATH

Run a full end-to-end test:

```bash
# Encode GUILLERMO_REYES as base64
PDF_B64=$(base64 -i "ClientReports/GUILLERMO_REYES_v_LIONEL_FRANCOIS_et_al_EXHIBIT_S__XX.pdf")

# Trigger the webhook
curl -X POST http://localhost:5678/webhook/police-report-intake \
  -H "Content-Type: application/json" \
  -d "{
    \"matter_id\": \"${CLIO_MATTER_ID}\",
    \"pdf_base64\": \"${PDF_B64}\"
  }"
```

Then:
1. Open the verification form URL from the curl response
2. Review the pre-filled fields
3. Click Approve
4. Verify in Clio UI that custom fields are populated
5. Verify SOL calendar entry appears in Clio
6. Check that retainer document appears in Clio Documents
7. Check that email arrives at the automation email address

DO NOT send to the actual automation email address yet.
Use a test email address for all testing until the final submission.

## TASK 3.6 — TEST THE REJECTION PATH

Run the webhook again, but this time click Reject in the form.
Verify:
- No data pushed to Clio
- No calendar entry created
- No document generated
- No email sent
- Webhook returns rejection response

## TASK 3.7 — EXPORT THE BLUEPRINT

When the flow is complete and tested:
1. n8n UI > Open workflow
2. Three dots menu > Download
3. Save as n8n_blueprint/final_workflow.json

Verify the JSON:
- No hardcoded API keys (should all be {{ $env.VARIABLE }})
- All 21 nodes present
- All nodes have descriptive names (not "HTTP Request 1")

## SEGMENT 3 COMPLETION CRITERIA

- [ ] Full happy path tested and working
- [ ] Rejection path tested and working
- [ ] All Clio data verified correct after test run
- [ ] Email received with correct content
- [ ] n8n_blueprint/final_workflow.json exported and clean
- [ ] Update SOURCE_OF_TRUTH.md Section 13 checkboxes
- [ ] Commit: "feat(n8n): Complete n8n automation flow, all paths tested"
```
