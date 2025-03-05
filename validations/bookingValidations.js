const { body } = require('express-validator');

const validateBooking = [
  body('property')
    .notEmpty().withMessage('Property ID is required.')
    .isMongoId().withMessage('Invalid Property ID.'),
  
  body('startDate')
    .notEmpty().withMessage('Start date is required.')
    .isISO8601().withMessage('Invalid start date format.'),
  
  body('endDate')
    .notEmpty().withMessage('End date is required.')
    .isISO8601().withMessage('Invalid end date format.')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date.');
      }
      return true;
    }),
];

module.exports = { validateBooking };
