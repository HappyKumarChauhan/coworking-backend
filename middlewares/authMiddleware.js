const jwt = require('jsonwebtoken');
const User = require('../models/User');
const admin = require('../config/firebase');
const Admin = require("../models/Admin");

const protectAdmin = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    token = token.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Admin.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "Admin not found" });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token", error: error.message });
  }
};

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


module.exports = { protect, ownerOnly, protectAdmin };