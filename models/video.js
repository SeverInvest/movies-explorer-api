const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');
const { MSG_400_LINK } = require('../utils/constants');

mongoose.set('strictQuery', false);

const videoSchema = new mongoose.Schema({

  language: {
    type: String,
    required: true,
    default: 'ru',
  },
  author: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  publishedAtYoutube: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageLink: {
    type: String,
    required: true,
    validate: {
      validator: (url) => isURL(url),
      message: MSG_400_LINK,
    },
  },
  videoLink: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (url) => isURL(url),
      message: MSG_400_LINK,
    },
  },
  nameVideo: {
    type: String,
    required: true,
  },
  viewCountYoutube: {
    type: String,
  },
  likeCountYoutube: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  publishedAtThis: {
    type: Date,
    required: true,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

module.exports = mongoose.model('Video', videoSchema);
