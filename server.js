const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
// models
const User = require('./models/User.js');
const Exercise = require('./models/Exercise.js');
// helpers
const getDateQuery = require('./utils/helpers');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// get all users
app.get('/api/users/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.log(error.message);
  }
});

// get logs User
app.get('/api/users/:_id/logs', async (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;

  try {
    const { username } = await User.findById(_id);
    const logs = await Exercise.find({
      username,
      date: getDateQuery(from, to),
    })
      .select('-_id -username')
      .limit(limit && Number(limit));

    const result = {
      username,
      count: logs.length,
      _id,
      log: logs.map(({ description, duration, date }) => {
        return { description, duration, date: new Date(date).toDateString() };
      }),
    };
    res.json(result);
  } catch (error) {
    console.log(error.message);
  }
});

// create new User
app.post('/api/users/', async (req, res) => {
  const { username } = req.body;
  try {
    const newUser = await new User({ username }).save();
    res.json(newUser);
  } catch (error) {
    console.log(error);
  }
});
// create new Exercise
app.post('/api/users/:_id/exercises', async (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;
  try {
    const user = await User.findById(_id);
    const newExercise = await new Exercise({
      username: user.username,
      description,
      duration,
      date: date ? new Date(date) : new Date(),
    }).save();

    if (newExercise) {
      const { description, duration, date } = newExercise;
      res.json({
        _id: user._id,
        username: user.username,
        description,
        duration,
        date: new Date(date).toDateString(),
      });
    }
  } catch (error) {
    console.log(error);
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
