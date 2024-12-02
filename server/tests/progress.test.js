// tests/progress.test.js

const request = require('supertest');
const app = require('../app');

describe('POST /progress/completed_progress', () => {
  test('should return 400 if user_courses is missing', async () => {
    const response = await request(app)
      .post('/progress/completed_progress')
      .send({
        user_concentration: 'Theoretical Computer Science',
        calculation_type: 'current',
      })
      .expect(400);

    expect(response.body).toHaveProperty('error', 'User courses are required.');
  });

  test('should calculate progress for valid input', async () => {
    const response = await request(app)
      .post('/progress/completed_progress')
      .send({
        user_courses: [
          { id: 11, credits: 3, grade: 'A', completed: 'yes' },
          { id: 4, credits: 3, grade: 'A', completed: 'yes' }
        ],
        user_concentration: 'Artificial Intelligence and Machine Learning',
        calculation_type: 'current',
      })
      .expect(200);

    expect(response.body).toHaveProperty('core');
    expect(response.body.core.completed_credits).toBe(6);
  });

  test('should calculate progress for only completed courses', async () => {
    const response = await request(app)
      .post('/progress/completed_progress')
      .send({
        user_courses: [
          { id: 11, credits: 3, grade: 'A', completed: 'yes' },
          { id: 4, credits: 3, grade: 'A', completed: 'no' }
        ],
        user_concentration: 'Artificial Intelligence and Machine Learning',
        calculation_type: 'current',
      })
      .expect(200);

    expect(response.body).toHaveProperty('core');
    expect(response.body.core.completed_credits).toBe(3);
  });

});
