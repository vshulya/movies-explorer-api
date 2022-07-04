const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');
const NotFoundError = require('../errors/NotFoundError');

const { userRouter } = require('./users');
const { movieRouter } = require('./movies');
const { auth } = require('../middlewares/auth');

const {
  login,
  createUser,
} = require('../controllers/users');

// routes w/o auth
router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
    }),
  }),
  createUser,
);

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

// routes w/ auth TODO add auth
router.use('/users', auth, userRouter);
router.use('/movies', auth, movieRouter);

router.use((req, res, next) => {
  next(new NotFoundError('Такого адреса не существует'));
});

module.exports = router;
