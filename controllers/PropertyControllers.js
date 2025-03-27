const { validationResult } = require('express-validator');
const Property = require('../models/Property');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/properties/');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // Limit: 5MB
});

// Upload images for a property
const uploadPropertyImages = async (req, res) => {
  if (req.user.role !== 'PropertyOwner') {
    return res.status(403).json({ message: 'Only Property Owners can upload images' });
  }

  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You do not own this property' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    // Store image file paths in database
    const imagePaths = req.files.map(file => `/properties/${file.filename}`);
    property.images = property.images.concat(imagePaths);
    await property.save();

    res.json({ message: 'Images uploaded successfully', images: imagePaths });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading images', error: error.message });
  }
};


// Create a new property (Without images)
const createProperty = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const property = new Property({ owner: req.user.id, ...req.body });
    await property.save();
    res.status(201).json({ message: 'Property created successfully', property });
  } catch (error) {
    res.status(500).json({ message: 'Error creating property', error: error.message });
  }
};

// Get all properties
const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: 'Available' }).populate('owner', 'name email');
    res.json(properties);
    // res.json([])
  } catch (error) {
    res.status(500).json({ message: 'Error fetching properties', error: error.message });
  }
};

// Get all properties listed by the logged-in owner
const getOwnerProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user.id });
    res.json(properties);
    // res.json([]);

  } catch (error) {
    res.status(500).json({ message: 'Error fetching owner properties', error: error.message });
  }
};

// Get property by ID
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner', 'name email');
    if (!property) return res.status(404).json({ message: 'Property not found' });
    let isInWishlist = false;

    // Check if the user is logged in and has the property in their wishlist
    if (req.user) {
      const user = await User.findById(req.user.id);
      if (user) {
        isInWishlist = user.wishlist.some((id) => id.toString() === req.params.id);
      }
    }

    res.json({ ...property.toObject(), isInWishlist });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching property', error: error.message });
  }
};

// Update property details (Only Owner or Admin)
const updateProperty = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    if (req.user.id !== property.owner.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Unauthorized action' });
    }

    const updatedProperty = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Property updated successfully', property: updatedProperty });
  } catch (error) {
    res.status(500).json({ message: 'Error updating property', error: error.message });
  }
};

// Delete a property (Only the Owner or Admin)
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    if (req.user.id !== property.owner.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Unauthorized action' });
    }

    await property.deleteOne();
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting property', error: error.message });
  }
};

module.exports = {
  uploadPropertyImages,
  createProperty,
  getAllProperties,
  getOwnerProperties,
  getPropertyById,
  deleteProperty,
  updateProperty,
  upload
};
