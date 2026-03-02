# System Audit

## Contradictions

- **SOL Rule:** `skills/legal_domain_context.md` mentions NY SOL is 3 years but Andrew wants 8. This is also documented in `docs/hackathon_brief_summary.md`. **Resolution:** We must use 8 years as it's a direct client requirement.
- **Node Naming:** `skills/n8n_patterns.md` gives very specific naming patterns. `agents/n8n_architect.md` should be verified against these patterns.
- **Model Version:** `agents/doc_intelligence.md` and `skills/pdf_extraction_patterns.md` use `claude-3-5-sonnet-20240620`. This is consistent.

## Gaps

- **Paralegal Verification Form:** Described in `agents/n8n_architect.md` and `skills/pdf_extraction_patterns.md` (Step 7), but the exact HTML/UI of the form is not defined anywhere.
- **Rejection Path:** `agents/n8n_architect.md` (Step 6) mentions a rejection path but doesn't define the final action (e.g., email notification to paralegal, Slack alert, etc.).
- **Error Handling:** `skills/n8n_patterns.md` defines a global error handler, but specific retry logic for Clio API or Claude API is only described in code snippets, not integrated into the n8n node plan yet.
- **Async Document Polling:** Described in `skills/clio_api_patterns.md` but not fully specified in the `agents/n8n_architect.md` node sequence. It needs to be explicitly handled in n8n.
- **OAuth Expiration:** `skills/clio_api_patterns.md` describes a refresh flow in Python, but we need to ensure n8n also handles this or uses a static long-lived token if possible during the hackathon.

## Environment Variable Discrepancies

- **`.env.template` Check:**
    - `ANTHROPIC_API_KEY`: OK
    - `CLIO_CLIENT_ID`: OK
    - `CLIO_CLIENT_SECRET`: OK
    - `CLIO_ACCESS_TOKEN`: OK
    - `CLIO_REFRESH_TOKEN`: OK
    - `GMAIL_CLIENT_ID`: OK
    - `GMAIL_CLIENT_SECRET`: OK
    - `GMAIL_ACCESS_TOKEN`: OK
    - `GMAIL_REFRESH_TOKEN`: OK
    - `CLIO_FIELD_ID_ACCIDENT_DATE` (and others): OK, needed for mapping.
    - `BOOKING_LINK_IN_OFFICE` & `BOOKING_LINK_VIRTUAL`: OK.

## Edge Cases

- **Claude Returns Null:** Handled in `skills/n8n_patterns.md` (Step 5 - Pattern 1) where missing fields are flagged for the paralegal review.
- **Leap Year SOL:** `skills/legal_domain_context.md` recommends `relativedelta` for Python. Need to ensure n8n's JavaScript handles this correctly as well.
- **Seasonal Link Transition:** February 28 to March 2. Mar 1 is the switch date. This will be a critical test case.
- **Large PDF Encoding:** Webhook payload size limits in n8n need to be checked if using `n8n start --tunnel`.

## Undocumented Assumptions

- **Client Identity:** We assume the "Client" is always the injured party (Vehicle 2, Pedestrian, or Bicyclist).
- **Attorney ID:** We assume the Matter is already assigned to Andrew Richards, but we need his `attorney_id` to create the SOL calendar entry.
- **Retainer Template ID:** We assume the template exists and its ID is known.
- **Email Delivery:** We assume the judge/reviewer has access to the `talent.legal-engineer.hackathon.automation-email@swans.co` inbox to verify Email #3.

## Timing Risks

- **Clio API:** 10 requests/sec limit.
- **Document Generation:** Takes 2-10 seconds. The 8-second Wait node in n8n is a risk if generation takes longer.
- **Paralegal Verification:** This is a blocking step. If the form is not submitted, the flow stops. This must be highlighted to the judge.
