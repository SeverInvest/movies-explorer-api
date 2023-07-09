const routerVideos = require('express').Router();
const {
  getVideos,
  deleteVideo,
  createVideo,
  like,
  dislike,
} = require('../controllers/videos');

routerVideos.get('/', getVideos);
routerVideos.post('/', createVideo);
routerVideos.delete('/:videoId', deleteVideo);
routerVideos.patch('/like/:videoId', like);
routerVideos.patch('/dislike/:videoId', dislike);

module.exports = routerVideos;
