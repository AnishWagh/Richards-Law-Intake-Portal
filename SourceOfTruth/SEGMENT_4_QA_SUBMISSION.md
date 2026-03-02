# SEGMENT 4 — QA, HARDENING & SUBMISSION
# Prerequisite: Segment 3 complete
# Time estimate: 3–4 hours
# Human involvement: Record Loom video, send 3 emails

---

## WHAT THIS SEGMENT DELIVERS

By the end of Segment 4, ALL of these must be true:
- [ ] All 5 police reports tested through full flow
- [ ] Edge cases handled
- [ ] Critic Agent review complete
- [ ] Client Simulator review complete
- [ ] All 3 submission emails drafted and ready
- [ ] Loom video recorded (15 min max)
- [ ] Email #1 sent to client email address
- [ ] Email #2 sent to submission email address
- [ ] Email #3 triggered via automation with GUILLERMO_REYES

---

## PROMPT TO START SEGMENT 4

```
Read SOURCE_OF_TRUTH.md Section 11 (Submission Requirements Checklist),
agents/qa_reliability.md, agents/critic_judge.md,
and agents/client_simulator.md before starting.

We are now in Segment 4: QA, Hardening and Submission.

## TASK 4.1 — RUN FULL QA ON ALL 5 REPORTS

For each report in /ClientReports/:
1. Encode as base64
2. POST to webhook with CLIO_MATTER_ID
3. Fill in verification form (approve)
4. Verify Clio fields updated correctly
5. Verify calendar entry created
6. Verify retainer document generated
7. Log results to docs/qa_test_results.md

Use a TEST email address for all QA runs.
Do NOT use the automation submission email yet.

For each report document:
```
Report: [filename]
Extraction: PASS/FAIL
Missing fields: [list]
Low confidence fields: [list]
Clio update: PASS/FAIL
SOL date correct: PASS/FAIL
Retainer generated: PASS/FAIL
Notes: [anything unusual]
```

## TASK 4.2 — EDGE CASE TESTING

Test these specific scenarios:

**Test A: Rejection flow**
Submit a report, click Reject on the form.
Verify: nothing pushed to Clio, no email sent.

**Test B: Low confidence field handling**
Verify the form shows visual warnings on low confidence fields.

**Test C: Seasonal URL — March (current month)**
Verify the booking link is the in-office link.
Current month = 3 (March) → must be in-office.

**Test D: SOL date accuracy**
For CASTILLO report: accident date 2022-11-16
Expected SOL: 2030-11-16
Verify the calendar entry shows this exact date.

**Test E: Token refresh**
If CLIO_ACCESS_TOKEN expires during testing:
Run scripts/refresh_clio_token.py
Update .env with new token
Update n8n environment variables

## TASK 4.3 — CRITIC AGENT REVIEW

Read agents/critic_judge.md and conduct the review.

Evaluate the complete solution against:
1. Technical execution (does everything actually work?)
2. Problem-solving (are all stated + unstated requirements covered?)
3. Communication (can Andrew understand the business value?)

Classify every issue:
🔴 BLOCKER — fix before submission
🟡 IMPROVEMENT — fix if time allows
🟢 NICE TO HAVE — document for video

Save review to docs/critic_review_1.md
Fix all 🔴 blockers before proceeding.

## TASK 4.4 — CLIENT SIMULATOR REVIEW

Read agents/client_simulator.md and simulate Andrew reviewing the solution.

Focus on:
- Does the client email feel warm and personal?
- Does it reference the specific accident?
- Is the tone right for a law firm representing accident victims?
- Would Andrew trust this system with real client cases?

Save feedback to docs/client_review.md
Apply any critical feedback to the email template in n8n.

## TASK 4.5 — DRAFT ALL THREE SUBMISSION EMAILS

### Email 1 Draft (to Andrew)
Read agents/email_comms.md Email 1 section.
Create submissions/email_1_andrew.md

Requirements:
- Written as Anish Wagh, Legal Engineer at Swans
- Delivers the completed automation to Andrew
- Offers Friday morning meeting (this Friday = March 6, 2026)
  Suggest 10:00 AM EST specifically
- Includes Loom video link (placeholder until recorded)
- Translates every technical component into business language
- Strategic partner tone — not developer tone

### Email 2 Draft (to Swans judges)
Read agents/email_comms.md Email 2 section.
Create submissions/email_2_swans.md

Requirements:
- Subject: "Legal Engineer Hackathon Submission - Anish Wagh"
- Video link (placeholder)
- Architecture summary in business + technical terms
- All assumptions documented
- Post-deployment implications
- JSON blueprint attachment reference

### Email 3 Preview (automated output)
Create submissions/email_3_preview.md
This is a preview of what the automation will send.
Run through the flow with GUILLERMO_REYES to confirm
the actual email content before the live submission trigger.

⚠️ HUMAN ACTION REQUIRED — EMAIL 3 PREVIEW:
I need you to confirm the email content looks correct before
we trigger the actual submission. Review submissions/email_3_preview.md
and tell me YES to proceed or flag any issues.

## TASK 4.6 — VIDEO SCRIPT AND RECORDING

Read agents/technical_writer.md for the full video script.
Save the script to docs/video_script.md

The 15-minute video must cover:
[0:00–1:00] Introduction — who you are, what you built
[1:00–3:00] The problem — Andrew's speed-to-lead crisis
[3:00–6:00] Live demo — GUILLERMO_REYES through full flow
[6:00–8:00] Architecture walkthrough — n8n flow node by node
[8:00–10:00] Edge cases and reliability
[10:00–11:00] Technical decisions and why
[11:00–12:30] Assumptions documented
[12:30–14:00] Post-deployment implications
[14:00–15:00] Closing — business impact

⚠️ HUMAN ACTION REQUIRED — VIDEO RECORDING:
Record the Loom video using docs/video_script.md as your guide.
Screen share + webcam required.
Upload to Loom or Google Drive.
Share the link with me to add to Email #1 and Email #2.

## TASK 4.7 — FINAL SUBMISSION

After video is recorded and link is received:

1. Add video link to submissions/email_1_andrew.md
2. Add video link to submissions/email_2_swans.md
3. Confirm n8n_blueprint/final_workflow.json is clean (no hardcoded keys)
4. Confirm the n8n webhook URL is accessible (the judges will test it)

⚠️ HUMAN ACTION REQUIRED — SEND THE EMAILS:

Send in this order:

STEP 1: Send Email #1
To: talent.legal-engineer.hackathon.client-email@swans.co
Content: submissions/email_1_andrew.md
Attachment: None
Send from: tiger.anish2002@gmail.com

STEP 2: Send Email #2
To: talent.legal-engineer.hackathon.submission-email@swans.co
Subject: Legal Engineer Hackathon Submission - Anish Wagh
Content: submissions/email_2_swans.md
Attachment: n8n_blueprint/final_workflow.json
Send from: tiger.anish2002@gmail.com

STEP 3: Trigger Email #3 (the automation)
This is the live submission trigger. Do this LAST.
Run the webhook with the GUILLERMO_REYES report.
The automation will send Email #3 automatically to:
talent.legal-engineer.hackathon.automation-email@swans.co

Command:
```bash
PDF_B64=$(base64 -i "ClientReports/GUILLERMO_REYES_v_LIONEL_FRANCOIS_et_al_EXHIBIT_S__XX.pdf")
curl -X POST http://localhost:5678/webhook/police-report-intake \
  -H "Content-Type: application/json" \
  -d "{
    \"matter_id\": \"${CLIO_MATTER_ID}\",
    \"pdf_base64\": \"${PDF_B64}\"
  }"
```

Complete the verification form when it appears.
Click APPROVE.
The automation sends Email #3 automatically.

VERIFY: Check that Email #3 arrived at the automation email address.

CRITICAL: Only trigger this ONCE. Only one submission is evaluated.

## SEGMENT 4 COMPLETION CRITERIA

- [ ] All 5 reports QA tested
- [ ] All 🔴 blockers from critic review resolved
- [ ] Client email tone approved by client simulator
- [ ] Video recorded and link obtained
- [ ] Email #1 sent ✅
- [ ] Email #2 sent with JSON blueprint ✅
- [ ] Email #3 triggered and confirmed sent ✅
- [ ] Update SOURCE_OF_TRUTH.md Section 13 — all checkboxes complete
- [ ] Final commit: "conductor(checkpoint): Hackathon submission complete"
```
