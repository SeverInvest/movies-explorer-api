const { celebrate, Joi } = require('celebrate');

// const urlCheckPattern = /https?:\/\/(www\.)?[a-zA-Z\d-]+\.[\w\d\-.~:/?#[\]@!$&'()*+,;=]{2,}#?/;

const authValidate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const registerValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    // about: Joi.string().min(2).max(30),
    // avatar: Joi.string().pattern(urlCheckPattern),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const userValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

// const userIdValidate = celebrate({
//   params: Joi.object().keys({
//     userId: Joi.string().hex().length(24).required(),
//   }),
// });

// const avatarValidate = celebrate({
//   body: Joi.object().keys({
//     avatar: Joi.string().required().pattern(urlCheckPattern),
//   }),
// });

// const movieValidate = celebrate({
//   body: Joi.object().keys({
//     name: Joi.string().required().min(2).max(30),
//     link: Joi.string().required().pattern(urlCheckPattern),
//   }),
// });

// const movieIdValidate = celebrate({
//   params: Joi.object().keys({
//     cardId: Joi.string().hex().length(24).required(),
//   }),
// });

module.exports = {
  authValidate,
  registerValidate,
  userValidate,
  // userIdValidate,
  // avatarValidate,
  // movieValidate,
  // movieIdValidate,
};
