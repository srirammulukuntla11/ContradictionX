import dotenv from 'dotenv';
dotenv.config({ override: true });

import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

// Catch synchronous uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION! Shutting down...', err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});

// Connect to Database and start listener
const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`\n🚀 ContradictionX Backend is running on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔍 Environment: ${process.env.NODE_ENV || 'development'}\n`);
  });

  // Catch unhandled asynchronous rejections
  process.on('unhandledRejection', (err) => {
    console.error('💥 UNHANDLED REJECTION! Shutting down...', err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
};

startServer();
