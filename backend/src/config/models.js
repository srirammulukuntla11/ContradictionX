/**
 * Supported Google Gemini Models in ContradictionX
 * All requests are strictly validated against this allowlist.
 */

export const SUPPORTED_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.7-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite'
];

export const DEFAULT_MODEL = 'gemini-3.8-flash';

export const isValidModel = (model) => {
  if (!model || typeof model !== 'string') return false;
  return SUPPORTED_MODELS.includes(model.trim());
};
