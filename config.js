const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'production',
  jwtSecret: process.env.JWT_SECRET || 'some-secret-key',
  addressCors: process.env.CORS_ADDRESS || 'http://localhost:3000',
  cacert: process.env.CACERT || './.mongodb/root.crt',
  dbUser: process.env.DB_USER || 'user',
  dbPass: process.env.DB_PASS || 'password',
  dbName: process.env.DB_NAME || 'database',
  dbHosts: process.env.DB_HOSTS || 'host',
  keyApiYoutube: process.env.KEY_API_YOUTUBE || 'keyApi',
};
