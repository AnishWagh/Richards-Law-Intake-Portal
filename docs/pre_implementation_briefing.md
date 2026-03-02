# Pre-Implementation Executive Briefing

## CRITICAL FINDINGS (Would break submission if ignored)
- **GUILLERMO REYES Case (Mandatory Demo):** The demo MUST use this specific report. Any failure on this report specifically is a critical risk.
- **Clio Document Automation REQUIRED:** We cannot bypass this with a custom PDF generator. Our solution MUST trigger Clio's native template system and wait for processing.
- **Client Email Not in PDF:** The email address MUST be retrieved from the pre-existing Clio Contact. The PDF only contains names and addresses.
- **HITL is Blocking:** The n8n Form node is a manual step. If a judge tests the webhook, they will be blocked unless they also have access to the verification form URL.

## IMPORTANT FINDINGS (Weaken submission if ignored)
- **SOL Rule (8 Years):** Despite standard NY law (3 years), we MUST use 8 years as per Andrew's instructions. This must be highlighted as a client-specific constraint.
- **Seasonal Link Transition:** We are at the March 1 boundary. The seasonal logic MUST be bulletproof for the Mar-Aug (In-office) vs Sep-Feb (Virtual) switch.
- **Bicyclist/Pedestrian Cases:** 2 of the 5 reports are not vehicle-vs-vehicle. The extraction prompt must find the "Client" in any role (Driver, Pedestrian, or Bicyclist).
- **OAuth Expiration:** Tokens for Clio and Gmail last 1 hour. Automated refresh logic is mandatory for the demo and judge review.

## MINOR FINDINGS (Nice to know, low impact)
- **Scan Quality:** `MARDOCHEE_VINCENT` is the lowest quality scan; it's our "stress test" for extraction.
- **Gender Mis-match:** The `GUILLERMO_REYES` report refers to the driver as "SHE" in the narrative. We should avoid gendered language in the client email to be safe.
- **Double Parking:** The `MARDOCHEE_VINCENT` case mentions the client was double parked. This is a legal detail but irrelevant to our intake automation goal.

## UNRESOLVED ITEMS (Human decision required)
- **Scheduling URLs:** The actual URL strings for in-office and virtual booking are unknown.
- **Clio Attorney ID:** We need Andrew's specific UUID from Clio to correctly assign the SOL calendar entry.
- **Retainer Template ID:** The ID of the uploaded template in Clio is required to trigger document automation.
- **Submission Email Tone:** Need to finalize if the tone for Email #1 should be strictly technical or more business-partnership focused.

## RECOMMENDED CHANGES
1. **n8n Wait Logic:** Change the fixed 8s wait to a polling loop (Step 5 in `skills/clio_api_patterns.md`) to increase robustness.
2. **SOL Documentation:** Explicitly flag the 8-year SOL in the `docs/assumptions.md` as a client-driven constraint.
3. **Prompt Refinement:** Add specific instructions to the extraction prompt to identify Bicyclists and Pedestrians as "Client" if their checkbox is checked.
4. **Agent Status:** Mark `Agent 8` as high priority to retrieve the `CLIO_ATTORNEY_ID` first.

## CLEARED FOR IMPLEMENTATION
The project is cleared for **PHASE 1: FOUNDATION**. The critical risks are identified, and the technical constraints of Clio Manage are understood.
