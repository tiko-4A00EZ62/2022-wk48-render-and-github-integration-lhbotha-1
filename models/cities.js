const connection = require('../db/connection');

const cities = {
  findAll: () => new Promise((resolve, reject) => {
    connection.query('SELECT * FROM cities;', (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  }),
  findById: (id) => new Promise((resolve, reject) => {
    const selectQuery = 'SELECT * FROM cities WHERE id=?;';
    connection.query(selectQuery, id, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  }),
  findByCity: (city) => new Promise((resolve, reject) => {
    const selectQuery = 'SELECT * FROM cities WHERE name LIKE ? AND country LIKE ?;';
    connection.query(selectQuery, [city.name, city.country], (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  }),
  save: (city) => new Promise((resolve, reject) => {
    connection.query('INSERT INTO cities SET ?', city, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  }),
  deleteById: (id) => new Promise((resolve, reject) => {
    const deleteQuery = 'DELETE FROM cities WHERE id=?;';
    connection.query(deleteQuery, id, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  }),
  updateById: (city) => new Promise((resolve, reject) => {
    const updateQuery = 'UPDATE cities SET name = ?, country = ? WHERE id = ?;';
    connection.query(updateQuery, [city.name, city.country, city.id], (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  }),
};

module.exports = cities;
