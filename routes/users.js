const router = require('express').Router();
const roles = require('../middlewares/roles');
const {
  userValidate,
} = require('../middlewares/validation');
const {
  getCurrentUser,
  updateUserInfo,
  getUsers,
  updateRoles,
} = require('../controllers/users');

router.get('/me', getCurrentUser);
router.patch('/me', userValidate, updateUserInfo);
router.get('/', getUsers);
router.patch('/roles', roles(['SUPERUSER']), updateRoles);

module.exports = router;
