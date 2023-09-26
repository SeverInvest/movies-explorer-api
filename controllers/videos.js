const axios = require("axios");
const Video = require("../models/video");
const User = require("../models/user");
const { STATUS_OK, STATUS_CREATED } = require("../utils/statuses");
const NotFoundError = require("../errors/NotFoundError");
const ForbiddenError = require("../errors/ForbiddenError");
const ConflictedError = require("../errors/ConflictedError");
const { MSG_404, MSG_403, MSG_DELETE_MOVIE, MSG_409_VIDEO } = require("../utils/constants");
const { keyApiYoutube } = require("../config");

async function getVideo(idVideo) {
  const api = axios.create({
    baseURL: "https://www.googleapis.com/youtube/v3/videos",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const response = await api.get(`/?key=${keyApiYoutube}&part=snippet,contentDetails,statistics&id=${idVideo}`);
  return response;
}

module.exports.getVideos = async (_, res, next) => {
  try {
    const videos = await Video.find({});
    res.status(STATUS_OK).send(videos);
  } catch (err) {
    next(err);
  }
};

module.exports.createVideo = async (req, res, next) => {
  try {
    const vLink = req.body.videoLink;
    const idVideo = vLink.replace("https://youtu.be/", "");
    const responseYoutube = await getVideo(idVideo);
    if (!responseYoutube) {
      throw new NotFoundError(MSG_404);
    }
    const { snippet, contentDetails, statistics } = responseYoutube.data.items[0];
    const tryVideo = await Video.findOne({ videoLink: req.body.videoLink });
    if (tryVideo) {
      throw new ConflictedError(MSG_409_VIDEO);
    }
    const video = await Video.create({
      language: snippet.defaultAudioLanguage,
      author: snippet.channelTitle,
      duration: contentDetails.duration,
      publishedAtYoutube: snippet.publishedAt,
      description: snippet.description,
      imageLink: snippet.thumbnails.medium.url,
      videoLink: vLink,
      nameVideo: snippet.title,
      viewCountYoutube: statistics.viewCount,
      likeCountYoutube: statistics.likeCount,
      owner: req.user._id.toString(),
      publishedAtThis: new Date(),
      users: [],
    });
    await video.save();
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
    if (video.owner.toString() === req.user._id.toString() || req.user.roles.includes("ADMIN")) {
      await User.updateMany({}, { $pull: { videos: req.params.videoId } });
      await Video.deleteOne(video);
      res.status(STATUS_OK).send({ data: video, message: MSG_DELETE_MOVIE });
    } else {
      throw new ForbiddenError(MSG_403);
    }
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
    user.videos = user.videos.filter(x => req.params.videoId !== x.toString());
    user.save();
    const video = await Video.findById(req.params.videoId);
    video.users = video.users.filter(x => req.user._id.toString() !== x.toString());
    video.save();
    res.status(STATUS_OK).send({ video, user });
  } catch (err) {
    next(err);
  }
};

module.exports.updateVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.videoId);
    const idVideo = video.videoLink.replace("https://youtu.be/", "");
    const responseYoutube = await getVideo(idVideo);
    const { snippet, contentDetails, statistics } = responseYoutube.data.items[0];
    video.language = snippet.defaultAudioLanguage;
    video.author = snippet.channelTitle;
    video.duration = contentDetails.duration;
    video.publishedAtYoutube = snippet.publishedAt;
    video.description = snippet.description;
    video.imageLink = snippet.thumbnails.medium.url;
    video.nameVideo = snippet.title;
    video.viewCountYoutube = statistics.viewCount;
    video.likeCountYoutube = statistics.likeCount;
    video.save();
    res.status(STATUS_CREATED).send(video);
  } catch (err) {
    next(err);
  }
};
