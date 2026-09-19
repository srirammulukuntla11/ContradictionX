/**
 * ContradictionX Error Parser
 * Translates backend, Google Gemini, and network errors into actionable, user-friendly messages.
 * 
 * Protects users from internal stack traces, file paths, and implementation details
 * while clearly distinguishing between invalid keys, quotas, transient downtime, and connection issues.
 */

export function parseUserFacingError(err) {
  if (!err) {
    return {
      title: 'Analysis Error',
      message: 'An unexpected error occurred during processing.',
      technicalDetail: null,
      category: 'general_error'
    };
  }

  const rawMessage = typeof err === 'string' ? err : (err?.message || '');
  const status = Number(err?.statusCode || err?.status || 0);
  const lower = rawMessage.toLowerCase();

  // 1. INVALID API KEY — HTTP 400 / 403
  const isInvalidKey =
    status === 400 ||
    status === 401 ||
    status === 403 ||
    lower.includes('api key not valid') ||
    lower.includes('api_key_invalid') ||
    lower.includes('invalid api key') ||
    lower.includes('key rejected') ||
    lower.includes('permission_denied') ||
    lower.includes('api_key_expired') ||
    (lower.includes('api key') && (lower.includes('invalid') || lower.includes('rejected') || lower.includes('pass a valid')));

  if (isInvalidKey) {
    return {
      title: 'Invalid Gemini API Key',
      message: 'The Gemini API key you provided was rejected. Please check that your API key is correct and active, then try again.',
      technicalDetail: 'Error: API key rejected (400/403)',
      category: 'invalid_key'
    };
  }

  // 2. QUOTA / RATE LIMIT — HTTP 429
  const isQuotaOrRateLimit =
    status === 429 ||
    lower.includes('429') ||
    lower.includes('quota') ||
    lower.includes('rate limit') ||
    lower.includes('resource_exhausted') ||
    lower.includes('generaterequestsperday') ||
    lower.includes('daily request limit');

  if (isQuotaOrRateLimit) {
    return {
      title: 'Gemini API Limit Reached',
      message: 'The Gemini API key has reached its current usage or rate limit. Please check your Gemini API quota or try another API key.',
      technicalDetail: 'Error: Gemini API limit reached (429)',
      category: 'rate_limit'
    };
  }

  // 3. GEMINI TEMPORARILY UNAVAILABLE — HTTP 503
  const isTemporarilyUnavailable =
    status === 503 ||
    lower.includes('503') ||
    lower.includes('high demand') ||
    lower.includes('temporarily unavailable') ||
    lower.includes('service unavailable') ||
    lower.includes('temporarily busy') ||
    lower.includes('spikes in demand');

  if (isTemporarilyUnavailable) {
    return {
      title: 'Gemini Service Temporarily Unavailable',
      message: 'Gemini is temporarily busy or unavailable. Please wait a few moments and try the analysis again.',
      technicalDetail: 'Error: Gemini service temporarily unavailable (503)',
      category: 'unavailable'
    };
  }

  // MODEL UNAVAILABLE — HTTP 404
  const isModelUnavailable =
    status === 404 ||
    lower.includes('model is unavailable') ||
    lower.includes('model not found') ||
    lower.includes('choose another model') ||
    (lower.includes('model') && (lower.includes('404') || lower.includes('not found') || lower.includes('unavailable')));

  if (isModelUnavailable) {
    return {
      title: 'Gemini Model Unavailable',
      message: 'Selected Gemini model is unavailable for this API project. Please choose another model.',
      technicalDetail: 'Error: Model unavailable (404)',
      category: 'model_unavailable'
    };
  }

  // INVALID MODEL SELECTED — HTTP 400
  if (lower.includes('invalid gemini model selected')) {
    return {
      title: 'Invalid Model Selected',
      message: rawMessage.split('\n')[0],
      technicalDetail: 'Error: Invalid model (400)',
      category: 'invalid_model'
    };
  }

  // 5. GENERAL NETWORK / SERVER CONNECTION ERROR
  const isConnectionError =
    status === 0 ||
    lower.includes('failed to fetch') ||
    lower.includes('network error') ||
    lower.includes('econnrefused') ||
    lower.includes('could not connect') ||
    lower.includes('connection refused') ||
    lower.includes('load failed') ||
    lower.includes('networkrequestfailed') ||
    lower.includes('server unreachable');

  if (isConnectionError) {
    return {
      title: 'Connection Error',
      message: 'Could not connect to the analysis service. Please check your connection and try again.',
      technicalDetail: 'Error: Connection failed',
      category: 'connection'
    };
  }

  // Document validation issues (e.g. file count, unextractable text, file format)
  if (
    lower.includes('at least two') ||
    lower.includes('unsupported file format') ||
    lower.includes('contains no extractable text') ||
    lower.includes('password-protected')
  ) {
    // Strip any raw URLs, file system paths, or stacks from message
    const cleanMsg = rawMessage
      .split('\n')[0]
      .replace(/file:\/\/\/[^\s]+/g, '')
      .trim();

    return {
      title: 'Document Processing Issue',
      message: cleanMsg,
      technicalDetail: status ? `Status ${status}` : null,
      category: 'document_error'
    };
  }

  // 4. OTHER GEMINI / API ERRORS
  // Sanitize: Do not display stack traces, file paths, env variables, or keys
  const cleanStatus = status > 0 ? ` (${status})` : '';

  return {
    title: 'Analysis Could Not Proceed',
    message: 'Gemini could not process this analysis at the moment. Please check your API key and try again.',
    technicalDetail: `Error: Gemini processing error${cleanStatus}`,
    category: 'general_error'
  };
}
