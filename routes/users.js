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
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
    }),
  }),
  updateUser,
);

module.exports.userRouter = router;
