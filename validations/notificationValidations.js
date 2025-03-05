const { body } = require('express-validator');

const validateNotification = [
  body('user')
    .notEmpty().withMessage('User ID is required.')
    .isMongoId().withMessage('Invalid User ID.'),
  
  body('message')
    .notEmpty().withMessage('Message is required')
    .isString().withMessage('Message must be a string')
];

module.exports = { validateNotification };
