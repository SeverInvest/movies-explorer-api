const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const roleSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      unique: true,
    },
  },
);

module.exports = mongoose.model('Role', roleSchema);
