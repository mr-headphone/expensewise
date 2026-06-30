// This file describes what an Expense looks like in our database
import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    // Which user does this expense belong to?
    user: {
      type: mongoose.Schema.Types.ObjectId,  // This is a reference to a User
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 100,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be positive'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      // Only these values are allowed
      enum: ['Food', 'Transport', 'Housing', 'Entertainment', 'Health', 'Shopping', 'Education', 'Other'],
    },
    date: {
      type: Date,
      default: Date.now,  // Default to today
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 300,
    },
  },
  { timestamps: true }
);

export const Expense = mongoose.model('Expense', expenseSchema);