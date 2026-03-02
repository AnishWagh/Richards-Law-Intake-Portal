# Risk Register

| Risk | Likelihood | Impact | Mitigation | Owner |
|---|---|---|---|---|
| **Clio Custom Field Mismatch:** Template merge fields do not match custom field names exactly. | **Medium** | **High** | Double-check every field name case-sensitivity between Clio Settings and Document Template. Use `skills/clio_api_patterns.md` for exact mapping. | **Agent 3 (Clio Integration)** |
| **Claude Extraction Failure:** AI fails to extract correctly from `GUILLERMO_REYES` (demo case). | **Low** | **Critical** | Perform manual prompt tuning specifically against this report. Ensure the prompt handles "Same Dir" and "Vehicle 1" vs "Vehicle 2". | **Agent 2 (Doc Intelligence)** |
| **OAuth Token Expiration:** Clio/Gmail tokens expire during judge evaluation or video demo. | **High** | **High** | Implement automatic refresh logic in all scripts. Verify tokens are refreshed *before* the demo starts. | **Agent 3 (Clio Integration)** |
| **n8n Webhook Accessibility:** Local n8n instance is not reachable via `--tunnel` for judge testing. | **Medium** | **High** | Test the webhook from an external device. Use a reliable tunnel provider or a cloud n8n instance if possible. | **Agent 4 (n8n Architect)** |
| **Seasonal Link Logic Error:** Wrong link sent on Feb 28 - March 2 transition. | **Medium** | **Medium** | Unit test the n8n Code node logic with mock dates for Feb 28, March 1, and March 2. | **Agent 4 (n8n Architect)** |
| **PDF Base64 Payload Size:** scanned PDF too large for webhook/memory. | **Low** | **Medium** | Check n8n `N8N_PAYLOAD_SIZE_MAX` environment variable. Keep reports under 5MB. | **Agent 8 (Research & Setup)** |
| **Paralegal Form Blocking:** Judge cannot access the internal n8n Form to trigger the flow. | **High** | **High** | Provide a temporary public link to the form or record a video of the HITL step being completed. | **Agent 7 (Technical Writer)** |
| **SOL Calculation Error:** Leap year math off by one day. | **Low** | **Medium** | Use `relativedelta` or a robust date library in both Python and n8n JavaScript. | **Agent 6 (QA & Reliability)** |
| **Clio US Region Error:** Using EU/CA account accidentally. | **Low** | **High** | Verify URL is `app.clio.com`, not `eu.app.clio.com` or `ca.app.clio.com`. | **Agent 8 (Research & Setup)** |
| **Retainer Generation Timeout:** Wait node in n8n finishes before Clio is done. | **Medium** | **High** | Implement a retry/polling loop in n8n instead of a single fixed-interval Wait node. | **Agent 4 (n8n Architect)** |
