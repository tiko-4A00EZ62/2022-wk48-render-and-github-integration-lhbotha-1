/* eslint-disable linebreak-style */
const express = require('express');
const cors = require('cors');
const citiesRouter = require('./routes/cities');

const app = express();
app.use(express.static('frontend/build'));

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});
app.use('/api/cities', citiesRouter);

module.exports = app;
