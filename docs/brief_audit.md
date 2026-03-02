# Hackathon Brief Audit

## Submission Deadline
- **Date:** Monday, March 2nd, 2026
- **Time:** 6:00 PM
- **Timezone:** CET (Central European Time)

## Submission Email Addresses
1. **Email #1 (To Client/Andrew):** `talent.legal-engineer.hackathon.client-email@swans.co`
2. **Email #2 (To Swans Team):** `talent.legal-engineer.hackathon.submission-email@swans.co`
3. **Email #3 (Automation Output):** `talent.legal-engineer.hackathon.automation-email@swans.co`

## Demo Report Requirement
- **Specific File:** `GUILLERMO_REYES_v_LIONEL_FRANCOIS_et_al_EXHIBIT_S__XX.pdf`
- **Context:** The final delivery must demonstrate the solution using this specific report. It must be capable of processing any of the provided reports, but this one is the primary demonstration case.

## Scheduling Link URLs
- **In-office scheduling link:** `in-office scheduling link` (Note: Brief says "use the link", but the actual URL isn't explicitly written in text in the PDF. It's likely a hyperlink in the original document. I will use placeholders and mark as UNKNOWN for actual URL string).
- **Virtual scheduling link:** `virtual scheduling link` (Same as above, mark as UNKNOWN for actual URL string).

## Police Reports Folder Link
- **Link:** `this folder` (Hyperlinked in brief under section 4 - Expected Delivery, Email #2).

## Email Requirements

### Email #1 - Manual Submission to "The Client/Andrew"
- Sent by: You (Anish Wagh)
- Tone: Strategic partner, professional, clear.
- Content:
    - Write as if you are the legal engineer delivering the completed automation to Andrew.
    - Showcase how you would manage this conversation in a real scenario.
    - Offer to meet at a specific time next Friday morning to review feedback.
    - Provide a video or visual materials to help showcase your solution to Andrew.

### Email #2 - Manual Submission to Swans Team
- Sent by: You
- Subject: `Legal Engineer Hackathon Submission - [Your Name]`
- Content:
    - 15 min (maximum) Video Link (sharing screen + webcam) including:
        - Walkthrough of the flow behind your submission and everything it does.
        - Include any issues you encountered and any assumptions used.
        - Include your perspective on the high-level implications you envision for this build post-deployment.
    - The file(s) of your final automation blueprint(s) (e.g., JSON).
    - The link to your AI App/Workflow.

### Email #3 - Automatic Submission Email
- Sent by: Your automation
- Content:
    - An Email with the output of your automation; meaning the email that is sent to the Contact associated with the matter that triggered your solution.
    - Use the email above as the email of the Contact/Potential New Client associated with the already existing matter in Clio Manage.
    - This email should include everything that Andrew highlighted as important for his Potential New Client to receive.
    - Only one email sent by your automation will be evaluated.

## "Only one submission for each email will be evaluated"
- **Implications:** This means we cannot "spray and pray". We must ensure the automation is perfectly tuned before triggering the final submission email. The manual emails must also be definitive.

## Retainer Agreement Template Structure
- **Requirement:** Andrew provided a `copy of a retainer agreement template` with notes.
- **Goal:** Format your own template for the automation.
- **Features:** Must include accident details, parties involved (pre-filled), and the Statute of Limitations date (8 years after accident date).

## Clio Manage Document Automation Requirement
- **Phrase:** "The Retainer Agreement MUST be generated using Clio Manage’s document automation feature."
- **Implications:** We cannot generate a PDF using a third-party library (like fpdf or reportlab) and upload it. We must use Clio's native template system and trigger it via API.

## Section 5 Clarifications (Verbatim)
1. "You are expected to create a new free account in Clio Manage (US region) via this link for this case study and build it as if it was the account of Andrew. This means:
    - Creating new custom fields to store the case details needed for the retainer agreement.
    - Creating a new Matter and Contact with this email as the email of the existing Potential New Client."
2. "Before receiving the Police Report, the only information the firm has in a Clio Manage Matter about the case is:
    - Matter Fields: Responsible Attorney = Andrew Richards
    - Contact Associated to the Matter as the Potential New Client: First Name, Last Name, Email."
3. "Please note that the Client's Email Address is not contained within the police report PDF. In this scenario, the email is one of the few pieces of information the firm collects prior to receiving the police report. You must assume that the Client Contact associated with the Matter already exists in the system with the following email address: `talent.legal-engineer.hackathon.automation-email@swans.co`."
4. "For your final delivery, please demonstrate your solution using the Police Report of `GUILLERMO_REYES_v_LIONEL_FRANCOIS`. However, be aware that your final solution must be capable of processing any of the provided reports here, not only the `GUILLERMO_REYES_v_LIONEL_FRANCOIS` file."
5. "The Retainer Agreement MUST be generated using Clio Manage’s document automation feature."
6. "Videos in your final submission can be shared as a Loom, Google Drive file or any other format that enables you to showcase your solution and explain everything that’s required above."
7. "Please send all of your submission emails using the same email address."
8. "You are expected to work independently without additional guidance from us. To ensure a successful submission, please feel free to make your own assumptions — just be sure to clearly explain them in your video walkthrough. Only if absolutely necessary, you may email `hackathon@swans.co` with your questions, using the subject line: 'Hackathon Question: [Your Name]'."

## Brief Contradictions/Nuance
- **SOL Date:** Brief says 8 years. NYC law is typically 3 years. We MUST use 8 years as it's a specific client requirement.
- **Client Email:** Explicitly NOT in the PDF. It must be pulled from the pre-existing Clio Contact.
- **Seasonal Links:** Mar-Aug (In-office), Sep-Feb (Virtual). Since the hackathon is Feb 28 - March 2, we are right on the boundary. The logic must handle the transition correctly.
