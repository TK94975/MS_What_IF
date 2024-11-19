var express = require('express');
var router = express.Router();
const db = require('../config/db'); // Database connection

router.post('/get_user_courses', async (req, res, next) => {
    try {
        const user_id = req.body.user_id;

        // Validate user_id
        if (!user_id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        // Fetch user courses
        const [user_courses] = await db.query(
            `SELECT c.id, c.department, c.number, c.title, uc.semester, uc.year, uc.grade
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

module.exports = router;