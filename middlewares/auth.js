const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { nodeEnv, jwtSecret } = require('../config');

module.exports = (req, _, next) => {
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

  req.user = payload;

  next();
};
