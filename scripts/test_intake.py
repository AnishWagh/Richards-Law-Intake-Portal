import requests
import os

# Your n8n intake webhook URL
url = 'https://augmentloop.app.n8n.cloud/webhook/police-intake'

# Test data
matter_id = '1769228281'
client_email = 'talent.legal-engineer.hackathon.automation-email@swans.co'
file_path = 'ClientReports/GUILLERMO_REYES_v_LIONEL_FRANCOIS_et_al_EXHIBIT_S__XX.pdf'

if not os.path.exists(file_path):
    print(f"Error: File not found at {file_path}")
    exit(1)

files = {
    'police_report': open(file_path, 'rb')
}
data = {
    'matter_id': matter_id,
    'client_email': client_email,
    'client_name': 'REYES, GUILLERMO'
}

print(f"Sending {file_path} to {url}...")
try:
    response = requests.post(url, files=files, data=data)
    print(f"Status Code: {response.status_code}")
    print("Response Body:")
    print(response.text)
except Exception as e:
    print(f"Request failed: {e}")
