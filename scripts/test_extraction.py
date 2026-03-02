import anthropic
import base64
import json
import os
import re
from pathlib import Path
from dotenv import load_dotenv
from datetime import date
from dateutil.relativedelta import relativedelta

load_dotenv()

# Required fields for a valid intake
REQUIRED_FIELDS = [
    "client_first_name",
    "client_last_name", 
    "accident_date",
    "accident_location",
    "accident_description",
    "injuries_sustained",
    "statute_of_limitations_date"
]

def extract_from_pdf(pdf_path: str) -> dict:
    """Extract structured data from a police report PDF using Claude."""
    
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise ValueError("ANTHROPIC_API_KEY not found in .env")
        
    client = anthropic.Anthropic(api_key=api_key)
    
    # Read and encode PDF
    with open(pdf_path, "rb") as f:
        pdf_data = base64.standard_b64encode(f.read()).decode("utf-8")
    
    # Load prompt from file
    prompt_path = Path("prompts/pdf_extraction_prompt.md")
    extraction_prompt = prompt_path.read_text()
    
    print(f"--- Sending request to Claude for: {Path(pdf_path).name} ---")
    
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
        if "json" in clean[:10]:
            clean = clean.split("\n", 1)[1]
        else:
            clean = clean[3:]
        if clean.endswith("```"):
            clean = clean[:-3]
    clean = clean.strip()
    
    try:
        return json.loads(clean)
    except json.JSONDecodeError:
        print(f"FAILED TO PARSE JSON: {clean}")
        raise

def validate_extraction(extracted: dict) -> dict:
    """Validates extraction result. Returns validation report."""
    
    issues = []
    warnings = []
    
    # Check required fields
    for field in REQUIRED_FIELDS:
        if not extracted.get(field):
            issues.append(f"MISSING required field: {field}")
    
    # Check date format
    date_pattern = r"^\d{4}-\d{2}-\d{2}$"
    for date_field in ["accident_date", "statute_of_limitations_date"]:
        val = extracted.get(date_field, "")
        if val and not re.match(date_pattern, str(val)):
            issues.append(f"Invalid date format for {date_field}: {val}")
    
    # Verify SOL date = accident date + 8 years
    if extracted.get("accident_date") and extracted.get("statute_of_limitations_date"):
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

def run_test(pdf_name: str):
    pdf_path = f"ClientReports/{pdf_name}"
    try:
        data = extract_from_pdf(pdf_path)
        report = validate_extraction(data)
        
        output_path = f"docs/extraction_test_{Path(pdf_name).stem}.json"
        with open(output_path, "w") as f:
            json.dump({"data": data, "validation": report}, f, indent=2)
            
        print(f"--- Result for {pdf_name} ---")
        print(f"Valid: {report['valid']}")
        if not report['valid']:
            print(f"Issues: {report['issues']}")
        if report['warnings']:
            print(f"Warnings: {report['warnings']}")
        print(f"Saved to: {output_path}\n")
        
    except Exception as e:
        print(f"Error processing {pdf_name}: {e}")

if __name__ == "__main__":
    # Test with the required demo case
    run_test("GUILLERMO_REYES_v_LIONEL_FRANCOIS_et_al_EXHIBIT_S__XX.pdf")
    
    # Also test the Castillo case as it was specifically mentioned as clear
    run_test("FAUSTO_CASTILLO_v_CHIMIE_DORJEE_et_al_EXHIBIT_S__31.pdf")
