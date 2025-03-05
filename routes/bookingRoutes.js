const express = require('express');
const {
  createBooking,
  getAllBookings,
  getUserBookings,
  cancelBooking,
  confirmBooking
} = require('../controllers/bookingController');
const { protect, adminOnly,ownerOnly } = require('../middlewares/authMiddleware');
const { validateBooking } = require('../validations/bookingValidations');

const router = express.Router();

// Create a new booking
router.post('/', protect, validateBooking, createBooking);

// Get all bookings (Admin only)
router.get('/', protect, adminOnly, getAllBookings);

// Get user bookings
router.get('/my-bookings', protect, getUserBookings);

// Confirm booking
router.put('/:id/confirm', protect, ownerOnly, confirmBooking);

// Cancel a booking
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
