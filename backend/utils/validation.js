// backend/utils/validation.js
const { validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errorObj = {}
    const errors = validationErrors
      .array()
      .filter((error) => error.msg !== "Invalid value")
    // .map((error) =>  `${error.msg}`);//console.log(error)

    for (let error of errors) {
      const key = error.param;
      const value = error.msg;
      errorObj[key] = value
    }

    const err = Error('Validation error'); //'Bad request.'
    err.errors = errorObj;
    err.status = 400;
    // err.title = 'Bad request.';
    next(err);
  }
  next();
};

module.exports = {
  handleValidationErrors
};
