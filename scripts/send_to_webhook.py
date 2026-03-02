import requests
import os
from pathlib import Path

# Using the TEST URL since the workflow is in "Listen" mode
WEBHOOK_URL = "https://augmentloop.app.n8n.cloud/webhook-test/police-report-upload"
FILE_NAME = "GUILLERMO_REYES_v_LIONEL_FRANCOIS_et_al_EXHIBIT_S__XX.pdf"
FILE_PATH = Path("ClientReports") / FILE_NAME

def send_test_pdf():
    if not FILE_PATH.exists():
        print(f"Error: File not found at {FILE_PATH}")
        return

    print(f"--- Sending {FILE_NAME} to n8n TEST Webhook ---")
    
    with open(FILE_PATH, 'rb') as f:
        files = {'data': (FILE_NAME, f, 'application/pdf')}
        try:
            response = requests.post(WEBHOOK_URL, files=files)
            
            print(f"Status Code: {response.status_code}")
            print("Response Body:")
            print(response.text)
            
            if response.status_code == 200:
                print("\nSUCCESS: PDF submitted to n8n TEST workflow.")
            else:
                print(f"\nFAILED: Webhook returned error {response.status_code}")
                
        except Exception as e:
            print(f"Error sending request: {e}")

if __name__ == "__main__":
    send_test_pdf()
