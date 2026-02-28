# SKILL: n8n Workflow Patterns
## Version: 1.0 | Owner: Agent 4 | Last Updated: Phase 1

---

## WHO USES THIS SKILL
- Agent 4 (n8n Architect) — primary owner, builds the flow
- Agent 6 (QA & Reliability) — validates node behavior during testing
- Agent 8 (Research & Setup) — sets up n8n instance and credentials

## ENABLE THIS SKILL WHEN
You are building, modifying, testing, or debugging any part of the
n8n workflow.

---

## 1. N8N SETUP

### Starting n8n Locally
```bash
# Install (once)
npm install -g n8n

# Start n8n
n8n start

# Access UI
open http://localhost:5678

# Start with tunnel (for webhook testing from external)
n8n start --tunnel
```

### Setting Environment Variables in n8n
In n8n UI: Settings > Environment Variables
Or in ~/.n8n/.env file:

```bash
ANTHROPIC_API_KEY=your_key_here
CLIO_ACCESS_TOKEN=your_token_here
GMAIL_ACCESS_TOKEN=your_token_here
```

Access in nodes as: `{{ $env.ANTHROPIC_API_KEY }}`

### Getting n8n API Key
n8n UI > Settings > API > Create API Key
Save to your project .env as N8N_API_KEY

---

## 2. NAMING CONVENTIONS

### CRITICAL: Name Every Node Descriptively
Judges will see your node names. Bad names = points lost.

```
❌ BAD:                    ✅ GOOD:
HTTP Request               Extract PDF via Claude API
HTTP Request1              Update Clio Matter Fields
Code                       Calculate SOL Date
Code1                      Seasonal Booking URL Logic
IF                         Approved or Rejected?
Set                        Format Email Content
```

### Node Naming Pattern
`[Action] [Object] [Context]`
Examples:
- "Extract Data from Police Report PDF"
- "Update Clio Matter Custom Fields"
- "Create SOL Calendar Entry in Clio"
- "Generate Retainer Agreement via Clio Automation"
- "Send Personalized Retainer Email to Client"

---

## 3. WEBHOOK TRIGGER NODE

```json
{
  "name": "Receive Police Report Upload",
  "type": "n8n-nodes-base.webhook",
  "parameters": {
    "httpMethod": "POST",
    "path": "police-report-intake",
    "responseMode": "responseNode",
    "options": {
      "rawBody": true
    }
  }
}
```

### Expected Incoming Payload
```json
{
  "matter_id": "12345",
  "pdf_base64": "JVBERi0xLjQK...",
  "uploaded_by": "paralegal@richardslaw.com"
}
```

### Testing the Webhook
```bash
# Test with curl
curl -X POST http://localhost:5678/webhook/police-report-intake 
  -H "Content-Type: application/json" 
  -d '{
    "matter_id": "TEST_MATTER_ID",
    "pdf_base64": "'$(base64 -i ClientReports/GUILLERMO_REYES_v_LIONEL_FRANCOIS_et_al_EXHIBIT_S__XX.pdf)'"
  }'
```

---

## 4. HTTP REQUEST NODE — CLAUDE API

```
Node Name: "Extract Data from Police Report PDF"
Method: POST
URL: https://api.anthropic.com/v1/messages

Headers:
  x-api-key: {{ $env.ANTHROPIC_API_KEY }}
  anthropic-version: 2023-06-01
  content-type: application/json

Body (JSON):
{
  "model": "claude-3-5-sonnet-20240620",
  "max_tokens": 2000,
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "document",
          "source": {
            "type": "base64",
            "media_type": "application/pdf",
            "data": "{{ $json.pdf_base64 }}"
          }
        },
        {
          "type": "text",
          "text": "{{ $env.EXTRACTION_PROMPT }}"
        }
      ]
    }
  ]
}
```

---

## 5. CODE NODE PATTERNS

### Pattern 1: Parse Claude JSON Response
```javascript
// Node Name: "Parse and Validate Extracted Data"
const response = $input.first().json;
const rawText = response.content[0].text;

// Clean markdown fences if present
let clean = rawText.trim();
if (clean.startsWith('```')) {
  clean = clean.replace(/^```json?
?/, '').replace(/
?```$/, '');
}

let extracted;
try {
  extracted = JSON.parse(clean);
} catch (e) {
  throw new Error(`Claude returned invalid JSON: ${e.message}
Raw: ${rawText}`);
}

// Validate required fields
const required = [
  'client_first_name', 'client_last_name',
  'accident_date', 'accident_location', 
  'accident_description', 'injuries_sustained'
];

const missing = required.filter(f => !extracted[f]);
const lowConfidence = Object.entries(extracted.confidence_flags || {})
  .filter(([, v]) => v === 'low')
  .map(([k]) => k);

return [{
  json: {
    ...extracted,
    _matter_id: $('Receive Police Report Upload').first().json.matter_id,
    _validation: {
      missing_fields: missing,
      low_confidence_fields: lowConfidence,
      has_issues: missing.length > 0 || lowConfidence.length > 0
    }
  }
}];
```

### Pattern 2: Seasonal URL Logic
```javascript
// Node Name: "Determine Seasonal Booking Link"
const now = new Date();
const month = now.getMonth() + 1; // 1 = January, 12 = December

// March (3) through August (8) = in-office
// September (9) through February (2) = virtual
const isInOfficeSeason = month >= 3 && month <= 8;

const bookingLink = isInOfficeSeason
  ? $env.BOOKING_LINK_IN_OFFICE
  : $env.BOOKING_LINK_VIRTUAL;

return [{
  json: {
    ...$input.first().json,
    booking_link: bookingLink,
    booking_season: isInOfficeSeason ? 'in-office' : 'virtual',
    current_month: month
  }
}];
```

### Pattern 3: Format Email Body
```javascript
// Node Name: "Compose Personalized Client Email"
const data = $input.first().json;

// Format date for human reading
const accidentDate = new Date(data.accident_date + 'T12:00:00Z');
const formattedDate = accidentDate.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long', 
  day: 'numeric',
  timeZone: 'UTC'
});

const clientFirstName = data.client_first_name;
const clientFullName = `${data.client_first_name} ${data.client_last_name}`;

const emailBody = `Dear ${clientFirstName},

Thank you for reaching out to Richards & Law. We want you to know that we are here for you during this difficult time.

We have reviewed the details of your case. We understand that on ${formattedDate}, you were involved in an incident at ${data.accident_location}. ${data.accident_description}

Our firm handles cases exactly like yours, and we are committed to fighting for the compensation you deserve — at no upfront cost to you.

Attached, you will find our Retainer Agreement for your review. This document establishes our representation of you on a contingency basis, meaning we only get paid when you do.

Please click the link below to schedule your consultation with Andrew Richards:

${data.booking_link}

We look forward to speaking with you soon and getting started on your case.

Warm regards,
Andrew Richards
Richards & Law | New York, NY`;

return [{
  json: {
    ...data,
    email_subject: `Your Case — Richards & Law is Ready to Help`,
    email_body: emailBody,
    client_full_name: clientFullName,
    formatted_accident_date: formattedDate
  }
}];
```

### Pattern 4: Build Clio API Payload
```javascript
// Node Name: "Prepare Clio Custom Field Payload"
const data = $input.first().json;

// Load field IDs from environment
// These must be set after creating custom fields in Clio
const fieldIds = {
  accident_date: $env.CLIO_FIELD_ID_ACCIDENT_DATE,
  accident_location: $env.CLIO_FIELD_ID_ACCIDENT_LOCATION,
  accident_description: $env.CLIO_FIELD_ID_ACCIDENT_DESCRIPTION,
  opposing_party_name: $env.CLIO_FIELD_ID_OPPOSING_PARTY_NAME,
  opposing_party_address: $env.CLIO_FIELD_ID_OPPOSING_PARTY_ADDRESS,
  injuries_sustained: $env.CLIO_FIELD_ID_INJURIES_SUSTAINED,
  statute_of_limitations_date: $env.CLIO_FIELD_ID_SOL_DATE
};

const customFieldValues = [];

Object.entries(fieldIds).forEach(([fieldName, fieldId]) => {
  const value = data[fieldName];
  if (value && fieldId) {
    customFieldValues.push({
      custom_field: { id: fieldId },
      value: String(value)
    });
  }
});

return [{
  json: {
    data: {
      custom_field_values: customFieldValues
    },
    _matter_id: data._matter_id
  }
}];
```

---

## 6. IF / BRANCH NODE

```
Node Name: "Approved or Rejected by Paralegal?"
Condition: {{ $json.approval_status }} equals "Approve"
True path → Continue to Clio update
False path → Send rejection notification, stop flow
```

---

## 7. WAIT NODE (For Async Document Generation)

```
Node Name: "Wait for Retainer Document Generation"
Type: Fixed Interval
Wait Amount: 8
Wait Unit: Seconds
```

Note: Clio document generation is async. 8 seconds is conservative.
If documents are still not ready, increase to 15 seconds.

---

## 8. ERROR HANDLING

### Add Error Workflow to Every Critical Node
In n8n, right-click any node > Add Error Output

### Global Error Handler Node
```javascript
// Node Name: "Handle Flow Error"
const error = $input.first().json;
const matterId = $('Receive Police Report Upload').first().json?.matter_id || 'UNKNOWN';

// Log the error
console.error('Flow failed:', {
  matter_id: matterId,
  error: error,
  timestamp: new Date().toISOString()
});

// Return structured error for notification
return [{
  json: {
    error: true,
    matter_id: matterId,
    message: `Automation failed for matter ${matterId}. Manual review required.`,
    timestamp: new Date().toISOString(),
    details: JSON.stringify(error)
  }
}];
```

---

## 9. EXPORTING THE WORKFLOW

When flow is complete and tested:
1. n8n UI > Open workflow
2. Top right menu (three dots) > Download
3. Save as `n8n_blueprint/final_workflow.json`
4. This is your submission deliverable

### Before Exporting: Sanitize Credentials
Replace any hardcoded API keys in the export with environment variable
references: `{{ $env.VARIABLE_NAME }}`

Never submit a blueprint with real credentials embedded.

---

## 10. COMMON n8n ERRORS AND FIXES

| Error | Cause | Fix |
|---|---|---|
| `Cannot read property of undefined` | Previous node returned empty | Add IF node to check data exists |
| `401 Unauthorized` | Expired token | Refresh token, update env var |
| `Webhook not receiving` | n8n not running | Check localhost:5678 is up |
| `JSON parse error` | Claude returned text, not JSON | Add JSON cleaning in Code node |
| `Timeout` | Clio doc generation too slow | Increase Wait node duration |
| `Expression error` | Wrong node name in reference | Check exact node name spelling |
