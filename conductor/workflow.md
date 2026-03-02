# Project Workflow

## Guiding Principles

1. **The Plan is the Source of Truth:** All work must be tracked in `plan.md`
2. **The Tech Stack is Deliberate:** Changes to the tech stack must be documented in `tech-stack.md` *before* implementation
3. **Test-Driven Development:** Write unit tests before implementing functionality
4. **High Code Coverage:** Aim for >80% code coverage for all modules
5. **User Experience First:** Every decision should prioritize user experience
6. **Non-Interactive & CI-Aware:** Prefer non-interactive commands. Use `CI=true` for watch-mode tools (tests, linters) to ensure single execution.
7. **Document Everything:** Every assumption, anomaly, constraint, and decision must be captured in the living documentation before moving forward. Undocumented decisions are invisible risks.

---

## Living Documentation Files

These files must be kept current throughout the entire project lifecycle.
They are not created once and forgotten — they are updated continuously.

| File | Purpose | Updated When |
|---|---|---|
| `plan.md` | Task tracking, phase progress, commit SHAs | Every task start and completion |
| `tech-stack.md` | Technology decisions and deviations | Before any stack change |
| `docs/decisions_and_assumptions.md` | Every assumption, decision, and constraint | During every task, before implementing |
| `docs/risk_register.md` | All identified risks and mitigations | When any new risk is discovered |
| `docs/pdf_audit.md` | PDF extraction anomalies and field behaviors | When any PDF produces unexpected output |
| `docs/phase_summaries.md` | Per-phase synthesis of all documentation | At every phase completion |
| `docs/brief_audit.md` | Hackathon brief constraints and requirements | When brief ambiguities are discovered |
| `docs/system_audit.md` | System conflicts, gaps, and contradictions | When project files contradict each other |

---

## Task Workflow

All tasks follow a strict lifecycle:

### Standard Task Workflow

1. **Select Task:** Choose the next available task from `plan.md` in sequential order

2. **Mark In Progress:** Before beginning work, edit `plan.md` and change the task from `[ ]` to `[~]`

3. **Write Failing Tests (Red Phase):**
   - Create a new test file for the feature or bug fix.
   - Write one or more unit tests that clearly define the expected behavior and acceptance criteria for the task.
   - **CRITICAL:** Run the tests and confirm that they fail as expected. This is the "Red" phase of TDD. Do not proceed until you have failing tests.

---

### 3b. Document Discoveries Before Implementing (Mandatory)

**This step runs between writing failing tests and writing implementation code.**
**It is not optional. It cannot be skipped.**

Before writing any implementation code, scan for and document any of
the following that were discovered while analyzing the task or writing tests:

**Trigger this step if you find ANY of the following:**
- A constraint not previously documented
- A behavior in an external API (Clio, Claude, Gmail, n8n) that differs
  from documentation or our skill files
- An ambiguity in the hackathon brief that requires an assumption
- A field in a police report PDF that behaves unexpectedly
- A conflict between two files in the project
- A risk that is not in `docs/risk_register.md`
- A decision point where multiple valid approaches exist
- Any surprise discovered while reading tests, APIs, or source documents

**Action: Append to `docs/decisions_and_assumptions.md` immediately**

Use this exact format for every item:

```
### [TYPE] Short Title
**Type:** Decision | Assumption | Anomaly | Constraint | Risk
**Discovered During:** [Task name / Phase name]
**Timestamp:** YYYY-MM-DD HH:MM
**Detail:** Full explanation of what was found
**Impact if ignored:** What breaks or weakens if we skip this
**Decision made:** What we chose to do and why
**Owner:** Which agent or component owns this
**Status:** Confirmed | Unconfirmed | Needs human validation
```

**Action: Update `docs/risk_register.md` if the discovery is a risk**

Add a new row to the risk register table immediately.
Do not wait until phase completion.

**If Status is "Needs human validation":**
- **STOP** implementation for this task immediately
- Surface the item to the user with:
  - Exactly what was found
  - Why it blocks implementation
  - Your recommended decision
  - What you need from the human to proceed
- Do not resume until the human confirms explicitly

**If nothing new was discovered:** Write a one-line note in the task's
git commit message: `No new assumptions or anomalies discovered.`

**Then proceed to Step 4.**

---

4. **Implement to Pass Tests (Green Phase):**
   - Write the minimum amount of application code necessary to make the failing tests pass.
   - Run the test suite again and confirm that all tests now pass. This is the "Green" phase.

5. **Refactor (Optional but Recommended):**
   - With the safety of passing tests, refactor the implementation code and the test code to improve clarity, remove duplication, and enhance performance without changing the external behavior.
   - Rerun tests to ensure they still pass after refactoring.

6. **Verify Coverage:** Run coverage reports using the project's chosen tools. For example, in a Python project, this might look like:
   ```bash
   pytest --cov=app --cov-report=html
   ```
   Target: >80% coverage for new code. The specific tools and commands will vary by language and framework.

7. **Document Deviations:** If implementation differs from tech stack:
   - **STOP** implementation
   - Update `tech-stack.md` with new design
   - Add dated note explaining the change
   - Resume implementation

8. **Commit Code Changes:**
   - Stage all code changes related to the task.
   - Propose a clear, concise commit message e.g, `feat(ui): Create basic HTML structure for calculator`.
   - Perform the commit.

9. **Attach Task Summary with Git Notes:**
   - **Step 9.1: Get Commit Hash:** Obtain the hash of the *just-completed commit* (`git log -1 --format="%H"`).
   - **Step 9.2: Draft Note Content:** Create a detailed summary for the completed task. This should include the task name, a summary of changes, a list of all created/modified files, the core "why" for the change, and a list of any assumptions or anomalies documented during this task.
   - **Step 9.3: Attach Note:** Use the `git notes` command to attach the summary to the commit.
     ```bash
     git notes add -m "<note content>" <commit_hash>
     ```

10. **Get and Record Task Commit SHA:**
    - **Step 10.1: Update Plan:** Read `plan.md`, find the line for the completed task, update its status from `[~]` to `[x]`, and append the first 7 characters of the *just-completed commit's* commit hash.
    - **Step 10.2: Write Plan:** Write the updated content back to `plan.md`.

11. **Commit Plan Update:**
    - **Action:** Stage the modified `plan.md` file.
    - **Action:** Commit this change with a descriptive message (e.g., `conductor(plan): Mark task 'Create user model' as complete`).

---

### Quality Gates

Before marking any task complete, verify all of the following:

**Code Quality:**
- [ ] All tests pass
- [ ] Code coverage meets requirements (>80%)
- [ ] Code follows project's code style guidelines (as defined in `code_styleguides/`)
- [ ] All public functions/methods are documented (e.g., docstrings, JSDoc, GoDoc)
- [ ] Type safety is enforced (e.g., type hints, TypeScript types, Go types)
- [ ] No linting or static analysis errors (using the project's configured tools)
- [ ] Works correctly on mobile (if applicable)
- [ ] Documentation updated if needed
- [ ] No security vulnerabilities introduced

**Documentation Quality (Mandatory — task is NOT complete without these):**
- [ ] `docs/decisions_and_assumptions.md` updated if any assumption was made during this task
- [ ] `docs/risk_register.md` updated if any new risk was identified
- [ ] No items with Status `Needs human validation` left unresolved
- [ ] Any anomaly found in a PDF, API response, or tool behavior is documented before the task closes
- [ ] If a skill file pattern was found to be incorrect or incomplete, the skill file was updated and the change was noted with a timestamp
- [ ] Git note includes a summary of assumptions and anomalies discovered (or explicit statement that none were found)

---

## Phase Completion Verification and Checkpointing Protocol

**Trigger:** This protocol is executed immediately after a task is completed that also concludes a phase in `plan.md`.

1. **Announce Protocol Start:** Inform the user that the phase is complete and the verification and checkpointing protocol has begun.

2. **Ensure Test Coverage for Phase Changes:**
   - **Step 2.1: Determine Phase Scope:** To identify the files changed in this phase, you must first find the starting point. Read `plan.md` to find the Git commit SHA of the *previous* phase's checkpoint. If no previous checkpoint exists, the scope is all changes since the first commit.
   - **Step 2.2: List Changed Files:** Execute `git diff --name-only <previous_checkpoint_sha> HEAD` to get a precise list of all files modified during this phase.
   - **Step 2.3: Verify and Create Tests:** For each file in the list:
     - **CRITICAL:** First, check its extension. Exclude non-code files (e.g., `.json`, `.md`, `.yaml`).
     - For each remaining code file, verify a corresponding test file exists.
     - If a test file is missing, you **must** create one. Before writing the test, **first, analyze other test files in the repository to determine the correct naming convention and testing style.** The new tests **must** validate the functionality described in this phase's tasks (`plan.md`).

3. **Execute Automated Tests with Proactive Debugging:**
   - Before execution, you **must** announce the exact shell command you will use to run the tests.
   - **Example Announcement:** "I will now run the automated test suite to verify the phase. **Command:** `CI=true npm test`"
   - Execute the announced command.
   - If tests fail, you **must** inform the user and begin debugging. You may attempt to propose a fix a **maximum of two times**. If the tests still fail after your second proposed fix, you **must stop**, report the persistent failure, and ask the user for guidance.

---

### 4b. Synthesize and Validate Living Documentation (Mandatory at Every Phase Completion)

**This step runs before the manual verification plan is presented to the user.**
**It cannot be skipped.**

**Step 4b.1: Audit `docs/decisions_and_assumptions.md`**
- Count all items added during this phase
- Flag any with `Status: Unconfirmed` — list them for human review
- Flag any with `Status: Needs human validation` that were not resolved
- Verify every assumption has a documented decision
- If any unresolved items exist: **STOP** — do not proceed to Step 5 until human confirms each one

**Step 4b.2: Audit `docs/risk_register.md`**
- Verify all risks discovered during this phase are logged
- Update the Mitigation column for any risks that were addressed during this phase
- Flag any HIGH impact risks that remain unmitigated — surface to human

**Step 4b.3: Audit `docs/pdf_audit.md` (if PDFs were processed this phase)**
- Verify any new extraction anomalies found during testing are logged
- Add any fields that behaved unexpectedly across multiple reports
- Note which reports produced the anomaly

**Step 4b.4: Audit skill files (if any skill file patterns were found incorrect)**
- Verify the skill file was updated with the corrected pattern
- Verify a timestamp and reason for the change was added to the skill file

**Step 4b.5: Produce Phase Documentation Summary**

Append to `docs/phase_summaries.md`:

```markdown
## Phase [N] — [Phase Name]
**Completed:** YYYY-MM-DD HH:MM
**Checkpoint SHA:** [first 7 chars — filled after checkpoint commit]

### Tasks Completed This Phase
- [List all tasks with their commit SHAs]

### Decisions Made This Phase
[List all items added to decisions_and_assumptions.md this phase,
one line each with Type and title]

### Assumptions Validated
[List assumptions that were confirmed by actual implementation or testing]

### Assumptions Still Unconfirmed
[List assumptions that remain unverified — these carry forward to next phase]

### Anomalies Discovered
[List any unexpected behaviors found in APIs, PDFs, tools, or project files]

### Risks Added to Register
[List new risks added this phase with their impact level]

### Risks Mitigated This Phase
[List risks that were resolved and how]

### Skill Files Updated
[List any skill files that were corrected or expanded this phase]

### What the Next Phase Must Know
[Critical context the next phase's tasks must be aware of before starting]

### Unresolved Items Carried Forward
[Any items that were not resolved and must be addressed in the next phase]
```

**Step 4b.6: If any Unconfirmed or Needs Human Validation items exist after the audit:**
- Do **NOT** proceed to Step 5 (manual verification plan)
- Present all unresolved items to the human in a numbered list
- For each item, include your recommended resolution
- Wait for explicit human confirmation on every item before continuing

---

4. **Propose a Detailed, Actionable Manual Verification Plan:**
   - **CRITICAL:** To generate the plan, first analyze `product.md`, `product-guidelines.md`, and `plan.md` to determine the user-facing goals of the completed phase.
   - You **must** generate a step-by-step plan that walks the user through the verification process, including any necessary commands and specific, expected outcomes.
   - The plan you present to the user **must** follow this format:

     **For a Frontend Change:**
     ```
     The automated tests have passed. For manual verification, please follow these steps:

     Manual Verification Steps:
     1. Start the development server with the command: `npm run dev`
     2. Open your browser to: `http://localhost:3000`
     3. Confirm that you see: The new user profile page, with the user's name and email displayed correctly.
     ```

     **For a Backend Change:**
     ```
     The automated tests have passed. For manual verification, please follow these steps:

     Manual Verification Steps:
     1. Ensure the server is running.
     2. Execute the following command in your terminal: `curl -X POST http://localhost:8080/api/v1/users -d '{"name": "test"}'`
     3. Confirm that you receive: A JSON response with a status of `201 Created`.
     ```

5. **Await Explicit User Feedback:**
   - After presenting the detailed plan, ask the user for confirmation: "**Does this meet your expectations? Please confirm with yes or provide feedback on what needs to be changed.**"
   - **PAUSE** and await the user's response. Do not proceed without an explicit yes or confirmation.

6. **Create Checkpoint Commit:**
   - Stage all changes. If no changes occurred in this step, proceed with an empty commit.
   - Perform the commit with a clear and concise message (e.g., `conductor(checkpoint): Checkpoint end of Phase X`).

7. **Attach Auditable Verification Report using Git Notes:**
   - **Step 7.1: Draft Note Content:** Create a detailed verification report including:
     - The automated test command and results
     - The manual verification steps
     - The user's confirmation
     - Count of assumptions/decisions documented this phase
     - Count of risks in the register
     - Any unresolved items carried forward to the next phase
   - **Step 7.2: Attach Note:** Use the `git notes` command and the full commit hash from the previous step to attach the full report to the checkpoint commit.

8. **Get and Record Phase Checkpoint SHA:**
   - **Step 8.1: Get Commit Hash:** Obtain the hash of the *just-created checkpoint commit* (`git log -1 --format="%H"`).
   - **Step 8.2: Update Plan:** Read `plan.md`, find the heading for the completed phase, and append the first 7 characters of the commit hash in the format `[checkpoint: <sha>]`.
   - **Step 8.3: Update Phase Summary:** Go back to `docs/phase_summaries.md` and fill in the Checkpoint SHA field for this phase.
   - **Step 8.4: Write Plan:** Write the updated content back to `plan.md`.

9. **Commit Plan Update:**
   - **Action:** Stage the modified `plan.md` and `docs/phase_summaries.md` files.
   - **Action:** Commit this change with a descriptive message following the format `conductor(plan): Mark phase '<PHASE NAME>' as complete`.

10. **Announce Completion:** Inform the user that the phase is complete and the checkpoint has been created, with the detailed verification report attached as a git note. Include a one-line summary of documentation health: how many assumptions are confirmed vs. unconfirmed, and how many risks remain open.

---

## Emergency Procedures

### Critical Bug in Production
1. Create hotfix branch from main
2. Write failing test for bug
3. Implement minimal fix
4. Test thoroughly including mobile
5. Deploy immediately
6. Document in plan.md

### Data Loss
1. Stop all write operations
2. Restore from latest backup
3. Verify data integrity
4. Document incident
5. Update backup procedures

### Security Breach
1. Rotate all secrets immediately
2. Review access logs
3. Patch vulnerability
4. Notify affected users (if any)
5. Document and update security procedures

### Undocumented Anomaly Discovered Mid-Implementation

If during implementation you discover something that contradicts
existing documentation, skill files, prior assumptions, or expected
API behavior:

1. **STOP** implementation immediately — do not work around it silently
2. Document the anomaly in `docs/decisions_and_assumptions.md`
   using the standard format with `Type: Anomaly`
3. Assess impact:
   - **HIGH** (breaks existing built components or submission requirements): Surface to human before continuing
   - **MEDIUM** (weakens reliability or quality): Document decision, continue, flag in phase summary
   - **LOW** (cosmetic or edge case): Document, continue, note in git commit
4. If the anomaly invalidates a skill file pattern:
   - Update the skill file immediately
   - Add a timestamp and reason for the change at the top of the affected section
   - Note the update in the current task's git commit message
5. Never silently work around an anomaly without documenting it
6. If HIGH impact: wait for human confirmation before resuming

### Skill File Found to Be Incorrect

If implementation reveals that a skill file contains wrong information:

1. **Do not** silently use the correct approach without updating the skill
2. Update the skill file with the corrected pattern
3. Add this header to the corrected section:
   ```
   > ⚠️ CORRECTED [YYYY-MM-DD]: [One line explaining what was wrong and what is correct]
   ```
4. Document the correction in `docs/decisions_and_assumptions.md`
   with `Type: Anomaly`
5. Continue implementation using the corrected pattern

---

## Development Commands

**AI AGENT INSTRUCTION: This section should be adapted to the project's specific language, framework, and build tools.**

### Setup
```bash
# Example: Commands to set up the development environment
# e.g., for a Node.js project: npm install
# e.g., for a Python project: pip install -r requirements.txt
```

### Daily Development
```bash
# Example: Commands for common daily tasks
# e.g., for a Node.js project: npm run dev, npm test, npm run lint
# e.g., for a Python project: python main.py, pytest, flake8
```

### Before Committing
```bash
# Example: Commands to run all pre-commit checks
# e.g., for a Node.js project: npm run check
# e.g., for a Python project: make check
```

---

## Testing Requirements

### Unit Testing
- Every module must have corresponding tests.
- Use appropriate test setup/teardown mechanisms (e.g., fixtures, beforeEach/afterEach).
- Mock external dependencies.
- Test both success and failure cases.

### Integration Testing
- Test complete user flows
- Verify database transactions
- Test authentication and authorization
- Check form submissions

### Mobile Testing
- Test on actual iPhone when possible
- Use Safari developer tools
- Test touch interactions
- Verify responsive layouts
- Check performance on 3G/4G

---

## Code Review Process

### Self-Review Checklist
Before requesting review:

1. **Functionality**
   - Feature works as specified
   - Edge cases handled
   - Error messages are user-friendly

2. **Code Quality**
   - Follows style guide
   - DRY principle applied
   - Clear variable/function names
   - Appropriate comments

3. **Testing**
   - Unit tests comprehensive
   - Integration tests pass
   - Coverage adequate (>80%)

4. **Security**
   - No hardcoded secrets
   - Input validation present
   - SQL injection prevented
   - XSS protection in place

5. **Performance**
   - Database queries optimized
   - Images optimized
   - Caching implemented where needed

6. **Mobile Experience**
   - Touch targets adequate (44x44px)
   - Text readable without zooming
   - Performance acceptable on mobile
   - Interactions feel native

7. **Documentation**
   - All assumptions documented in `docs/decisions_and_assumptions.md`
   - All new risks logged in `docs/risk_register.md`
   - No anomalies discovered and left undocumented
   - Skill files updated if any patterns were found incorrect

---

## Commit Guidelines

### Message Format
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests
- `chore`: Maintenance tasks
- `conductor`: Conductor/orchestration system updates (plan, checkpoint, docs)
- `assumption`: New assumption or decision documented
- `anomaly`: Anomaly discovered and documented

### Examples
```bash
git commit -m "feat(extraction): Add Claude PDF extraction for police reports"
git commit -m "fix(clio): Correct custom field value format for date fields"
git commit -m "assumption(sol): Document 8-year SOL decision per client request"
git commit -m "anomaly(clio): Clio document generation is async, added polling"
git commit -m "conductor(checkpoint): Checkpoint end of Phase 1 — Foundation"
```

---

## Definition of Done

A task is complete when ALL of the following are true:

**Implementation:**
1. All code implemented to specification
2. Unit tests written and passing
3. Code coverage meets project requirements (>80%)
4. Code passes all configured linting and static analysis checks
5. Works correctly on mobile (if applicable)

**Documentation:**
6. All assumptions made during this task documented in `docs/decisions_and_assumptions.md`
7. All new risks logged in `docs/risk_register.md`
8. No anomalies discovered and left undocumented
9. Any incorrect skill file patterns corrected with timestamp
10. Implementation notes added to `plan.md`

**Commit:**
11. Changes committed with proper message format
12. Git note with task summary attached, including assumption/anomaly count
13. `plan.md` updated with task status and commit SHA

---

## Deployment Workflow

### Pre-Deployment Checklist
- [ ] All tests passing
- [ ] Coverage >80%
- [ ] No linting errors
- [ ] Mobile testing complete
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Backup created
- [ ] `docs/decisions_and_assumptions.md` has no unresolved items
- [ ] `docs/risk_register.md` has no unmitigated HIGH risks
- [ ] `docs/phase_summaries.md` is current through the last phase

### Deployment Steps
1. Merge feature branch to main
2. Tag release with version
3. Push to deployment service
4. Run database migrations
5. Verify deployment
6. Test critical paths
7. Monitor for errors

### Post-Deployment
1. Monitor analytics
2. Check error logs
3. Gather user feedback
4. Plan next iteration

---

## Continuous Improvement

- Review workflow weekly
- Update based on pain points
- Document lessons learned
- Optimize for user happiness
- Keep things simple and maintainable
- If a workflow step consistently causes friction, document it as an anomaly
  and propose an improvement — do not silently skip it
