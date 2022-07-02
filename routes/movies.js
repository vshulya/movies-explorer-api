const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { reg } = require('../utils/isLink');
const {
  getMovies,
  addMovie,
  deleteMovie,
} = require('../controllers/movies');

// GET /movies - saved movies
router.get('/', getMovies);

// POST /movies - saved movies
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().pattern(reg).required(),
      trailer: Joi.string().pattern(reg).required(),
      thumbnail: Joi.string().pattern(reg).required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  addMovie,
);

// DELETE /movies - saved movies
router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex().required(),
  }),
}), deleteMovie);

module.exports.movieRouter = router;
