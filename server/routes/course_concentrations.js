const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Ensure this path is correct and db connection is set up



// GET course_concentration - Retrieve all course prerequisites
router.get('/', async (req, res) => {
    try {
      const [prereqs] = await db.query('SELECT * FROM course_concentrations');
      res.json(prereqs);
    } catch (err) {
      console.error('Error fetching course concentration:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
});

// GET courses by concentration
router.get('/:concentration', async (req, res) => {
    const concentration = req.params.concentration;
  
    try {
      // Validate input
      if (!concentration) {
        return res.status(400).json({ error: 'Concentration is required.' });
      }
  
      // Query to retrieve courses for the given concentration
      const [rows] = await db.query(
        `SELECT 
           c.id AS course_id,
           c.department,
           c.number,
           c.title,
           cc.isConcentrationCore
         FROM courses c
         JOIN course_concentrations cc ON c.id = cc.course_id
         WHERE cc.concentration = ? AND cc.major = 'CSI'`,
        [concentration]
      );
  
      if (rows.length === 0) {
        return res.status(404).json({ message: 'No courses found for this concentration.' });
      }
  
      // Format the response to include 'isCore' as a boolean
      const courses = rows.map(course => ({
        course_id: course.course_id,
        department: course.department,
        number: course.number,
        title: course.title,
        isCore: course.isConcentrationCore === 1,
      }));
  
      res.json(courses);
    } catch (err) {
      console.error('Error retrieving courses by concentration:', err);
      res.status(500).json({ error: 'An error occurred while retrieving courses.' });
    }
});

// GET route to fetch course concentration by department and course_id
router.get('/:department/:course_id/concentration', async (req, res) => {
    const department = req.params.department;
    const course_id = parseInt(req.params.course_id, 10);
  
    try {
      // verifying course exists
      const [courseRows] = await db.query(
        'SELECT id, number, title FROM courses WHERE department = ? AND id = ?',
        [department, course_id]
      );
  
      if (courseRows.length === 0) {
        return res.status(404).json({ error: 'Course not found' });
      }
  
      const course = courseRows[0];
  
      // Query
      const [concentrationRows] = await db.query(
        'SELECT concentration, isConcentrationCore FROM course_concentrations WHERE course_id = ? AND major = ?',
        [course_id, department]
      );
  
      if (concentrationRows.length === 0) {
        return res.status(404).json({ error: 'No concentration found for this course' });
      }
  
      const concentrationInfo = concentrationRows[0];
  
      // Respond with concentration
      res.json({ concentration: concentrationInfo.concentration });

    } catch (error) {
      console.error('Error fetching course concentration:', error);
      res.status(500).json({ error: 'An error occurred while fetching course concentration.' });
    }
  });




module.exports = router;