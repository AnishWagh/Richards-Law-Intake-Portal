# IMPLEMENTATION GUIDE — INDEX
# Swans Applied AI Hackathon — Richards & Law Automation

---

## How To Use This Guide

This guide is divided into segments.
Each segment has its own file with a self-contained prompt.
Paste the prompt from each segment into Gemini CLI to begin that segment.

ALWAYS run Segment 0 first in any new Gemini CLI instance.
It restores context from SOURCE_OF_TRUTH.md.

---

## Segment Map

| Segment | File | What It Does | Time |
|---|---|---|---|
| 0 | SEGMENT_0_CONTEXT_RESTORE.md | Restores full context in new instance | 10 min |
| 1 | SEGMENT_1_CLIO_SETUP.md | Clio account, custom fields, matter, template | 1.5–2 hrs |
| 2 | SEGMENT_2_PDF_EXTRACTION.md | Claude extraction engine, all 5 reports | 2–3 hrs |
| 3 | SEGMENT_3_N8N_FLOW.md | Complete n8n automation flow | 3–4 hrs |
| 4 | SEGMENT_4_QA_SUBMISSION.md | QA, video, 3 submission emails | 3–4 hrs |

**Total estimated time: 10–13 hours of active work**
**You have ~38 hours — this is achievable with buffer for fixes**

---

## Source of Truth

SOURCE_OF_TRUTH.md is the single most important file.
Every segment reads it first.
Every segment updates Section 13 (what's done) when complete.

If Gemini ever seems confused or forgets context:
1. Run /compress
2. Run Segment 0 prompt
3. Continue from where you left off

---

## Human Actions Required Summary

These are the things ONLY YOU can do.
Gemini will pause and wait at each one.

| Segment | Action | Time Needed |
|---|---|---|
| 1 | Approve Clio OAuth in browser | 2 min |
| 1 | Upload retainer template DOCX to Clio | 5 min |
| 2 | Confirm GUILLERMO_REYES extraction looks correct | 5 min |
| 3 | Verify verification form displays correctly | 5 min |
| 4 | Confirm Email #3 preview content | 5 min |
| 4 | Record 15-minute Loom video | 20 min |
| 4 | Send Email #1 manually | 2 min |
| 4 | Send Email #2 manually | 2 min |
| 4 | Approve verification form for live GUILLERMO_REYES run | 2 min |

**Total human time: ~50 minutes across 38 hours**
Everything else is autonomous.

---

## Critical Reminders

1. Email #3 can only be sent ONCE to the submission email
   Test with a different email address for all QA runs

2. The demo MUST use GUILLERMO_REYES — not any other report

3. The retainer MUST be generated via Clio document automation
   Do not generate a custom PDF

4. The deadline is Monday March 2nd at 6:00 PM CET
   That is 17:00 UTC / 12:00 PM EST

5. Send all 3 emails from the same email address
   tiger.anish2002@gmail.com
