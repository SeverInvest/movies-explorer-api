const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');
const routerUsers = require('./users');
const routerMovies = require('./movies');
const { createUser, login } = require('../controllers/users');
const { authValidate, registerValidate } = require('../middlewares/validation');
const auth = require('../middlewares/auth');

router.post('/signup', registerValidate, createUser);
router.post('/signin', authValidate, login);
router.use(auth);
router.use('/users', routerUsers);
router.use('/movies', routerMovies);
router.use((_, res, next) => {
  next(new NotFoundError('Resource not found'));
});

module.exports = router;
