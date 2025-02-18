const express = require('express');
const {
  createDesk,
  getAllDesks,
  getDeskById,
  updateDesk,
  deleteDesk
} = require('../controllers/deskController');
const { validateDesk } = require('../validations/deskValidations');
const { protect, adminOnly } = require('../middlewares/authMiddleware')

const router = express.Router();

// Create a new desk (Admin only)
router.post('/', protect, adminOnly, validateDesk, createDesk);

// Get all desks
router.get('/', protect, getAllDesks);

// Get a desk by ID
router.get('/:id', protect, getDeskById);

// Update a desk (Admin only)
router.put('/:id', protect, adminOnly, validateDesk, updateDesk);

// Delete a desk (Admin only)
router.delete('/:id', protect, adminOnly, deleteDesk);

module.exports = router;
