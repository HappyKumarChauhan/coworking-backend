const jwt = require('jsonwebtoken');
const User = require('../models/User');
const admin = require('../config/firebase');

const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    let decoded;
    
    if (token.startsWith('eyJ')) {
      // JWT Authentication (Existing System)
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } else {
      // Firebase Authentication
      decoded = await admin.auth().verifyIdToken(token);
    }
    // Attach user to request
    req.user = await User.findById(decoded.id || decoded.uid);
    if (!req.user) return res.status(401).json({ message: 'User not found' });

    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

// Restrict to Property Owners
const ownerOnly = (req, res, next) => {
  if (req.user.role !== 'PropertyOwner') {
    return res.status(403).json({ message: 'Access restricted to Property Owners' });
  }
  next();
};

// Restrict to Admins
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Access restricted to Admins' });
  }
  next();
};

module.exports = { protect, ownerOnly, adminOnly };