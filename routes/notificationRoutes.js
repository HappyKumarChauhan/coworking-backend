const express = require('express');
const {
  createNotification,
  getUserNotifications,
  markAsRead,
  deleteNotification
} = require('../controllers/notificationController');
const { validateNotification } = require('../validations/notificationValidations');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Create a new notification
router.post('/', protect, validateNotification, createNotification);

// Get notifications for a user
router.get('/', protect, getUserNotifications);

// Mark a notification as read
router.put('/:id/read', protect, markAsRead);

// Delete a notification
router.delete('/:id', protect, deleteNotification);

module.exports = router;
