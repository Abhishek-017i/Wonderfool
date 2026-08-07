const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

let serviceAccount;
try {
  serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : require('./serviceAccountKey.json');
} catch (e) {
  console.warn('⚠️  Firebase serviceAccountKey.json not found. Auth routes will not work.');
  serviceAccount = null;
}

if (serviceAccount && getApps().length === 0) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const admin = { auth: getAuth };

module.exports = admin;