export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error in non-test environment
  if (process.env.NODE_ENV !== 'test') {
    console.error('❌ Error caught by globalErrorHandler:', {
      message: err.message,
      statusCode: err.statusCode,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      details: err.details
    });
  }

  // Multer error handling
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        status: 'fail',
        message: 'File too large. Maximum file size is 15MB.'
      });
    }
    return res.status(400).json({
      success: false,
      status: 'fail',
      message: `Upload error: ${err.message}`
    });
  }

  // Send safe response
  return res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message || 'An unexpected internal server error occurred.',
    details: err.details || null,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
