ContradictionX — Final MVP

Goal:
Build an AI-powered requirements intelligence platform that analyzes multiple requirement documents and identifies potential contradictions, ambiguities, missing information, and dependencies between requirements.

Stack:

Frontend: React + Vite
Backend: Node.js + Express
Database: MongoDB + Mongoose
AI: Gemini API
Documents: PDF + TXT initially
Styling: modern responsive UI
Visualization: React graph library only if stable
Deployment: Vercel + Render

Core workflow:

Upload Documents → Extract Requirements → Gemini Analysis → Detect Issues → Dashboard → Investigate Issue → Dependency Graph → Save Analysis

MVP features:

Upload multiple PDF/TXT files.
Extract text from each document.
Break documents into individual requirements.
Gemini analyzes requirements.
Detect:
Contradictions
Ambiguities
Missing information
Dependencies
Give every issue:
Type
Severity
Confidence
Related requirements
Source document
Page/location when available
Explanation
Suggested clarification
Dashboard with issue counts and filters.
Issue-detail view showing the evidence.
Dependency visualization.
Save analysis history in MongoDB.
Delete previous analyses.
Proper loading/error/empty states.

Important AI rule:
The application must describe uncertain findings as potential issues, not absolute facts. Gemini must return structured JSON that the backend validates before sending it to React.

Main screens

1. Landing

ContradictionX branding
Short explanation
"Analyze Requirements" button

2. Upload

Drag-and-drop/upload area
Multiple documents
File list
Remove file
Analyze button

3. Analysis

Processing animation
Stages such as:
Reading documents
Extracting requirements
Comparing requirements
Detecting conflicts
Building dependency map

4. Dashboard
Example:

42 Requirements
4 Potential Contradictions
7 Ambiguities
5 Missing Information
12 Dependencies

With filters:

All | Contradictions | Ambiguities | Missing | Dependencies

5. Issue Detail

Example:

Potential Contradiction
Severity: High
Confidence: 91%

Requirement A:

"Users can permanently delete their account immediately."

Source: user-policy.pdf, Page 3

Requirement B:

"Transaction records must be retained for 7 years."

Source: compliance.pdf, Page 7

Then:

Why this may conflict:
Permanent account deletion may conflict with the requirement to retain transaction-related records, depending on what data is covered by the deletion policy.

Suggested clarification:
Specify which user data is deleted immediately and which records must remain for regulatory retention.

6. Dependency Graph

Example:

Registration → Email Verification → Account Activation → Dashboard Access

7. History

Previous analyses
Date
Number of documents
Issue counts
Open/delete analysis