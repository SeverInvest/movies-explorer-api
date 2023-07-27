const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');
const routerUsers = require('./users');
const routerVideos = require('./videos');
const { createUser, login } = require('../controllers/users');
const { authValidate, registerValidate } = require('../middlewares/validation');
const auth = require('../middlewares/auth');
const { MSG_404 } = require('../utils/constants');

router.post('/signup', registerValidate, createUser);
router.post('/signin', authValidate, login);
router.use(auth);
router.use('/users', routerUsers);
router.use('/videos', routerVideos);
router.use((_, res, next) => {
  next(new NotFoundError(MSG_404));
});

module.exports = router;
