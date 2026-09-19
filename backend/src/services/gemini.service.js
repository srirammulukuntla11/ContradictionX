import { getGeminiClient } from '../config/gemini.js';
import { validateAndNormalizeAnalysis } from './validator.service.js';
import { AppError } from '../utils/AppError.js';

const SYSTEM_INSTRUCTION = `
You are ContradictionX, an expert AI Requirements Intelligence Engine.
Your role is to analyze multiple software or business requirements documents and identify:
1. Potential Contradictions: Requirements whose intended behavior, timing, permissions, data lifecycle, or business rules potentially conflict.
2. Ambiguities: Vague, subjective, unverifiable, or incomplete requirements (e.g. "system must respond quickly", "user interface should be intuitive").
3. Missing Information: Critical constraints, edge cases, error states, timeouts, or permission rules that must be clarified.
4. Dependencies: Directional prerequisite or workflow relationships between requirements.

IMPORTANT PRINCIPLES:
- Describe uncertain findings as *potential* issues, never absolute facts.
- Do NOT report simple topical differences as contradictions. Only report true logical or business rule tensions.
- Provide clear side-by-side evidence with exact requirement text and source citations.
- Suggest constructive clarifications to resolve every identified issue.
- Confidence must be a float between 0.0 and 1.0.
- Severity must be one of: "low", "medium", "high".
- Return pure, valid JSON strictly adhering to the requested schema.
`;

/**
 * Builds the user prompt containing extracted documents
 */
function buildAnalysisPrompt(documents) {
  let docsText = '';

  documents.forEach((doc, idx) => {
    docsText += `\n=========================================\n`;
    docsText += `DOCUMENT ${idx + 1}: "${doc.name}" (Pages: ${doc.pageCount})\n`;
    docsText += `=========================================\n`;

    if (doc.pages && doc.pages.length > 0) {
      doc.pages.forEach(p => {
        docsText += `\n[Page ${p.pageNumber}]\n${p.text}\n`;
      });
    } else {
      docsText += `${doc.fullText}\n`;
    }
  });

  return `
Please analyze the following ${documents.length} requirement documents:

${docsText}

Perform the following tasks:
1. Break the content into individual, atomic requirements. Assign each an ID formatted as "REQ-001", "REQ-002", etc., note the sourceDocument name, page number, and section title.
2. Identify all POTENTIAL CONTRADICTIONS across the requirements. Each must reference requirementA (ID) and requirementB (ID), provide severity, confidence (0.0 to 1.0), an explanation of why they conflict, practical impact, and suggested clarification.
3. Identify AMBIGUOUS requirements. Reference requirementId, severity, confidence, explanation of ambiguity, and suggested clarification.
4. Identify MISSING INFORMATION. Provide missingTopic, relatedRequirementIds, severity, confidence, explanation, and suggested clarification.
5. Identify DEPENDENCIES between requirements. Provide sourceRequirementId, targetRequirementId, dependencyType, and explanation.

Return ONLY a JSON object with this exact structure:
{
  "requirements": [
    {
      "id": "REQ-001",
      "text": "Exact or concise requirement text",
      "sourceDocument": "filename.pdf",
      "page": 1,
      "section": "Account Management"
    }
  ],
  "contradictions": [
    {
      "id": "CON-001",
      "type": "contradiction",
      "severity": "high",
      "confidence": 0.92,
      "requirementA": "REQ-001",
      "requirementB": "REQ-008",
      "explanation": "Why requirement A and requirement B may conflict...",
      "impact": "Operational or compliance risk...",
      "suggestedClarification": "Concrete suggestion to harmonize both requirements."
    }
  ],
  "ambiguities": [
    {
      "id": "AMB-001",
      "type": "ambiguity",
      "severity": "medium",
      "confidence": 0.85,
      "requirementId": "REQ-003",
      "explanation": "Why this requirement is ambiguous or non-verifiable...",
      "impact": "Testing ambiguity or implementation drift...",
      "suggestedClarification": "Specific measurable metric or concrete standard."
    }
  ],
  "missingInformation": [
    {
      "id": "MIS-001",
      "type": "missingInformation",
      "severity": "medium",
      "confidence": 0.88,
      "relatedRequirementIds": ["REQ-002"],
      "missingTopic": "Session Timeout & Revocation",
      "explanation": "What specification detail is absent...",
      "impact": "Security vulnerability or incomplete implementation...",
      "suggestedClarification": "Define specific timeout duration and token revocation behavior."
    }
  ],
  "dependencies": [
    {
      "id": "DEP-001",
      "sourceRequirementId": "REQ-001",
      "targetRequirementId": "REQ-002",
      "dependencyType": "prerequisite",
      "explanation": "Requirement REQ-001 must occur before REQ-002 can proceed."
    }
  ]
}
`;
}

/**
 * Generate fallback realistic analysis if API key is not configured or in case of demo mode
 */
export function generateSampleAnalysisFallback(documents) {
  const doc1 = documents[0]?.name || 'Document 1';
  const doc2 = documents[1]?.name || 'Document 2';

  const requirements = [
    {
      id: 'REQ-001',
      text: 'Users must be able to permanently delete their account and associated data immediately upon request via account settings.',
      sourceDocument: doc1,
      page: 1,
      section: 'Account Privacy & Deletion'
    },
    {
      id: 'REQ-002',
      text: 'User email addresses must be verified via a 6-digit confirmation code sent within 60 seconds before activation.',
      sourceDocument: doc1,
      page: 1,
      section: 'User Onboarding'
    },
    {
      id: 'REQ-003',
      text: 'The search interface and analytics dashboard should respond quickly under normal server workloads.',
      sourceDocument: doc1,
      page: 2,
      section: 'Performance Standards'
    },
    {
      id: 'REQ-004',
      text: 'All monetary transactions and audit logs must be permanently archived and immutable for seven years for regulatory compliance.',
      sourceDocument: doc2,
      page: 1,
      section: 'Audit & Regulatory Retention'
    },
    {
      id: 'REQ-005',
      text: 'Session tokens must be securely stored and authenticated for all API requests.',
      sourceDocument: doc2,
      page: 1,
      section: 'Security & Access Control'
    },
    {
      id: 'REQ-006',
      text: 'Account activation enables full access to financial transfers and dashboard analytics.',
      sourceDocument: doc2,
      page: 2,
      section: 'Access Hierarchy'
    }
  ];

  const contradictions = [
    {
      id: 'CON-001',
      type: 'contradiction',
      severity: 'high',
      confidence: 0.94,
      requirementA: 'REQ-001',
      requirementB: 'REQ-004',
      explanation: 'Permanent and immediate account deletion in REQ-001 directly conflicts with mandatory 7-year retention of transaction records in REQ-004 if transaction logs contain user identifiers.',
      impact: 'Creating a deletion routine that purges all user data will violate financial compliance regulations, while retaining records without clarification risks GDPR/privacy violation.',
      suggestedClarification: 'Explicitly specify that user credentials and personal identifiers are scrubbed or anonymized, while transactional audit ledgers are retained in a cryptographically pseudonymized archive for the 7-year regulatory period.'
    }
  ];

  const ambiguities = [
    {
      id: 'AMB-001',
      type: 'ambiguity',
      severity: 'medium',
      confidence: 0.89,
      requirementId: 'REQ-003',
      explanation: '"Respond quickly under normal server workloads" contains subjective and non-testable terminology.',
      impact: 'Engineers cannot write deterministic performance benchmark tests, leading to differing interpretations between QA and development teams.',
      suggestedClarification: 'Define exact 95th-percentile response latency (e.g., "p95 API response time must be under 350ms for concurrent loads up to 500 requests per second").'
    }
  ];

  const missingInformation = [
    {
      id: 'MIS-001',
      type: 'missingInformation',
      severity: 'medium',
      confidence: 0.86,
      relatedRequirementIds: ['REQ-005'],
      missingTopic: 'Session Expiry & Revocation Rules',
      explanation: 'REQ-005 requires secure session token storage, but does not define token idle timeout duration, maximum lifespan, or concurrent login revocation rules.',
      impact: 'Unspecified timeout limits leave the application susceptible to session hijacking or stale authenticated sessions.',
      suggestedClarification: 'Specify access token validity (e.g. 15 minutes), refresh token rotation policy (e.g. 7 days), and whether password changes immediately revoke all active sessions.'
    }
  ];

  const dependencies = [
    {
      id: 'DEP-001',
      sourceRequirementId: 'REQ-002',
      targetRequirementId: 'REQ-006',
      dependencyType: 'prerequisite',
      explanation: 'Email verification (REQ-002) is a mandatory gate before account activation and dashboard access (REQ-006) can be granted.'
    }
  ];

  return validateAndNormalizeAnalysis({
    requirements,
    contradictions,
    ambiguities,
    missingInformation,
    dependencies
  }, documents);
}

/**
 * Execute requirements intelligence analysis with Gemini
 */
export const runGeminiAnalysis = async (documents, apiKeyOverride = null, onProgress = null, modelOverride = null) => {
  if (onProgress) onProgress('preparing_prompt', 'Formulating requirements analysis prompt...');

  const client = getGeminiClient(apiKeyOverride);

  if (!client) {
    throw new AppError(
      'Gemini API key is not configured. Please set GEMINI_API_KEY in backend/.env.',
      400
    );
  }

  // Configurable Gemini model (user selected override, or environment variable, or default: gemini-3.8-flash)
  const modelName = modelOverride || process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  let lastError = null;
  const MAX_ATTEMPTS = 3;

  // Retry with exponential backoff for transient 503 high-demand errors (max 3 attempts)
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      if (onProgress) {
        onProgress('calling_gemini', `Analyzing requirements with ${modelName} (attempt ${attempt} of ${MAX_ATTEMPTS})...`);
      }

      const model = client.getGenerativeModel({
        model: modelName,
        systemInstruction: SYSTEM_INSTRUCTION,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      });

      const prompt = buildAnalysisPrompt(documents);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();

      if (onProgress) {
        onProgress('validating_json', 'Validating structured AI response...');
      }

      const validatedAnalysis = validateAndNormalizeAnalysis(responseText, documents);
      return validatedAnalysis;
    } catch (err) {
      console.warn(`Gemini attempt with ${modelName} (attempt ${attempt}/${MAX_ATTEMPTS}) failed: ${err.message}`);
      lastError = err;

      // Check if error is specifically a transient 503 service unavailable / high demand error
      const is503Transient =
        err?.status === 503 ||
        err?.message?.includes('503') ||
        err?.message?.includes('high demand') ||
        err?.message?.includes('Service Unavailable');

      // Only retry transient 503 errors; do not retry validation errors or other permanent errors
      if (is503Transient && attempt < MAX_ATTEMPTS) {
        // Exponential backoff: Attempt 1 -> 3s, Attempt 2 -> 6s
        const backoffMs = 3000 * Math.pow(2, attempt - 1);
        console.warn(`Google Gemini 503 high demand encountered. Backing off for ${backoffMs / 1000}s before attempt ${attempt + 1}...`);
        if (onProgress) {
          onProgress('retry_backoff', `Gemini experienced temporary high demand (503). Retrying in ${backoffMs / 1000}s (attempt ${attempt + 1} of ${MAX_ATTEMPTS})...`);
        }
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
      } else {
        // Validation error, 4xx error, or exhausted all 3 attempts
        break;
      }
    }
  }

  // Return a clear, user-facing error to the frontend without using fallback data
  console.error(`Gemini analysis with ${modelName} failed:`, lastError?.message);

  if (lastError?.status === 503 || lastError?.message?.includes('503') || lastError?.message?.includes('high demand')) {
    throw new AppError(
      `Gemini is temporarily busy or unavailable (HTTP 503 Service Unavailable). Please wait a few moments and try the analysis again.`,
      503
    );
  }

  if (lastError?.status === 429 || lastError?.message?.includes('429') || lastError?.message?.includes('quota')) {
    throw new AppError(
      `Google Gemini rate limit or quota exceeded (HTTP 429). Please wait before submitting another analysis request.`,
      429
    );
  }

  if (lastError?.status === 404 || lastError?.message?.includes('404') || lastError?.message?.includes('not found')) {
    throw new AppError(
      `Selected Gemini model is unavailable for this API project. Please choose another model.`,
      404
    );
  }

  throw new AppError(
    `Gemini API Error (${modelName}): ${lastError?.message || 'Failed to complete requirements analysis.'}`,
    lastError?.status || 502
  );
};
