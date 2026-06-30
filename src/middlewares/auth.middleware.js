// This file checks if a user is logged in before allowing access
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

export const protect = async (req, res, next) => {
  try {
    // 1. Look for a token in the request headers
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Please log in to access this.',
      });
    }

    // 2. Extract the token (remove "Bearer " from the start)
    const token = authHeader.split(' ')[1];

    // 3. Verify the token is valid and not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Find the user this token belongs to
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists.',
      });
    }

    // 5. Attach user to the request so controllers can use it
    req.user = user;
    next(); // Move on to the next function

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.',
    });
  }
};