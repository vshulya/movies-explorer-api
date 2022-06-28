const mongoose = require('mongoose');
// const isUrl = require('validator/lib/isURL');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    // validate: {
    //   validator: (link) => isUrl(link),
    //   message: 'Некорректный формат ссылки',
    // },
  },
  trailerLink: {
    type: String,
    required: true,
    // validate: {
    //   validator: (link) => isUrl(link),
    //   message: 'Некорректный формат ссылки',
    // },
  },
  thumbnail: {
    type: String,
    required: true,
    // validate: {
    //   validator: (link) => isUrl(link),
    //   message: 'Некорректный формат ссылки',
    // },
  },
  owner: {
    type: String,
    required: true,
  },
  movieId: {
    // id фильма, который содержится в ответе сервиса MoviesExplorer.Обязательное поле.
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);