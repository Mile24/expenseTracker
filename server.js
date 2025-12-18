require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const admin = require('firebase-admin');
const path = require('path');

const authRoutes = require('./routes/auth');
const expensesRoutes = require('./routes/expenses');
const reportsRoutes = require('./routes/reports');

const app = express();
app.use(cors());
app.use(express.json());

// Init Firebase Admin
if (!process.env.SERVICE_ACCOUNT_PATH) {
  console.error('Missing SERVICE_ACCOUNT_PATH in .env');
  process.exit(1);
}
const serviceAccountPath = path.resolve(process.env.SERVICE_ACCOUNT_PATH);
const serviceAccount = require(serviceAccountPath);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

// Connect MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/expense-tracker';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => res.json({ message: 'Expense Tracker Backend running' }));
app.use('/api', authRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/reports', reportsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
