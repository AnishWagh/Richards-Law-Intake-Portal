const fileInput = document.getElementById('file-input');
const matterIdInput = document.getElementById('matter-id');
const clientEmailInput = document.getElementById('client-email');
const fileInfo = document.getElementById('file-info');
const fileNameDisplay = document.querySelector('.file-name');
const extractBtn = document.getElementById('extract-btn');
const browseLabel = document.getElementById('browse-label');
const statusContainer = document.getElementById('status-container');
const statusText = document.getElementById('status-text');
const successContainer = document.getElementById('success-container');
const uploadCard = document.querySelector('.upload-card');
const verificationContainer = document.getElementById('verification-container');
const approveBtn = document.getElementById('approve-btn');

// Using unique webhook paths to avoid conflicts
const WEBHOOK_EXTRACT = 'https://augmentloop.app.n8n.cloud/webhook/swans-police-intake-v1';
const WEBHOOK_EXECUTE = 'https://augmentloop.app.n8n.cloud/webhook/swans-police-verify-v1';

let selectedFile = null;

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        selectedFile = e.target.files[0];
        if (selectedFile.type !== 'application/pdf') {
            alert('Please upload a PDF file.');
            selectedFile = null;
            fileInput.value = '';
            return;
        }
        fileNameDisplay.textContent = `Attached: ${selectedFile.name}`;
        fileInfo.classList.remove('hidden');
        browseLabel.textContent = 'Change PDF';
    }
});

// PHASE 1: Send PDF to AI for Extraction
extractBtn.addEventListener('click', async () => {
    const matterId = matterIdInput.value.trim();
    const clientEmail = clientEmailInput.value.trim();

    if (!matterId || !clientEmail || !selectedFile) {
        alert('Please provide Matter ID, Client Email, and a PDF file.');
        return;
    }

    uploadCard.classList.add('hidden');
    statusContainer.classList.remove('hidden');
    statusText.textContent = "AI Agent is reading the PDF (Phase 1)...";

    const formData = new FormData();
    formData.append('police_report', selectedFile);
    formData.append('matter_id', matterId);
    formData.append('client_email', clientEmail);
    formData.append('client_name', 'Extracted from PDF'); 

    try {
        const response = await fetch(WEBHOOK_EXTRACT, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            populateVerificationForm(data);
            statusContainer.classList.add('hidden');
            verificationContainer.classList.remove('hidden');
        } else {
            throw new Error(`Server responded with ${response.status}. Ensure Intake webhook is ACTIVE and CORS is enabled.`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert(`Extraction Error: ${error.message}`);
        uploadCard.classList.remove('hidden');
        statusContainer.classList.add('hidden');
    }
});

function populateVerificationForm(data) {
    // Mapping from n8n extracted fields to UI
    document.getElementById('v-last-name').value = data.client_name || '';
    document.getElementById('v-first-name').value = ''; 
    document.getElementById('v-gender').value = data.client_sex || 'M';
    document.getElementById('v-opposing-party').value = data.defendant_name || '';
    document.getElementById('v-accident-date').value = data.date_of_accident || '';
    document.getElementById('v-accident-type').value = 'Motor Vehicle Accident';
    document.getElementById('v-number-injured').value = data.number_of_injured || 0;
    document.getElementById('v-location').value = data.accident_location || '';
    document.getElementById('v-plate').value = data.client_vehicle_plate || '';
    document.getElementById('v-description').value = data.accident_description || '';
    document.getElementById('v-sol-date').value = data.sol_date || '';
    
    // State needed for execution phase
    window.extractedCaseData = data;
}

// PHASE 2: Send Verified Data to Clio & Gmail
approveBtn.addEventListener('click', async () => {
    verificationContainer.classList.add('hidden');
    statusContainer.classList.remove('hidden');
    statusText.textContent = "Executing Automation: Updating Clio & Sending Email...";

    const payload = {
        ...window.extractedCaseData,
        client_name: document.getElementById('v-last-name').value,
        client_sex: document.getElementById('v-gender').value,
        defendant_name: document.getElementById('v-opposing-party').value,
        date_of_accident: document.getElementById('v-accident-date').value,
        number_of_injured: document.getElementById('v-number-injured').value,
        accident_location: document.getElementById('v-location').value,
        client_vehicle_plate: document.getElementById('v-plate').value,
        accident_description: document.getElementById('v-description').value,
        sol_date: document.getElementById('v-sol-date').value,
        verified_at: new Date().toISOString()
    };

    try {
        const response = await fetch(WEBHOOK_EXECUTE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            statusContainer.classList.add('hidden');
            successContainer.classList.remove('hidden');
        } else {
            throw new Error(`Server responded with ${response.status}. Ensure Verification webhook is ACTIVE and CORS is enabled.`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert(`Execution Error: ${error.message}`);
        verificationContainer.classList.remove('hidden');
        statusContainer.classList.add('hidden');
    }
});