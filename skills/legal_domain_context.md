# SKILL: Legal Domain Context
## Version: 1.0 | Owner: Orchestrator | Last Updated: Phase 1

---

## WHO USES THIS SKILL
- Agent 2 (Doc Intelligence) — understanding which party is the client
- Agent 3 (Clio Integration) — knowing which fields matter legally
- Agent 5 (Email & Comms) — writing in appropriate legal tone
- Agent 7 (Technical Writer) — explaining business value correctly
- Agent 9 (Critic) — evaluating legal correctness of the solution
- Agent 10 (Client Simulator) — simulating Andrew's domain knowledge

## ENABLE THIS SKILL WHEN
You need to make any decision that involves legal context, PI law firm
operations, retainer agreements, or client communication tone.

---

## 1. PERSONAL INJURY LAW FIRM BASICS

### How PI Firms Make Money
- Contingency fee model: attorneys only get paid if they WIN
- Standard fee: 33% of the final settlement amount
- This means firms do NOT compete on price
- They compete on: speed, trust, professionalism, reputation

### Why Speed-to-Lead is Everything
- A person injured in an accident often calls 3-5 firms
- They sign with whoever responds fastest AND most professionally
- Once a retainer is signed, the client relationship is EXCLUSIVE
- Losing a high-value case (e.g. $500k settlement) = losing $165k in fees
- This is why Andrew's problem is genuinely critical — not just annoying

### The Intake Timeline (Before This Automation)
```
Client calls → 
Paralegal receives police report PDF → 
Paralegal reads messy document (15-20 min) →
Paralegal manually enters data into Clio (20-30 min) →
Attorney reviews and generates retainer (10-15 min) →
Email sent to client (5 min) →
TOTAL: 50-70 minutes per intake
```

### The Intake Timeline (After This Automation)
```
Client calls → 
Paralegal uploads PDF to system →
AI extracts data (30 seconds) →
Paralegal reviews verification form (60-90 seconds) →
Paralegal clicks Approve →
Everything else happens automatically →
TOTAL: Under 3 minutes
```

**Time saved per case: ~65 minutes**
**Business impact: Firm can respond before competitors every time**

---

## 2. THE RETAINER AGREEMENT

### What It Is
A binding legal contract between the client and the law firm establishing:
- The attorney-client relationship
- The contingency fee percentage (33%)
- The scope of representation
- The client's rights and obligations

### Why It Must Be Generated Immediately
- Unsigned retainer = no exclusive relationship
- Client can still sign with another firm until retainer is executed
- Speed of retainer delivery is a direct competitive advantage

### Critical Fields in the Retainer
These fields MUST be accurately populated from the police report:

| Field | Source | Legal Importance |
|---|---|---|
| Client full name | Police report | Identifies the party being represented |
| Accident date | Police report | Defines scope of representation |
| Accident location | Police report | Jurisdiction and venue |
| Accident description | Officer narrative | Establishes basis of claim |
| Opposing party name | Police report | Identifies adverse party |
| Injuries sustained | Police report | Establishes basis for damages |
| Attorney name | Clio Matter | Identifies representing attorney |
| SOL date | Calculated | Critical legal deadline |

### What Happens if Fields Are Wrong
- Wrong client name → unenforceable contract
- Wrong accident date → wrong SOL calculation
- Missing opposing party → incomplete representation scope
- This is why the human verification step is NON-NEGOTIABLE

---

## 3. STATUTE OF LIMITATIONS

### What It Is
The legal deadline by which a lawsuit must be filed. After this date,
the client loses their right to sue — forever.

### New York Personal Injury SOL
Standard NY personal injury: **3 years** from the date of accident
(CPLR § 214)

### IMPORTANT NOTE FOR THIS PROJECT
Andrew explicitly stated **8 years** in his email. This is unusual.
Possible reasons:
- He may handle specific case types with longer SOL (medical devices, etc.)
- He may have made an error in his email
- He may be using a conservative buffer date for internal tracking

**Decision: Use 8 years as instructed. Document this assumption.**
Flag it clearly in docs/assumptions.md for Andrew to confirm.

### SOL Date Calculation
```python
from datetime import date
from dateutil.relativedelta import relativedelta

def calculate_sol_date(accident_date_str: str, years: int = 8) -> str:
    """
    Calculate SOL date. Uses relativedelta to handle leap years correctly.
    Example: 2022-11-16 + 8 years = 2030-11-16
    """
    accident_date = date.fromisoformat(accident_date_str)
    sol_date = accident_date + relativedelta(years=years)
    return sol_date.isoformat()
```

### Why relativedelta and Not timedelta
`timedelta(days=365*8)` will be wrong for leap years.
Always use `relativedelta(years=8)` for year-based date math.

---

## 4. CLIENT COMMUNICATION STANDARDS

### Tone for Email to Accident Victim
The potential client has just been in an accident. They are:
- Possibly injured and in pain
- Stressed about medical bills
- Confused about the legal process
- Comparing multiple law firms simultaneously

The email must feel:
- **Warm and human** — not a form letter
- **Reassuring** — we understand what happened to you
- **Confident** — we know how to handle this
- **Simple** — no legal jargon
- **Action-oriented** — clear next step (book consultation)

### What to Reference Specifically
Always reference the specific accident. Generic emails lose clients.

Good: "We understand that on November 16th, you were struck by a vehicle
while crossing West 105th Street at Central Park West."

Bad: "We have reviewed your accident report and are ready to assist you."

### What NOT to Include in the Client Email
- Legal jargon (contingency, statute of limitations, retainer)
- Fee percentages
- Technical details about how the automation works
- Multiple calls to action (one booking link only)
- Lengthy disclaimers

---

## 5. CLIO MANAGE IN THE PI FIRM CONTEXT

### How Clio Fits Into Daily Operations
- Clio is the system of record for all case information
- Paralegals spend 2-3 hours per day inside Clio
- Attorneys review Clio matters before client calls
- Documents generated in Clio are legally timestamped
- Calendar entries in Clio are the firm's deadline management system

### Why Document Automation Must Use Clio (Not a Custom PDF)
- Legally timestamped in the system
- Accessible to all staff via Clio
- Audit trail for compliance
- Client can be given Clio portal access to view their documents
- Andrew explicitly required this — it is non-negotiable

### Custom Fields Strategy
Keep custom fields minimal and business-focused.
Name them exactly as they appear in the retainer merge fields.
A paralegal should understand every field name without explanation.

---

## 6. LANGUAGE GUIDE FOR ANDREW

When writing for Andrew or as Andrew, use this vocabulary:

| Technical Term | Andrew's Language |
|---|---|
| Webhook trigger | "when we receive a police report" |
| Claude API extraction | "the AI reads the report" |
| n8n workflow | "the automation" |
| Custom field population | "filling in Clio" |
| Document automation | "generating the retainer" |
| SOL calendar entry | "the deadline reminder" |
| Confidence flags | "fields the AI wasn't sure about" |
| Verification form | "the review step" |
| Rejection path | "if something looks wrong, we stop" |

Always lead with outcomes, not process:
- "Never lose a lead to a slower competitor" not "reduced latency"
- "Retainer ready before the client hangs up" not "automated document generation"
- "Your paralegal reviews once and approves" not "human-in-the-loop verification"
