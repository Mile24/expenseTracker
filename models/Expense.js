const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expense', expenseSchema);
