# SKILL: PDF Extraction Patterns
## Version: 1.0 | Owner: Agent 2 | Last Updated: Phase 1

---

## WHO USES THIS SKILL
- Agent 2 (Document Intelligence) — primary owner, builds the prompt
- Agent 6 (QA & Reliability) — validates extraction quality across all PDFs
- Agent 4 (n8n Architect) — when configuring the Claude API HTTP node

## ENABLE THIS SKILL WHEN
You are designing, testing, or evaluating the Claude API extraction
prompt against any police report PDF.

## DISABLE / SKIP WHEN
You are working on Clio integration, n8n flow, or email templates.

---

## 1. UNDERSTANDING THE SOURCE DOCUMENTS

### NYC Police Accident Report (MV-104AN) Structure
These reports follow a standard NYC DMV format but quality varies
significantly because they are scanned physical documents.

Key sections and where to find critical fields:

```
SECTION 1 — Accident metadata
  Location: Top of form
  Contains: Accident date, time, number of vehicles, injuries

SECTION 2 — Vehicle 1 Driver (typically the AT-FAULT party)
  Location: Left column
  Contains: Driver name, license ID, address, DOB

SECTION 2 — Vehicle 2 / Pedestrian (typically OUR CLIENT)
  Location: Right column
  Contains: Driver/pedestrian name, license ID, address, DOB

SECTION 4 — Registered Owner
  Location: Middle section
  Contains: Vehicle registration info

SECTION 5 — Vehicle info
  Location: Middle
  Contains: Plate number, year, make, vehicle type

SECTION 30 — Officer Narrative (MOST IMPORTANT)
  Location: Bottom of form, labeled "Accident Description/Officers Notes"
  Contains: Plain-text description of what happened — use this for
            accident_description field

SECTION — Names of all involved
  Location: Bottom right table
  Contains: All party names — use to cross-reference client identity
```

### Identifying the CLIENT vs OPPOSING PARTY
This is the most critical extraction decision. Rules in priority order:

1. If one party is labeled PEDESTRIAN or BICYCLIST → that is the CLIENT
2. If officer narrative says "struck" or "hit" → struck party is CLIENT
3. If injuries are listed for one party → that party is CLIENT
4. If Vehicle 1 caused the accident per officer notes → Vehicle 2 is CLIENT
5. When ambiguous → set confidence_flag to "low" and flag for paralegal

---

## 2. THE EXTRACTION PROMPT

### Master Prompt (copy this exactly into prompts/pdf_extraction_prompt.md)

```
You are a legal data extraction specialist working for a personal injury 
law firm. Extract information from this NYC Police Accident Report PDF.

IMPORTANT RULES:
1. Return ONLY a valid JSON object. No preamble, explanation, or markdown.
2. This is a scanned document. OCR artifacts are common. Use context to 
   interpret unclear text.
3. The CLIENT is the INJURED PARTY — typically the pedestrian, cyclist, 
   or the vehicle occupant who was struck/injured.
4. The OPPOSING PARTY is typically the driver who caused the incident.
5. For the accident_description field, use the Officer's Notes section 
   verbatim (bottom of the form). This is the most reliable narrative.
6. Calculate statute_of_limitations_date as exactly 8 years after 
   accident_date.
7. Set confidence flags honestly — low means you are uncertain.

Extract these fields exactly:

{
  "client_first_name": "First name of injured/client party",
  "client_last_name": "Last name of injured/client party",
  "accident_date": "YYYY-MM-DD",
  "accident_time": "HH:MM in 24h format or null",
  "accident_location": "Full street address or intersection",
  "accident_description": "Full officer narrative, verbatim from report",
  "opposing_party_name": "Full name of at-fault driver",
  "opposing_party_address": "Full address of opposing party or null",
  "client_address": "Full address of client or null",
  "injuries_sustained": "All injuries listed for the client party",
  "vehicle_info": "Year Make Model of vehicle involved or null",
  "reporting_officer": "Officer full name from signature section or null",
  "accident_type": "rear-end|pedestrian-strike|sideswipe|head-on|other",
  "statute_of_limitations_date": "YYYY-MM-DD (accident_date + 8 years)",
  "confidence_flags": {
    "client_identity": "high|medium|low",
    "accident_date": "high|medium|low",
    "accident_location": "high|medium|low",
    "accident_description": "high|medium|low",
    "injuries_sustained": "high|medium|low"
  },
  "extraction_notes": "Any ambiguities or issues found during extraction"
}

Return ONLY the JSON. Nothing else.
```

---

## 3. CALLING THE CLAUDE API

```python
import anthropic
import base64
import json
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

def extract_from_pdf(pdf_path: str) -> dict:
    """Extract structured data from a police report PDF using Claude."""
    
    client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    
    # Read and encode PDF
    with open(pdf_path, "rb") as f:
        pdf_data = base64.standard_b64encode(f.read()).decode("utf-8")
    
    # Load prompt from file
    prompt_path = Path("prompts/pdf_extraction_prompt.md")
    extraction_prompt = prompt_path.read_text()
    
    response = client.messages.create(
        model="claude-3-5-sonnet-20240620",
        max_tokens=2000,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "document",
                        "source": {
                            "type": "base64",
                            "media_type": "application/pdf",
                            "data": pdf_data
                        }
                    },
                    {
                        "type": "text",
                        "text": extraction_prompt
                    }
                ]
            }
        ]
    )
    
    raw_text = response.content[0].text
    
    # Clean any accidental markdown fences
    clean = raw_text.strip()
    if clean.startswith("```"):
        clean = clean.split("
", 1)[1]
        clean = clean.rsplit("```", 1)[0]
    clean = clean.strip()
    
    return json.loads(clean)
```

---

## 4. VALIDATION AFTER EXTRACTION

```python
REQUIRED_FIELDS = [
    "client_first_name",
    "client_last_name", 
    "accident_date",
    "accident_location",
    "accident_description",
    "injuries_sustained",
    "statute_of_limitations_date"
]

def validate_extraction(extracted: dict) -> dict:
    """Validates extraction result. Returns validation report."""
    
    issues = []
    warnings = []
    
    # Check required fields
    for field in REQUIRED_FIELDS:
        if not extracted.get(field):
            issues.append(f"MISSING required field: {field}")
    
    # Check date format
    import re
    date_pattern = r"^\d{4}-\d{2}-\d{2}$"
    for date_field in ["accident_date", "statute_of_limitations_date"]:
        val = extracted.get(date_field, "")
        if val and not re.match(date_pattern, str(val)):
            issues.append(f"Invalid date format for {date_field}: {val}")
    
    # Verify SOL date = accident date + 8 years
    if extracted.get("accident_date") and extracted.get("statute_of_limitations_date"):
        from datetime import date
        try:
            acc = date.fromisoformat(extracted["accident_date"])
            sol = date.fromisoformat(extracted["statute_of_limitations_date"])
            expected_year = acc.year + 8
            if sol.year != expected_year:
                issues.append(
                    f"SOL year mismatch: expected {expected_year}, got {sol.year}"
                )
        except ValueError as e:
            issues.append(f"Date parsing error: {e}")
    
    # Check confidence flags
    low_confidence = [
        k for k, v in extracted.get("confidence_flags", {}).items()
        if v == "low"
    ]
    if low_confidence:
        warnings.append(f"Low confidence fields: {low_confidence}")
    
    return {
        "valid": len(issues) == 0,
        "issues": issues,
        "warnings": warnings,
        "low_confidence_fields": low_confidence
    }
```

---

## 5. KNOWN QUIRKS IN THESE SPECIFIC REPORTS

Based on analysis of the provided sample PDFs:

### CASTILLO v DORJEE
- Pedestrian case — client is CASTILLO (pedestrian, right column)
- Accident date clearly readable: 11/16/2022
- Officer narrative at bottom is the clearest section
- Vehicle 1 driver (DORJEE) is the opposing party

### NOEL v FREESE
- Two-vehicle collision on 495I Long Island Expressway
- Client is NOEL (Vehicle 1, rear-ended)
- Opposing party is FREESE (Vehicle 2, struck from behind)
- Multiple pages — officer notes may be on subsequent page

### Common OCR Issues Across All Reports
- Date fields sometimes read as "l6" instead of "16" (OCR confuses 1 and l)
- Address numbers sometimes corrupted
- Military time field (20:01) sometimes misread
- Signature sections are never readable — ignore them
- Stamp overlays on amended reports can obscure text

---

## 6. HANDLING FAILURES GRACEFULLY

```python
def safe_extract(pdf_path: str) -> tuple[dict, dict]:
    """
    Returns (extracted_data, validation_report).
    Never raises — returns partial data with issues flagged.
    """
    try:
        extracted = extract_from_pdf(pdf_path)
        validation = validate_extraction(extracted)
        return extracted, validation
    
    except json.JSONDecodeError as e:
        return {}, {
            "valid": False, 
            "issues": [f"Claude returned invalid JSON: {e}"],
            "warnings": [],
            "low_confidence_fields": []
        }
    
    except Exception as e:
        return {}, {
            "valid": False, 
            "issues": [f"Extraction failed: {str(e)}"],
            "warnings": [],
            "low_confidence_fields": []
        }
```

---

## 7. WHAT THE VERIFICATION FORM SHOULD HIGHLIGHT

Pass this to Agent 4 for the n8n Form node configuration:

- Fields with `confidence_flags` = "low" → show in yellow with warning icon
- Missing required fields → show in red, mark as required
- `extraction_notes` content → show as info banner at top of form
- `accident_description` → always show as editable textarea (long text)
- `statute_of_limitations_date` → show as read-only calculated field
