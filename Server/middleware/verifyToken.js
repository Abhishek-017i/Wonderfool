const admin = require('../config/firebase');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.firebaseUser = decodedToken;

    const mongoUser = await User.findOne({ firebaseUid: decodedToken.uid });
    if (!mongoUser) {
      return res.status(404).json({ message: 'User not found. Please sync your account first.' });
    }

    req.mongoUser = mongoUser;
    next();
  } catch (err) {
    if (err.message && err.message.includes('The default Firebase app does not exist')) {
      // Local development bypass when serviceAccountKey is missing
      console.warn('⚠️  Bypassing Firebase Auth signature verification (Local Dev Mode)');
      try {
        const payloadBase64 = token.split('.')[1];
        const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf8');
        const payload = JSON.parse(payloadJson);
        const uid = payload.user_id || payload.sub || 'local-dev-uid';
        
        const mongoUser = await User.findOne({ firebaseUid: uid });
        if (!mongoUser) {
          return res.status(404).json({ message: 'User not found. Please sync your account first.' });
        }
        
        req.firebaseUser = payload;
        req.mongoUser = mongoUser;
        return next();
      } catch (parseErr) {
        console.error('Failed to parse token in local dev mode', parseErr);
        return res.status(401).json({ message: 'Invalid token payload' });
      }
    }
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;