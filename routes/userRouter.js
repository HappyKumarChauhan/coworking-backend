const express = require('express');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getAllUsers
} = require('../controllers/userController');
const { validateUser, validateLogin } = require('../validations/userValidations');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

const router = express.Router();

// Register a new user
router.post('/register', validateUser, registerUser);

// Login a user
router.post('/login', validateLogin, loginUser);

// Get user profile (protected route)
router.get('/profile', protect, getUserProfile);

// Update user profile (protected route)
router.put('/profile', protect, validateUser, updateUserProfile);

// Delete a user (admin-only route)
router.delete('/:id', protect, adminOnly, deleteUser);

// Get all users (admin-only route)
router.get('/', protect, adminOnly, getAllUsers);

module.exports = router;
