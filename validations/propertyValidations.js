const { body } = require('express-validator');

const validateProperty = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('coordinates.lat').notEmpty().withMessage('Latitude is required').isNumeric().withMessage('Latitude must be a number'),
  body('coordinates.lng').notEmpty().withMessage('Longitude is required').isNumeric().withMessage('Longitude must be a number'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('rentalType').isIn(['Daily', 'Monthly']).withMessage('Rental type must be Daily or Monthly'),
  body('amenities').optional().isArray().withMessage('Amenities must be an array'),
];

const validatePropertyUpdate = [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('location').optional().notEmpty().withMessage('Location cannot be empty'),
  body('coordinates.lat').optional().isNumeric().withMessage('Latitude must be a number'),
  body('coordinates.lng').optional().isNumeric().withMessage('Longitude must be a number'),
  body('price').optional().isNumeric().withMessage('Price must be a number'),
  body('amenities').optional().isArray().withMessage('Amenities must be an array'),
];

module.exports = { validateProperty, validatePropertyUpdate };