const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const axios = require('axios');
const User = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware');

// POST /api/register
// Body: { email, password }
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
  try {
    const userRecord = await admin.auth().createUser({ email, password });
    // create entry in MongoDB
    await User.create({ uid: userRecord.uid, email: userRecord.email });
    return res.status(201).json({ message: 'User registered successfully', uid: userRecord.uid });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message || 'Registration failed' });
  }
});

// POST /api/login
// Body: { email, password }
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
  const apiKey = process.env.FIREBASE_API_KEY;
  if (!apiKey) return res.status(500).json({ message: 'FIREBASE_API_KEY not configured' });
  try {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
    const response = await axios.post(url, { email, password, returnSecureToken: true });
    const idToken = response.data.idToken;
    return res.status(200).json({ token: idToken, message: 'Login successful' });
  } catch (err) {
    console.error(err?.response?.data || err.message);
    const status = err?.response?.status || 500;
    const msg = err?.response?.data?.error?.message || 'Login failed';
    return res.status(status).json({ message: msg });
  }
});

// POST /api/logout
// Protected: requires Authorization: Bearer <idToken>
router.post('/logout', verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    await admin.auth().revokeRefreshTokens(uid);
    return res.json({ message: 'Logout successful' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Logout failed' });
  }
});

module.exports = router;
