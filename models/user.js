const mongoose = require('mongoose');
// const isEmail = require('validator/lib/isEmail');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    // validate: {
    //   validator: (email) => isEmail(email),
    //   message: 'Некорректный формат почты',
    // },
  },
  password: {
    type: String,
    required: true,
    // select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30
  }
});

module.exports = mongoose.model('User', userSchema);