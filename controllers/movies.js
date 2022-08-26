const Movie = require('../models/movie');
const ValidationError = require('../errors/ValidationError');
const ServerError = require('../errors/ServerError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

// GET /movies - saved movies
module.exports.getMovies = (req, res, next) => {
  Movie.find({});
  const owner = req.user._id;
  const myMovies = [];
  Movie.find({})
    .then((movies) => {
      movies.forEach((item) => item.owner.toString() === owner && myMovies.push(item));
      res.status(201).send({ Movies: myMovies });
    })
    .catch(next);
};

// POST /movies - saved movies
module.exports.addMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    movieId,
    nameRU,
    nameEN,
    thumbnail,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    movieId,
    nameRU,
    nameEN,
    thumbnail,
    owner,
  })
    // return data in DB
    .then((movie) => res.status(201).send(movie))
    // something went wrong, return an error
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Invalid data for creating movie'));
      }
      return next(new ServerError());
    });
};

// DELETE /movies - saved movies
module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        return next(new NotFoundError('Movie not found'));
      }
      if (req.user._id === movie.owner.toString()) {
        return movie.remove()
          .then(() => {
            res.send({ message: 'Movie has been deleted' });
          });
      }
      return next(new ForbiddenError('Do not have permission to delete this movie'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Invalid id'));
      }
      return next(new ServerError());
    });
};
