const analyticsSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    totalBookings: { type: Number, default: 0 },
    spaceUtilization: { type: Number, default: 0 }, // Percentage
    trends: { type: Object } // Additional analytics data
  });
  
  module.exports = mongoose.model('Analytics', analyticsSchema);
  