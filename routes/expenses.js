const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { verifyToken } = require('../middleware/authMiddleware');

// GET /api/expenses - fetch all expenses for logged-in user
router.get('/', verifyToken, async (req, res) => {
  try {
    const expenses = await Expense.find({ uid: req.user.uid }).sort({ date: -1 });
    return res.json(expenses);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to fetch expenses' });
  }
});

// GET /api/expenses/:id - fetch a single expense by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    // Verify ownership
    if (expense.uid !== req.user.uid) return res.status(403).json({ message: 'Unauthorized' });
    return res.json(expense);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to fetch expense' });
  }
});

// POST /api/expenses - add a new expense
router.post('/', verifyToken, async (req, res) => {
  const { title, amount, category, date } = req.body;
  if (!title || amount === undefined || !category || !date) {
    return res.status(400).json({ message: 'Missing required fields: title, amount, category, date' });
  }
  try {
    const expense = await Expense.create({
      uid: req.user.uid,
      title,
      amount,
      category,
      date: new Date(date)
    });
    return res.status(201).json({ message: 'Expense added successfully', id: expense._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to add expense' });
  }
});

// PUT /api/expenses/:id - update an expense
router.put('/:id', verifyToken, async (req, res) => {
  const { title, amount, category, date } = req.body;
  if (!title || amount === undefined || !category || !date) {
    return res.status(400).json({ message: 'Missing required fields: title, amount, category, date' });
  }
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    // Verify ownership
    if (expense.uid !== req.user.uid) return res.status(403).json({ message: 'Unauthorized' });
    expense.title = title;
    expense.amount = amount;
    expense.category = category;
    expense.date = new Date(date);
    await expense.save();
    return res.json({ message: 'Expense updated successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to update expense' });
  }
});

// DELETE /api/expenses/:id - delete an expense
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    // Verify ownership
    if (expense.uid !== req.user.uid) return res.status(403).json({ message: 'Unauthorized' });
    await Expense.deleteOne({ _id: req.params.id });
    return res.json({ message: 'Expense deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to delete expense' });
  }
});

module.exports = router;
