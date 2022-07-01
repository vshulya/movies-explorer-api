const router = require('express').Router();
const {
  getMovies,
  addMovie,
  deleteMovie,
} = require('../controllers/movies');

// GET /movies - saved movies
router.get('/', getMovies);

// POST /movies - saved movies
router.post('/', addMovie);

// DELETE /movies - saved movies
router.delete('/:movieId', deleteMovie);

module.exports.movieRouter = router;
