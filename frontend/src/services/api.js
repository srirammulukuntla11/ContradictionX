const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Normalizes API response errors
 */
const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  let data = null;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = { message: await response.text() };
  }

  if (!response.ok) {
    const errorMsg = data?.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.details = data?.details;
    throw error;
  }

  return data;
};

export const api = {
  /**
   * Health Check
   */
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return handleResponse(res);
  },

  /**
   * Standard REST Document Analysis
   */
  async analyzeDocuments(formData) {
    const res = await fetch(`${API_BASE}/analysis`, {
      method: 'POST',
      body: formData
    });
    return handleResponse(res);
  },

  /**
   * Stream Analysis via Server-Sent Events (over POST)
   */
  async streamAnalyzeDocuments(formData, { onProgress, onComplete, onError }) {
    try {
      const response = await fetch(`${API_BASE}/analysis/stream`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        return handleResponse(response);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || ''; // Keep incomplete part

        for (const block of lines) {
          if (!block.trim()) continue;

          let eventType = 'message';
          let eventData = null;

          const blockLines = block.split('\n');
          for (const line of blockLines) {
            if (line.startsWith('event:')) {
              eventType = line.replace('event:', '').trim();
            } else if (line.startsWith('data:')) {
              try {
                eventData = JSON.parse(line.replace('data:', '').trim());
              } catch (e) {
                eventData = line.replace('data:', '').trim();
              }
            }
          }

          if (eventType === 'progress' && onProgress) {
            onProgress(eventData);
          } else if (eventType === 'complete' && onComplete) {
            onComplete(eventData);
          } else if (eventType === 'error' && onError) {
            onError(eventData);
          }
        }
      }
    } catch (err) {
      if (onError) onError({ message: err.message, status: err.status || 0, statusCode: err.status || 0 });
      throw err;
    }
  },

  /**
   * Quick Load Pre-seeded Demo Analysis
   */
  async loadDemoAnalysis() {
    const res = await fetch(`${API_BASE}/analysis/demo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(res);
  },

  /**
   * Fetch saved analysis by ID
   */
  async getAnalysis(id) {
    const res = await fetch(`${API_BASE}/analysis/${id}`);
    return handleResponse(res);
  },

  /**
   * List saved analyses for History page
   */
  async listAnalyses() {
    const res = await fetch(`${API_BASE}/analysis`);
    return handleResponse(res);
  },

  /**
   * Delete an analysis by ID
   */
  async deleteAnalysis(id) {
    const res = await fetch(`${API_BASE}/analysis/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(res);
  }
};
