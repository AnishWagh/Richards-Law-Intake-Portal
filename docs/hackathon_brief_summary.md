# Hackathon Brief Summary — Richards & Law Intake Automation

## Project Goal
Automate the intake of **NYC Police Accident Reports** into **Clio Manage** to improve "speed-to-lead" and reduce manual paralegal workload from 45 minutes to under 2 minutes per case.

## Key Stakeholder
- **Andrew Richards**, Richards & Law (NYC Personal Injury Law Firm).

## Technical Requirements
- **Extraction:** Use AI Vision (Claude API) to extract data from scanned PDFs.
- **Verification:** Implement a human-in-the-loop (HITL) step for paralegals to review and edit extracted data.
- **Clio Integration:** 
    - Create/Update Matter custom fields.
    - Calendar the **Statute of Limitations (SOL)** exactly **8 years** from the accident date.
    - Trigger native Clio document automation for the **Retainer Agreement**.
    - Download and attach the generated Retainer PDF to an email.
- **Email Automation:**
    - Send a personalized email to the client using **Gmail API**.
    - Dynamically switch between an **in-office booking link** (Mar-Aug) and a **virtual booking link** (Sep-Feb).
- **Tooling:** n8n, Claude API, Clio Manage API, Gmail API, Python (for testing).

## Required Deliverables
1. **Email #1 (Manual):** Delivery email to the client (Andrew Richards) with a video walkthrough link.
2. **Email #2 (Manual):** Submission email to the Swans team with architecture details and n8n JSON blueprint.
3. **Email #3 (Automated):** The actual automated email sent to a potential client by the system.
4. **15-Minute Video Walkthrough:** Loom video explaining the solution, architecture, and assumptions.

## Key Constraints
- **NYC-Specific:** NYPD report formats and a (hypothetically) fixed 8-year SOL.
- **Client Email:** Not found in the police report; must be pre-existing in the Clio contact record.
- **Clio Region:** US.
- **Deadline:** Monday, March 2nd, 6:00 PM CET.
