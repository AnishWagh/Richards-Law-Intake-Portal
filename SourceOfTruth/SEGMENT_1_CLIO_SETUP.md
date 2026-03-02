# SEGMENT 1 — CLIO ACCOUNT SETUP
# Prerequisite: Segment 0 complete, context restored
# Time estimate: 1.5–2 hours
# Human involvement: OAuth approval, template upload

---

## WHAT THIS SEGMENT DELIVERS

By the end of Segment 1, ALL of these must be true:
- [ ] Clio account active, US region, logged in via OAuth
- [ ] All 8 custom fields created on Matters
- [ ] All custom field IDs saved to .env
- [ ] Test Matter created with correct contact email
- [ ] Responsible Attorney = Andrew Richards
- [ ] CLIO_MATTER_ID saved to .env
- [ ] CLIO_ATTORNEY_ID saved to .env
- [ ] Retainer Agreement template uploaded with correct merge fields
- [ ] CLIO_TEMPLATE_ID saved to .env
- [ ] All Clio API calls tested and returning 200

---

## PROMPT TO START SEGMENT 1

```
Read SOURCE_OF_TRUTH.md Section 7 (Clio Account Setup Requirements)
and skills/clio_api_patterns.md before starting.

We are now in Segment 1: Clio Account Setup.
Your job is to complete and verify the entire Clio setup.

## TASK 1.1 — VERIFY CLIO LOGIN AND OAuth

Use the browser to navigate to https://app.clio.com
Check if we are already logged in from a previous session.

If logged in:
- Navigate to Settings > API Keys
- Verify our OAuth app exists
- Report the Client ID

If not logged in:
⚠️ HUMAN ACTION REQUIRED: I need you to approve the OAuth
login in the browser. Tell me when the screen appears.

After confirming login, run this test:
```python
# scripts/test_clio_connection.py
import os, requests
from dotenv import load_dotenv
load_dotenv()

headers = {"Authorization": f"Bearer {os.getenv('CLIO_ACCESS_TOKEN')}"}
r = requests.get("https://app.clio.com/api/v4/users/who_am_i", headers=headers)
print(r.status_code, r.json())
```
Save the user ID as CLIO_ATTORNEY_ID in .env.

## TASK 1.2 — CREATE CUSTOM FIELDS

Read SOURCE_OF_TRUTH.md Section 7 for the exact field names and types.

For each custom field, use the Clio API to create it:
```
POST https://app.clio.com/api/v4/custom_fields
{
  "data": {
    "name": "[field_name]",
    "field_type": "[Text|Date|Text Area]",
    "parent_type": "Matter"
  }
}
```

After creating each field, immediately save its ID to .env:
CLIO_FIELD_ID_ACCIDENT_DATE=
CLIO_FIELD_ID_ACCIDENT_LOCATION=
CLIO_FIELD_ID_ACCIDENT_DESCRIPTION=
CLIO_FIELD_ID_OPPOSING_PARTY_NAME=
CLIO_FIELD_ID_OPPOSING_PARTY_ADDRESS=
CLIO_FIELD_ID_INJURIES_SUSTAINED=
CLIO_FIELD_ID_VEHICLE_INFO=
CLIO_FIELD_ID_SOL_DATE=

Use the browser to verify fields appear in Clio UI:
Settings > Custom Fields > Matters

## TASK 1.3 — CREATE TEST MATTER

First, read the GUILLERMO_REYES PDF in /ClientReports/ to get the
client's first and last name.

Then create the Matter via API or browser:
```
POST https://app.clio.com/api/v4/matters
{
  "data": {
    "description": "Guillermo Reyes v Lionel Francois - PI Case",
    "status": "Pending",
    "responsible_staff": {"id": "[CLIO_ATTORNEY_ID]"}
  }
}
```

Then create or find the Contact:
- First Name: [from GUILLERMO_REYES report]
- Last Name: [from GUILLERMO_REYES report]
- Email: talent.legal-engineer.hackathon.automation-email@swans.co

Associate the Contact to the Matter as the client.
Save the Matter ID to .env as CLIO_MATTER_ID.

CRITICAL: The email address on the Contact must be exactly:
talent.legal-engineer.hackathon.automation-email@swans.co
Verify this in Clio UI after creation.

## TASK 1.4 — UPLOAD RETAINER TEMPLATE

The retainer template must be uploaded to Clio's document automation.
Navigate in browser: Clio > Documents > Templates > New Template

The template must include these merge fields exactly:
{{ matter.client.name }}
{{ matter.custom_fields.accident_date }}
{{ matter.custom_fields.accident_location }}
{{ matter.custom_fields.accident_description }}
{{ matter.custom_fields.opposing_party_name }}
{{ matter.custom_fields.injuries_sustained }}
{{ matter.responsible_staff.name }}
{{ matter.custom_fields.statute_of_limitations_date }}

Create a DOCX template with professional retainer agreement content.
Use the merge fields above wherever those values should appear.

⚠️ HUMAN ACTION REQUIRED: You need to upload the DOCX to Clio.
I will create the DOCX file at: docs/retainer_template.docx
Tell me when you have uploaded it and I will get the Template ID.

After upload, get the Template ID from the URL or API:
GET https://app.clio.com/api/v4/document_templates
Save as CLIO_TEMPLATE_ID in .env.

## TASK 1.5 — VERIFY ALL CLIO SETUP

Run a full verification script:
```python
# scripts/verify_clio_setup.py
import os, requests, json
from dotenv import load_dotenv
load_dotenv()

BASE = "https://app.clio.com/api/v4"
H = {"Authorization": f"Bearer {os.getenv('CLIO_ACCESS_TOKEN')}"}

checks = {
    "Attorney exists": f"/users/{os.getenv('CLIO_ATTORNEY_ID')}",
    "Matter exists": f"/matters/{os.getenv('CLIO_MATTER_ID')}",
    "Template exists": f"/document_templates/{os.getenv('CLIO_TEMPLATE_ID')}",
}

for name, endpoint in checks.items():
    r = requests.get(f"{BASE}{endpoint}", headers=H)
    status = "✅" if r.status_code == 200 else "❌"
    print(f"{status} {name}: {r.status_code}")

# Check custom fields
r = requests.get(f"{BASE}/custom_fields", headers=H,
                 params={"parent_type": "Matter", "fields": "id,name"})
fields = r.json().get("data", [])
print(f"\n✅ Custom fields found: {len(fields)}")
for f in fields:
    print(f"  - {f['name']}: {f['id']}")

# Check contact email on matter
matter_id = os.getenv('CLIO_MATTER_ID')
r = requests.get(f"{BASE}/matters/{matter_id}", headers=H,
                 params={"fields": "id,client{name,email_addresses}"})
client = r.json()["data"].get("client", {})
emails = client.get("email_addresses", [])
print(f"\n✅ Contact: {client.get('name')}")
print(f"✅ Email: {emails[0]['address'] if emails else 'MISSING ❌'}")
```

All checks must pass before moving to Segment 2.

## SEGMENT 1 COMPLETION CRITERIA

Before marking Segment 1 done, confirm:
- [ ] test_clio_connection.py returns 200
- [ ] verify_clio_setup.py shows all ✅
- [ ] Contact email is talent.legal-engineer.hackathon.automation-email@swans.co
- [ ] All field IDs in .env
- [ ] CLIO_TEMPLATE_ID in .env
- [ ] Update SOURCE_OF_TRUTH.md Section 13 checkboxes
- [ ] Update docs/decisions_and_assumptions.md with any discoveries
- [ ] Commit: "feat(clio): Complete Clio account setup and verification"
```
