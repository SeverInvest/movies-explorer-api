const router = require('express').Router();
const {
  // userIdValidate,
  userValidate,
  // avatarValidate,
} = require('../middlewares/validation');

const {
  // getUsers,
  getCurrentUser,
  // getUserById,
  updateUserInfo,
  // updateAvatar,
} = require('../controllers/users');

// router.get('/', getUsers);
router.get('/me', getCurrentUser);
// router.get('/:userId', userIdValidate, getUserById);
router.patch('/me', userValidate, updateUserInfo);
// router.patch('/me/avatar', avatarValidate, updateAvatar);

module.exports = router;
