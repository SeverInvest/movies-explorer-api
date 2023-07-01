const Video = require('../models/video');
const { STATUS_OK } = require('../utils/statuses');

module.exports.getVideos = async (req, res, next) => {
  try {
    const videos = await Video.find();
    res.status(STATUS_OK).send(videos.reverse());
  } catch (err) {
    next(err);
  }
};
