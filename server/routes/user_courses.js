var express = require('express');
var router = express.Router();
const db = require('../config/db'); // Database connection

router.post('/get_user_courses', async (req, res) => {
    try {
        const user_id = req.body.user_id;

        // Validate user_id
        if (!user_id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        // Fetch user courses
        const [user_courses] = await db.query(
            `SELECT c.id, c.department, c.number, c.title, uc.semester, uc.year, uc.grade, uc.user_id
             FROM courses c
             JOIN user_courses uc ON c.id = uc.course_id
             WHERE uc.user_id = ?`,
            [user_id]
        );

        // Send response
        res.status(200).json({ user_courses });

    } catch (error) {
        console.error("Error fetching user courses:", error);

        // Send error response
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/update_user_courses', async (req, res) => {
    try{
        const updatedCourses = req.body.courses;
        await db.query(
            `DELETE FROM user_courses WHERE user_courses.user_id = ?`,
            [updatedCourses[0].user_id]
        )
        updatedCourses.forEach(element => {
            db.query(
                `INSERT INTO user_courses (user_id, course_id, semester, year, grade) VALUES (?,?,?,?,?)`,
                [element.user_id, element.id, element.semester, element.year, element.grade]
            )
        });
    }   
    catch(error){
        console.error("Update failed", error);
    }
});

module.exports = router;