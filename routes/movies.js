const router = require('express').Router();

// GET /movies - saved movies
router.get('/movies', getMovies);

// POST /movies - saved movies
router.post('/movies', addMovies);

// DELETE /movies - saved movies
router.delete('/movies/_id', deleteMovies);

module.exports.movieRouter = router;

