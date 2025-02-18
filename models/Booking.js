const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  desk: { type: mongoose.Schema.Types.ObjectId, ref: 'Desk', required: true },
  startTime: { type: Date, required: true },
  endTime: { 
    type: Date, 
    required: true, 
    validate: {
      validator: function (value) {
        return value > this.startTime; // Ensure end time is after start time
      },
      message: 'End time must be after start time.'
    }
  },
  status: { 
    type: String, 
    enum: ['Active', 'Completed', 'Cancelled'], 
    default: 'Active' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);