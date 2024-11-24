const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Ensure this path is correct and db connection is set up

// GET /course_prerequisites - Retrieve all course prerequisites
router.get('/', async (req, res) => {
  try {
    const [prereqs] = await db.query('SELECT * FROM course_prerequisites');
    res.json(prereqs);
  } catch (err) {
    console.error('Error fetching course prerequisites:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /course_prerequisites - Add a new course prerequisite
router.post('/', async (req, res) => {
  try {
    const { course_id, prereq_course_id, grade } = req.body;

    // Validate required fields
    if (!course_id || !prereq_course_id) {
      return res.status(400).json({ error: 'course_id and prereq_course_id are required.' });
    }

    await db.query(
      'INSERT INTO course_prerequisites (course_id, prereq_course_id, grade) VALUES (?, ?, ?)',
      [course_id, prereq_course_id, grade || null]
    );

    res.status(201).json({ message: 'Course prerequisite added successfully.' });
  } catch (err) {
    console.error('Error adding course prerequisite:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /course_prerequisites/course_id - Retrieve course prerequisites for specific class
router.post('/course_id', async (req, res) => {
  const course_id = req.body.id; // Retrieve `id` from query parameters
  try {
    const [prereqs] = await db.query(
      'SELECT * FROM course_prerequisites WHERE course_id = ?',
      [course_id]
    );
    res.json(prereqs);
  } catch (err) {
    console.error('Error fetching course prerequisites:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
