// tests/user_courses.test.js

const request = require('supertest');
const app = require('../app');
const db = require('../config/db');
const bcrypt = require('bcrypt');

describe('User Courses Routes', () => {
  afterAll(async () => {
    await db.end();
  });

  describe('POST /user_courses/get_user_courses', () => {
    let testUserId;
    let testCourseId;

    beforeAll(async () => {
      // Insert a test user into the database
      const [userResult] = await db.query(
        'INSERT INTO users (email, password, major, concentration, role) VALUES (?, ?, ?, ?, ?)',
        ['testuser@example.com', '$2b$10$Xz91xMkewlylc7oD.7udSu37MeBD0hYib59JSqSQUFlATFYFE7ro2', 'CSI', 'Artificial Intelligence and Machine Learning', 'user']
      );
      testUserId = userResult.insertId;

      // Insert a test course into the database
      const [courseResult] = await db.query(
        'INSERT INTO courses (department, number, title, credits) VALUES (?, ?, ?, ?)',
        ['CSI', '700', 'Test Course', 3]
      );
      testCourseId = courseResult.insertId;

      // Insert a test user_course entry
      await db.query(
        'INSERT INTO user_courses (user_id, course_id, semester, year, grade, completed) VALUES (?, ?, ?, ?, ?, ?)',
        [testUserId, testCourseId, 'Fall', '2023', 'A', 'yes']
      );
    });

    afterAll(async () => {
      // Clean up the test data from the database
      await db.query('DELETE FROM user_courses WHERE user_id = ?', [testUserId]);
      await db.query('DELETE FROM courses WHERE id = ?', [testCourseId]);
      await db.query('DELETE FROM users WHERE id = ?', [testUserId]);
    });

    test('should fetch user courses with valid user_id', async () => {
      const response = await request(app)
        .post('/user_courses/get_user_courses')
        .send({ user_id: testUserId })
        .expect(200);

      expect(response.body).toHaveProperty('user_courses');
      expect(Array.isArray(response.body.user_courses)).toBe(true);
      expect(response.body.user_courses.length).toBeGreaterThan(0);

      const course = response.body.user_courses[0];
      expect(course).toHaveProperty('id', testCourseId);
      expect(course).toHaveProperty('user_id', testUserId);
      expect(course).toHaveProperty('grade', 'A');
    });

    test('should return 400 if user_id is missing', async () => {
      const response = await request(app)
        .post('/user_courses/get_user_courses')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error', 'User ID is required');
    });
  });

  describe('POST /user_courses/update_user_courses', () => {
    let testUserId;
    let testCourseId1;
    let testCourseId2;
    const testEmail = 'testuser5@example.com';
    const testPassword = 'signinpassword122';

    beforeAll(async () => {
      // Insert a test user into the database
      const hashedPassword = await bcrypt.hash(testPassword, 10);
      const [userResult] = await db.query(
        'INSERT INTO users (email, password, major, concentration, role) VALUES (?, ?, ?, ?, ?)',
        [testEmail, hashedPassword, 'CSI', 'Systems', 'user']
      );
      /*const [userResult] = await db.query(
        'INSERT INTO users (email, password, major, concentration, role) VALUES (?, ?, ?, ?, ?)',
        ['testuser1@example.com', '$2b$10$Xz91xMkewlylc7oD.7udSu37MeBD0hYib59JSqSQUFlATFYFE7ro2', 'CSI', 'Artificial Intelligence and Machine Learning', 'user']
      );*/
      testUserId = userResult.insertId;

      // Insert test courses into the database
      const [courseResult1] = await db.query(
        'INSERT INTO courses (department, number, title, credits) VALUES (?, ?, ?, ?)',
        ['CSI', '701', 'Test Course 1', 3]
      );
      testCourseId1 = courseResult1.insertId;

      const [courseResult2] = await db.query(
        'INSERT INTO courses (department, number, title, credits) VALUES (?, ?, ?, ?)',
        ['CSI', '702', 'Test Course 2', 3]
      );
      testCourseId2 = courseResult2.insertId;
    });

    afterAll(async () => {
      // Clean up the test data from the database
      await db.query('DELETE FROM user_courses WHERE user_id = ?', [testUserId]);
      await db.query('DELETE FROM courses WHERE id IN (?, ?)', [testCourseId1, testCourseId2]);
      await db.query('DELETE FROM users WHERE id = ?', [testUserId]);
    });

    test('should update user courses with valid data', async () => {
      const updatedCourses = [
        {
          user_id: testUserId,
          id: testCourseId1,
          semester: 'Spring',
          year: 2024,
          grade: "A",
          completed: "yes"
        },
        {
          user_id: testUserId,
          id: testCourseId2,
          semester: 'Fall',
          year: 2023,
          grade: "B+",
          completed: "yes"
        },
      ];

      const response = await request(app)
        .post('/user_courses/update_user_courses')
        .send({ courses: updatedCourses })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'User courses updated successfully');

      // Fetch user courses from the database
      const [rows] = await db.query(
        'SELECT * FROM user_courses WHERE user_id = ?',
        [testUserId]
      );

      expect(rows.length).toBe(2);

      const course1 = rows.find(c => c.course_id === testCourseId1);
      expect(course1).toBeDefined();
      expect(course1.semester).toBe('Spring');
      expect(course1.year).toBe(2024);
      expect(course1.grade).toBe('A');
      expect(course1.completed).toBe('yes');

      const course2 = rows.find(c => c.course_id === testCourseId2);
      expect(course2).toBeDefined();
      expect(course2.semester).toBe('Fall');
      expect(course2.year).toBe(2023);
      expect(course1.grade).toBe('B+');
      expect(course1.completed).toBe('yes');
    });

    test('should handle missing courses data gracefully', async () => {
      const response = await request(app)
        .post('/user_courses/update_user_courses')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Courses data is required');
    });
  });
});
