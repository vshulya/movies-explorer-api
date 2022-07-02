const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../utils/jwt');

const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ServerError = require('../errors/ServerError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');

const MONGO_DUPLICATE_KEY_CODE = 11000;

const saltRounds = 10;

// GET /users/me - current user
module.exports.getMe = (req, res, next) => {
  const { _id, name, email } = req.body;
  User.find({ _id })
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
      }
      res.send({
        _id,
        email,
        name,
      });
    })
    .catch(next);
};

// PATCH /users/me — update profile
module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  // обновим имя найденного по _id пользователя
  User.findByIdAndUpdate(req.user._id, { name, email }, {
    new: true, runValidators: true,
  })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Введены некорретные данные'));
      }
      if (err.name === 'CastError') {
        next(new ValidationError('Id пользователя введено некорректно'));
      } else {
        next(new ServerError());
      }
    });
};

// POST /signup — create user
module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  if (!email || !password) {
    res.status(400).send({ message: 'Не передан email или пароль' });
    return;
  }
  bcrypt.hash(password, saltRounds).then((hash) => {
    // Store hash in your password DB.
    User.create({
      email, password: hash, name,
    })
      // вернём записанные в базу данные
      .then((user) => {
        const { _id } = user;
        res.status(201).send({
          _id,
          email,
          name,
        });
      })
      // данные не записались, вернём ошибку
      .catch((err) => {
        if (err.code === MONGO_DUPLICATE_KEY_CODE) {
          next(new ConflictError('Пользователь с таким email уже существует'));
        }
        next(err);
      });
  });
};

// POST /signin - login
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      // вернём токен
      res.send({ token });
    })
    .catch(() => {
      // ошибка аутентификации
      next(new UnauthorizedError('Неверный логин или пароль'));
    })
    .catch(next);
};
