# Swans Hackathon Submission Video Script

**Length: Target 10-15 Minutes**

## Part 1: The Setup & Problem (1-2 min)
- "Hi Andrew and the Swans team. Today I'm going to walk you through the custom AI Automation pipeline I've built for Richards & Law to solve the critical 'speed-to-lead' problem."
- "As you know, manual entry from messy MV-104A police reports causes delays that lose clients to faster firms. Our goal is to ingest the report, extract the retainer details, update Clio, and dispatch the welcome email with the appropriate scheduling link—instantly."

## Part 2: The Portal Demo (2 min)
- *Share screen showing the Richards & Law Intake Portal.*
- "To make this incredibly easy for your team, I built a dedicated intake portal. Your paralegals simply drop the PDF here. There is no training required."
- "Let's run a live test with the Guillermo Reyes case file."
- *Drag and drop the PDF, click Process.*
- "Behind the scenes, this hits our secure n8n production webhook..."

## Part 3: Architecture Walkthrough (5-7 min)
- *Switch screen to n8n canvas (final_robust_workflow.json).*
- "Here is the blueprint. I initially explored n8n's visual AI Agent nodes, but found them unreliable when handling binary PDF data. A 'Legal Engineer' needs production-grade reliability."
- "Therefore, I architected a robust, explicit integration path:"
  1. **Webhook:** Receives the file and metadata.
  2. **Anthropic API Node:** We use Claude 3.5 Sonnet, passing the binary data directly to the `/messages` endpoint. I engineered a strict JSON schema prompt to enforce our extraction rules. *Show the prompt briefly.*
  3. **Logic Node:** We parse the JSON, calculate the seasonal logic (Summer vs. Winter scheduling links), and map the data.
  4. **Clio Integration:** We make an explicit PATCH request to the Matter with the precise Custom Field IDs. We also POST the 8-year Statute of Limitations deadline directly to the Responsible Attorney's calendar.
  5. **Gmail Integration:** Finally, we dispatch the customized welcome email.

## Part 4: The Result & Post-Deployment (2 min)
- *Show the extracted JSON output from the simulation or real run.*
- "As you can see, Claude perfectly extracted Guillermo Reyes, handled the opposing party details, and correctly parsed the narrative without hallucinating."
- *Show the draft Clio output or Gmail draft.*
- "The matter is updated, and the client receives a personalized email with the correct office scheduling link for the current season."
- **High-Level Implications:** "Post-deployment, this reduces a 30-minute manual task to 5 seconds. It eliminates transcription errors, ensures SOL dates are never missed, and guarantees you are the first firm to respond to the lead. This is how Richards & Law scales without adding headcount."

## Part 5: Sign Off (30 sec)
- "Thank you for the challenge. All JSON blueprints, portal code, and documentation are included in my submission email. I look forward to your feedback."