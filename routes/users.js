const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMe,
  updateUser,
} = require('../controllers/users');

// GET /users/me - current user
router.get('/me', getMe);

// PATCH /users/me — update profile
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUser,
);

module.exports.userRouter = router;
