# SOURCE OF TRUTH
# Swans Applied AI Hackathon — Richards & Law Automation
# Last Updated: 2026-03-01
# This file is the single most important file in the project.
# When in doubt about anything, check here first.

---

## 1. DEADLINE

**Monday, March 2nd 2026 at 6:00 PM CET**
CET = UTC+1, so this is 17:00 UTC / 12:00 PM EST
You have approximately 38 hours from project start.

---

## 2. WHO WE ARE BUILDING FOR

**Client:** Andrew Richards
**Firm:** Richards & Law
**Location:** New York, NY
**Role:** Personal Injury Law Firm Owner
**Problem:** Losing clients because paralegals take 45–70 minutes to
manually enter police report data into Clio Manage.
**Goal:** Reduce intake time to under 3 minutes per case.
**Key metric:** Speed-to-lead — first firm to send a retainer wins the client.

---

## 3. THE THREE SUBMISSION EMAILS

These are the only three outputs that get evaluated.
Send all three from the same email address on the same day.

| # | Send To | Sent By | What It Is |
|---|---|---|---|
| Email 1 | talent.legal-engineer.hackathon.client-email@swans.co | You (manually) | Delivery email to Andrew as his Legal Engineer |
| Email 2 | talent.legal-engineer.hackathon.submission-email@swans.co | You (manually) | Technical submission to Swans judges |
| Email 3 | talent.legal-engineer.hackathon.automation-email@swans.co | Your automation (automatically) | Output of the automation — client onboarding email |

**CRITICAL RULES:**
- Only ONE submission per email address is evaluated
- Email 3 must be sent BY your n8n automation, not manually
- The Contact in Clio must have this email:
  `talent.legal-engineer.hackathon.automation-email@swans.co`
- The demo MUST use the GUILLERMO_REYES report for the final trigger

---

## 4. WHAT THE SYSTEM MUST DO (FUNCTIONAL REQUIREMENTS)

### FR-01: PDF Ingestion
Accept a police report PDF via webhook POST request containing:
- `matter_id` (string) — the existing Clio Matter ID
- `pdf_base64` (string) — the PDF encoded as base64

### FR-02: AI Data Extraction
Use Claude API (claude-opus-4-5) with document vision to extract:
- `client_first_name`
- `client_last_name`
- `accident_date` (YYYY-MM-DD)
- `accident_time` (HH:MM 24h or null)
- `accident_location` (full intersection/address)
- `accident_description` (officer narrative verbatim)
- `opposing_party_name`
- `opposing_party_address` (or null)
- `injuries_sustained`
- `vehicle_info` (or null)
- `reporting_officer` (or null)
- `statute_of_limitations_date` (accident_date + 8 years, YYYY-MM-DD)
- `confidence_flags` (high/medium/low per field)

### FR-03: Human Verification Gate
Present extracted data to a paralegal via n8n Form node.
- All fields must be editable
- Low confidence fields must be visually flagged
- Paralegal can Approve or Reject
- Rejection stops the flow entirely — no data pushed to Clio

### FR-04: Clio Matter Update
After approval, PATCH the existing Clio Matter with extracted data
via custom fields. The matter already exists — do not create a new one.
Custom fields to populate:
- accident_date
- accident_location
- accident_description
- opposing_party_name
- opposing_party_address
- injuries_sustained
- vehicle_info
- statute_of_limitations_date

### FR-05: SOL Calendar Entry
Create a calendar entry in Clio assigned to the Responsible Attorney:
- Title: "⚠️ SOL Deadline — [Client Name]"
- Date: accident_date + exactly 8 years
- All-day event
- Linked to the Matter

### FR-06: Retainer Agreement Generation
MUST use Clio Manage's native document automation feature.
Cannot use a custom PDF generator.
Trigger via Clio API: POST /api/v4/documents with template_id.
Document generation is async — poll for completion before downloading.

### FR-07: Personalized Client Email
Send an email to the Contact's email address in Clio (NOT from the PDF):
- Warm tone — references specific accident date and location
- Brief accident description
- Retainer Agreement attached as PDF
- Seasonal booking link:
  - March–August → in-office scheduling link
  - September–February → virtual scheduling link
- Signed off as Andrew Richards

### FR-08: Seasonal URL Logic
Current date is March 1, 2026 → IN-OFFICE season.
Logic must be dynamic (not hardcoded to current date).
Months 3–8 = in-office, Months 9–2 = virtual.

---

## 5. HARD CONSTRAINTS (CANNOT BE VIOLATED)

| # | Constraint | Source |
|---|---|---|
| HC-01 | Retainer MUST be generated via Clio document automation | Brief Section 5 |
| HC-02 | Client email MUST come from Clio Contact record, NOT the PDF | Brief Section 5 |
| HC-03 | Final demo MUST use GUILLERMO_REYES report | Brief Section 5 |
| HC-04 | Solution must process ANY of the 5 reports, not just GUILLERMO_REYES | Brief Section 5 |
| HC-05 | Clio account must be US region | Brief Section 5 |
| HC-06 | Matter and Contact must already exist before the flow runs | Brief Section 5 |
| HC-07 | SOL date = accident date + 8 years (Andrew's instruction, not standard NY law) | Client email |
| HC-08 | Only one Email #3 will be evaluated — do not send multiple test runs to that address | Brief Section 4 |

---

## 6. TECH STACK

| Component | Tool | Why |
|---|---|---|
| Workflow orchestration | n8n (local) | Visual blueprint, JSON export, webhook support |
| PDF extraction | Claude API claude-opus-4-5 | Best vision on messy scanned docs |
| CRM | Clio Manage API v4 (US) | Client requirement |
| Email sending | Gmail API via n8n | Reliable, supports attachments |
| Browser automation | Playwright / Browser MCP | Clio UI setup, OAuth flows |
| Automation framework | Anaten + Anaten MCP | Agent coordination |
| Runtime | Python 3.x + Node.js | Scripts + n8n |

---

## 7. CLIO ACCOUNT SETUP REQUIREMENTS

Before the n8n flow can run, ALL of these must exist in Clio:

### Custom Fields (on Matters)
Create these exactly — names must match template merge fields:

| Field Name | Type | Required |
|---|---|---|
| accident_date | Date | Yes |
| accident_location | Text | Yes |
| accident_description | Text Area | Yes |
| opposing_party_name | Text | Yes |
| opposing_party_address | Text | No |
| injuries_sustained | Text Area | Yes |
| vehicle_info | Text | No |
| statute_of_limitations_date | Date | Yes |

### Test Matter
- Responsible Attorney: Andrew Richards
- Status: Pending
- Contact associated with Matter:
  - First Name: [from GUILLERMO_REYES report]
  - Last Name: [from GUILLERMO_REYES report]
  - Email: talent.legal-engineer.hackathon.automation-email@swans.co

### Document Automation Template
- Upload retainer agreement template with merge fields
- Save Template ID to .env as CLIO_TEMPLATE_ID

### IDs to Save to .env
After setup, these must all be populated:
```
CLIO_ACCESS_TOKEN=
CLIO_REFRESH_TOKEN=
CLIO_MATTER_ID=
CLIO_TEMPLATE_ID=
CLIO_ATTORNEY_ID=
```

---

## 8. N8N FLOW — COMPLETE NODE SEQUENCE

```
Node 01: Receive Police Report Upload (Webhook Trigger)
Node 02: Extract Data from Police Report PDF (HTTP → Claude API)
Node 03: Parse and Validate Extracted Data (Code Node)
Node 04: Review Extracted Data (n8n Form — paralegal verification)
Node 05: Approved or Rejected? (IF Node)
Node 06: Prepare Clio Custom Field Payload (Code Node)
Node 07: Update Clio Matter Custom Fields (HTTP → Clio PATCH)
Node 08: Get Matter Details from Clio (HTTP → Clio GET)
Node 09: Create SOL Calendar Entry in Clio (HTTP → Clio POST)
Node 10: Trigger Retainer Document Generation (HTTP → Clio POST)
Node 11: Wait for Document Generation (Wait Node — 8 seconds)
Node 12: Check Document Status (HTTP → Clio GET)
Node 13: Download Retainer Agreement PDF (HTTP → Clio download)
Node 14: Determine Seasonal Booking Link (Code Node)
Node 15: Compose Personalized Client Email (Code Node)
Node 16: Send Email with Retainer Attached (Gmail Node)
Node 17: Return Success Response (Respond to Webhook)

Rejection path (from Node 05 false):
Node 18: Log Rejection (Code Node)
Node 19: Return Rejection Response (Respond to Webhook)

Error path (from any node):
Node 20: Handle Flow Error (Error Trigger)
Node 21: Send Error Notification (Gmail Node)
```

---

## 9. ENVIRONMENT VARIABLES — COMPLETE LIST

All must be set in .env before the flow works:

```bash
# Anthropic
ANTHROPIC_API_KEY=

# Clio OAuth
CLIO_CLIENT_ID=
CLIO_CLIENT_SECRET=
CLIO_ACCESS_TOKEN=
CLIO_REFRESH_TOKEN=
CLIO_REDIRECT_URI=http://localhost:3000/callback

# Clio IDs (populated after Clio setup)
CLIO_MATTER_ID=
CLIO_TEMPLATE_ID=
CLIO_ATTORNEY_ID=

# Clio Custom Field IDs (populated after creating custom fields)
CLIO_FIELD_ID_ACCIDENT_DATE=
CLIO_FIELD_ID_ACCIDENT_LOCATION=
CLIO_FIELD_ID_ACCIDENT_DESCRIPTION=
CLIO_FIELD_ID_OPPOSING_PARTY_NAME=
CLIO_FIELD_ID_OPPOSING_PARTY_ADDRESS=
CLIO_FIELD_ID_INJURIES_SUSTAINED=
CLIO_FIELD_ID_VEHICLE_INFO=
CLIO_FIELD_ID_SOL_DATE=

# Gmail
GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=
GMAIL_ACCESS_TOKEN=
GMAIL_REFRESH_TOKEN=

# Scheduling links (from hackathon brief)
BOOKING_LINK_IN_OFFICE=
BOOKING_LINK_VIRTUAL=

# n8n
N8N_API_KEY=
N8N_BASE_URL=http://localhost:5678

# Submission emails (do not change these)
EMAIL_CLIENT=talent.legal-engineer.hackathon.client-email@swans.co
EMAIL_SUBMISSION=talent.legal-engineer.hackathon.submission-email@swans.co
EMAIL_AUTOMATION=talent.legal-engineer.hackathon.automation-email@swans.co
```

---

## 10. THE 5 POLICE REPORTS

Located in /ClientReports/

| File | Client | Type | Scan Quality |
|---|---|---|---|
| GUILLERMO_REYES_v_LIONEL_FRANCOIS | Guillermo Reyes | TBD from pdf_audit | TBD |
| FAUSTO_CASTILLO_v_CHIMIE_DORJEE | Fausto Castillo | Pedestrian struck | Moderate |
| DARSHAME_NOEL_v_FRANCIS_FREESE | Darshame Noel | Rear-end collision | Moderate |
| JOHN_GRILLO_v_JOHN_GRILLO | John Grillo | TBD | TBD |
| MARDOCHEE_VINCENT_v_MARDOCHEE_VINCENT | Mardochee Vincent | TBD | TBD |

**Demo report:** GUILLERMO_REYES — this is what triggers Email #3.

---

## 11. SUBMISSION REQUIREMENTS CHECKLIST

### Email #1 (to Andrew — sent manually by you)
- [ ] Written as Legal Engineer at Swans delivering to client
- [ ] Professional strategic partner tone
- [ ] Offers Friday morning meeting at specific time
- [ ] Includes video walkthrough link (Loom or Google Drive)
- [ ] Translates technical work into business value language

### Email #2 (to Swans judges — sent manually by you)
- [ ] Subject: "Legal Engineer Hackathon Submission - [Your Name]"
- [ ] 15-minute max video link (screen + webcam)
- [ ] Video covers: flow walkthrough, issues, assumptions, post-deployment implications
- [ ] Automation blueprint JSON file attached
- [ ] Live workflow link included (judges will test it)

### Email #3 (sent by automation — triggered once with GUILLERMO_REYES)
- [ ] Sent automatically by n8n to automation-email@swans.co
- [ ] Contains warm personalized accident reference
- [ ] Retainer Agreement PDF attached
- [ ] Correct seasonal booking link (currently March = in-office)
- [ ] Signed as Andrew Richards
- [ ] Only sent ONCE — do not test with this email address

---

## 12. KNOWN DECISIONS AND ASSUMPTIONS

| # | Decision | Rationale | Risk if Wrong |
|---|---|---|---|
| D-01 | SOL = 8 years | Andrew explicitly stated this | Wrong deadline — legal risk |
| D-02 | Client = injured party in report | Standard PI intake logic | Wrong party represented |
| D-03 | Client email from Clio, not PDF | Brief Section 5 explicit | Email goes to wrong person |
| D-04 | n8n over Make.com | JSON export required, free tier | N/A |
| D-05 | Claude opus-4-5 for extraction | Best vision on scanned docs | Extraction quality |
| D-06 | 8s wait for Clio doc generation | Async API, conservative buffer | Doc not ready when downloaded |
| D-07 | Placeholder booking URLs until brief links extracted | Links in PDF hyperlinks | Wrong booking destination |

---

## 13. WHAT GEMINI CLI HAS ALREADY DONE

Based on prior sessions:
- ✅ Project folder structure created
- ✅ All agent .md files created and organized
- ✅ All skill files created (skills/)
- ✅ workflow.md updated with documentation gates
- ✅ Pre-implementation audit completed (docs/)
- ✅ Clio account logged into via browser
- ✅ Clio project setup started
- ✅ Custom fields created in Clio (including `number_injured` and `vehicle_registration_plate`)
- ✅ Test Matter created for Guillermo Reyes (Matter ID: 1769228281)
- ✅ Retainer template uploaded and merge fields mapped (Template ID: 9130996)
- ✅ .env fully populated (except for active credits)
- ✅ Persona updated to "Richards & Law" and "Andrew Richards"
- ⬜ n8n flow built — IN PROGRESS (Skeleton ready)
- ⬜ Claude extraction tested — PENDING CREDITS
- ⬜ End-to-end flow tested — NOT STARTED
- ✅ Submission emails drafted (submissions/)

---

## 14. REFERENCE FILES MAP

| What you need | Where to find it |
|---|---|
| Full task plan | plan.md |
| Workflow rules | conductor/workflow.md |
| Agent instructions | agents/*.md |
| Reusable patterns | skills/*.md |
| Audit findings | docs/brief_audit.md, docs/pdf_audit.md |
| Decisions log | docs/decisions_and_assumptions.md |
| Risk register | docs/risk_register.md |
| Phase summaries | docs/phase_summaries.md |
| Submission drafts | submissions/*.md |
| n8n blueprint | n8n_blueprint/final_workflow.json |
| API test scripts | scripts/*.py |
