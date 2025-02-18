const mongoose = require('mongoose');
const deskSchema = new mongoose.Schema({
  location: { type: String, required: true },
  equipment: [{ type: String }], // List of available equipment (e.g., ["Monitor", "Standing Desk"])
  isAvailable: { type: Boolean, default: true },
  bookings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      startTime: { type: Date },
      endTime: { type: Date }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Desk', deskSchema);
