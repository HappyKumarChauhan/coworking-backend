const express = require('express');
const {
  createBooking,
  getBookingById,
  getCancelledBookings,
  getCompletedBookings,
  getUpcomingBookings,
  getAllBookings,
  getUserBookings,
  cancelBooking,
  confirmBooking,
  checkAvailability
} = require('../controllers/bookingController');
const { protect, protectAdmin,ownerOnly } = require('../middlewares/authMiddleware');
const { validateBooking } = require('../validations/bookingValidations');

const router = express.Router();

router.get('/my-bookings',protect, getUserBookings)

// Check property availability before booking
router.post('/check-availability', protect, checkAvailability)

// Get Cancelled Bookings
router.get('/cancelled', protect, getCancelledBookings);

// Get Upcoming Bookings
router.get('/upcoming', protect, getUpcomingBookings);

// Get Completed Bookings
router.get('/completed', protect, getCompletedBookings);

// Create a new booking
router.post('/', protect, validateBooking, createBooking);

// Get a specific booking by ID
router.get('/:id', protect, getBookingById);

// Get all bookings (Admin only)
router.get('/', protect, protectAdmin, getAllBookings);

// Confirm booking
router.put('/:id/confirm', protect, ownerOnly, confirmBooking);

// Cancel a booking
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
