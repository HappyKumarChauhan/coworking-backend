const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number.'],
  },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['Employee', 'Admin', 'HR'],
    default: 'Employee',
  },
  preferences: {
    notifications: { type: Boolean, default: true },
    language: { type: String, default: 'en' },
  },
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('User', userSchema)
