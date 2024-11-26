// tests/courses.test.js

const request = require('supertest');
const app = require('../app');
const db = require('../config/db');

describe('Courses Routes', () => {
  afterAll(async () => {
    await db.end();
  });

  describe('GET /courses', () => {
    test('should retrieve all courses', async () => {
      const response = await request(app).get('/courses').expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    test('should handle server errors gracefully', async () => {
      jest.spyOn(db, 'query').mockImplementationOnce(() => Promise.reject(new Error('Database error')));

      const response = await request(app).get('/courses').expect(500);

      expect(response.body).toHaveProperty('error', 'Internal server error');
    });
  });

  describe('POST /courses', () => {
    let newCourseId;

    afterAll(async () => {
      // Clean up the test course from the database
      if (newCourseId) {
        await db.query('DELETE FROM courses WHERE id = ?', [newCourseId]);
      }
    });

    test('should add a new course with valid data', async () => {
      const newCourse = {
        department: 'PHY',
        number: '999',
        title: 'Test Course',
        description: 'This is a test course.',
        credits: 3,
      };

      const response = await request(app).post('/courses').send(newCourse).expect(201);

      expect(response.body).toHaveProperty('message', 'Course created successfully.');
      expect(response.body).toHaveProperty('courseId');
      expect(typeof response.body.courseId).toBe('number');

      newCourseId = response.body.courseId;

      // Verify the course was added to the database
      const [rows] = await db.query('SELECT * FROM courses WHERE id = ?', [newCourseId]);
      expect(rows.length).toBe(1);
      expect(rows[0].title).toBe(newCourse.title);
    });

    test('should return 400 if required fields are missing', async () => {
      const incompleteCourse = {
        department: 'PHY',
        title: 'Incomplete Course',
        credits: 3,
      };

      const response = await request(app).post('/courses').send(incompleteCourse).expect(400);

      expect(response.body).toHaveProperty('error', 'Department, number, title, and credits are required.');
    });
  });

  describe('POST /courses/course_description', () => {
    let courseId;

    beforeAll(async () => {
      const [result] = await db.query(
        'INSERT INTO courses (department, number, title, description, credits) VALUES (?, ?, ?, ?, ?)',
        ['PHY', '101', 'Test Course', 'This is a test course.', 3]
      );
      courseId = result.insertId;
    });

    afterAll(async () => {
      await db.query('DELETE FROM courses WHERE id = ?', [courseId]);
    });

    test('should retrieve course description with valid course_id', async () => {
      const response = await request(app)
        .post('/courses/course_description')
        .send({ course_id: courseId })
        .expect(200);

      expect(response.body).toHaveProperty('id', courseId);
      expect(response.body).toHaveProperty('title', 'Test Course');
    });

    test('should return 400 if course_id is missing', async () => {
      const response = await request(app).post('/courses/course_description').send({}).expect(400);

      expect(response.body).toHaveProperty('error', 'Need course ID');
    });

    test('should return 404 if course_id does not exist', async () => {
      const response = await request(app)
        .post('/courses/course_description')
        .send({ course_id: 999999 })
        .expect(404);

      expect(response.body).toHaveProperty('error', 'No course with that ID found');
    });
  });

  describe('GET /courses/course_options', () => {
    test('should retrieve course options', async () => {
      const response = await request(app).get('/courses/course_options').expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        const course = response.body[0];
        expect(course).toHaveProperty('id');
        expect(course).toHaveProperty('department');
        expect(course).toHaveProperty('number');
      }
    });
  });

  describe('GET /courses/expanded_details', () => {
    test('should retrieve expanded course details', async () => {
      const response = await request(app).get('/courses/expanded_details').expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        const course = response.body[0];
        expect(course).toHaveProperty('id');
        expect(course).toHaveProperty('department');
        expect(course).toHaveProperty('number');
        expect(course).toHaveProperty('title');
        expect(course).toHaveProperty('description');
        expect(course).toHaveProperty('credits');
        // Additional properties from the JOINs can be checked here
      }
    });
  });
});
