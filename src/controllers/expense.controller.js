// This file handles all expense operations
import { Expense } from '../models/expense.model.js';

// ── GET ALL EXPENSES ──────────────────────────────────────
export const getExpenses = async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query;

    const filter = { user: req.user._id };

    if (category) {
      filter.category = category;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate)   filter.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });

    res.json({ 
      success: true, 
      count: expenses.length, 
      data: expenses 
    });

  } catch (error) {
    console.error('Get expenses error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ── CREATE EXPENSE ────────────────────────────────────────
export const createExpense = async (req, res) => {
  try {
    const { title, amount, category, date, notes } = req.body;

    const expense = await Expense.create({
      user: req.user._id,
      title,
      amount,
      category,
      date,
      notes,
    });

    res.status(201).json({ 
      success: true, 
      data: expense 
    });

  } catch (error) {
    console.error('Create expense error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ── GET ONE EXPENSE ───────────────────────────────────────
export const getExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({ 
        success: false, 
        message: 'Expense not found.' 
      });
    }

    res.json({ success: true, data: expense });

  } catch (error) {
    console.error('Get expense error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ── UPDATE EXPENSE ────────────────────────────────────────
export const updateExpense = async (req, res) => {
  try {
    const { title, amount, category, date, notes } = req.body;

    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, amount, category, date, notes },
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({ 
        success: false, 
        message: 'Expense not found.' 
      });
    }

    res.json({ success: true, data: expense });

  } catch (error) {
    console.error('Update expense error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ── DELETE EXPENSE ────────────────────────────────────────
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({ 
        success: false, 
        message: 'Expense not found.' 
      });
    }

    res.json({ success: true, message: 'Expense deleted successfully.' });

  } catch (error) {
    console.error('Delete expense error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ── GET SUMMARY ───────────────────────────────────────────
export const getSummary = async (req, res) => {
  try {
    const summary = await Expense.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const grandTotal = summary.reduce((sum, item) => sum + item.total, 0);

    res.json({ 
      success: true, 
      grandTotal, 
      data: summary 
    });

  } catch (error) {
    console.error('Summary error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};