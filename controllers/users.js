const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { STATUS_OK, STATUS_CREATED } = require('../utils/statuses');
const NotFoundError = require('../errors/NotFoundError');
const { nodeEnv, jwtSecret } = require('../config');

function searchUserById(userId, res, next) {
  User.findById(userId)
    .orFail(() => {
      throw new NotFoundError('Resource not found');
    })
    .then((user) => {
      res
        .status(STATUS_OK)
        .send(user);
    })
    .catch(next);
}

function updateUser(userId, values, res, next) {
  User.findByIdAndUpdate(userId, values, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError('Resource not found');
    })
    .then((user) => {
      res.status(STATUS_OK).send(user);
    })
    .catch(next);
}

module.exports.getCurrentUser = (req, res, next) => {
  searchUserById(req.user._id, res, next);
};

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
    }))
    .then((user) => res.status(STATUS_CREATED).send(
      {
        email: user.email,
        name: user.name,
        _id: user._id,
      },
    ))
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  updateUser(req.user._id, { name, email }, res, next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        nodeEnv === 'production' && jwtSecret,
        { expiresIn: '7d' },
      );
      res
        .status(STATUS_OK)
        .send({ token });
    })
    .catch(next);
};
