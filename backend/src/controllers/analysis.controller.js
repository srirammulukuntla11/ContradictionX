import { extractAllDocuments } from '../services/extractor.service.js';
import { runGeminiAnalysis, generateSampleAnalysisFallback } from '../services/gemini.service.js';
import { Analysis } from '../models/Analysis.js';
import { AppError } from '../utils/AppError.js';
import { SUPPORTED_MODELS, DEFAULT_MODEL, isValidModel } from '../config/models.js';

/**
 * Standard REST API: Analyze uploaded requirement documents
 */
export const analyzeDocuments = async (req, res, next) => {
  try {
    const files = req.files;
    if (!files || files.length < 2) {
      throw new AppError('Please upload at least two requirement documents (PDF or TXT) to compare.', 400);
    }

    const customApiKey = req.body.apiKey || null;
    const title = req.body.title || `Analysis: ${files.map(f => f.originalname).join(' vs ')}`;

    // Validate selected Gemini model against server allowlist
    let selectedModel = process.env.GEMINI_MODEL || DEFAULT_MODEL;
    if (req.body.model) {
      const requestedModel = req.body.model.trim();
      if (!isValidModel(requestedModel)) {
        throw new AppError(
          `Invalid Gemini model selected: "${requestedModel}". Supported models are: ${SUPPORTED_MODELS.join(', ')}.`,
          400
        );
      }
      selectedModel = requestedModel;
    }

    // 1. Extract text and page structures
    const extractedDocs = await extractAllDocuments(files);

    // 2. Run Gemini Analysis with schema validation
    const analysisResult = await runGeminiAnalysis(extractedDocs, customApiKey, null, selectedModel);

    // 3. Persist to MongoDB
    let savedAnalysis = null;
    try {
      savedAnalysis = await Analysis.create({
        title,
        status: 'completed',
        model: selectedModel,
        documents: extractedDocs.map(d => ({
          id: d.id,
          name: d.name,
          size: d.size,
          mimeType: d.mimeType,
          pageCount: d.pageCount,
          extractedTextLength: d.extractedTextLength
        })),
        requirements: analysisResult.requirements,
        contradictions: analysisResult.contradictions,
        ambiguities: analysisResult.ambiguities,
        missingInformation: analysisResult.missingInformation,
        dependencies: analysisResult.dependencies,
        summary: analysisResult.summary
      });
    } catch (dbErr) {
      console.warn('⚠️ Could not persist to MongoDB (offline mode?):', dbErr.message);
      // Construct in-memory representation so UI continues smoothly
      savedAnalysis = {
        _id: `temp_${Date.now()}`,
        title,
        status: 'completed',
        model: selectedModel,
        documents: extractedDocs,
        ...analysisResult,
        createdAt: new Date().toISOString()
      };
    }

    return res.status(200).json({
      success: true,
      data: savedAnalysis
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Server-Sent Events (SSE) Stream: Live progress + Analysis
 */
export const streamAnalyzeDocuments = async (req, res) => {
  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const sendEvent = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const files = req.files;
    if (!files || files.length < 2) {
      sendEvent('error', { message: 'At least two requirement documents (PDF or TXT) are required.' });
      return res.end();
    }

    const customApiKey = req.body.apiKey || null;
    const title = req.body.title || `Analysis: ${files.map(f => f.originalname).join(' vs ')}`;

    // Validate selected Gemini model against server allowlist
    let selectedModel = process.env.GEMINI_MODEL || DEFAULT_MODEL;
    if (req.body.model) {
      const requestedModel = req.body.model.trim();
      if (!isValidModel(requestedModel)) {
        sendEvent('error', {
          message: `Invalid Gemini model selected: "${requestedModel}". Supported models are: ${SUPPORTED_MODELS.join(', ')}.`,
          statusCode: 400
        });
        return res.end();
      }
      selectedModel = requestedModel;
    }

    // Stage 1: Upload confirmed
    sendEvent('progress', { stage: 'upload', message: 'Documents received and buffered in memory.', percent: 15 });

    // Stage 2: Text extraction
    sendEvent('progress', { stage: 'extract', message: 'Extracting text and identifying page boundaries...', percent: 35 });
    const extractedDocs = await extractAllDocuments(files);

    // Stage 3: Requirements extraction & Gemini reasoning
    sendEvent('progress', { stage: 'gemini_prompt', message: `Submitting requirements to ${selectedModel} reasoning engine...`, percent: 55 });
    
    const analysisResult = await runGeminiAnalysis(extractedDocs, customApiKey, (stage, msg) => {
      sendEvent('progress', { stage, message: msg, percent: 75 });
    }, selectedModel);

    // Stage 4: Validation
    sendEvent('progress', { stage: 'validation', message: 'Validating structured intelligence output and references...', percent: 88 });

    // Stage 5: Database persistence
    sendEvent('progress', { stage: 'persistence', message: 'Saving intelligence report to database...', percent: 95 });

    let savedAnalysis = null;
    try {
      savedAnalysis = await Analysis.create({
        title,
        status: 'completed',
        model: selectedModel,
        documents: extractedDocs.map(d => ({
          id: d.id,
          name: d.name,
          size: d.size,
          mimeType: d.mimeType,
          pageCount: d.pageCount,
          extractedTextLength: d.extractedTextLength
        })),
        requirements: analysisResult.requirements,
        contradictions: analysisResult.contradictions,
        ambiguities: analysisResult.ambiguities,
        missingInformation: analysisResult.missingInformation,
        dependencies: analysisResult.dependencies,
        summary: analysisResult.summary
      });
    } catch (dbErr) {
      console.warn('⚠️ MongoDB save failed in SSE handler:', dbErr.message);
      savedAnalysis = {
        _id: `temp_${Date.now()}`,
        title,
        status: 'completed',
        model: selectedModel,
        documents: extractedDocs,
        ...analysisResult,
        createdAt: new Date().toISOString()
      };
    }

    // Complete
    sendEvent('complete', {
      success: true,
      analysisId: savedAnalysis._id,
      data: savedAnalysis
    });

    res.end();
  } catch (error) {
    console.error('SSE Pipeline Error:', error);
    sendEvent('error', {
      message: error.message || 'An error occurred during requirement intelligence analysis.',
      statusCode: error.statusCode || error.status || 500
    });
    res.end();
  }
};

/**
 * Get Analysis by ID
 */
export const getAnalysisById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const analysis = await Analysis.findById(id);

    if (!analysis) {
      throw new AppError(`Analysis report with ID "${id}" not found.`, 404);
    }

    return res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (error) {
    next(error);
  }
};

/**
 * List all saved analyses (History)
 */
export const listAnalyses = async (req, res, next) => {
  try {
    const analyses = await Analysis.find()
      .select('title model documents summary createdAt updatedAt status')
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({
      success: true,
      count: analyses.length,
      data: analyses
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an analysis by ID
 */
export const deleteAnalysis = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Analysis.findByIdAndDelete(id);

    if (!deleted) {
      throw new AppError(`Analysis with ID "${id}" could not be found to delete.`, 404);
    }

    return res.status(200).json({
      success: true,
      message: 'Analysis deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Load Sample Demo Data (Pre-seeded demo analyses)
 */
export const createSampleDemoAnalysis = async (req, res, next) => {
  try {
    const sampleDocs = [
      {
        id: 'doc_demo_1',
        name: 'user-policy-v2.pdf',
        size: 14280,
        mimeType: 'application/pdf',
        pageCount: 3,
        extractedTextLength: 3200
      },
      {
        id: 'doc_demo_2',
        name: 'compliance-retention-spec.pdf',
        size: 21540,
        mimeType: 'application/pdf',
        pageCount: 5,
        extractedTextLength: 4800
      }
    ];

    const fallbackAnalysis = generateSampleAnalysisFallback(sampleDocs);

    let saved = null;
    try {
      saved = await Analysis.create({
        title: 'Demo: User Policy vs Regulatory Compliance',
        status: 'completed',
        model: DEFAULT_MODEL,
        documents: sampleDocs,
        requirements: fallbackAnalysis.requirements,
        contradictions: fallbackAnalysis.contradictions,
        ambiguities: fallbackAnalysis.ambiguities,
        missingInformation: fallbackAnalysis.missingInformation,
        dependencies: fallbackAnalysis.dependencies,
        summary: fallbackAnalysis.summary
      });
    } catch (err) {
      saved = {
        _id: `demo_${Date.now()}`,
        title: 'Demo: User Policy vs Regulatory Compliance',
        status: 'completed',
        model: DEFAULT_MODEL,
        documents: sampleDocs,
        ...fallbackAnalysis,
        createdAt: new Date().toISOString()
      };
    }

    return res.status(201).json({
      success: true,
      data: saved
    });
  } catch (error) {
    next(error);
  }
};
