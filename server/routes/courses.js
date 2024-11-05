const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Ensure this path is correct and db connection is set up

// GET /courses - Retrieve all courses
router.get('/', async (req, res) => {
  try {
    const [courses] = await db.query('SELECT * FROM courses');
    res.json(courses);
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /courses - Add a new course
router.post('/', async (req, res) => {
  try {
    const { department, number, title, description, credits } = req.body;

    // Validate required fields
    if (!department || !number || !title || !credits) {
      return res.status(400).json({ error: 'Department, number, title, and credits are required.' });
    }

    const [result] = await db.query(
      'INSERT INTO courses (department, number, title, description, credits) VALUES (?, ?, ?, ?, ?)',
      [department, number, title, description || null, credits]
    );

    res.status(201).json({ message: 'Course created successfully.', courseId: result.insertId });
  } catch (err) {
    console.error('Error adding course:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
