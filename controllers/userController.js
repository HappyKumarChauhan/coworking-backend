const { validationResult } = require('express-validator')
const User = require('../models/User')
const multer = require('multer')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const path = require('path')

// Multer storage setup for profile picures
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profile-pictures')
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${req.user.userId}-${Date.now()}${path.extname(file.originalname)}`,
    )
  },
})
const upload = multer({ storage })

// Register a new user
const registerUser = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { name, email, phoneNumber, password, role } = req.body

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create a new user
    const user = new User({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
    })

    await user.save()
    const responseUser = {
      email: user.email,
      name: user.name,
    }
    res
      .status(201)
      .json({ message: 'User registered successfully', user: responseUser })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error registering user', error: error.message })
  }
}

// Upload profile picture
const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.profilePicture = req.file.filename;
    await user.save();

    res.json({ message: 'Profile picture updated', profilePicture: req.file.filename });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading profile picture', error: error.message });
  }
};


// Login a user
const loginUser = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { email, password } = req.body

  try {
    // Check if the user exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      },
    )

    res.json({ message: 'Login successful', token, user })
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message })
  }
}

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json({user})
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error retrieving user profile', error: error.message })
  }
}

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Update fields
    user.name = req.body.name || user.name
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber
    user.address = req.body.address|| user.address
    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10)
    }

    await user.save()
    res.json({ message: 'User profile updated', user })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error updating user profile', error: error.message })
  }
}

// Delete a user (Admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    await user.remove()
    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error deleting user', error: error.message })
  }
}

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password')
    res.json(users)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching users', error: error.message })
  }
}

module.exports = {
  registerUser,
  upload,
  uploadProfilePicture,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getAllUsers,
}
