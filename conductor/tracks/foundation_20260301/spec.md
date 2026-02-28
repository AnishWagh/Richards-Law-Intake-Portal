# Track Specification: Phase 1 Foundation

## Goal
Establish a robust development and execution environment, finalize the core AI extraction logic for NYC Police Accident Reports (MV-104AN), and initiate formalized logging for technical decisions and business assumptions.

## Technical Context
- **Orchestration:** n8n (local instance).
- **Extraction:** Anthropic Claude-3.5-Sonnet Vision.
- **Data Source:** Sample PDFs in `ClientReports/`.
- **Integrations:** Initial structure for Clio Manage and Gmail API.

## Requirements
1. **Environment Verification:** Ensure Node.js, n8n, and Python dependencies are correctly installed and configured.
2. **Credential Management:** Establish a secure `.env` structure with placeholders for all required API keys.
3. **AI Extraction Refinement:** Finalize the `prompts/pdf_extraction_prompt.md` and `prompts/extraction_schema.json` based on the analysis of provided sample reports.
4. **Extraction Validation:** Implement a Python-based testing script to verify extraction accuracy and confidence flagging.
5. **Governance:** Initialize `docs/assumptions.md` and `docs/architecture.md` with initial findings and decisions (e.g., the 8-year SOL rule).

## Success Criteria
- n8n is running locally and accessible.
- `.env` contains all necessary keys (even if blank).
- Claude API correctly extracts JSON from a sample report with >90% accuracy on core fields.
- `docs/assumptions.md` correctly logs the SOL decision.
- All track tasks pass the TDD workflow and quality gates.
