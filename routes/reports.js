const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { verifyToken } = require('../middleware/authMiddleware');

// GET /api/reports/monthly - get total and category-wise expense summary for a month
router.get('/monthly', verifyToken, async (req, res) => {
  const { month, year } = req.query;
  if (!month || !year) {
    return res.status(400).json({ message: 'Query params required: month (MM) and year (YYYY)' });
  }
  try {
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    if (monthNum < 1 || monthNum > 12 || yearNum < 1900) {
      return res.status(400).json({ message: 'Invalid month (01-12) or year' });
    }
    // Create date range for the month
    const startDate = new Date(yearNum, monthNum - 1, 1);
    const endDate = new Date(yearNum, monthNum, 1);
    
    const expenses = await Expense.find({
      uid: req.user.uid,
      date: { $gte: startDate, $lt: endDate }
    });
    
    let total = 0;
    const categories = {};
    
    expenses.forEach(expense => {
      total += expense.amount;
      if (!categories[expense.category]) {
        categories[expense.category] = 0;
      }
      categories[expense.category] += expense.amount;
    });
    
    return res.json({ total, categories });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to fetch monthly report' });
  }
});

// GET /api/reports/category - get expenses filtered by category
router.get('/category', verifyToken, async (req, res) => {
  const { category } = req.query;
  if (!category) {
    return res.status(400).json({ message: 'Query param required: category' });
  }
  try {
    const expenses = await Expense.find({
      uid: req.user.uid,
      category: category
    }).sort({ date: -1 });
    
    const result = expenses.map(exp => ({
      id: exp._id,
      title: exp.title,
      amount: exp.amount,
      date: exp.date
    }));
    
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to fetch category report' });
  }
});

module.exports = router;
