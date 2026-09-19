# CONTRADICTIONX — MASTER BUILD PROMPT

You are the lead full-stack engineer responsible for building a complete hackathon-ready MVP called:

**ContradictionX — AI Requirements Intelligence**

## 1. PRODUCT OBJECTIVE

Build a modern web application that allows a user to upload multiple software/business requirement documents and uses Google's Gemini API to analyze them together.

The system must identify:

1. Potential contradictions between requirements
2. Ambiguous or vague requirements
3. Missing information
4. Dependencies between requirements

The key value proposition is:

> "Find requirement conflicts humans may miss before they become software problems."

This is NOT a generic PDF chatbot.

The application must perform structured requirements analysis.

---

# 2. TECHNOLOGY STACK

Use:

### Frontend

* React
* Vite
* JavaScript
* React Router
* Modern CSS or a lightweight styling solution

### Backend

* Node.js
* Express
* JavaScript
* REST APIs

### Database

* MongoDB
* Mongoose

### AI

* Google Gemini API

### Document processing

Support PDF and TXT files for the MVP.

Use reliable npm packages for PDF text extraction.

DOCX support is optional and should ONLY be added if it does not jeopardize the core MVP.

### Deployment target

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

---

# 3. IMPORTANT DEVELOPMENT PRINCIPLES

Prioritize reliability over unnecessary features.

Do NOT build:

* Generic chatbot functionality
* Authentication unless absolutely necessary
* Payment systems
* Admin panels
* Model training
* Hardware/sensor functionality
* Unrelated AI features
* Excessive animations
* Complex enterprise features

The core analysis workflow must work correctly first.

Build the application as a real usable product, not as a static prototype.

---

# 4. USER WORKFLOW

The complete workflow should be:

Landing Page
→ Upload Documents
→ Validate Files
→ Extract Text
→ Extract Requirements
→ Gemini Analysis
→ Validate AI JSON
→ Store Analysis
→ Results Dashboard
→ Investigate Issues
→ View Dependency Graph
→ View Analysis History

---

# 5. LANDING PAGE

Create a professional landing page for ContradictionX.

Include:

* Product name
* Short tagline
* Short explanation
* Main CTA: "Analyze Requirements"
* Small explanation of the four analysis capabilities:

  * Contradictions
  * Ambiguities
  * Missing Information
  * Dependencies

The design should feel like a modern AI developer/productivity tool.

Do not make it look like a generic AI chatbot.

---

# 6. DOCUMENT UPLOAD

Create an upload page.

Requirements:

* Upload multiple files
* Accept PDF and TXT
* Drag and drop
* File picker
* Display selected files
* Display filename and file size
* Allow removing files
* Validate unsupported files
* Validate empty files
* Show useful errors
* Require at least two documents before analysis

The user should clearly understand which documents are being compared.

---

# 7. DOCUMENT EXTRACTION

When analysis starts:

1. Receive uploaded documents in the backend.
2. Extract their text.
3. Preserve source metadata:

   * filename
   * document ID
   * page number when available
4. Clean unnecessary whitespace.
5. Divide the content into manageable sections.
6. Extract individual requirements.

Do not send unnecessarily huge raw documents to Gemini in a single request if doing so risks token limits.

Use a sensible chunking/analysis strategy.

---

# 8. REQUIREMENT EXTRACTION

Convert document content into structured requirements.

Each requirement should contain approximately:

```json
{
  "id": "REQ-001",
  "text": "Users can permanently delete their account immediately.",
  "sourceDocument": "user-policy.pdf",
  "page": 3,
  "section": "Account Management"
}
```

Requirement IDs must be stable within an analysis.

Display extracted requirements where useful.

---

# 9. GEMINI ANALYSIS

Use Gemini as the reasoning engine.

Gemini must analyze requirements across documents.

It must identify:

## A. CONTRADICTIONS

Find requirements whose intended behavior, constraints, timing, permissions, data handling, or business rules potentially conflict.

Example:

Requirement A:
"Users can permanently delete their account immediately."

Requirement B:
"Transaction records must be retained for seven years."

The system should identify this as a potential conflict and explain the conditions under which it conflicts.

Do NOT report every difference as a contradiction.

---

## B. AMBIGUITIES

Identify requirements that are vague, unclear, incomplete, subjective, or open to multiple interpretations.

Examples:

"System should respond quickly."

"The application should be secure."

"Users should receive notifications regularly."

Explain why the requirement is ambiguous and suggest how it could be clarified.

---

## C. MISSING INFORMATION

Identify important information that is necessary to implement or interpret a requirement but is not specified.

Examples:

* Missing timeout value
* Missing permission rule
* Missing retention period
* Missing error behavior
* Missing authentication condition
* Missing expected input/output behavior

Do not invent missing requirements as facts.

Describe them as potentially missing information.

---

## D. DEPENDENCIES

Identify relationships between requirements.

Example:

REQ-001:
User registration

REQ-002:
Email verification

REQ-003:
Account activation

Possible dependency:

REQ-001 → REQ-002 → REQ-003

Each dependency should include a short explanation.

---

# 10. AI OUTPUT FORMAT

Gemini must return structured JSON.

Do NOT rely on free-form natural-language responses for the main analysis.

Use a structure similar to:

```json
{
  "requirements": [],
  "contradictions": [],
  "ambiguities": [],
  "missingInformation": [],
  "dependencies": []
}
```

A contradiction object should contain fields similar to:

```json
{
  "id": "CON-001",
  "type": "contradiction",
  "severity": "high",
  "confidence": 0.91,
  "requirementA": "REQ-001",
  "requirementB": "REQ-014",
  "explanation": "These requirements may conflict because...",
  "impact": "This could create conflicting implementation or compliance behavior.",
  "suggestedClarification": "Clarify which records are excluded from account deletion."
}
```

Ambiguity, missing-information and dependency objects should follow similarly structured formats.

Validate the JSON on the backend.

If Gemini returns malformed JSON, handle the error gracefully and retry or return a useful error rather than crashing the application.

---

# 11. CONFIDENCE AND SEVERITY

Every detected issue should have:

### Severity

One of:

* low
* medium
* high

### Confidence

A numerical confidence value between 0 and 1.

Display confidence as a percentage in the UI.

Important:

Confidence does NOT mean the issue is objectively true.

Use wording such as:

"Potential contradiction"

rather than:

"Confirmed contradiction"

when appropriate.

---

# 12. RESULTS DASHBOARD

Create a polished dashboard.

At the top show:

* Documents analyzed
* Requirements found
* Potential contradictions
* Ambiguities
* Missing information
* Dependencies

Example:

```text
42 Requirements

4 Potential Contradictions
7 Ambiguities
5 Missing Information
12 Dependencies
```

Create filters:

* All
* Contradictions
* Ambiguities
* Missing Information
* Dependencies

Each result should appear as a clear card/list item.

Display:

* Issue type
* Severity
* Confidence
* Short explanation
* Related requirement IDs

Allow clicking an issue to open the detailed view.

---

# 13. ISSUE DETAIL PAGE

Create a detailed issue view.

Show:

* Issue type
* Severity
* Confidence
* Explanation
* Impact
* Suggested clarification

For requirement-based issues show:

### Requirement A

Full requirement text

Source document

Page/section if available

### Requirement B

Full requirement text

Source document

Page/section if available

Use visually distinct evidence sections.

The user should be able to understand WHY the AI detected the issue without reading the entire document.

---

# 14. SOURCE REFERENCES

Whenever possible preserve document source information.

Show:

* Document filename
* Page number
* Section

Example:

`user-policy.pdf — Page 3 — Account Management`

If exact page information cannot be determined, do not fabricate it.

Use available metadata such as document and section.

---

# 15. DEPENDENCY GRAPH

Create a dependency visualization.

Represent requirements as nodes.

Represent dependencies as directed edges.

Example:

```text
Registration
     ↓
Email Verification
     ↓
Account Activation
     ↓
Dashboard Access
```

Each node should correspond to a requirement.

If the graph library introduces significant technical problems, implement a clean dependency list first and add visualization only after the core application is stable.

The dependency feature must never break the main application.

---

# 16. HISTORY

Store completed analyses in MongoDB.

Each analysis should contain:

* analysis ID
* title
* creation date
* documents
* requirements
* contradictions
* ambiguities
* missing information
* dependencies

Create a History page.

Allow users to:

* View previous analysis
* Delete previous analysis

---

# 17. DATABASE MODELS

Use Mongoose.

Create sensible schemas for:

### Analysis

```text
title
documents
requirements
issues
dependencies
status
createdAt
updatedAt
```

You may normalize the schema if that creates a cleaner architecture.

Do not over-engineer the database.

---

# 18. BACKEND API

Implement REST APIs similar to:

```text
POST /api/documents/upload

POST /api/analysis

GET /api/analysis

GET /api/analysis/:id

DELETE /api/analysis/:id
```

Add appropriate validation and error handling.

Keep the API structure clean.

Use environment variables for:

* MongoDB URI
* Gemini API key
* Frontend URL
* Port

Never hard-code secrets.

---

# 19. FRONTEND STRUCTURE

Use a clean component architecture.

Suggested pages:

```text
HomePage
UploadPage
AnalysisPage
DashboardPage
IssueDetailPage
DependencyPage
HistoryPage
NotFoundPage
```

Suggested reusable components:

```text
Navbar
FileUploader
FileList
AnalysisProgress
StatsCards
IssueCard
IssueFilters
RequirementEvidence
SeverityBadge
ConfidenceBadge
DependencyGraph
EmptyState
ErrorState
LoadingState
```

Modify this structure if a better architecture is appropriate.

---

# 20. UI/UX REQUIREMENTS

The application should feel professional.

Use:

* Clean typography
* Good spacing
* Clear hierarchy
* Responsive layout
* Accessible buttons
* Consistent cards
* Clear status indicators
* Useful loading states
* Useful error messages
* Empty states

Avoid excessive visual effects.

The dashboard should be the main visual highlight.

The user should immediately understand:

"What was found?"

"How serious is it?"

"Which requirements are involved?"

"Where did they come from?"

"Why does it matter?"

---

# 21. ANALYSIS PROGRESS

While analysis is running, show meaningful progress.

Example:

```text
✓ Documents uploaded
✓ Text extracted
✓ Requirements identified
● Comparing requirements
○ Detecting ambiguities
○ Finding missing information
○ Building dependency map
```

Do not fake progress for long periods.

Progress should correspond to actual backend stages when practical.

---

# 22. ERROR HANDLING

Handle:

* Invalid files
* Empty files
* Too many files
* Gemini API errors
* Gemini rate limits
* Invalid AI output
* MongoDB connection errors
* Network failures
* Server errors
* Missing environment variables

Never leave the user with a blank screen.

Provide understandable error messages.

---

# 23. SECURITY BASICS

Implement reasonable security basics:

* Environment variables for secrets
* Input validation
* File type validation
* File size limits
* Safe error messages
* CORS configuration
* Helmet if appropriate
* Avoid exposing API keys to frontend

Do not expose the Gemini API key in React code.

---

# 24. PERFORMANCE

The MVP should remain practical for normal hackathon-sized documents.

Avoid:

* Unnecessary repeated Gemini calls
* Sending identical content repeatedly
* Excessive database writes
* Extremely large frontend state objects

If a document is too large, handle it gracefully.

---

# 25. TESTING

Before considering the project complete, test the full workflow:

1. Open application.
2. Upload two documents.
3. Verify extraction.
4. Start analysis.
5. Verify Gemini response.
6. Verify structured JSON.
7. Verify contradictions.
8. Verify ambiguities.
9. Verify missing information.
10. Verify dependencies.
11. Verify dashboard.
12. Open issue detail.
13. Verify source references.
14. Verify history.
15. Delete an analysis.
16. Test invalid file.
17. Test Gemini/API failure.
18. Test responsive layout.

Fix errors discovered during testing.

---

# 26. DEMO DATA

Create sample requirement documents ONLY for testing the application.

Use scenarios containing realistic conflicts.

Example:

Document 1:

* Account deletion
* User permissions
* Notification requirements

Document 2:

* Compliance/data retention
* Security requirements
* Audit requirements

The demo should produce meaningful examples of potential contradictions, ambiguities and dependencies.

---

# 27. README

Create a professional README containing:

* Project name
* Problem
* Solution
* Key features
* Architecture
* Tech stack
* How to run locally
* Environment variables
* API overview
* Gemini integration
* Screenshots section placeholder
* Deployment instructions
* Future improvements

Do not claim features that were not actually implemented.

---

# 28. GITHUB READINESS

Organize the project cleanly.

Use:

```text
/frontend
/backend
/README.md
/.gitignore
```

Do not commit:

```text
.env
API keys
passwords
node_modules
temporary uploads
```

Create an example environment file such as:

```text
.env.example
```

with placeholder values.

---

# 29. DEPLOYMENT READINESS

Prepare the application for:

### Frontend

Vercel

### Backend

Render

### Database

MongoDB Atlas

Make sure frontend API URLs can be configured through environment variables.

Do not hard-code localhost URLs in production.

---

# 30. FINAL QUALITY CHECK

Before declaring the application complete, verify:

* The frontend starts.
* The backend starts.
* MongoDB connects.
* Gemini API works.
* Documents upload.
* Text extraction works.
* Requirements are extracted.
* AI analysis works.
* JSON is validated.
* Potential contradictions appear.
* Ambiguities appear.
* Missing information appears.
* Dependencies appear.
* Dashboard works.
* Issue detail works.
* History works.
* Errors are handled.
* UI is responsive.
* Secrets are protected.
* README exists.
* Production configuration is prepared.

If something is broken, fix it before adding optional features.

---

# 31. PRIORITY RULE

If development time becomes limited, use this order:

### P0 — MUST WORK

1. Project setup
2. Document upload
3. PDF/TXT extraction
4. Gemini integration
5. Requirement extraction
6. Contradiction detection
7. Results dashboard

### P1 — SHOULD WORK

8. Ambiguity detection
9. Missing information detection
10. Issue detail/source references

### P2 — ADD IF TIME

11. Dependencies
12. Dependency graph
13. MongoDB history
14. Deployment polish
15. Extra UI polish

Never sacrifice the working contradiction-analysis pipeline for optional features.

---

# 32. IMPORTANT PRODUCT POSITIONING

The application should NOT be presented as:

"Upload PDFs and chat with AI."

It should be presented as:

**"An AI requirements intelligence engine that detects potential conflicts, ambiguities, missing information and dependencies before development begins."**

The primary demo story should be:

```text
Multiple requirement documents
        ↓
AI extracts requirements
        ↓
AI compares requirements
        ↓
Potential issues discovered
        ↓
Evidence + explanation
        ↓
Developer/product team can clarify requirements
        ↓
Fewer requirement-related problems before implementation
```

---

# 33. IMPLEMENTATION APPROACH

Start by inspecting the existing project directory.

If no project exists, initialize the complete MERN project.

Build incrementally.

After each major section:

1. Run the application.
2. Check for errors.
3. Fix errors.
4. Continue.

Do not generate an enormous amount of untested code at once.

Prefer a working implementation over theoretical architecture.

When a library causes compatibility problems, choose a simpler stable implementation rather than spending excessive time on the library.

---

# 34. FINAL INSTRUCTION

Build ContradictionX as a complete, polished, functional hackathon MVP according to this specification.

Do not add unrelated features.

Do not replace the core concept with a generic AI chatbot.

Do not fabricate analysis results.

Do not expose API keys.

Do not claim functionality that does not work.

Focus on creating a genuinely usable requirements-analysis product that can be demonstrated end-to-end.

After implementation, provide:

1. Final project structure
2. How to run frontend
3. How to run backend
4. Required environment variables
5. Test results
6. Known limitations
7. Deployment steps
8. Recommended next improvements

The goal is a stable, impressive, demonstrable MVP rather than maximum feature count.
