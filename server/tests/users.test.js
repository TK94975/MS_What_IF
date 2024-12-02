// tests/users.test.js

const request = require('supertest');
const app = require('../app');
const db = require('../config/db');
const bcrypt = require('bcrypt');

describe('Users Routes', () => {
  afterAll(async () => {
    await db.end();
  });

  /*describe('GET /users', () => {
    test('should retrieve all users', async () => {
      const response = await request(app).get('/users').expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      // Additional assertions can be made based on your database content
    });
  });*/

  describe('POST /users/signup', () => {
    let testEmail = 'testuser@example.com';

    afterAll(async () => {
      // Clean up the test user from the database
      await db.query('DELETE FROM users WHERE email = ?', [testEmail]);
    });

    test('should sign up a new user with valid data', async () => {
      const newUser = {
        email: testEmail,
        password: 'password123',
        major: 'CSI',
        concentration: 'Artificial Intelligence and Machine Learning',
      };

      const response = await request(app)
        .post('/users/signup')
        .send(newUser)
        .expect(201);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('email', testEmail);
    });
  });

  describe('POST /users/signin', () => {
    const testEmail = 'signinuser@example.com';
    const testPassword = 'signinpassword123';

    beforeAll(async () => {
      // Hash the password and insert a test user into the database
      const hashedPassword = await bcrypt.hash(testPassword, 10);
      await db.query(
        'INSERT INTO users (email, password, major, concentration, role) VALUES (?, ?, ?, ?, ?)',
        [testEmail, hashedPassword, 'CSI', 'Systems', 'user']
      );
    });

    afterAll(async () => {
      // Clean up the test user from the database
      await db.query('DELETE FROM users WHERE email = ?', [testEmail]);
    });

    test('should sign in an existing user with valid credentials', async () => {
      const response = await request(app)
        .post('/users/signin')
        .send({ email: testEmail, password: testPassword })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty('email', testEmail);
    });
  });
});
