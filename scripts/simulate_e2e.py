import base64
import json
import os
import requests
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

FILE_NAME = "GUILLERMO_REYES_v_LIONEL_FRANCOIS_et_al_EXHIBIT_S__XX.pdf"
FILE_PATH = Path("ClientReports") / FILE_NAME

def run_e2e_simulation():
    print("==================================================")
    print("🚀 RICHARDS & LAW: END-TO-END WORKFLOW SIMULATION")
    print("==================================================\n")

    if not ANTHROPIC_API_KEY:
        print("❌ Error: ANTHROPIC_API_KEY not found in .env")
        return

    # 1. READ PDF (Simulating Webhook)
    print("📂 [1/4] Simulating Webhook Upload...")
    try:
        with open(FILE_PATH, "rb") as f:
            pdf_data = base64.b64encode(f.read()).decode("utf-8")
        print(f"   ✓ Loaded {FILE_NAME}")
    except Exception as e:
        print(f"❌ Failed to load PDF: {e}")
        return

    # 2. ANTHROPIC EXTRACTION (Simulating HTTP Request Node)
    print("\n🧠 [2/4] Calling Anthropic API for Extraction...")
    
    headers = {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }

    prompt = """You are an expert Legal Case Extraction Assistant. Extract structured data from the provided New York State police report (MV-104A) into a JSON object.

INSTRUCTIONS:
1. Identify the CLIENT (injured party) and OPPOSING PARTY.
2. Accident date MUST be YYYY-MM-DD.
3. SOL date is EXACTLY 8 years after accident date.
4. If client is pedestrian, vehicle_info must be null.

SCHEMA:
{
  "client_first_name": "string",
  "client_last_name": "string",
  "client_gender": "male|female|others|unknown",
  "accident_date": "YYYY-MM-DD",
  "accident_time": "string or null",
  "accident_location": "string",
  "accident_description": "string",
  "opposing_party_name": "string",
  "injuries_sustained": "string",
  "number_injured": "integer",
  "vehicle_info": "string or null",
  "vehicle_registration_plate": "string or null",
  "accident_type": "string",
  "statute_of_limitations_date": "YYYY-MM-DD"
}

Return ONLY the raw JSON object. Do not use markdown blocks."""

    payload = {
        "model": "claude-sonnet-4-6",
        "max_tokens": 4000,
        "system": prompt,
        "messages": [
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
                        "text": "Extract the case details from this police report."
                    }
                ]
            }
        ]
    }

    try:
        response = requests.post("https://api.anthropic.com/v1/messages", headers=headers, json=payload)
        response.raise_for_status()
        result = response.json()
        raw_json = result['content'][0]['text']
        extracted_data = json.loads(raw_json)
        print("   ✓ Extraction Successful!")
        print("   --- Extracted Data ---")
        print(json.dumps(extracted_data, indent=2))
    except Exception as e:
        print(f"❌ Anthropic API Failed: {e}")
        if 'response' in locals():
            print(response.text)
        return

    # 3. PROCESS LOGIC (Simulating Code Node)
    print("\n⚙️ [3/4] Applying Seasonal Logic & Routing...")
    matter_id = "1769228281"
    client_email = "talent.legal-engineer.hackathon.automation-email@swans.co"
    
    month = 3 # Hardcoding March for testing Summer/Spring logic
    booking_type = "Office" if (3 <= month <= 8) else "Virtual"
    booking_link = "https://calendly.com/swans-santiago-p/summer-spring" if booking_type == "Office" else "https://calendly.com/swans-santiago-p/winter-autumn"
    
    final_payload = {
        **extracted_data,
        "matterId": matter_id,
        "clientEmail": client_email,
        "bookingType": booking_type,
        "bookingLink": booking_link
    }
    
    print(f"   ✓ Logic Applied. Booking: {booking_type} -> {booking_link}")

    # 4. SIMULATE FINAL INTEGRATIONS
    print("\n✅ [4/4] Simulating Output Integrations...")
    print(f"   -> [Clio API] PATCH Matter {matter_id} with custom fields.")
    print(f"   -> [Clio API] POST Calendar Entry for SOL: {final_payload['statute_of_limitations_date']}")
    print(f"   -> [Gmail API] SEND Email to {client_email}")
    print("\n🎉 SIMULATION COMPLETE. The architecture is sound.")

if __name__ == "__main__":
    run_e2e_simulation()