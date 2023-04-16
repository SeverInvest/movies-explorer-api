const routerMovies = require('express').Router();
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

routerMovies.get('/', getMovies);
routerMovies.post('/', createMovie);
routerMovies.delete('/:movieId', deleteMovie);

module.exports = routerMovies;
