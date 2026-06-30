// This file creates and configures our Express app
import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import expenseRoutes from './routes/expense.routes.js';

export const createServer = () => {
  const app = express();

  // ── Allow frontend to talk to backend ──────────────────
 app.use(cors({
    origin: '*',
    credentials: false,
  }));

  // ── Allow app to read JSON data from requests ──────────
  app.use(express.json());

  // ── Health check route ─────────────────────────────────
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      message: '✅ ExpenseWise API is running!' 
    });
  });

  // ── Connect the routes ─────────────────────────────────
  app.use('/api/auth', authRoutes);
  app.use('/api/expenses', expenseRoutes);

  // ── Catch-all for unknown routes ───────────────────────
  app.use((req, res) => {
    res.status(404).json({ 
      success: false, 
      message: `Route ${req.originalUrl} not found` 
    });
  });

  // ── Global error handler (must be last) ────────────────
  // ⚠️ Must have exactly 4 parameters to work as error handler
  app.use((err, req, res, next) => {
    errorHandler(err, req, res, next);
  });

  return app;
};