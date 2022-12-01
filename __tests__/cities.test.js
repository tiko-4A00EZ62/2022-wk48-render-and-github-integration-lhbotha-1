/* eslint-disable linebreak-style */
const {
  describe, expect, test, afterAll, beforeAll,
} = require('@jest/globals');
const request = require('supertest');
const app = require('../app');

const connection = require('../db/connection');

describe('GET cities endoint', () => {
  test('should return 200', (done) => {
    request(app)
      .get('/api/cities')
      .expect(200)
      .end(done);
  });

  test('should return valid JSON', async () => {
    const response = await request(app)
      .get('/api/cities')
      .set('Accept', 'application/json');

    expect(response.status).toEqual(200);
    expect(response.headers['content-type']).toMatch(/json/);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 1,
          name: 'Oslo',
          country: 'Norway',
        }),
        expect.objectContaining({
          id: 2,
          name: 'Pretoria',
          country: 'South Africa',
        }),
        expect.objectContaining({
          id: 3,
          name: 'Helsinki',
          country: 'Finland',
        }),
      ]),
    );
  });

  test('should return 1 city', async () => {
    const response = await request(app)
      .get('/api/cities/2')
      .set('Accept', 'application/json');

    expect(response.status).toEqual(200);
    expect(response.headers['content-type']).toMatch(/json/);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: 2,
        name: 'Pretoria',
        country: 'South Africa',
      }),
    );
  });

  test('should return 404 and Not Found', async () => {
    const response = await request(app)
      .get('/api/cities/101');

    expect(response.status).toEqual(404);
    expect(response.text).toContain('Not Found');
  });

  afterAll(async () => {
    //connection.end();
  });
});

describe('POST cities endpoint', () => {
  afterAll(async () => {
    // eslint-disable-next-line quotes
    const deleteQuery = `DELETE FROM cities WHERE name LIKE 'Cape Town' AND country LIKE 'South Africa';`;
    connection.query(deleteQuery, (err, result) => {
      if (err) {
        console.log(err);
      }
    });
  });

  test('should create a new city', async () => {
    const city = {
      name: 'Cape Town',
      country: 'South Africa',
    };

    const response = await request(app)
      .post('/api/cities')
      .set('Accept', 'application/json')
      .send(city);

    expect(response.status).toEqual(201);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body.id).toBeTruthy();
    expect(response.body.name).toEqual('Cape Town');
    expect(response.body.country).toEqual('South Africa');
  });

  test('should not allow no name', async () => {
    const city = {
      country: 'South Africa',
    };

    const response = await request(app)
      .post('/api/cities')
      .set('Accept', 'application/json')
      .send(city);

    expect(response.status).toEqual(400);
    expect(response.text).toContain('"name" is required');
  });

  test('should not allow empty name', async () => {
    const city = {
      name: '',
      country: 'South Africa',
    };

    const response = await request(app)
      .post('/api/cities')
      .set('Accept', 'application/json')
      .send(city);

    expect(response.status).toEqual(400);
    expect(response.text).toContain('"name" is not allowed to be empty');
  });

  test('should not allow too short name', async () => {
    const city = {
      name: 'C',
      country: 'South Africa',
    };

    const response = await request(app)
      .post('/api/cities')
      .set('Accept', 'application/json')
      .send(city);
    expect(response.status).toEqual(400);
    expect(response.text).toContain('"name" length must be at least 2 characters long');
  });

  test('should not allow no country', async () => {
    const city = {
      name: 'Cape Town',
    };

    const response = await request(app)
      .post('/api/cities')
      .set('Accept', 'application/json')
      .send(city);

    expect(response.status).toEqual(400);
    expect(response.text).toContain('"country" is required');
  });

  test('should not allow empty country', async () => {
    const city = {
      name: 'Cape Town',
      country: '',
    };

    const response = await request(app)
      .post('/api/cities')
      .set('Accept', 'application/json')
      .send(city);

    expect(response.status).toEqual(400);
    expect(response.text).toContain('"country" is not allowed to be empty');
  });

  test('should not allow too short country', async () => {
    const city = {
      name: 'Cape Town',
      country: 'S',
    };

    const response = await request(app)
      .post('/api/cities')
      .set('Accept', 'application/json')
      .send(city);

    expect(response.status).toEqual(400);
    expect(response.text).toContain('"country" length must be at least 2 characters long');
  });

  test('should not allow a duplicate city', async () => {
    const city = {
      name: 'Cape Town',
      country: 'South Africa',
    };

    const response = await request(app)
      .post('/api/cities')
      .set('Accept', 'application/json')
      .send(city);

    expect(response.status).toEqual(400);
    expect(response.text).toContain('City exist');
  });

  afterAll(async () => {
    // connection.end();
  });
});

describe('DELETE cities endpoint', () => {
  test('should delete the city by id', async () => {
    const city = {
      name: 'Test Town',
      country: 'Crazy Country',
    };

    const postResponse = await request(app)
      .post('/api/cities')
      .set('Accept', 'application/json')
      .send(city);
    const postId = postResponse.body.id;

    const response = await request(app)
      .delete(`/api/cities/${postId}`)
      .set('Accept', 'application/json');

    expect(response.status).toEqual(200);
    expect(response.text).toEqual('City deleted');
  });

  test('should check that city with id exists', async () => {
    const response = await request(app)
      .delete('/api/cities/100001')
      .set('Accept', 'application/json');

    expect(response.status).toEqual(404);
    expect(response.text).toEqual('Not Found');
  });

  afterAll(async () => {
    // connection.end();
  });
});

describe('PUT cities endpoint', () => {
  let postId;
  beforeAll(async () => {
    const city = {
      name: 'Test Town',
      country: 'Crazy Country',
    };

    const postResponse = await request(app)
      .post('/api/cities')
      .set('Accept', 'application/json')
      .send(city);
    postId = postResponse.body.id;
  });

  test('should update the city with the id', async () => {
    const city = {
      id: postId,
      name: 'Crazy Town',
      country: 'Test Country',
    };

    const response = await request(app)
      .put('/api/cities')
      .set('Accept', 'application/json')
      .send(city);

    expect(response.status).toEqual(200);
    expect(response.body.id).toEqual(postId);
    expect(response.body.name).toEqual('Crazy Town');
    expect(response.body.country).toEqual('Test Country');
  });

  test('should check that city with id exists', async () => {
    const city = {
      id: 100000,
      name: 'Crazy Town',
      country: 'Test Country',
    };

    const response = await request(app)
      .put('/api/cities')
      .set('Accept', 'application/json')
      .send(city);

    expect(response.status).toEqual(404);
    expect(response.text).toEqual('Not Found');
  });

  test('should not allow no id', async () => {
    const city = {
      name: 'Crazy Town',
      country: 'Test Country',
    };

    const response = await request(app)
      .put('/api/cities')
      .set('Accept', 'application/json')
      .send(city);

    expect(response.status).toEqual(400);
    expect(response.text).toEqual('"id" is required');
  });

  test('should not allow a non integer', async () => {
    const city = {
      id: 101.1223,
      name: 'Crazy Town',
      country: 'Test Country',
    };

    const response = await request(app)
      .put('/api/cities')
      .set('Accept', 'application/json')
      .send(city);

    expect(response.status).toEqual(400);
    expect(response.text).toEqual('"id" must be an integer');
  });

  test('should not allow no name', async () => {
    const city = {
      id: '101',
      country: 'Test Country',
    };

    const response = await request(app)
      .put('/api/cities')
      .set('Accept', 'application/json')
      .send(city);

    expect(response.status).toEqual(400);
    expect(response.text).toEqual('"name" is required');
  });

  test('should not allow empty name', async () => {
    const city = {
      id: '101',
      name: '',
      country: 'Test Country',
    };

    const response = await request(app)
      .put('/api/cities')
      .set('Accept', 'application/json')
      .send(city);

    expect(response.status).toEqual(400);
    expect(response.text).toEqual('"name" is not allowed to be empty');
  });

  test('should not allow to short name', async () => {
    const city = {
      id: '101',
      name: 'C',
      country: 'Test Country',
    };

    const response = await request(app)
      .put('/api/cities')
      .set('Accept', 'application/json')
      .send(city);

    expect(response.status).toEqual(400);
    expect(response.text).toEqual('"name" length must be at least 2 characters long');
  });

  test('should not allow no country', async () => {
    const city = {
      id: '101',
      name: 'Crazy Town',
    };

    const response = await request(app)
      .put('/api/cities')
      .set('Accept', 'application/json')
      .send(city);

    expect(response.status).toEqual(400);
    expect(response.text).toEqual('"country" is required');
  });

  test('should not allow empty country', async () => {
    const city = {
      id: '101',
      name: 'Crazy Town',
      country: '',
    };

    const response = await request(app)
      .put('/api/cities')
      .set('Accept', 'application/json')
      .send(city);

    expect(response.status).toEqual(400);
    expect(response.text).toEqual('"country" is not allowed to be empty');
  });

  test('should not allow to short country', async () => {
    const city = {
      id: '101',
      name: 'Crazy Town',
      country: 'T',
    };

    const response = await request(app)
      .put('/api/cities')
      .set('Accept', 'application/json')
      .send(city);

    expect(response.status).toEqual(400);
    expect(response.text).toEqual('"country" length must be at least 2 characters long');
  });

  afterAll(async () => {
    await request(app)
      .delete(`/api/cities/${postId}`)
      .set('Accept', 'application/json');

    connection.end();
  });
});
