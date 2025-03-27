const express = require('express');
const {
  registerUser,
  upload,
  uploadProfilePicture,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getAllUsers
} = require('../controllers/userController');
const { validateUser, validateLogin,validateProfileUpdate } = require('../validations/userValidations');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

const router = express.Router();

// Register a new user
router.post('/register', validateUser, registerUser);

// Upload profile picture (Authenticated users only)
router.post('/upload-profile', protect, upload.single('profilePicture'), uploadProfilePicture);

// Login a user 
router.post('/login', validateLogin, loginUser);

// Get user profile (protected route)
router.get('/profile', protect, getUserProfile);

// Update user profile (protected route)
router.put('/profile', protect, validateProfileUpdate, updateUserProfile);

// Delete a user (admin-only route)
router.delete('/:id', protect, adminOnly, deleteUser);

// Get all users (admin-only route)
router.get('/', protect, adminOnly, getAllUsers);

module.exports = router;
