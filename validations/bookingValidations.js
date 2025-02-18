const { body } = require('express-validator');

const validateBooking = [
  body('user')
    .notEmpty().withMessage('User ID is required.')
    .isMongoId().withMessage('Invalid User ID.'),
  
  body('desk')
    .notEmpty().withMessage('Desk ID is required.')
    .isMongoId().withMessage('Invalid Desk ID.'),
  
  body('startTime')
    .notEmpty().withMessage('Start time is required.')
    .isISO8601().withMessage('Invalid start time format.'),
  
  body('endTime')
    .notEmpty().withMessage('End time is required.')
    .isISO8601().withMessage('Invalid end time format.')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startTime)) {
        throw new Error('End time must be after start time.');
      }
      return true;
    }),
];

module.exports = { validateBooking };