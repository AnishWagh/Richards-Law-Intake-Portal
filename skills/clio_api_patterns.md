# SKILL: Clio API Patterns
## Version: 1.0 | Owner: Agent 3 | Last Updated: Phase 1

---

## WHO USES THIS SKILL
- Agent 3 (Clio Integration) — primary owner
- Agent 4 (n8n Architect) — when configuring HTTP Request nodes
- Agent 6 (QA & Reliability) — when validating Clio API responses
- Agent 8 (Research & Setup) — when setting up OAuth

## ENABLE THIS SKILL WHEN
You are about to make any Clio API call, configure a Clio HTTP node
in n8n, debug a Clio integration error, or set up OAuth authentication.

## DISABLE / SKIP WHEN
You are working purely on PDF extraction, email templates, or n8n
logic that does not touch Clio endpoints.

---

## 1. AUTHENTICATION

### OAuth 2.0 Flow
Clio uses OAuth 2.0. The access token expires. Always implement refresh.

```python
import os
import requests
from dotenv import load_dotenv

load_dotenv()

CLIO_BASE_URL = "https://app.clio.com/api/v4"

def get_headers() -> dict:
    return {
        "Authorization": f"Bearer {os.getenv('CLIO_ACCESS_TOKEN')}",
        "Content-Type": "application/json"
    }

def refresh_access_token() -> str:
    """Call this when you get a 401 response."""
    response = requests.post(
        "https://app.clio.com/oauth/token",
        data={
            "grant_type": "refresh_token",
            "refresh_token": os.getenv("CLIO_REFRESH_TOKEN"),
            "client_id": os.getenv("CLIO_CLIENT_ID"),
            "client_secret": os.getenv("CLIO_CLIENT_SECRET")
        }
    )
    response.raise_for_status()
    tokens = response.json()
    # Save new tokens to .env
    os.environ["CLIO_ACCESS_TOKEN"] = tokens["access_token"]
    os.environ["CLIO_REFRESH_TOKEN"] = tokens["refresh_token"]
    return tokens["access_token"]

def api_call_with_retry(method: str, endpoint: str, **kwargs) -> dict:
    """Wraps any Clio API call with automatic token refresh on 401."""
    url = f"{CLIO_BASE_URL}{endpoint}"
    response = requests.request(method, url, headers=get_headers(), **kwargs)
    
    if response.status_code == 401:
        refresh_access_token()
        response = requests.request(method, url, headers=get_headers(), **kwargs)
    
    response.raise_for_status()
    return response.json()
```

### Getting Your Own User ID (Attorney ID)
```python
def get_current_user() -> dict:
    result = api_call_with_retry("GET", "/users/who_am_i")
    return result["data"]
# Save result["data"]["id"] to CLIO_ATTORNEY_ID in .env
```

---

## 2. MATTERS

### Fetch a Matter with All Needed Fields
```python
def get_matter(matter_id: str) -> dict:
    params = {
        "fields": "id,description,status,responsible_staff{id,name},"
                  "client{id,name,email_addresses},"
                  "custom_field_values{id,value,custom_field{id,name}}"
    }
    result = api_call_with_retry("GET", f"/matters/{matter_id}", params=params)
    return result["data"]
```

### GOTCHA: Custom Field Values Format
Custom field values are an ARRAY on the matter. When updating, you must
send the full array with the field's existing ID if it exists, or omit
the ID to create new. Do NOT send just the changed fields.

```python
def update_matter_custom_fields(matter_id: str, 
                                 field_updates: dict,
                                 field_id_map: dict) -> dict:
    """
    field_updates: { "accident_date": "2022-11-16", ... }
    field_id_map: { "accident_date": "clio_custom_field_id", ... }
    """
    custom_field_values = []
    for field_name, value in field_updates.items():
        if value is not None and field_name in field_id_map:
            custom_field_values.append({
                "custom_field": {"id": field_id_map[fieldName]},
                "value": str(value)  # Clio expects strings for most types
            })
    
    payload = {
        "data": {
            "custom_field_values": custom_field_values
        }
    }
    result = api_call_with_retry("PATCH", f"/matters/{matter_id}", json=payload)
    return result["data"]
```

### GOTCHA: Date Fields
Clio date fields expect `YYYY-MM-DD` format as a string. Not a datetime
object. Not ISO 8601 with time. Just `"2022-11-16"`.

---

## 3. CONTACTS

### Get Contact Email from Matter
```python
def get_client_email(matter_id: str) -> str:
    matter = get_matter(matter_id)
    client = matter.get("client", {})
    emails = client.get("email_addresses", [])
    
    if not emails:
        raise ValueError(f"No email found for client on matter {matter_id}")
    
    # Use primary email if multiple exist
    primary = next((e for e in emails if e.get("name") == "Work"), emails[0])
    return primary["address"]
```

---

## 4. CALENDAR ENTRIES

### Create SOL Calendar Entry
```python
def create_calendar_entry(matter_id: str,
                           attorney_id: str, 
                           sol_date: str,
                           client_name: str) -> dict:
    """
    sol_date: "YYYY-MM-DD" string
    Creates all-day event assigned to responsible attorney
    """
    payload = {
        "data": {
            "summary": f"⚠️ SOL Deadline — {client_name}",
            "description": (
                f"STATUTE OF LIMITATIONS DEADLINE
"
                f"Client: {client_name}
"
                f"Matter ID: {matter_id}
"
                f"Do NOT miss this date. File must be resolved before this deadline."
            ),
            "start_at": f"{sol_date}T00:00:00Z",
            "end_at": f"{sol_date}T23:59:59Z",
            "all_day": True,
            "matter": {"id": matter_id},
            "attendees": [{"id": attorney_id}]
        }
    }
    result = api_call_with_retry("POST", "/calendar_entries", json=payload)
    return result["data"]
```

### GOTCHA: Calendar Attendees
The `attendees` field requires the Clio user ID — not the contact ID.
Get the attorney's user ID from `/users/who_am_i` or from the matter's
`responsible_staff.id` field.

---

## 5. DOCUMENT AUTOMATION

### How Clio Document Automation Works
1. You create a template in Clio UI with merge fields
2. You trigger generation via API passing matter_id + template_id
3. Clio generates the document asynchronously
4. You poll or wait, then download

### GOTCHA: Document Generation is ASYNC
Do NOT try to download immediately after triggering. The document
takes 2-10 seconds to generate. Implement polling.

```python
import time

def trigger_document_automation(matter_id: str, 
                                  template_id: str,
                                  title: str = "Retainer Agreement") -> str:
    """Returns document ID."""
    payload = {
        "data": {
            "matter": {"id": matter_id},
            "document_template": {"id": template_id},
            "title": title
        }
    }
    result = api_call_with_retry("POST", "/documents", json=payload)
    return result["data"]["id"]

def wait_for_document(document_id: str, 
                       max_wait_seconds: int = 30) -> dict:
    """Polls until document is ready."""
    for attempt in range(max_wait_seconds // 2):
        result = api_call_with_retry("GET", f"/documents/{document_id}",
                                      params={"fields": "id,name,status"})
        doc = result["data"]
        
        if doc.get("status") == "processed":
            return doc
        
        time.sleep(2)
    
    raise TimeoutError(f"Document {document_id} not ready after {max_wait_seconds}s")

def download_document_pdf(document_id: str, 
                            output_path: str) -> str:
    """Downloads document as PDF. Returns file path."""
    url = f"{CLIO_BASE_URL}/documents/{document_id}/download"
    response = requests.get(url, headers=get_headers())
    response.raise_for_status()
    
    with open(output_path, "wb") as f:
        f.write(response.content)
    
    return output_path
```

### Clio Merge Field Format
In your Clio document template, merge fields use this format:
```
{{ matter.client.name }}
{{ matter.custom_fields.accident_date }}
{{ matter.custom_fields.accident_location }}
{{ matter.custom_fields.accident_description }}
{{ matter.custom_fields.opposing_party_name }}
{{ matter.custom_fields.injuries_sustained }}
{{ matter.custom_fields.statute_of_limitations_date }}
{{ matter.responsible_staff.name }}
```

### GOTCHA: Custom Field Names in Templates
The merge field name must exactly match the custom field name you
created in Clio Settings. Case sensitive. Spaces become underscores.

---

## 6. RATE LIMITS & ERROR HANDLING

### Clio Rate Limits
- 10 requests per second per token
- 429 response = rate limited, wait and retry

```python
def api_call_with_retry(method: str, endpoint: str, 
                         max_retries: int = 3, **kwargs) -> dict:
    url = f"{CLIO_BASE_URL}{endpoint}"
    
    for attempt in range(max_retries):
        response = requests.request(method, url, 
                                     headers=get_headers(), **kwargs)
        
        if response.status_code == 429:
            wait_time = int(response.headers.get("Retry-After", 2))
            time.sleep(wait_time)
            continue
        
        if response.status_code == 401:
            refresh_access_token()
            continue
            
        response.raise_for_status()
        return response.json()
    
    raise Exception(f"Clio API failed after {max_retries} retries: {endpoint}")
```

---

## 7. COMMON ERROR CODES

| Code | Meaning | Fix |
|---|---|---|
| 401 | Token expired | Call refresh_access_token() |
| 403 | Wrong permissions | Check OAuth scopes |
| 404 | Matter/field not found | Verify ID is correct |
| 422 | Invalid data format | Check field types (dates as strings) |
| 429 | Rate limited | Wait and retry |

---

## 8. FINDING YOUR IDs

After Clio account setup, save these to .env:
```bash
# Get matter ID: Clio UI > Matters > click matter > URL contains the ID
# Format: https://app.clio.com/nc/#/matters/[MATTER_ID]

# Get template ID: Clio UI > Documents > Templates > click template > URL
# Format: https://app.clio.com/nc/#/document_templates/[TEMPLATE_ID]

# Get attorney ID: Call /users/who_am_i after OAuth
```
