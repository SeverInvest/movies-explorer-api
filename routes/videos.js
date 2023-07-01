const routerVideos = require('express').Router();
const {
  getVideos,
} = require('../controllers/videos');

routerVideos.get('/', getVideos);

module.exports = routerVideos;
