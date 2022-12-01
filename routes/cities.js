const express = require('express');
const {
  createCity, getCities, getCityById, updateCity, deleteCity,
} = require('../controllers/cities');

const router = express.Router();

router.get('/', getCities);

router.get('/:id', getCityById);

router.post('/', createCity);

router.put('/', updateCity);

router.delete('/:id', deleteCity);

module.exports = router;
