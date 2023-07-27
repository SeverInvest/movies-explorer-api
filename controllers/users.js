const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Role = require('../models/role');
const { STATUS_OK, STATUS_CREATED } = require('../utils/statuses');
const NotFoundError = require('../errors/NotFoundError');
const ConflictedError = require('../errors/ConflictedError');
const { MSG_404, MSG_409_USER } = require('../utils/constants');
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
    const userRole = await Role.findOne({ value: 'USER' });
    const tryUser = await User.findOne({ email: req.body.email });
    if (tryUser) {
      throw new ConflictedError(MSG_409_USER);
    }
    const user = await User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      roles: [userRole.value],
    });
    await user.save();
    res.status(STATUS_CREATED).send(
      {
        email: user.email,
        name: user.name,
        _id: user._id,
        roles: [userRole.value],
        atRegistration: user.atRegistration,
        atLastEntry: user.atLastEntry,
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
    const token = jwt.sign(
      { _id: user._id },
      // nodeEnv === 'production' &&
      jwtSecret,
      { expiresIn: '24h' },
    );
    user.atLastEntry = Date.now();
    await user.save();
    res.status(STATUS_OK).send({ token });
  } catch (err) {
    next(err);
  }
};

module.exports.getUsers = async (_, res, next) => {
  try {
    const users = await User.find();
    if (!users) {
      throw new NotFoundError(MSG_404);
    }
    res.status(STATUS_OK).send(users);
  } catch (err) {
    next(err);
  }
};

module.exports.updateRoles = async (req, res, next) => {
  const { roles, userId } = req.body;
  updateUser(userId, { roles }, res, next);
};
