const User = require('../models/User');
const Property = require('../models/Property');

// Toggle property in wishlist (Add if not exists, Remove if exists)
const toggleWishlist = async (req, res) => {
  try {
    const { propertyId } = req.body;

    // Check if the property exists
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    const user = await User.findById(req.user.id);

    // Check if property is already in wishlist
    const isInWishlist = user.wishlist.includes(propertyId);

    if (isInWishlist) {
      // Remove from wishlist
      user.wishlist = user.wishlist.filter(id => id.toString() !== propertyId);
      await user.save();
      return res.json({ message: 'Property removed from wishlist', wishlist: user.wishlist });
    } else {
      // Add to wishlist
      user.wishlist.push(propertyId);
      await user.save();
      return res.json({ message: 'Property added to wishlist', wishlist: user.wishlist });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating wishlist', error: error.message });
  }
};

// Fetch wishlist properties
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist', 'title location price rentalType images');
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist', error: error.message });
  }
};

module.exports = { toggleWishlist, getWishlist };
