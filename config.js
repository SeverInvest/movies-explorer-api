const dotenv = require('dotenv'); // eslint-disable-line

dotenv.config();
module.exports = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'production',
  jwtSecret: process.env.JWT_SECRET || 'some-secret-key',
  addressDB: process.env.DB_ADDRESS || 'mongodb://127.0.0.1/mestodb',
  addressCors: process.env.CORS_ADDRESS || 'http://localhost:3000',
};
