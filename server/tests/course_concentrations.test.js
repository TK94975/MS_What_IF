// tests/course_concentrations.test.js

const request = require('supertest');
const app = require('../app');
const db = require('../config/db');

describe('Course Concentrations Routes', () => {
  afterAll(async () => {
    await db.end();
  });

  describe('GET /course_concentrations/:concentration', () => {
    let testCourseId;
    const testConcentration = 'Artificial Intelligence and Machine Learning';

    beforeAll(async () => {
      // Insert a test course into the database
      const [courseResult] = await db.query(
        'INSERT INTO courses (department, number, title, credits) VALUES (?, ?, ?, ?)',
        ['CSI', '500', 'Test Course for Concentration', 3]
      );
      testCourseId = courseResult.insertId;

      // Associate the course with the concentration
      await db.query(
        'INSERT INTO course_concentrations (course_id, major, concentration, isConcentrationCore) VALUES (?, ?, ?, ?)',
        [testCourseId, 'CSI', testConcentration, true]
      );
    });

    afterAll(async () => {
      // Clean up the test data from the database
      await db.query('DELETE FROM course_concentrations WHERE course_id = ?', [testCourseId]);
      await db.query('DELETE FROM courses WHERE id = ?', [testCourseId]);
    });

    test('should retrieve courses for a valid concentration', async () => {
      const response = await request(app)
        .get(`/course_concentrations/${encodeURIComponent(testConcentration)}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      const course = response.body.find(c => c.course_id === testCourseId);
      expect(course).toBeDefined();
      expect(course).toHaveProperty('department', 'CSI');
      expect(course).toHaveProperty('number', 500);
      expect(course).toHaveProperty('title', 'Test Course for Concentration');
      expect(course).toHaveProperty('isCore', true);
    });

    test('should return 404 if no courses found for the concentration', async () => {
      const response = await request(app)
        .get('/course_concentrations/NonexistentConcentration')
        .expect(404);

      expect(response.body).toHaveProperty('message', 'No courses found for this concentration.');
    });
  });

  describe('GET /course_concentrations/:department/:course_id/concentration', () => {
    let testCourseId;
    const testDepartment = 'CSI';
    const testConcentration = 'Systems';

    beforeAll(async () => {
      // Insert a test course into the database
      const [courseResult] = await db.query(
        'INSERT INTO courses (department, number, title, credits) VALUES (?, ?, ?, ?)',
        [testDepartment, '600', 'Test Course for Department and Course ID', 3]
      );
      testCourseId = courseResult.insertId;

      // Associate the course with the concentration
      await db.query(
        'INSERT INTO course_concentrations (course_id, major, concentration, isConcentrationCore) VALUES (?, ?, ?, ?)',
        [testCourseId, testDepartment, testConcentration, false]
      );
    });

    afterAll(async () => {
      // Clean up the test data from the database
      await db.query('DELETE FROM course_concentrations WHERE course_id = ?', [testCourseId]);
      await db.query('DELETE FROM courses WHERE id = ?', [testCourseId]);
    });

    test('should retrieve the concentration for a valid course', async () => {
      const response = await request(app)
        .get(`/course_concentrations/${testDepartment}/${testCourseId}/concentration`)
        .expect(200);

      expect(response.body).toHaveProperty('concentration', testConcentration);
    });

    test('should return 404 if course does not exist or has no concentration', async () => {
      const nonexistentCourseId = 999999;
      const response = await request(app)
        .get(`/course_concentrations/${testDepartment}/${nonexistentCourseId}/concentration`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Course not found');
    });
  });
});
