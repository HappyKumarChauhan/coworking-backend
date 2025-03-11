const express = require('express');
const {
  createBooking,
  getBookingById,
  getAllBookings,
  getUserBookings,
  cancelBooking,
  confirmBooking
} = require('../controllers/bookingController');
const { protect, adminOnly,ownerOnly } = require('../middlewares/authMiddleware');
const { validateBooking } = require('../validations/bookingValidations');

const router = express.Router();

router.get('/my-bookings',protect, getUserBookings)

// Create a new booking
router.post('/', protect, validateBooking, createBooking);

// Get a specific booking by ID
router.get('/:id', protect, getBookingById);

// Get all bookings (Admin only)
router.get('/', protect, adminOnly, getAllBookings);

// Confirm booking
router.put('/:id/confirm', protect, ownerOnly, confirmBooking);

// Cancel a booking
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
