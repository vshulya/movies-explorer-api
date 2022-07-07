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
  const owner = req.user._id; // _id станет доступен
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
    // вернём записанные в базу данные
    .then((movie) => res.status(201).send(movie))
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Некорректные данные при создании фильма'));
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
        return next(new NotFoundError('Фильм не найден'));
      }
      if (req.user._id === movie.owner.toString()) {
        return movie.remove()
          .then(() => {
            res.send({ message: 'Фильм удален' });
          });
      }
      return next(new ForbiddenError('Нет прав для удаления этого фильма'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Передан некорректный Id'));
      }
      return next(new ServerError());
    });
};
