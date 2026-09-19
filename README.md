# ContradictionX — AI Requirements Intelligence Platform

> **"Find requirement conflicts humans miss before they become software problems."**

ContradictionX is an AI-powered requirements intelligence platform that ingests multiple software, legal, and compliance specification documents (PDF and TXT), isolates atomic requirements, and uses Google Gemini to detect potential contradictions, ambiguities, missing logic, and cross-document dependencies before engineering starts.

This is **not** a generic PDF chatbot. ContradictionX delivers structured, cited, and actionable requirements intelligence with side-by-side evidence and interactive topology visualization.

---

## 1. Problem & Solution

### The Problem
In modern software engineering, requirements are fragmented across product PRDs, security policies, compliance standards, and architectural blueprints written by different stakeholders at different times.
- Requirements conflict silently (e.g., immediate GDPR account erasure vs. statutory 7-year financial audit ledger retention).
- Subjective statements ("system must respond quickly") lead to QA/engineering misalignment.
- Unspecified boundary constraints (missing session timeouts, absent error states) cause vulnerability discoveries late in the development cycle.
- Manual cross-referencing across dozens of pages is tedious, error-prone, and unsustainable.

### The ContradictionX Solution
1. **Multi-Document Ingestion**: Upload 2 or more PDF and TXT documents simultaneously.
2. **Deterministic Extraction**: Extracts text with page-level attribution (`user-policy.pdf, Page 2`) and segments content into discrete numbered requirements (`REQ-001`, `REQ-002`).
3. **Structured Comparative Reasoning**: Employs Google Gemini with strict schema enforcement to analyze requirements together.
4. **Actionable Intelligence Dashboard**: Presents side-by-side textual evidence, categorized severity (`high`, `medium`, `low`), numerical confidence ratings, and suggested rewrites to clarify ambiguous or conflicting specifications.
5. **Interactive Dependency Graph**: Automatically renders directed acyclic graphs (DAGs) and linear traceability chains connecting prerequisite requirements.
6. **MongoDB Persistence**: Stores full intelligence reports for auditing, review, and historical tracking.

---

## 2. Core Capabilities

| Capability | Description | Example Detected |
| :--- | :--- | :--- |
| **Potential Contradictions** | Discovers conflicting behavioral, timing, permission, or data lifecycle rules across documents. | Immediate account deletion (`REQ-001`) vs. mandatory 7-year immutable audit retention (`REQ-103`). |
| **Ambiguities & Vagueness** | Flags non-testable or subjective terminology and proposes measurable criteria. | "System should respond quickly" flagged with suggestion to specify p95 latency under 350ms. |
| **Missing Information** | Identifies critical specifications omitted from requirements. | Secure token requirement lacking timeout duration, idle expiry, or revocation triggers. |
| **Dependency Mapping** | Surfaces directional workflow prerequisites between requirements. | Email verification gate (`REQ-002`) required before dashboard portal access (`REQ-004`). |

*Note: All findings are explicitly qualified as **potential issues** (not absolute facts), empowering product and engineering teams to make informed decisions.*

---

## 3. Architecture & Tech Stack

```
[ Frontend: React 18 + Vite ]
       │  (REST / SSE Multipart Upload & Staged Tracking)
       ▼
[ Backend: Node.js + Express REST API ]
       │
       ├──> [ Document Extractor ] ──> Mozilla PDF.js & Text Chunker (In-memory)
       ├──> [ Gemini Engine ]     ──> @google/generative-ai (Structured JSON Schema)
       ├──> [ Zod Validator ]     ──> Schema, enum bounds & referential integrity
       └──> [ MongoDB Atlas ]     ──> Mongoose Analysis Model Persistence
```

### Technology Breakdown
- **Frontend**: React 18, Vite, React Router 6, `@xyflow/react` (React Flow 12 for interactive DAGs), Lucide Icons, Modern CSS Design System (dark mode, glassmorphism, responsive).
- **Backend**: Node.js, Express, Multer (in-memory buffer storage), Mozilla `pdfjs-dist` (accurate multi-page PDF text extraction), Zod (runtime validation), Helmet, Morgan.
- **Database**: MongoDB & Mongoose.
- **AI Engine**: Google Gemini API (`gemini-3.6-flash` with strict JSON schema and low temperature for analytical determinism).

---

## 4. Folder Structure

```text
ContradictionX/
├── backend/
│   ├── sample_docs/                  # Realistic sample PDFs and TXTs for testing
│   │   ├── 01_user_privacy_policy.pdf
│   │   ├── 02_financial_compliance.pdf
│   │   ├── 01_user_privacy_and_account_policy.txt
│   │   └── 02_financial_compliance_and_audit_spec.txt
│   ├── scripts/
│   │   └── generate_sample_pdfs.js   # Script to generate test PDFs
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                 # Mongoose connection with retry
│   │   │   └── gemini.js             # Google Generative AI client
│   │   ├── controllers/
│   │   │   └── analysis.controller.js # Upload, SSE stream, CRUD, demo endpoints
│   │   ├── models/
│   │   │   └── Analysis.js           # Mongoose Analysis schema
│   │   ├── routes/
│   │   │   ├── analysis.routes.js    # /api/analysis routes
│   │   │   └── health.routes.js      # /api/health route
│   │   ├── services/
│   │   │   ├── extractor.service.js  # PDF & TXT extraction with page index
│   │   │   ├── gemini.service.js     # Gemini prompt & structured output
│   │   │   └── validator.service.js  # Zod schema validation & ID linking
│   │   ├── utils/
│   │   │   ├── AppError.js           # Operational error class
│   │   │   └── errorHandler.js       # Global Express error handler
│   │   ├── app.js                    # Express application configuration
│   │   └── server.js                 # Server listener & bootstrap
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/               # Navbar, Footer, Badges, Progress, States
│   │   │   ├── upload/               # Dropzone, FileList
│   │   │   ├── dashboard/            # StatsOverview, FilterBar, IssueCard
│   │   │   ├── issues/               # RequirementEvidence, IssueDetailModal
│   │   │   └── graph/                # DependencyGraph (React Flow) & DependencyList
│   │   ├── pages/
│   │   │   ├── HomePage.jsx          # Landing page with value prop & CTA
│   │   │   ├── UploadPage.jsx        # Multi-document upload & live progress
│   │   │   ├── DashboardPage.jsx     # Primary intelligence dashboard
│   │   │   ├── HistoryPage.jsx       # MongoDB saved reports with delete
│   │   │   └── NotFoundPage.jsx
│   │   ├── services/
│   │   │   └── api.js                # API & SSE client
│   │   ├── index.css                 # Dark theme design system
│   │   ├── App.jsx                   # React Router
│   │   └── main.jsx
│   ├── .env.example
│   ├── vite.config.js                # Vite with dev proxy to backend
│   └── package.json
├── CONTRADICTIONX_MVP.md             # Authoritative MVP Specification
├── CONTRADICTIONX_MASTER_PROMPT.md   # Authoritative Master Build Prompt
├── README.md                         # Documentation
└── .gitignore
```

---

## 5. Local Setup & Running

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **MongoDB**: Local MongoDB service running or a free MongoDB Atlas connection URI
- **Google Gemini API Key**: Optional for testing (the application includes built-in high-fidelity demonstration intelligence and a "Load Conflicting Demo Docs" feature)

### 1. Backend Setup
```bash
cd backend
npm install
```

Create `backend/.env` (or copy from `.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/contradictionx
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Start backend:
```bash
npm run dev
# or: node src/server.js
```
The server will start at `http://localhost:5000` with health check at `http://localhost:5000/api/health`.

### 2. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 6. API Overview

| Method | Endpoint | Description | Payload |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Health status of server, MongoDB, and Gemini API | None |
| `POST` | `/api/analysis` | Analyze uploaded PDF/TXT documents (REST) | `multipart/form-data` with `documents` ($\ge 2$) |
| `POST` | `/api/analysis/stream` | Stream analysis with real-time SSE progress events | `multipart/form-data` with `documents` ($\ge 2$) |
| `POST` | `/api/analysis/demo` | Quick-load pre-seeded demo report | None |
| `GET` | `/api/analysis` | List all saved analyses for History | None |
| `GET` | `/api/analysis/:id` | Fetch complete analysis report by ID | None |
| `DELETE` | `/api/analysis/:id` | Delete an analysis report by ID | None |

---

## 7. Gemini Structured Output & Validation

The backend enforces strict schema compliance through a multi-tier defense:

1. **Native Gemini Schema Configuration**:
   ```javascript
   const model = client.getGenerativeModel({
     model: 'gemini-3.6-flash',
     generationConfig: {
       responseMimeType: 'application/json',
       temperature: 0.2
     }
   });
   ```
2. **Backend Zod Schema Validation**:
   Validates every requirement, contradiction, ambiguity, missing detail, and dependency against strict enums (`low`, `medium`, `high`) and numeric bounds ($0.0 \le \text{confidence} \le 1.0$).
3. **Referential Integrity Enforcement**:
   Ensures all `requirementA`, `requirementB`, and `requirementId` citations map to real extracted requirements in the requirements array.
4. **Sanitization & Repair**:
   Strips extraneous Markdown code fences and trailing syntax errors before `JSON.parse`.

---

## 8. Deployment Guide

### Frontend (Vercel)
1. Push repository to GitHub.
2. In Vercel, import the repository and set Root Directory to `frontend`.
3. Set environment variable:
   `VITE_API_BASE_URL=https://your-backend.onrender.com/api`
4. Deploy.

### Backend (Render)
1. Create a **Web Service** on Render pointing to the GitHub repository.
2. Set Root Directory to `backend`.
3. Build Command: `npm install`
4. Start Command: `node src/server.js`
5. Set environment variables:
   - `PORT=5000`
   - `NODE_ENV=production`
   - `CLIENT_URL=https://your-frontend.vercel.app`
   - `MONGODB_URI=mongodb+srv://<user>:<pwd>@cluster.mongodb.net/contradictionx`
   - `GEMINI_API_KEY=your_gemini_api_key`
6. Deploy.

### Database (MongoDB Atlas)
1. Create a free M0 cluster on MongoDB Atlas.
2. Under Network Access, allow IP access (`0.0.0.0/0` or Render's outbound IPs).
3. Under Database Access, create a database user and paste the connection string into `MONGODB_URI`.

---

## 9. Future Roadmap
- [ ] OCR support for scanned PDF documents using Tesseract / Google Document AI.
- [ ] Microsoft Word (`.docx`) file extraction support.
- [ ] Automated git branch integration to analyze pull request requirement diffs.
- [ ] Jira / Confluence direct integration to sync clarified requirements back into tickets.
