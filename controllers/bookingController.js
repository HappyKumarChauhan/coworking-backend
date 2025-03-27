const { validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Property = require('../models/Property');

// Create a new booking
const createBooking = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { property, startDate, endDate } = req.body;

  try {
    const selectedProperty = await Property.findById(property);
    if (!selectedProperty) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if the property is available
    if (!selectedProperty.isAvailable(new Date(startDate), new Date(endDate))) {
      return res.status(400).json({ message: 'Property is already booked for the selected dates.' });
    }

    // Update availability
    if (selectedProperty.rentalType === 'Daily') {
      selectedProperty.bookedDates.push(...getDatesInRange(new Date(startDate), new Date(endDate)));
    } else {
      selectedProperty.bookedMonths.push(`${new Date(startDate).getFullYear()}-${(new Date(startDate).getMonth() + 1).toString().padStart(2, '0')}`);
    }

    await selectedProperty.save();

    // Create booking record
    const booking = new Booking({ user: req.user.id, property, startDate, endDate, rentalType: selectedProperty.rentalType });
    await booking.save();

    res.status(201).json({ message: 'Booking request submitted, awaiting confirmation', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};

// Get a single booking by ID
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate('property', 'title location images');

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Ensure user is either the owner of the booking or an admin
    if (req.user.id.toString() !== booking.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking details', error: error.message });
  }
};

// Get Cancelled Bookings
const getCancelledBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id, status: 'Cancelled' }).populate('property', '_id title location images');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cancelled bookings', error: error.message });
  }
};

// Get Upcoming Bookings
const getUpcomingBookings = async (req, res) => {
  try {
    const currentDate = new Date();
    const bookings = await Booking.find({ user: req.user.id, endDate: { $gt: currentDate },status: { $ne: 'Cancelled' } }).populate('property', '_id title location images');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching upcoming bookings', error: error.message });
  }
};

// Get Completed Bookings
const getCompletedBookings = async (req, res) => {
  try {
    const currentDate = new Date();
    const bookings = await Booking.find({ user: req.user.id, endDate: { $lte: currentDate },status: { $ne: 'Cancelled' } }).populate('property', '_id title location images');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching completed bookings', error: error.message });
  }
};

// Get all bookings (Admin only)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('property', 'title location');
      
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

// Get bookings for a specific user
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('property', 'title location images');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user bookings', error: error.message });
  }
};
// Cancel a booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.user.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Unauthorized action' });
    }

    booking.status = 'Cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling booking', error: error.message });
  }
};

// Confirm a booking
const confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('property');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Only the property owner or admin can confirm the booking
    if (req.user.id !== booking.property.owner.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Unauthorized action' });
    }

    if (booking.status !== 'Pending') {
      return res.status(400).json({ message: 'Booking is already confirmed or cancelled' });
    }

    // Update booking status
    booking.status = 'Confirmed';
    await booking.save();

    // Update property availability
    const property = await Property.findById(booking.property._id);
    if (property.rentalType === 'Daily') {
      property.bookedDates.push(...getDatesInRange(new Date(booking.startDate), new Date(booking.endDate)));
    } else {
      property.bookedMonths.push(`${new Date(booking.startDate).getFullYear()}-${(new Date(booking.startDate).getMonth() + 1).toString().padStart(2, '0')}`);
    }
    await property.save();

    res.json({ message: 'Booking confirmed', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error confirming booking', error: error.message });
  }
};

// Utility function to get dates in a range
const getDatesInRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};
module.exports = {
  createBooking,
  getBookingById,
  getCancelledBookings,
  getUpcomingBookings,
  getCompletedBookings,
  getAllBookings,
  getUserBookings,
  confirmBooking,
  cancelBooking
};
