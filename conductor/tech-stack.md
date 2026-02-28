# Technology Stack

## Core Technologies
- **n8n:** The primary automation and orchestration platform for the intake workflow.
- **Python:** Used for advanced data processing scripts, custom API tests, and backend logic.
- **JavaScript (Node.js):** For writing logic within n8n nodes and potential custom modules.

## AI & Data Extraction
- **Anthropic Claude API:** Specifically `claude-3-5-sonnet-20240620`, utilized for high-accuracy extraction of legal data from scanned PDF reports.
- **Prompt Engineering:** Centralized system prompts for Claude to ensure consistent, structured JSON outputs.

## Primary Integrations
- **Clio Manage REST API v4:** Integration for legal case management (Matters, Contacts, Custom Fields, Document Automation, Calendar).
- **Gmail API:** For sending automated, personalized emails to potential clients.

## Infrastructure & Architecture
- **Webhook-Based Orchestration:** n8n acts as the central hub, triggered by webhooks to initiate the multi-stage automation process.
- **Human-in-the-Loop (HITL):** Use of n8n's Form nodes to create an approval and verification step for paralegals.
- **Environment Management:** Use of `.env` files for secure storage of API keys and project-specific credentials.
