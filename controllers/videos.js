const Video = require('../models/video');
const User = require('../models/user');
const { STATUS_OK, STATUS_CREATED } = require('../utils/statuses');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const { MSG_404, MSG_403, MSG_DELETE_MOVIE } = require('../utils/constants');

module.exports.getVideos = async (req, res, next) => {
  try {
    // const videos = await Video.find().populete('User');
    const videos = await Video.find();
    res.status(STATUS_OK).send(videos.reverse());
  } catch (err) {
    next(err);
  }
};

module.exports.createVideo = async (req, res, next) => {
  const data = req.body;
  const ownerId = req.user._id.toString();
  const query = { movieId: data.movieId, owner: ownerId };
  const update = { ...data, owner: ownerId };
  const options = { upsert: true, returnDocument: 'after' };
  try {
    const video = await Video.findOneAndUpdate(query, update, options);
    res.status(STATUS_CREATED).send(video);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.videoId);
    if (!video) {
      throw new NotFoundError(MSG_404);
    }
    if (video.owner.toString() !== req.user._id.toString()) {
      throw new ForbiddenError(MSG_403);
    }
    await Video.deleteOne(video);
    res.status(STATUS_OK).send({ data: video, message: MSG_DELETE_MOVIE });
  } catch (err) {
    next(err);
  }
};

module.exports.like = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id.toString(),
      { $addToSet: { videos: req.params.videoId } },
      { new: true },
    );
    const video = await Video.findByIdAndUpdate(
      req.params.videoId,
      { $addToSet: { users: req.user._id.toString() } },
      { new: true },
    );
    await video.save();
    await user.save();
    res.status(STATUS_OK).send({ video, user });
  } catch (err) {
    next(err);
  }
};

module.exports.dislike = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id.toString());
    user.videos = user.videos.filter((x) => req.params.videoId !== x.toString());
    user.save();
    const video = await Video.findById(req.params.videoId);
    video.users = video.users.filter((x) => req.user._id.toString() !== x.toString());
    video.save();
    res.status(STATUS_OK).send({ video, user });
  } catch (err) {
    next(err);
  }
};
