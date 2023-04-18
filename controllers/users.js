const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { STATUS_OK, STATUS_CREATED } = require('../utils/statuses');
const NotFoundError = require('../errors/NotFoundError');
const { MSG_404 } = require('../utils/constants');
const { jwtSecret } = require('../config');

async function searchUserById(userId, res, next) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError(MSG_404);
    }
    res.status(STATUS_OK).send(user);
  } catch (err) {
    next(err);
  }
}

async function updateUser(userId, values, res, next) {
  try {
    const user = await User.findByIdAndUpdate(userId, values, { new: true, runValidators: true });
    if (!user) {
      throw new NotFoundError(MSG_404);
    }
    res.status(STATUS_OK).send(user);
  } catch (err) {
    next(err);
  }
}

module.exports.getCurrentUser = (req, res, next) => {
  searchUserById(req.user._id, res, next);
};

module.exports.createUser = async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
    });
    res.status(STATUS_CREATED).send(
      {
        email: user.email,
        name: user.name,
        _id: user._id,
      },
    );
  } catch (err) {
    next(err);
  }
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  updateUser(req.user._id, { name, email }, res, next);
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    const token = await jwt.sign(
      { _id: user._id },
      // nodeEnv === 'production' &&
      jwtSecret,
      { expiresIn: '7d' },
    );
    res.status(STATUS_OK).send({ token });
  } catch (err) {
    next(err);
  }
};
