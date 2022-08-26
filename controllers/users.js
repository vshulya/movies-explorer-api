const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../utils/constants');

// const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ServerError = require('../errors/ServerError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');

const MONGO_DUPLICATE_KEY_CODE = 11000;

const saltRounds = 10;

// GET /users/me - current user
module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.status(200).send({
        email: user.email,
        name: user.name,
      });
    })
    .catch(next);
};

// PATCH /users/me — update profile
module.exports.updateUser = (req, res, next) => {
  const { _id, name, email } = req.body;
  // update user's name that we found by id
  User.findByIdAndUpdate(req.user._id, { name, email }, {
    new: true, runValidators: true,
  })
    .then(() => {
      res.status(200).send({
        _id,
        email,
        name,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Invalid data'));
      }
      if (err.name === 'CastError') {
        return next(new ValidationError('Invalid id'));
      }
      if (err.code === MONGO_DUPLICATE_KEY_CODE) {
        return next(new ConflictError('This email address is already being used'));
      }
      return next(new ServerError());
    });
};

// POST /signup — create user
module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  bcrypt.hash(password, saltRounds).then((hash) => {
    // Store hash in your password DB.
    User.create({
      email, password: hash, name,
    })
      // return data in DB
      .then((user) => {
        const { _id } = user;
        res.status(201).send({
          _id,
          email,
          name,
        });
      })
      // something went wrong, return an error
      .catch((err) => {
        if (err.name === 'ValidationError') {
          return next(new ValidationError('Invalid data'));
        }
        if (err.code === MONGO_DUPLICATE_KEY_CODE) {
          return next(new ConflictError('This email address is already being used'));
        }
        return next(err);
      });
  });
};

// POST /signin - login
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      // create token
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      // return token
      res.send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError('Invalid email or password'));
    })
    .catch(next);
};
