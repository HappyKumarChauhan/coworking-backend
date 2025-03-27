const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: {
    type: String,
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'],
  },
  password: { type: String },
  profilePicture: { type: String, default: 'default.jpg' },
  address: { type: String }, // Single string for full address
  city: { type: String }, // User's city
  pincode: { type: String, match: [/^\d{6}$/, 'Please enter a valid 6-digit pincode'] }, // Postal code validation
  dateOfBirth: { type: Date }, // User's date of birth
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  role: {
    type: String,
    enum: ['Normal', 'PropertyOwner', 'Admin'],
    default: 'Normal',
  },
  properties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  kyc: {
    selfie: { type: String, default: null }, // Path to owner's selfie
    idCard: { type: String, default: null }, // Path to ID card image
    isVerified: { type: Boolean, default: false }, // Admin verification status
  },
  preferences: {
    notifications: { type: Boolean, default: true },
    language: { type: String, default: 'en' },
  },
  fcmTokens: [String], // Array to store multiple FCM tokens for different devices
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
