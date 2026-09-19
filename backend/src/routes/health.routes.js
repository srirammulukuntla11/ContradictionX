import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', (req, res) => {
  const isMongoConnected = mongoose.connection.readyState === 1;
  const hasGeminiKey = Boolean(
    process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY.trim() !== '' &&
    process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'
  );

  return res.status(200).json({
    status: 'ok',
    service: 'ContradictionX Intelligence Engine',
    timestamp: new Date().toISOString(),
    database: {
      connected: isMongoConnected,
      status: isMongoConnected ? 'connected' : 'disconnected'
    },
    gemini: {
      configured: hasGeminiKey,
      model: process.env.GEMINI_MODEL || 'gemini-3.8-flash'
    }
  });
});

export default router;
