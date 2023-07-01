const {
  dbUser,
  dbPass,
  dbName,
  dbHosts,
} = require('./config');

const url = `mongodb://${dbUser}:${dbPass}@${dbHosts}/${dbName}`;

module.exports = { url };
