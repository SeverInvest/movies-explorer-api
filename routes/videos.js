const routerVideos = require('express').Router();
const roles = require('../middlewares/roles');
const { videoLinkValidate } = require('../middlewares/validation');
const {
  getVideos,
  deleteVideo,
  createVideo,
  like,
  dislike,
  updateVideo,
} = require('../controllers/videos');

routerVideos.get('/', getVideos);
routerVideos.post('/', [roles(['USER']), videoLinkValidate], createVideo);
routerVideos.delete('/:videoId', deleteVideo);
routerVideos.patch('/like/:videoId', like);
routerVideos.patch('/dislike/:videoId', dislike);
routerVideos.patch('/:videoId', updateVideo);

module.exports = routerVideos;
