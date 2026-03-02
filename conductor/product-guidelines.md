# Product Guidelines

## Brand Voice & Tone
- **Professional & Empathetic:** The tone should be professional to maintain legal authority, but empathetic to reflect the stressful situation accident victims are in.
- **Clear & Direct:** Avoid overly complex legal jargon where possible, especially in client-facing communications.
- **Trustworthy:** Every interaction should reinforce the firm's reliability and commitment to the client's case.

## User Experience (UX) Principles
- **Efficiency First:** The internal interface (HITL) must be optimized for speed, allowing paralegals to review and approve data with minimal friction.
- **Clarity of Action:** All primary actions (e.g., "Approve", "Request Re-extraction") should be prominent and unambiguous.
- **Progress Transparency:** Users should always know the status of an intake (e.g., "Processing", "Needs Review", "Syncing with Clio").
- **Seamless Integration:** The automation should feel like a natural extension of the existing Clio workflow, not a separate, jarring tool.

## Visual Design Guidelines (Internal HITL)
- **Clean Layout:** Use a structured, form-based layout for data verification.
- **Confidence Indicators:** Visually highlight fields where the AI had low extraction confidence to guide the user's attention.
- **Error Highlighting:** Use clear, non-intrusive error states for missing or invalid data.

## Client Communication Guidelines
- **Personalization:** Always address the client by their name and reference the specific details of their accident.
- **Timeliness:** Emails should be sent immediately after the paralegal approves the data.
- **Accessibility:** Ensure that all scheduling links are easy to find and work across all devices (mobile-first).
- **Seasonal Sensitivity:** Automatically switch between in-office and virtual scheduling links based on the time of year (Mar-Aug: In-office, Sep-Feb: Virtual).

## ⚠️ STRICT HACKATHON CONSTRAINTS & PERSONA INTEGRITY
All agents and outputs must strictly adhere to the following challenge details:
- **Client Persona:** The client is Andrew Richards, and the law firm must be named **"Richards & Law"** (not Anish Wagh or any other placeholder). All Clio settings, emails, and templates must reflect this name.
- **Statute of Limitations (SOL):** MUST be calculated as exactly **8 years** from the accident date, regardless of actual standard New York law.
- **Client Email Assumption:** The client's email address is *never* in the PDF. It must be pulled from the pre-existing Clio Contact, which will be set to: `talent.legal-engineer.hackathon.automation-email@swans.co`.
- **Target Demo Case:** The final video and primary configuration must work specifically for the `GUILLERMO_REYES_v_LIONEL_FRANCOIS` report, though the system must handle all 5 provided PDFs.
- **Submission Rules:** All 3 final submission emails must be sent from the same address, and the automation email (#3) must include the exact details Andrew highlighted (accident reference, seasonal link, and attached Retainer PDF generated natively in Clio).
- **Communication Tone to Andrew:** Treat Andrew as a strategic law firm owner. Explain business value ("speed-to-lead"), not technical code, in the manual submission emails.
