const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');
const { MSG_400_LINK } = require('../utils/constants');

mongoose.set('strictQuery', false);

const movieSchema = new mongoose.Schema({

  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (url) => isURL(url),
      message: MSG_400_LINK,
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (url) => isURL(url),
      message: MSG_400_LINK,
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (url) => isURL(url),
      message: MSG_400_LINK,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },

});

module.exports = mongoose.model('movie', movieSchema);
