// This file defines the URL paths for expenses
import { Router } from 'express';
import {
  getExpenses,
  createExpense,
  getExpense,
  updateExpense,
  deleteExpense,
  getSummary,
} from '../controllers/expense.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

// ALL expense routes require login
router.use(protect);

// GET /api/expenses/summary  ← must be BEFORE /:id
router.get('/summary', getSummary);

// GET /api/expenses  and  POST /api/expenses
router.route('/')
  .get(getExpenses)
  .post(createExpense);

// GET/PUT/DELETE /api/expenses/:id
router.route('/:id')
  .get(getExpense)
  .put(updateExpense)
  .delete(deleteExpense);

export default router;