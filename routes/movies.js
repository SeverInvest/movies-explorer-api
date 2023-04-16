const routerMovies = require('express').Router();
const {
  getMovies,
  createMovie,
  // likeCard,
  // dislikeCard,
  deleteMovie,
} = require('../controllers/movies');

// const {
//   movieValidate,
//   movieIdValidate,
// } = require('../middlewares/validation');

routerMovies.get('/', getMovies);
routerMovies.post('/', createMovie);
// routerMovies.put('/:cardId/likes', cardIdValidate, likeCard);
routerMovies.delete('/:movieId', deleteMovie);
// routerMovies.delete('/:cardId/likes', cardIdValidate, dislikeCard);

module.exports = routerMovies;
