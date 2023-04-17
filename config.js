const dotenv = require('dotenv');

dotenv.config();
module.exports = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'production',
  jwtSecret: process.env.JWT_SECRET || 'some-secret-key',
  addressDB: process.env.DB_ADDRESS || 'mongodb://127.0.0.1/bitfilmsdb',
  addressCors: process.env.CORS_ADDRESS || 'http://localhost:3000',
};
