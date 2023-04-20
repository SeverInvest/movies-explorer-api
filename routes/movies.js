const routerMovies = require('express').Router();
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const {
  movieValidate,
  movieIdValidate,
} = require('../middlewares/validation');

routerMovies.get('/', getMovies);
routerMovies.post('/', movieValidate, createMovie);
routerMovies.delete('/:movieId', movieIdValidate, deleteMovie);

module.exports = routerMovies;
