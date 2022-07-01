const router = require('express').Router();
const {
  getMe,
  updateUser,
} = require('../controllers/users');

// GET /users/me - current user
router.get('/me', getMe);

// PATCH /users/me — update profile
router.patch('/me', updateUser);

module.exports.userRouter = router;
