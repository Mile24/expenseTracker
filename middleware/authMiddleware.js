const admin = require('firebase-admin');

async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification failed', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = { verifyToken };
