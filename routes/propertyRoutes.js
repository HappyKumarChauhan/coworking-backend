const express = require('express')
const {
  createProperty,
  getOwnerProperties,
  getAllProperties,
  uploadPropertyImages,
  updateProperty,
  getPropertyById,
  deleteProperty,
  upload,
} = require('../controllers/propertyControllers')
const { validateProperty,validatePropertyUpdate } = require('../validations/propertyValidations')
const {
  protect,
  ownerOnly,
} = require('../middlewares/authMiddleware')

const router = express.Router()

// Create a new property (Without images)
router.post('/', protect, ownerOnly, validateProperty, createProperty)

// Upload images for a property (Only Property Owners)
router.post(
  '/:id/upload-images',
  protect,
  ownerOnly,
  upload.array('images', 5),
  uploadPropertyImages,
)

// Get all properties
router.get('/',protect, getAllProperties)

// Get all properties listed by the owner
router.get('/my-properties', protect, ownerOnly, getOwnerProperties);

// Get a property by ID
router.get('/:id', getPropertyById)

// Update property details (Only Owner or Admin)
router.put('/:id', protect, validatePropertyUpdate, updateProperty);

// Delete a property (Only Owner or Admin)
router.delete('/:id', protect, deleteProperty)

module.exports = router
