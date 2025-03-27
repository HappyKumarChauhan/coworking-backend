const express = require('express');
const { toggleWishlist, getWishlist } = require('../controllers/wishlistController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Toggle wishlist (Add/Remove)
router.post('/toggle', protect, toggleWishlist);

// Get user's wishlist
router.get('/', protect, getWishlist);

module.exports = router;
