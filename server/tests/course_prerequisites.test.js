const request = require('supertest');
const app = require('../app');
const db = require('../config/db');

describe('Course Prerequisites Routes', () => {
  afterAll(async () => {
    await db.end();
  });

  describe('GET /course_prerequisites', () => {
    test('should retrieve all course prerequisites', async () => {
      const response = await request(app).get('/course_prerequisites').expect(200);

      expect(Array.isArray(response.body)).toBe(true);

    });
  });

  describe('POST /course_prerequisites', () => {
    let testCourseId;
    let testPrereqCourseId;

    beforeAll(async () => {
      // Insert test courses into the database
      const [courseResult] = await db.query(
        'INSERT INTO courses (department, number, title, credits) VALUES (?, ?, ?, ?)',
        ['PHY', '201', 'Test Course', 3]
      );
      testCourseId = courseResult.insertId;

      const [prereqResult] = await db.query(
        'INSERT INTO courses (department, number, title, credits) VALUES (?, ?, ?, ?)',
        ['PHY', '101', 'Prerequisite Course', 3]
      );
      testPrereqCourseId = prereqResult.insertId;
    });

    afterAll(async () => {
      // Clean up the test data from the database
      await db.query('DELETE FROM course_prerequisites WHERE course_id = ?', [testCourseId]);
      await db.query('DELETE FROM courses WHERE id IN (?, ?)', [testCourseId, testPrereqCourseId]);
    });

    test('should add a new course prerequisite with valid data', async () => {
      const newPrerequisite = {
        course_id: testCourseId,
        prereq_course_id: testPrereqCourseId,
        grade: 'C',
      };

      const response = await request(app)
        .post('/course_prerequisites')
        .send(newPrerequisite)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Course prerequisite added successfully.');

      // Verify the prerequisite was added to the database
      const [rows] = await db.query(
        'SELECT * FROM course_prerequisites WHERE course_id = ? AND prereq_course_id = ?',
        [testCourseId, testPrereqCourseId]
      );
      expect(rows.length).toBe(1);
      expect(rows[0].grade).toBe('C');
    });

    test('should return 400 if required fields are missing', async () => {
      const incompletePrerequisite = {
        course_id: testCourseId,
        // prereq_course_id is missing
        grade: 'C',
      };

      const response = await request(app)
        .post('/course_prerequisites')
        .send(incompletePrerequisite)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'course_id and prereq_course_id are required.');
    });
  });

  describe('GET /course_prerequisites/:course_id', () => {
    let testCourseId;
    let testPrereqCourseId;

    beforeAll(async () => {
      // Insert test courses into the database
      const [courseResult] = await db.query(
        'INSERT INTO courses (department, number, title, credits) VALUES (?, ?, ?, ?)',
        ['PHY', '301', 'Test Course', 3]
      );
      testCourseId = courseResult.insertId;

      const [prereqResult] = await db.query(
        'INSERT INTO courses (department, number, title, credits) VALUES (?, ?, ?, ?)',
        ['PHY', '201', 'Prerequisite Course', 3]
      );
      testPrereqCourseId = prereqResult.insertId;

      // Insert prerequisite relationship
      await db.query(
        'INSERT INTO course_prerequisites (course_id, prereq_course_id, grade) VALUES (?, ?, ?)',
        [testCourseId, testPrereqCourseId, 'B']
      );
    });

    afterAll(async () => {
      // Clean up the test data from the database
      await db.query('DELETE FROM course_prerequisites WHERE course_id = ?', [testCourseId]);
      await db.query('DELETE FROM courses WHERE id IN (?, ?)', [testCourseId, testPrereqCourseId]);
    });

    test('should retrieve prerequisites for a valid course_id', async () => {
      const response = await request(app)
        .get(`/course_prerequisites/${testCourseId}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      const prereq = response.body[0];
      expect(prereq).toHaveProperty('prereq_course_id', testPrereqCourseId);
      expect(prereq).toHaveProperty('department', 'PHY');
      expect(prereq).toHaveProperty('number', 201);
      expect(prereq).toHaveProperty('title', 'Prerequisite Course');
      expect(prereq).toHaveProperty('grade', 'B');
    });

    test('should return 404 if no prerequisites found for the course', async () => {
      // Insert a course without prerequisites
      const [courseResult] = await db.query(
        'INSERT INTO courses (department, number, title, credits) VALUES (?, ?, ?, ?)',
        ['PHY', '401', 'Course Without Prereqs', 3]
      );
      const courseIdWithoutPrereqs = courseResult.insertId;

      const response = await request(app)
        .get(`/course_prerequisites/${courseIdWithoutPrereqs}`)
        .expect(404);

      expect(response.body).toHaveProperty('message', 'No prerequisites found for this course.');

      // Clean up
      await db.query('DELETE FROM courses WHERE id = ?', [courseIdWithoutPrereqs]);
    });
  });
});
