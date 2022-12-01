/* eslint-disable linebreak-style */
const Joi = require('joi');
const cities = require('../models/cities');

const getCities = async (req, res) => {
  try {
    const response = await cities.findAll();

    if (response) {
      res.send(response);
    }
  } catch (e) {
    res.sendStatus(500);
  }
};

const getCityById = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    const response = await cities.findById(id);
    if (response.length === 1) {
      res.send(response[0]);
    } else {
      res.status(404).send('Not Found');
    }
  } catch (e) {
    res.sendStatus(500);
  }
};

const createCity = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    country: Joi.string().min(2).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const city = {
    name: req.body.name,
    country: req.body.country,
  };

  try {
    const result = await cities.findByCity(city);
    if (result.length > 0) {
      res.status(400).send('City exist');
      return;
    }

    const response = await cities.save(city);
    if (response) {
      city.id = response.insertId;
      res.status(201).send(city);
    }
  } catch (e) {
    res.sendStatus(500);
  }
};

const updateCity = async (req, res) => {
  const schema = Joi.object({
    id: Joi.number().integer().required(),
    name: Joi.string().min(2).required(),
    country: Joi.string().min(2).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const city = {
    id: req.body.id,
    name: req.body.name,
    country: req.body.country,
  };

  try {
    const result = await cities.findById(city.id);
    if (result.length === 0) {
      res.status(404).send('Not Found');
      return;
    }

    const response = await cities.updateById(city);
    if (response.changedRows === 1) {
      res.status(200).send(city);
    }
  } catch (e) {
    res.sendStatus(500);
  }
};

const deleteCity = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    const result = await cities.findById(id);
    if (result.length === 0) {
      res.status(404).send('Not Found');
      return;
    }

    const response = await cities.deleteById(id);

    if (response.affectedRows === 1) {
      res.status(200).send('City deleted');
    }
  } catch (e) {
    res.sendStatus(500);
  }
};

module.exports = {
  createCity,
  deleteCity,
  getCities,
  getCityById,
  updateCity,
};
