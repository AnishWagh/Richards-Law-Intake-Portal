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

// Using two distinct webhooks for the two phases
const WEBHOOK_EXTRACT = 'https://augmentloop.app.n8n.cloud/webhook/extract-pdf';
const WEBHOOK_EXECUTE = 'https://augmentloop.app.n8n.cloud/webhook/execute-automation';

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
    formData.append('data', selectedFile);

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
            throw new Error(`Server responded with ${response.status}. Ensure Extraction webhook is ACTIVE.`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert(`Extraction Error: ${error.message}`);
        uploadCard.classList.remove('hidden');
        statusContainer.classList.add('hidden');
    }
});

function populateVerificationForm(data) {
    document.getElementById('v-first-name').value = data.client_first_name || '';
    document.getElementById('v-last-name').value = data.client_last_name || '';
    document.getElementById('v-gender').value = data.client_gender || 'unknown';
    document.getElementById('v-opposing-party').value = data.opposing_party_name || '';
    document.getElementById('v-accident-date').value = data.accident_date || '';
    document.getElementById('v-accident-time').value = data.accident_time || '';
    document.getElementById('v-accident-type').value = data.accident_type || '';
    document.getElementById('v-number-injured').value = data.number_injured || 0;
    document.getElementById('v-location').value = data.accident_location || '';
    document.getElementById('v-injuries').value = data.injuries_sustained || '';
    document.getElementById('v-vehicle-info').value = data.vehicle_info || '';
    document.getElementById('v-plate').value = data.vehicle_registration_plate || '';
    document.getElementById('v-description').value = data.accident_description || '';
    document.getElementById('v-sol-date').value = data.statute_of_limitations_date || '';
}

// PHASE 2: Send Verified Data to Clio & Gmail
approveBtn.addEventListener('click', async () => {
    verificationContainer.classList.add('hidden');
    statusContainer.classList.remove('hidden');
    statusText.textContent = "Executing Automation: Updating Clio & Sending Email...";

    const payload = {
        matterId: matterIdInput.value.trim(),
        clientEmail: clientEmailInput.value.trim(),
        client_first_name: document.getElementById('v-first-name').value,
        client_last_name: document.getElementById('v-last-name').value,
        client_gender: document.getElementById('v-gender').value,
        opposing_party_name: document.getElementById('v-opposing-party').value,
        accident_date: document.getElementById('v-accident-date').value,
        accident_time: document.getElementById('v-accident-time').value,
        accident_type: document.getElementById('v-accident-type').value,
        number_injured: document.getElementById('v-number-injured').value,
        accident_location: document.getElementById('v-location').value,
        injuries_sustained: document.getElementById('v-injuries').value,
        vehicle_info: document.getElementById('v-vehicle-info').value,
        vehicle_registration_plate: document.getElementById('v-plate').value,
        accident_description: document.getElementById('v-description').value,
        statute_of_limitations_date: document.getElementById('v-sol-date').value
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
            throw new Error(`Server responded with ${response.status}.`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert(`Execution Error: ${error.message}`);
        verificationContainer.classList.remove('hidden');
        statusContainer.classList.add('hidden');
    }
});