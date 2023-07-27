const { MSG_403 } = require('../utils/constants');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports = (roles) => (req, _, next) => {
  try {
    let hasRole = false;
    if (req.user.roles.includes('BLOCKED')) {
      throw new ForbiddenError(MSG_403);
    }
    roles.forEach((role) => {
      if (req.user.roles.includes(role)) {
        hasRole = true;
      }
    });
    if (!hasRole) {
      throw new ForbiddenError(MSG_403);
    }
    next();
  } catch (error) {
    next(error);
  }
};
