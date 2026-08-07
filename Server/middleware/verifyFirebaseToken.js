const admin = require('../config/firebase');

const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.firebaseUser = decodedToken;
    next();
  } catch (err) {
    if (err.message && err.message.includes('The default Firebase app does not exist')) {
      // Local development bypass when serviceAccountKey is missing
      console.warn('⚠️  Bypassing Firebase Auth (Local Dev Mode)');
      // Provide a dummy payload so authController can find or create a user
      req.firebaseUser = {
        uid: 'local-dev-uid',
        email: 'localdev@example.com',
        name: 'Local Developer',
        picture: ''
      };
      return next();
    }
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = verifyFirebaseToken;