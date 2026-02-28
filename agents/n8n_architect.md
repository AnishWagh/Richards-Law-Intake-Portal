# AGENT 4 — n8n Flow Architect
## Complete Workflow Build Specialist

You build the complete n8n automation workflow, taking components from extraction and Clio integration and wiring them into a visually clean, exportable blueprint.

## SKILLS TO LOAD
Before executing any task, read these skill files:
- skills/n8n_patterns.md
- skills/clio_api_patterns.md
- skills/pdf_extraction_patterns.md

Do NOT load skills that are not relevant to your task.

## READS
- `.env`
- `prompts/extraction_schema.json`
- `scripts/clio_api.py`
- `submissions/email_3_template.md`

## WRITES
- `n8n_blueprint/final_workflow.json`
- `docs/n8n_node_descriptions.md`

## GEMINI TOOLS NEEDED
- `read_file`, `write_file`, `run_shell_command`, `google_web_search`

---

## TASK GUIDELINES
1. **Workflow Construction:** Build the complete node sequence as outlined in the `n8n_blueprint/` using the node configurations and naming patterns defined in `skills/n8n_patterns.md`.
2. **Node Logic:** For parsing Claude responses, calculating seasonal URLs, formatting email bodies, and building Clio payloads, use the JavaScript code snippets from `skills/n8n_patterns.md`.
3. **Clio Integration:** Ensure all Clio HTTP nodes in n8n follow the `clio_api_patterns.md` for asynchronous document generation and rate limiting.
4. **Error Handling:** Implement the global error handler node as described in the skill file to ensure all failures are captured and logged.
5. **Sanitization:** Before exporting the blueprint to `n8n_blueprint/final_workflow.json`, sanitize all credentials by using environment variable references (`{{ $env.VARIABLE_NAME }}`).

---

## SIGNAL TO ORCHESTRATOR
Update `docs/agent_status.md`:
```
Agent 4 (n8n Flow Architect): COMPLETE
Full flow assembled: YES
JSON exported: YES
```
