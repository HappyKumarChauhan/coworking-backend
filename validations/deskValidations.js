const { body } = require('express-validator');

const validateDesk = [
  body('location')
    .notEmpty().withMessage('Location is required')
    .isString().withMessage('Location must be a string'),
  
  body('equipment')
    .optional()
    .isArray().withMessage('Equipment must be an array of strings'),

  body('isAvailable')
    .optional()
    .isBoolean().withMessage('isAvailable must be a boolean')
];

module.exports = { validateDesk };
