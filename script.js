const fileInput = document.getElementById('file-input');
const matterIdInput = document.getElementById('matter-id');
const clientEmailInput = document.getElementById('client-email');
const fileInfo = document.getElementById('file-info');
const fileNameDisplay = document.querySelector('.file-name');
const submitBtn = document.getElementById('submit-btn');
const browseLabel = document.getElementById('browse-label');
const statusContainer = document.getElementById('status-container');
const successContainer = document.getElementById('success-container');
const uploadCard = document.querySelector('.upload-card');

const WEBHOOK_URL = 'https://augmentloop.app.n8n.cloud/webhook/police-report-upload';

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

submitBtn.addEventListener('click', async () => {
    const matterId = matterIdInput.value.trim();
    const clientEmail = clientEmailInput.value.trim();

    if (!matterId || !clientEmail || !selectedFile) {
        alert('Please provide Matter ID, Client Email, and a PDF file.');
        return;
    }

    uploadCard.classList.add('hidden');
    statusContainer.classList.remove('hidden');

    const formData = new FormData();
    formData.append('data', selectedFile);
    formData.append('matterId', matterId);
    formData.append('clientEmail', clientEmail);

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            statusContainer.classList.add('hidden');
            successContainer.classList.remove('hidden');
        } else {
            const errorText = await response.text();
            throw new Error(`Server responded with ${response.status}. Ensure n8n workflow is ACTIVE.`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert(`Automation Error: ${error.message}`);
        uploadCard.classList.remove('hidden');
        statusContainer.classList.add('hidden');
    }
});
