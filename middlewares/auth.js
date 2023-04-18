const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { nodeEnv, jwtSecret } = require('../config');

module.exports = async (req, _, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    throw new UnauthorizedError('Needed authorization');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, nodeEnv === 'production' && jwtSecret);
  } catch (err) {
    next(new UnauthorizedError('Needed authorization'));
    return;
  }
  try {
    const user = await User.findById(payload._id);
    if (!user) {
      throw new UnauthorizedError('Needed authorization');
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
