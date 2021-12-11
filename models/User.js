const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: String,
  },
  { versionKey: false }
);

module.exports = mongoose.model('User', userSchema);
