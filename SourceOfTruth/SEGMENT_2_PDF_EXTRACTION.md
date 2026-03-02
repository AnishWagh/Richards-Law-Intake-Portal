# SEGMENT 2 — PDF EXTRACTION ENGINE
# Prerequisite: Segment 1 complete
# Time estimate: 2–3 hours
# Human involvement: Review extraction results, approve schema

---

## WHAT THIS SEGMENT DELIVERS

By the end of Segment 2, ALL of these must be true:
- [ ] Claude API extraction prompt finalized
- [ ] Extraction tested against all 5 police reports
- [ ] JSON schema locked and saved to prompts/extraction_schema.json
- [ ] All 5 extraction results saved to docs/
- [ ] GUILLERMO_REYES extraction specifically verified
- [ ] Validation function written and tested
- [ ] scripts/extract_pdf.py complete and working

---

## PROMPT TO START SEGMENT 2

```
Read SOURCE_OF_TRUTH.md Section 4 (FR-02)
and skills/pdf_extraction_patterns.md before starting.

We are now in Segment 2: PDF Extraction Engine.

## TASK 2.1 — ANALYZE ALL 5 REPORTS

Read every PDF in /ClientReports/ using your document reading capability.
For each report, identify:
- Client name (injured party)
- Opposing party name
- Accident date
- Accident type
- OCR quality (clean/moderate/poor)
- Any unusual features or anomalies

Save analysis to docs/pdf_audit.md if it doesn't exist,
or append to it if it does.

Pay special attention to GUILLERMO_REYES — this is our demo report.
Document its specific fields and any extraction challenges.

## TASK 2.2 — BUILD THE EXTRACTION PROMPT

Based on your analysis of all 5 reports, write the extraction prompt.
Reference skills/pdf_extraction_patterns.md Section 2 as your base.

Customize it for these specific reports based on what you found in 2.1.
Save the final prompt to: prompts/pdf_extraction_prompt.md

## TASK 2.3 — BUILD THE EXTRACTION SCRIPT

Create scripts/extract_pdf.py using this structure:

```python
#!/usr/bin/env python3
"""
PDF Police Report Extraction Script
Uses Claude API vision to extract structured data
from NYC Police Accident Reports (MV-104AN)
"""

import anthropic
import base64
import json
import os
import re
from pathlib import Path
from datetime import date
from dateutil.relativedelta import relativedelta
from dotenv import load_dotenv

load_dotenv()

def calculate_sol_date(accident_date_str: str, years: int = 8) -> str:
    """Calculate SOL date. Uses relativedelta for leap year safety."""
    accident_date = date.fromisoformat(accident_date_str)
    sol_date = accident_date + relativedelta(years=years)
    return sol_date.isoformat()

def extract_from_pdf(pdf_path: str) -> dict:
    """Extract structured data from police report PDF."""
    client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    
    prompt_path = Path("prompts/pdf_extraction_prompt.md")
    extraction_prompt = prompt_path.read_text()
    
    with open(pdf_path, "rb") as f:
        pdf_data = base64.standard_b64encode(f.read()).decode("utf-8")
    
    response = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=2000,
        messages=[{
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
                {"type": "text", "text": extraction_prompt}
            ]
        }]
    )
    
    raw = response.content[0].text.strip()
    # Clean markdown fences if present
    if raw.startswith("```"):
        raw = re.sub(r'^```json?\n?', '', raw)
        raw = re.sub(r'\n?```$', '', raw)
    
    extracted = json.loads(raw.strip())
    
    # Always recalculate SOL to ensure accuracy
    if extracted.get("accident_date"):
        extracted["statute_of_limitations_date"] = calculate_sol_date(
            extracted["accident_date"], years=8
        )
    
    return extracted

def validate_extraction(extracted: dict) -> dict:
    """Validate extraction result. Returns validation report."""
    required = [
        "client_first_name", "client_last_name",
        "accident_date", "accident_location",
        "accident_description", "injuries_sustained",
        "statute_of_limitations_date"
    ]
    
    missing = [f for f in required if not extracted.get(f)]
    low_confidence = [
        k for k, v in extracted.get("confidence_flags", {}).items()
        if v == "low"
    ]
    
    date_pattern = r"^\d{4}-\d{2}-\d{2}$"
    date_errors = []
    for field in ["accident_date", "statute_of_limitations_date"]:
        val = str(extracted.get(field, ""))
        if val and not re.match(date_pattern, val):
            date_errors.append(f"{field}: {val}")
    
    return {
        "valid": len(missing) == 0 and len(date_errors) == 0,
        "missing_fields": missing,
        "date_format_errors": date_errors,
        "low_confidence_fields": low_confidence,
        "needs_attention": len(missing) > 0 or len(low_confidence) > 0
    }

if __name__ == "__main__":
    import sys
    pdf_path = sys.argv[1] if len(sys.argv) > 1 else None
    
    if not pdf_path:
        # Test all reports
        reports = list(Path("ClientReports").glob("*.pdf"))
    else:
        reports = [Path(pdf_path)]
    
    for report in reports:
        print(f"\n{'='*60}")
        print(f"Processing: {report.name}")
        print('='*60)
        
        extracted, validation = safe_extract(str(report))
        
        print(f"Client: {extracted.get('client_first_name')} {extracted.get('client_last_name')}")
        print(f"Date: {extracted.get('accident_date')}")
        print(f"SOL: {extracted.get('statute_of_limitations_date')}")
        print(f"Location: {extracted.get('accident_location')}")
        print(f"Valid: {'✅' if validation['valid'] else '❌'}")
        
        if validation["missing_fields"]:
            print(f"Missing: {validation['missing_fields']}")
        if validation["low_confidence_fields"]:
            print(f"Low confidence: {validation['low_confidence_fields']}")
        
        # Save result
        output = {
            "source_file": report.name,
            "extracted": extracted,
            "validation": validation
        }
        out_path = f"docs/extraction_{report.stem}.json"
        with open(out_path, "w") as f:
            json.dump(output, f, indent=2)
        print(f"Saved to {out_path}")

def safe_extract(pdf_path: str) -> tuple:
    try:
        extracted = extract_from_pdf(pdf_path)
        validation = validate_extraction(extracted)
        return extracted, validation
    except json.JSONDecodeError as e:
        return {}, {"valid": False, "missing_fields": ["ALL"],
                    "date_format_errors": [], "low_confidence_fields": [],
                    "needs_attention": True, "error": f"JSON parse: {e}"}
    except Exception as e:
        return {}, {"valid": False, "missing_fields": ["ALL"],
                    "date_format_errors": [], "low_confidence_fields": [],
                    "needs_attention": True, "error": str(e)}
```

## TASK 2.4 — TEST ALL 5 REPORTS

Run: python scripts/extract_pdf.py

Review the output for each report.
For each one, verify:
- Client name is the INJURED party (not the at-fault driver)
- Accident date is correctly formatted
- SOL date = accident date + exactly 8 years
- Accident description uses the officer narrative

Special focus on GUILLERMO_REYES:
Document its exact extracted values in docs/decisions_and_assumptions.md
This is the report we use for the live demo.

## TASK 2.5 — LOCK THE SCHEMA

Save the finalized schema to prompts/extraction_schema.json:
```json
{
  "schema_version": "1.0",
  "locked": true,
  "fields": {
    "client_first_name": {"type": "string", "required": true},
    "client_last_name": {"type": "string", "required": true},
    "accident_date": {"type": "date", "format": "YYYY-MM-DD", "required": true},
    "accident_time": {"type": "string", "required": false},
    "accident_location": {"type": "string", "required": true},
    "accident_description": {"type": "string", "required": true},
    "opposing_party_name": {"type": "string", "required": true},
    "opposing_party_address": {"type": "string", "required": false},
    "injuries_sustained": {"type": "string", "required": true},
    "vehicle_info": {"type": "string", "required": false},
    "reporting_officer": {"type": "string", "required": false},
    "statute_of_limitations_date": {"type": "date", "format": "YYYY-MM-DD", "required": true},
    "confidence_flags": {"type": "object", "required": true},
    "extraction_notes": {"type": "string", "required": false}
  }
}
```

⚠️ HUMAN ACTION REQUIRED:
Review docs/extraction_GUILLERMO_REYES*.json
Confirm the extracted client name and accident details look correct.
Reply YES to proceed or flag any issues.

## SEGMENT 2 COMPLETION CRITERIA

- [ ] All 5 reports extracted without crashes
- [ ] GUILLERMO_REYES extraction verified by human
- [ ] prompts/extraction_schema.json saved
- [ ] prompts/pdf_extraction_prompt.md saved
- [ ] All extraction results saved to docs/
- [ ] Update SOURCE_OF_TRUTH.md Section 10 with actual report details
- [ ] Update SOURCE_OF_TRUTH.md Section 13 checkboxes
- [ ] Commit: "feat(extraction): Complete PDF extraction engine, all 5 reports tested"
```
