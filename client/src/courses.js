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

// POST /courses - Get full course description for a given course ID
router.post('/course_description', async (req, res) =>{
  try {
    const course_id = req.body.course_id;
    console.log('courseID', course_id);
    if (!course_id){
      return res.status(400).json({error: "Need course ID"})
    }
    const [description] = await db.query(
      'SELECT * FROM courses WHERE courses.id = ?', 
      [course_id]
    )
    if (description) {
      res.status(200).json(description[0])
    } else {
      return res.status(400).json({error: "No course with that ID found"});
    }
  }
  catch(error){
    console.error("Error getting course description", error);
  }
})

// GET /courses - Retrieve courses options
router.get('/course_options', async (req, res) => {
  try {
    const [courses] = await db.query('SELECT id, department, number FROM courses');
    res.json(courses);
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
