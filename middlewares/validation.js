const { celebrate, Joi } = require('celebrate');

const urlCheckPattern = /https?:\/\/(www\.)?[a-zA-Z\d-]+\.[\w\d\-.~:/?#[\]@!$&'()*+,;=]{2,}#?/;
const nameCheckPattern = /^(?!\s)[-A-Za-zА-Яа-яЁё\s]+$/;

const authValidate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const registerValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .required()
      .pattern(nameCheckPattern)
      .min(2)
      .max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const userValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .required()
      .pattern(nameCheckPattern)
      .min(2)
      .max(30),
    email: Joi.string().required().email(),
  }),
});

const movieValidate = celebrate({
  body: Joi.object().keys({
    language: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(urlCheckPattern),
    trailerLink: Joi.string().required().pattern(urlCheckPattern),
    movieId: Joi.string().required(),
    name: Joi.string().required(),
  }),
});

const movieIdValidate = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().length(24).hex(),
  }),
});

module.exports = {
  authValidate,
  registerValidate,
  userValidate,
  movieValidate,
  movieIdValidate,
};
