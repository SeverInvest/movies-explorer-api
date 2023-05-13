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
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(urlCheckPattern),
    trailerLink: Joi.string().required().pattern(urlCheckPattern),
    thumbnail: Joi.string().required().pattern(urlCheckPattern),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const movieIdValidate = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  authValidate,
  registerValidate,
  userValidate,
  movieValidate,
  movieIdValidate,
};
