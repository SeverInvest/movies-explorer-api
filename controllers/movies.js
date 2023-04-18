const Movie = require('../models/movie');
const { STATUS_OK, STATUS_CREATED } = require('../utils/statuses');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getMovies = async (req, res, next) => {
  const owner = req.user._id;
  try {
    const movies = await Movie.find({ owner }).populate('owner');
    res.status(STATUS_OK).send(movies.reverse());
  } catch (err) {
    next(err);
  }
};

// module.exports.createMovie = (req, res, next) => {
//   const data = req.body;
//   const ownerId = req.user._id;
//   Movie.create({ ...data, owner: ownerId })
//     .then((movie) => {
//       res.status(STATUS_CREATED).send(movie);
//     })
//     .catch(next);
// };

module.exports.createMovie = async (req, res, next) => {
  const data = req.body;
  const ownerId = req.user._id.toString();
  const query = { movieId: data.movieId, owner: ownerId };
  const update = { ...data, owner: ownerId };
  const options = { upsert: true, returnDocument: 'after' };
  let movie;
  try {
    movie = await Movie.findOneAndUpdate(query, update, options);
    res.status(STATUS_CREATED).send(movie);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) {
      throw new NotFoundError('Resource not found');
    }
    if (movie.owner.toString() !== req.user._id.toString()) {
      throw new ForbiddenError('Access to execution is forbidden');
    }
    await Movie.deleteOne(movie);
    res.status(STATUS_OK).send({ data: movie, message: 'Фильм удалён' });
  } catch (err) {
    next(err);
  }
};
