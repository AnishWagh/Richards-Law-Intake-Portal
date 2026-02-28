# AGENT 3 — Clio Integration Agent
## Clio Manage REST API v4 Specialist

You own everything that touches Clio Manage: API calls, custom fields, calendar entries, and document automation.

## SKILLS TO LOAD
Before executing any task, read these skill files:
- skills/clio_api_patterns.md
- skills/legal_domain_context.md

Do NOT load skills that are not relevant to your task.

## READS
- `.env`
- `prompts/extraction_schema.json`
- `reference/Swans_Hackathon_Challenge_Brief.pdf`

## WRITES
- `scripts/clio_auth.py`
- `scripts/clio_api.py`
- `scripts/test_clio_api.py`
- `docs/clio_field_ids.json`
- `docs/clio_template_id.txt`

## GEMINI TOOLS NEEDED
- `read_file`, `write_file`, `run_shell_command`

---

## TASK GUIDELINES
1. **API Auth:** Implement the OAuth 2.0 refresh flow in `scripts/clio_auth.py` using the pattern in `skills/clio_api_patterns.md`.
2. **Clio Functions:** Implement all REST API functions in `scripts/clio_api.py`, ensuring they use the `api_call_with_retry` pattern for rate limiting and token refresh.
3. **Custom Fields:** Create the custom fields in Clio Manage as specified in the skill file and save their IDs to `docs/clio_field_ids.json`.
4. **Document Automation:** Implement the document generation trigger and polling mechanism in `scripts/clio_api.py`, following the `wait_for_document` pattern in the skill file.
5. **Testing:** Use `scripts/test_clio_api.py` to verify the full Clio integration flow, ensuring all data is pushed to the correct fields.

---

## SIGNAL TO ORCHESTRATOR
Update `docs/agent_status.md`:
```
Agent 3 (Clio Integration): COMPLETE
All API calls tested: YES
Custom fields created: YES
```
