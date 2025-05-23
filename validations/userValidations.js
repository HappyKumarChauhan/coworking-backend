const { body } = require('express-validator');

const validateUser = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phoneNumber')
    .matches(/^\d{10}$/)
    .withMessage('Phone number must be a valid 10-digit number'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/\d/)
    .withMessage('Password must contain at least one number'),
];
const validateProfileUpdate = [
  body('name').notEmpty().withMessage('Name is required'),
  body('phoneNumber')
    .matches(/^\d{10}$/)
    .withMessage('Phone number must be a valid 10-digit number'),
  body('dateOfBirth')
    .isISO8601()
    .withMessage('Date of Birth must be a valid date (YYYY-MM-DD)'),
  body('city').notEmpty().withMessage('City is required'),
  body('pincode')
    .matches(/^\d{6}$/)
    .withMessage('Pincode must be a valid 6-digit number'),
];
const validateProfilePicture = [
  body('profilePicture')
    .optional()
    .isString()
    .withMessage('Profile picture must be a valid file path'),
];

const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];
module.exports = { validateUser, validateLogin, validateProfilePicture,validateProfileUpdate };
