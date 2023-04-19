const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { jwtSecret } = require('../config');
const { MSG_401_NEEDED_AUTH } = require('../utils/constants');

module.exports = async (req, _, next) => {
  const { authorization } = req.headers;
  try {
    if (!authorization || !authorization.startsWith('Bearer')) {
      throw new UnauthorizedError(MSG_401_NEEDED_AUTH);
    }
  } catch (err) {
    next(err);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, jwtSecret);
  } catch (err) {
    next(new UnauthorizedError(MSG_401_NEEDED_AUTH));
    return;
  }
  try {
    const user = await User.findById(payload._id);
    if (!user) {
      throw new UnauthorizedError(MSG_401_NEEDED_AUTH);
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
