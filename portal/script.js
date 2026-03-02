const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const browseBtn = document.getElementById('browse-btn');
const fileInfo = document.getElementById('file-info');
const fileNameDisplay = document.querySelector('.file-name');
const submitBtn = document.getElementById('submit-btn');
const statusContainer = document.getElementById('status-container');
const successContainer = document.getElementById('success-container');
const uploadCard = document.querySelector('.upload-card');

const WEBHOOK_URL = 'https://augmentloop.app.n8n.cloud/webhook/police-report-upload';

let selectedFile = null;

// Handle click to browse
browseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
});

uploadCard.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

// Drag and drop logic
uploadCard.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadCard.classList.add('dragover');
});

uploadCard.addEventListener('dragleave', () => {
    uploadCard.classList.remove('dragover');
});

uploadCard.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadCard.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
});

function handleFiles(files) {
    if (files.length > 0) {
        selectedFile = files[0];
        if (selectedFile.type !== 'application/pdf') {
            alert('Please upload a PDF file.');
            selectedFile = null;
            return;
        }
        fileNameDisplay.textContent = selectedFile.name;
        fileInfo.classList.remove('hidden');
        browseBtn.classList.add('hidden');
    }
}

// Submit to n8n
submitBtn.addEventListener('click', async (e) => {
    e.stopPropagation(); // Prevent re-triggering file input
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
            const errorData = await response.json().catch(() => ({ message: 'Workflow failed' }));
            throw new Error(errorData.message || 'Workflow failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert(`Automation Error: ${error.message}\n\nMake sure the n8n workflow is ACTIVE.`);
        uploadCard.classList.remove('hidden');
        statusContainer.classList.add('hidden');
    }
});
