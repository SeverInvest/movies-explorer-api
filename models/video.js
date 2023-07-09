const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');
const { MSG_400_LINK } = require('../utils/constants');

mongoose.set('strictQuery', false);

const videoSchema = new mongoose.Schema({

  language: {
    type: String,
    required: true,
  },
  author: {
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
    validate: {
      validator: (url) => isURL(url),
      message: MSG_400_LINK,
    },
  },
  nameVideo: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

videoSchema.pre('deleteOne', { document: true, query: false }, async (next) => {
  await this.model('User').updateMany(
    { videos: this._id },
    { $pull: { videos: this._id } },
  );
  next();
});

module.exports = mongoose.model('Video', videoSchema);
