const express = require('express');
const {
  createBooking,
  getAllBookings,
  getBookingById,
  cancelBooking
} = require('../controllers/bookingController');
const { validateBooking } = require('../validations/bookingValidations');
const {protect, adminOnly}=require('../middlewares/authMiddleware')

const router = express.Router();

// Create a new booking
router.post('/', protect, validateBooking, createBooking);

// Get all bookings (Admin only)
router.get('/', protect, adminOnly, getAllBookings);

// Get a single booking by ID
router.get('/:id', protect, getBookingById);

// Cancel a booking
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;