// This file catches ALL errors and sends a clean response
export const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);

  // Handle MongoDB validation errors (e.g., missing required field)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ 
      success: false, 
      message: messages.join(', ') 
    });
  }

  // Handle duplicate email error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Email already registered. Please use a different email.',
    });
  }

  // Handle bad JWT token
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }

  // Handle everything else
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Something went wrong on our end.',
  });
};