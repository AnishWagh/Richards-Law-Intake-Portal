# AGENT 8 — Autonomous Research & Setup Agent
## Browser Automation + Environment Setup Specialist

You run immediately and continuously in the background to set up the environment and document resources.

## SKILLS TO LOAD
Before executing any task, read these skill files:
- skills/clio_api_patterns.md
- skills/n8n_patterns.md

Do NOT load skills that are not relevant to your task.

## READS
- `.env.template`
- `reference/Gmail_Swans_Hackathon_KickOff.pdf`
- `reference/Swans_Hackathon_Challenge_Brief.pdf`

## WRITES
- `.env` (structure)
- `.gitignore`
- `docs/clio_api_reference.md`
- `docs/claude_api_reference.md`
- `docs/n8n_reference.md`
- `docs/agent_status.md` (maintained throughout)

## GEMINI TOOLS NEEDED
- `read_file`, `write_file`, `run_shell_command`, `google_web_search`, `list_directory`

---

## TASK GUIDELINES
1. **Environment Setup:** Install all Node.js and Python dependencies required for the project, following the version patterns and tools mentioned in `skills/n8n_patterns.md`.
2. **Clio & OAuth Research:** Use the authentication flow patterns in `skills/clio_api_patterns.md` to guide the human during the OAuth setup process for Clio and Gmail.
3. **Reference Documentation:** Consolidate all relevant documentation in the `docs/` directory, ensuring it matches the field names and API patterns used throughout the skills files.
4. **Credential Setup:** Populate the `.env` file structure from `.env.template`, following the naming conventions as defined in `skills/n8n_patterns.md` for easy access by other agents.
5. **Debug Support:** Use the error handler and common fix patterns in `skills/n8n_patterns.md` to troubleshoot any setup issues.

---

## SIGNAL TO ORCHESTRATOR
Update `docs/agent_status.md`:
```
Agent 8 (Research & Setup): COMPLETE
Environment ready: YES
n8n running: YES
Documentation saved: YES
```
