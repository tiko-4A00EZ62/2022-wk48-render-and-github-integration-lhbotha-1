/* eslint-disable linebreak-style */
const express = require('express');
const citiesRouter = require('./routes/cities');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});
app.use('/api/cities', citiesRouter);

module.exports = app;
