import { z } from 'zod';
import { AppError } from '../utils/AppError.js';

// Define Zod schemas
const SeverityEnum = z.enum(['low', 'medium', 'high']);

const RequirementZodSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(3),
  sourceDocument: z.string().min(1),
  page: z.number().int().min(1).default(1),
  section: z.string().default('General')
});

const ContradictionZodSchema = z.object({
  id: z.string().min(1),
  type: z.literal('contradiction').default('contradiction'),
  severity: SeverityEnum.default('medium'),
  confidence: z.number().min(0).max(1).default(0.85),
  requirementA: z.string().min(1),
  requirementB: z.string().min(1),
  explanation: z.string().min(5),
  impact: z.string().default(''),
  suggestedClarification: z.string().min(5)
});

const AmbiguityZodSchema = z.object({
  id: z.string().min(1),
  type: z.literal('ambiguity').default('ambiguity'),
  severity: SeverityEnum.default('medium'),
  confidence: z.number().min(0).max(1).default(0.8),
  requirementId: z.string().min(1),
  explanation: z.string().min(5),
  impact: z.string().default(''),
  suggestedClarification: z.string().min(5)
});

const MissingInfoZodSchema = z.object({
  id: z.string().min(1),
  type: z.literal('missingInformation').default('missingInformation'),
  severity: SeverityEnum.default('medium'),
  confidence: z.number().min(0).max(1).default(0.8),
  relatedRequirementIds: z.array(z.string()).default([]),
  missingTopic: z.string().min(2),
  explanation: z.string().min(5),
  impact: z.string().default(''),
  suggestedClarification: z.string().min(5)
});

const DependencyZodSchema = z.object({
  id: z.string().min(1),
  sourceRequirementId: z.string().min(1),
  targetRequirementId: z.string().min(1),
  dependencyType: z.string().default('prerequisite'),
  explanation: z.string().min(3)
});

const AnalysisZodSchema = z.object({
  requirements: z.array(RequirementZodSchema).default([]),
  contradictions: z.array(ContradictionZodSchema).default([]),
  ambiguities: z.array(AmbiguityZodSchema).default([]),
  missingInformation: z.array(MissingInfoZodSchema).default([]),
  dependencies: z.array(DependencyZodSchema).default([])
});

/**
 * Strips markdown code blocks and repairs minor JSON syntax quirks
 */
export const sanitizeRawJsonResponse = (rawText) => {
  if (!rawText || typeof rawText !== 'string') {
    throw new AppError('Empty AI response received from Gemini.', 502);
  }

  let cleaned = rawText.trim();

  // Strip Markdown code fences if present (```json ... ```)
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
  cleaned = cleaned.replace(/\s*```$/i, '');
  cleaned = cleaned.trim();

  // Find the outermost JSON object bounds { ... }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return cleaned;
};

/**
 * Validates, normalizes, and verifies referential integrity of Gemini analysis output
 */
export const validateAndNormalizeAnalysis = (rawAiOutput, documents = []) => {
  let parsedJson;

  if (typeof rawAiOutput === 'string') {
    const sanitized = sanitizeRawJsonResponse(rawAiOutput);
    try {
      parsedJson = JSON.parse(sanitized);
    } catch (parseErr) {
      console.error('Failed to parse Gemini JSON:', sanitized.substring(0, 500));
      throw new AppError(
        `Gemini returned malformed JSON: ${parseErr.message}`,
        502,
        { snippet: sanitized.substring(0, 300) }
      );
    }
  } else if (typeof rawAiOutput === 'object' && rawAiOutput !== null) {
    parsedJson = rawAiOutput;
  } else {
    throw new AppError('Invalid Gemini output format.', 502);
  }

  // Helper to normalize confidence numbers (e.g. 85 -> 0.85)
  const normalizeConfidence = (val) => {
    if (typeof val === 'number') {
      if (val > 1 && val <= 100) return Number((val / 100).toFixed(2));
      if (val >= 0 && val <= 1) return Number(val.toFixed(2));
    }
    return 0.85;
  };

  // Helper to normalize severity
  const normalizeSeverity = (val) => {
    if (typeof val === 'string') {
      const lower = val.toLowerCase().trim();
      if (['low', 'medium', 'high'].includes(lower)) return lower;
    }
    return 'medium';
  };

  // Pre-process items
  if (Array.isArray(parsedJson.contradictions)) {
    parsedJson.contradictions = parsedJson.contradictions.map((c, i) => ({
      ...c,
      id: c.id || `CON-${String(i + 1).padStart(3, '0')}`,
      type: 'contradiction',
      severity: normalizeSeverity(c.severity),
      confidence: normalizeConfidence(c.confidence)
    }));
  }

  if (Array.isArray(parsedJson.ambiguities)) {
    parsedJson.ambiguities = parsedJson.ambiguities.map((a, i) => ({
      ...a,
      id: a.id || `AMB-${String(i + 1).padStart(3, '0')}`,
      type: 'ambiguity',
      severity: normalizeSeverity(a.severity),
      confidence: normalizeConfidence(a.confidence)
    }));
  }

  if (Array.isArray(parsedJson.missingInformation)) {
    parsedJson.missingInformation = parsedJson.missingInformation.map((m, i) => ({
      ...m,
      id: m.id || `MIS-${String(i + 1).padStart(3, '0')}`,
      type: 'missingInformation',
      severity: normalizeSeverity(m.severity),
      confidence: normalizeConfidence(m.confidence),
      relatedRequirementIds: Array.isArray(m.relatedRequirementIds) ? m.relatedRequirementIds : []
    }));
  }

  if (Array.isArray(parsedJson.dependencies)) {
    parsedJson.dependencies = parsedJson.dependencies.map((d, i) => ({
      ...d,
      id: d.id || `DEP-${String(i + 1).padStart(3, '0')}`,
      dependencyType: d.dependencyType || 'prerequisite'
    }));
  }

  if (Array.isArray(parsedJson.requirements)) {
    parsedJson.requirements = parsedJson.requirements.map((r, i) => ({
      ...r,
      id: r.id || `REQ-${String(i + 1).padStart(3, '0')}`,
      sourceDocument: r.sourceDocument || (documents[0] ? documents[0].name : 'Document 1'),
      page: Number.isInteger(r.page) ? r.page : 1,
      section: r.section || 'General'
    }));
  }

  // Validate with Zod
  const validationResult = AnalysisZodSchema.safeParse(parsedJson);
  if (!validationResult.success) {
    console.error('Zod Validation Errors:', validationResult.error.format());
    throw new AppError(
      'Gemini analysis result failed schema validation.',
      502,
      validationResult.error.errors
    );
  }

  const validatedData = validationResult.data;

  // Referential integrity checks: ensure referenced requirements exist
  const existingReqIds = new Set(validatedData.requirements.map(r => r.id));

  // If a contradiction references an ID not in requirements, register a fallback stub
  validatedData.contradictions.forEach(c => {
    if (!existingReqIds.has(c.requirementA)) {
      validatedData.requirements.push({
        id: c.requirementA,
        text: `Referenced Requirement: ${c.requirementA}`,
        sourceDocument: documents[0]?.name || 'Unknown',
        page: 1,
        section: 'General'
      });
      existingReqIds.add(c.requirementA);
    }
    if (!existingReqIds.has(c.requirementB)) {
      validatedData.requirements.push({
        id: c.requirementB,
        text: `Referenced Requirement: ${c.requirementB}`,
        sourceDocument: documents[1]?.name || documents[0]?.name || 'Unknown',
        page: 1,
        section: 'General'
      });
      existingReqIds.add(c.requirementB);
    }
  });

  validatedData.ambiguities.forEach(a => {
    if (!existingReqIds.has(a.requirementId)) {
      validatedData.requirements.push({
        id: a.requirementId,
        text: `Referenced Requirement: ${a.requirementId}`,
        sourceDocument: documents[0]?.name || 'Unknown',
        page: 1,
        section: 'General'
      });
      existingReqIds.add(a.requirementId);
    }
  });

  // Calculate summary metrics
  const summary = {
    totalRequirements: validatedData.requirements.length,
    contradictionsCount: validatedData.contradictions.length,
    ambiguitiesCount: validatedData.ambiguities.length,
    missingInfoCount: validatedData.missingInformation.length,
    dependenciesCount: validatedData.dependencies.length
  };

  return {
    ...validatedData,
    summary
  };
};
