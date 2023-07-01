const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');
const { MSG_400_LINK } = require('../utils/constants');

mongoose.set('strictQuery', false);

const videoSchema = new mongoose.Schema({

  language: {
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
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('video', videoSchema);
