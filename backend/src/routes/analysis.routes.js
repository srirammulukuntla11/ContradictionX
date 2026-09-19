import express from 'express';
import multer from 'multer';
import {
  analyzeDocuments,
  streamAnalyzeDocuments,
  getAnalysisById,
  listAnalyses,
  deleteAnalysis,
  createSampleDemoAnalysis
} from '../controllers/analysis.controller.js';
import { AppError } from '../utils/AppError.js';

const router = express.Router();

// Memory storage for ephemeral document extraction
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMime = ['application/pdf', 'text/plain'];
  const ext = file.originalname.toLowerCase();

  if (allowedMime.includes(file.mimetype) || ext.endsWith('.pdf') || ext.endsWith('.txt')) {
    cb(null, true);
  } else {
    cb(new AppError(`Invalid file format for "${file.originalname}". Only PDF and TXT documents are supported.`, 400), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB limit per file
    files: 10 // Up to 10 files per analysis
  }
});

// REST routes
router.post('/', upload.array('documents', 10), analyzeDocuments);
router.post('/stream', upload.array('documents', 10), streamAnalyzeDocuments);
router.post('/demo', createSampleDemoAnalysis);
router.get('/', listAnalyses);
router.get('/:id', getAnalysisById);
router.delete('/:id', deleteAnalysis);

export default router;
