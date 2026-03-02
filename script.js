const fileInput = document.getElementById('file-input');
const fileInfo = document.getElementById('file-info');
const fileNameDisplay = document.querySelector('.file-name');
const submitBtn = document.getElementById('submit-btn');
const browseLabel = document.getElementById('browse-label');
const statusContainer = document.getElementById('status-container');
const successContainer = document.getElementById('success-container');
const uploadCard = document.querySelector('.upload-card');

const WEBHOOK_URL = 'https://augmentloop.app.n8n.cloud/webhook/police-report-upload';

let selectedFile = null;

// File Selection Handler
fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        selectedFile = e.target.files[0];
        if (selectedFile.type !== 'application/pdf') {
            alert('Please upload a PDF file.');
            selectedFile = null;
            fileInput.value = '';
            return;
        }
        fileNameDisplay.textContent = `Selected: ${selectedFile.name}`;
        fileInfo.classList.remove('hidden');
        browseLabel.classList.add('hidden');
    }
});

// Drag and Drop
uploadCard.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadCard.style.borderColor = '#c5a059';
});

uploadCard.addEventListener('dragleave', () => {
    uploadCard.style.borderColor = '#d1d9e0';
});

uploadCard.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadCard.style.borderColor = '#d1d9e0';
    if (e.dataTransfer.files.length > 0) {
        fileInput.files = e.dataTransfer.files;
        // Trigger the change event manually
        fileInput.dispatchEvent(new Event('change'));
    }
});

// Submit to n8n
submitBtn.addEventListener('click', async () => {
    if (!selectedFile) return;

    uploadCard.classList.add('hidden');
    statusContainer.classList.remove('hidden');

    const formData = new FormData();
    formData.append('data', selectedFile);

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
            throw new Error(`Server responded with ${response.status}: ${errorText}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert(`Automation Error: ${error.message}\n\nPlease ensure the n8n workflow is ACTIVE.`);
        uploadCard.classList.remove('hidden');
        statusContainer.classList.add('hidden');
    }
});
