// This file defines the URL paths for authentication
import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

// Public routes (anyone can access)
router.post('/register', register);
router.post('/login', login);

// Protected route (must be logged in)
router.get('/me', protect, getMe);

export default router;