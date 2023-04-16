const mongoose = require('mongoose');
const ValidationError = require('../errors/ValidationError');
const ConflictedError = require('../errors/ConflictedError');
const ApplicationError = require('../errors/ApplicationError');

function handleError(error, _, res, next) {
  let httpError = {
    status: 500,
    message: 'Internal server error',
  };

  if (error instanceof mongoose.Error.CastError) {
    httpError = new ValidationError('Incorrect data');
  } else if (error.code === 11000) {
    httpError = new ConflictedError('Such a user already exists');
  } else if (error instanceof ApplicationError) {
    httpError = error;
  } else if (error instanceof mongoose.Error.ValidationError) {
    httpError = new ValidationError(error.message);
  }

  res.status(httpError.status).send({ message: httpError.message });

  next();
}

module.exports = handleError;
