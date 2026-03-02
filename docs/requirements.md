# Formal Requirements Document

## Functional Requirements
FR-01: The system must receive Police Report PDFs via an automated trigger (e.g., webhook or file upload).
FR-02: The system must use AI (Claude 3.5 Sonnet) to extract specific case details from the uploaded Police Report PDF.
FR-03: The system must extract the following data points: Client First Name, Client Last Name, Accident Date, Accident Location, Accident Description, Opposing Party Name, and Injuries Sustained.
FR-04: The system must present the extracted data to a human user (paralegal) for review and validation before proceeding.
FR-05: The system must calculate the Statute of Limitations (SOL) date as exactly 8 years from the extracted Accident Date.
FR-06: The system must update an existing Matter in Clio Manage with the validated extracted data and the calculated SOL date using custom fields.
FR-07: The system must retrieve the pre-existing client email address from the Contact associated with the existing Matter in Clio Manage.
FR-08: The system must create a Calendar Entry in the Clio Manage Matter for the calculated SOL date, assigned to the Responsible Attorney (Andrew Richards).
FR-09: The system must trigger the generation of a Retainer Agreement using Clio Manage's native document automation feature, populating it with the updated Matter fields.
FR-10: The system must wait for the asynchronous document generation in Clio to complete before proceeding.
FR-11: The system must download the generated Retainer Agreement PDF from Clio.
FR-12: The system must send a personalized email to the retrieved client email address.
FR-13: The client email must include a brief reference to the accident details (what happened and when).
FR-14: The client email must include the generated Retainer Agreement as a PDF attachment.
FR-15: The client email must include a consultation booking link.
FR-16: The system must dynamically select the booking link based on the current season: an in-office link for March to August, and a virtual link for September to February.

## Non-Functional Requirements
NFR-01: The data extraction must accurately handle variations in scan quality and document structure across the provided sample reports (e.g., MV-104AN format, driver vs. pedestrian vs. bicyclist).
NFR-02: The system must handle the asynchronous nature of Clio document generation gracefully, employing a robust polling or wait mechanism to avoid timeouts.
NFR-03: The automated workflow should execute efficiently to significantly improve the firm's "speed-to-lead" metric.
NFR-04: The system must be robust against API rate limits and token expirations, implementing retry logic and OAuth token refresh mechanisms where necessary.
NFR-05: The client email must maintain a warm, empathetic, and professional tone, avoiding excessive legal jargon.

## Integration Requirements
IR-01: The system must integrate with the Anthropic API to utilize the Claude 3.5 Sonnet model for data extraction.
IR-02: The system must integrate with the Clio Manage REST API v4.
IR-03: The system must authenticate with the Clio Manage API using OAuth 2.0.
IR-04: The system must interact with the US region of Clio Manage (app.clio.com).
IR-05: The system must integrate with an email sending service (e.g., Gmail API) to dispatch the final client communication.
IR-06: The core orchestration must be handled by n8n.

## Constraints (Hard Rules)
HC-01: The Retainer Agreement MUST be generated using Clio Manage's native document automation feature. Third-party PDF generation libraries are not permitted for this step.
HC-02: The client's email address MUST be retrieved from the pre-existing Contact record in Clio Manage, not from the Police Report PDF.
HC-03: The final demonstration of the solution MUST use the `GUILLERMO_REYES_v_LIONEL_FRANCOIS` Police Report.
HC-04: The Statute of Limitations (SOL) MUST be calculated as exactly 8 years from the accident date, regardless of standard New York law.
HC-05: The solution must be capable of processing any of the 5 provided Police Report PDFs, even though the demo uses a specific one.
HC-06: Only one submission email will be evaluated per designated inbox; the final outputs must be definitive.
HC-07: The submission deadline of Monday, March 2nd, 2026, at 6:00 PM CET is strict.

## Acceptance Criteria
AC-01: Email #1 is successfully sent to `talent.legal-engineer.hackathon.client-email@swans.co` with the required tone and content (video link, offer to meet).
AC-02: Email #2 is successfully sent to `talent.legal-engineer.hackathon.submission-email@swans.co` containing the workflow blueprint, app link, and a video walkthrough (max 15 mins).
AC-03: Email #3 is automatically sent by the system to `talent.legal-engineer.hackathon.automation-email@swans.co`.
AC-04: Email #3 contains a personalized message referencing the accident.
AC-05: Email #3 includes the correct seasonal booking link.
AC-06: Email #3 includes the generated Retainer Agreement PDF as an attachment, with fields correctly populated via Clio document automation.
AC-07: The existing Clio Matter is successfully updated with the extracted case details.
AC-08: A Calendar Entry for the 8-year SOL deadline is successfully created in the Clio Matter.
AC-09: The video walkthrough clearly demonstrates the system processing the `GUILLERMO_REYES` report.
AC-10: All assumptions made during the build are clearly documented and explained in the video walkthrough.
