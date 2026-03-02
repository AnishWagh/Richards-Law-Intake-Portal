# Decisions and Assumptions Log

## Technical Decisions

### [DECISION] Claude 3.5 Sonnet for Extraction
**Type:** Decision
**Source:** Project Design / Skills (`pdf_extraction_patterns.md`)
**Detail:** Use Claude 3.5 Sonnet Vision via the Messages API for extracting structured JSON from scanned PDF reports.
**Impact if wrong:** Extraction accuracy for messy/scanned text would drop, leading to manual data entry overhead.
**Owner:** Agent 2 (Doc Intelligence)
**Status:** Confirmed

### [DECISION] n8n for Orchestration
**Type:** Decision
**Source:** Tech Stack (`tech-stack.md`)
**Detail:** n8n chosen as the primary workflow engine over Make.com for its flexibility, local execution, and advanced Code node capabilities.
**Impact if wrong:** Workflow complexity might become unmanageable; harder to implement custom Python/JS logic.
**Owner:** Agent 4 (n8n Architect)
**Status:** Confirmed

### [DECISION] 8-Second Wait for Document Generation
**Type:** Constraint / Decision
**Source:** Skills (`clio_api_patterns.md`)
**Detail:** A 15-second wait node (increased from 8 based on risk audit) will be used in n8n after triggering Clio document automation.
**Impact if wrong:** Document may not be "processed" yet, causing the download/email step to fail with a 404.
**Owner:** Agent 4 (n8n Architect)
**Status:** Confirmed (Updated to 15s)

### [DECISION] OAuth Refresh in Python
**Type:** Decision
**Source:** Skills (`clio_api_patterns.md`)
**Detail:** Implement automatic token refresh within the Python helper scripts using `CLIO_REFRESH_TOKEN` from `.env`.
**Impact if wrong:** Scripts will fail after 1 hour (default Clio token lifetime) during the demo or judge review.
**Owner:** Agent 3 (Clio Integration)
**Status:** Confirmed

## Legal & Business Assumptions

### [ASSUMPTION] Statute of Limitations = 8 Years
**Type:** Constraint / Assumption
**Source:** Client Email / Hackathon Brief (`Swans_Hackathon_Challenge_Brief.pdf`)
**Detail:** Andrew explicitly requested 8 years from the accident date. Standard NY PI SOL is 3 years. We will use 8 years as instructed.
**Impact if wrong:** The firm faces a massive legal malpractice risk if a true SOL is shorter and we calendar it later.
**Owner:** Orchestrator
**Status:** Confirmed (Documented as client-driven)

### [ASSUMPTION] Client = The Injured Party
**Type:** Assumption
**Source:** Legal Domain (`legal_domain_context.md`)
**Detail:** We assume the firm represents the party that was struck or injured (Pedestrian, Bicyclist, or Vehicle 2 in a rear-end).
**Impact if wrong:** The extraction will identify the "Opposing Party" as the client, leading to a retainer being sent to the wrong person.
**Owner:** Agent 2 (Doc Intelligence)
**Status:** Confirmed (Mitigated by HITL)

### [ASSUMPTION] Pre-existing Contact Record
**Type:** Constraint / Assumption
**Source:** Section 5 Clarifications (`Swans_Hackathon_Challenge_Brief.pdf`)
**Detail:** The Potential New Client already exists in Clio as a Contact with the hackathon submission email address before the police report is processed.
**Impact if wrong:** The flow will fail to find the contact by email, or create a duplicate if not handled correctly.
**Owner:** Agent 3 (Clio Integration)
**Status:** Confirmed

## Hackathon-Specific Constraints

### [CONSTRAINT] "Only One Submission per Email"
**Type:** Constraint
**Source:** Expected Delivery (`Swans_Hackathon_Challenge_Brief.pdf`)
**Detail:** The final evaluated submission is based on a single trigger of the automation for Email #3.
**Impact if wrong:** If we trigger it early with errors, we cannot "re-submit" the automation output.
**Owner:** Orchestrator
**Status:** Confirmed

### [CONSTRAINT] Clio Document Automation is REQUIRED
**Type:** Constraint
**Source:** Section 5 Clarifications (`Swans_Hackathon_Challenge_Brief.pdf`)
**Detail:** The retainer PDF MUST be generated using Clio's native document automation feature.
**Impact if wrong:** Points will be lost for not following technical constraints; firm loses native audit trail.
**Owner:** Agent 3 (Clio Integration)
**Status:** Confirmed

## Unknown / Unresolved

### [UNKNOWN] Actual Scheduling Link URLs
**Type:** Unknown
**Source:** Brief (Hyperlinks only)
**Detail:** The actual URL strings for `in-office scheduling link` and `virtual scheduling link` are unknown.
**Impact:** HIGH - Emails will contain broken or placeholder links.
**Action:** Extract from original PDF hyperlinks or ask user to provide.

### [UNKNOWN] Clio Attorney ID for Andrew Richards
**Type:** Unknown
**Source:** Clio Setup
**Detail:** We need the specific UUID of the Andrew Richards user in Clio to assign the calendar entry.
**Impact:** MEDIUM - SOL entry will be created but assigned to the default user, not Andrew.
**Action:** Agent 8 to retrieve via `/users/who_am_i`.

### [UNKNOWN] Retainer Template ID
**Type:** Unknown
**Source:** Clio Setup
**Detail:** The specific ID of the uploaded retainer template in Clio Manage.
**Impact:** HIGH - Document automation cannot be triggered without it.
**Action:** Agent 3 to retrieve from Clio UI URL once uploaded.
