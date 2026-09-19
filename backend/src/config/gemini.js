import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI = null;

export const getGeminiClient = (apiKeyOverride = null) => {
  const apiKey = apiKeyOverride || process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    return null;
  }

  // Create client instance (or memoized instance if default key)
  if (!apiKeyOverride && genAI) {
    return genAI;
  }

  const client = new GoogleGenerativeAI(apiKey.trim());
  if (!apiKeyOverride) {
    genAI = client;
  }
  return client;
};
