const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  coordinates: {
    type: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    required: true
  },
  price: { type: Number, required: true }, // Base price
  rentalType: { type: String, enum: ['Daily', 'Monthly'], required: true }, // Rental type
  images: [{ type: String }], // Image URLs
  amenities: [{ type: String }],
  availability: { type: Boolean, default: true }, // Available based on booking status
  bookedDates: [{ type: Date }], // Booked dates for daily rental
  bookedMonths: [{ type: String }], // Booked months for monthly rental (e.g., '2024-03')
  status: { type: String, enum: ['Available', 'Booked', 'Inactive'], default: 'Available' },
  createdAt: { type: Date, default: Date.now },
});

// Check if property is available for booking
propertySchema.methods.isAvailable = function (startDate, endDate) {
  if (this.rentalType === 'Daily') {
    return !this.bookedDates.some(date => date >= startDate && date <= endDate);
  }
  if (this.rentalType === 'Monthly') {
    const bookingMonth = `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}`;
    return !this.bookedMonths.includes(bookingMonth);
  }
  return true;
};

module.exports = mongoose.model('Property', propertySchema);
