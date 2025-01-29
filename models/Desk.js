const deskSchema = new mongoose.Schema({
    location: { type: String, required: true },
    equipment: [{ type: String }], // e.g., ['Monitor', 'Standing Desk']
    isAvailable: { type: Boolean, default: true },
    bookings: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        startTime: { type: Date },
        endTime: { type: Date }
      }
    ]
  });
  
  module.exports = mongoose.model('Desk', deskSchema);
  