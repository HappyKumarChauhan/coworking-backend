const jwt = require('jsonwebtoken');
const admin = require('../config/firebase');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Login with Firebase (Google Authentication)
const loginWithFirebase = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Token is required' });

    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Find or create user in database
    let user = await User.findOne({ email: decodedToken.email });
    if (!user) {
      user = await User.create({
        name: decodedToken.name || 'Anonymous',
        email: decodedToken.email,
        profilePicture: decodedToken.picture || '',
        authProvider: decodedToken.firebase.sign_in_provider,
      });
    }

    // Generate JWT token for the user
    const jwtToken = jwt.sign(
          { id: user._id, role: user.role },
          process.env.JWT_SECRET,
          )

    res.json({ message: 'User authenticated', user, token: jwtToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};

module.exports = { loginWithFirebase };
