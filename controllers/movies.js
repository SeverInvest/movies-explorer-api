const Movie = require('../models/movie');
const { STATUS_OK, STATUS_CREATED } = require('../utils/statuses');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .populate('owner')
    .then((movies) => res.status(STATUS_OK).send(movies.reverse()))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const data = req.body;
  const ownerId = req.user._id;
  Movie.create({ ...data, owner: ownerId })
    .then((movie) => {
      res.status(STATUS_CREATED).send(movie);
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => {
      throw new NotFoundError('Resource not found');
    })
    .then((movie) => {
      if (movie.owner.toString() === req.user._id) {
        Movie.deleteOne(movie)
          .then(() => res.status(STATUS_OK).send({ data: movie, message: 'Фильм удалён' }))
          .catch(next);
      } else {
        throw new ForbiddenError('Access to execution is forbidden');
      }
    })
    .catch(next);
};
