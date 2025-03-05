const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'],
  },
  password: { type: String, required: true }, 
  profilePicture: { type: String, default: 'default.jpg' },
  address: { type: String }, // Single string for full address
  // Updated roles: Normal, PropertyOwner, and Admin.
  role: { type: String, enum: ['Normal', 'PropertyOwner', 'Admin'], default: 'Normal' },
  properties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  kyc: {
    selfie: { type: String, default: null }, // Path to owner's selfie
    idCard: { type: String, default: null }, // Path to ID card image
    isVerified: { type: Boolean, default: false } // Admin verification status
  },
  preferences: {
    notifications: { type: Boolean, default: true },
    language: { type: String, default: 'en' },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);