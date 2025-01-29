const { body } = require('express-validator');

const validateBooking = [
  body('user')
    .notEmpty().withMessage('User ID is required.'),
  body('desk')
    .notEmpty().withMessage('Desk ID is required.'),
  body('startTime')
    .isISO8601().withMessage('Start time must be a valid date.'),
  body('endTime')
    .isISO8601().withMessage('End time must be a valid date.')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startTime)) {
        throw new Error('End time must be after start time.');
      }
      return true;
    })
];

module.exports = { validateBooking };
