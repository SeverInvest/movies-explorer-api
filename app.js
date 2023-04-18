const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
// const { port, addressCors, addressDB } = require('./config');
const { addressCors, addressDB } = require('./config');
const router = require('./routes/index');
const limiter = require('./middlewares/rateLimit');

const handleError = require('./middlewares/handleError');

mongoose.set('strictQuery', false);

const app = express();
app.use(helmet());
app.use(express.json());
mongoose.connect(addressDB);
app.use(cors({
  origin: addressCors,
}));
app.use(requestLogger);
app.use(limiter);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(handleError);

module.exports = app;
