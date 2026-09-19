import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  size: { type: Number, default: 0 },
  mimeType: { type: String, default: 'text/plain' },
  pageCount: { type: Number, default: 1 },
  extractedTextLength: { type: Number, default: 0 }
}, { _id: false });

const RequirementSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
  sourceDocument: { type: String, required: true },
  page: { type: Number, default: 1 },
  section: { type: String, default: 'General' }
}, { _id: false });

const ContradictionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, default: 'contradiction' },
  severity: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  confidence: { type: Number, min: 0, max: 1, default: 0.85 },
  requirementA: { type: String, required: true }, // REQ-xxx
  requirementB: { type: String, required: true }, // REQ-yyy
  explanation: { type: String, required: true },
  impact: { type: String, default: '' },
  suggestedClarification: { type: String, required: true }
}, { _id: false });

const AmbiguitySchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, default: 'ambiguity' },
  severity: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  confidence: { type: Number, min: 0, max: 1, default: 0.8 },
  requirementId: { type: String, required: true }, // REQ-xxx
  explanation: { type: String, required: true },
  impact: { type: String, default: '' },
  suggestedClarification: { type: String, required: true }
}, { _id: false });

const MissingInfoSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, default: 'missingInformation' },
  severity: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  confidence: { type: Number, min: 0, max: 1, default: 0.8 },
  relatedRequirementIds: { type: [String], default: [] },
  missingTopic: { type: String, required: true },
  explanation: { type: String, required: true },
  impact: { type: String, default: '' },
  suggestedClarification: { type: String, required: true }
}, { _id: false });

const DependencySchema = new mongoose.Schema({
  id: { type: String, required: true },
  sourceRequirementId: { type: String, required: true },
  targetRequirementId: { type: String, required: true },
  dependencyType: { type: String, default: 'prerequisite' },
  explanation: { type: String, required: true }
}, { _id: false });

const SummarySchema = new mongoose.Schema({
  totalRequirements: { type: Number, default: 0 },
  contradictionsCount: { type: Number, default: 0 },
  ambiguitiesCount: { type: Number, default: 0 },
  missingInfoCount: { type: Number, default: 0 },
  dependenciesCount: { type: Number, default: 0 }
}, { _id: false });

const AnalysisSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'completed'
  },
  model: {
    type: String,
    default: 'gemini-3.8-flash'
  },
  documents: [DocumentSchema],
  requirements: [RequirementSchema],
  contradictions: [ContradictionSchema],
  ambiguities: [AmbiguitySchema],
  missingInformation: [MissingInfoSchema],
  dependencies: [DependencySchema],
  summary: { type: SummarySchema, default: () => ({}) },
  error: { type: String, default: null }
}, {
  timestamps: true
});

// Index for efficient sorting by creation date in History
AnalysisSchema.index({ createdAt: -1 });

export const Analysis = mongoose.model('Analysis', AnalysisSchema);
