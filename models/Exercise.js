const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema(
  {
    username: String,
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Exercise', exerciseSchema);
