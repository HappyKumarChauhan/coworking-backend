const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Import service account

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
