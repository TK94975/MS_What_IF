var express = require('express');
var router = express.Router();
const db = require('../config/db'); // Database connection

const {
    createFullSchedule,
    createDatedSchedule,
    getUpcomingSemester,
    extractCourseIDs, 
    } = require('../utils/schedule_templateUtils.js')

router.post('/get_user_courses', async (req, res) => {
    try {
        const user_id = req.body.user_id;

        // Validate user_id
        if (!user_id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        // Fetch user courses
        const [user_courses] = await db.query(
            `SELECT c.id, c.department, c.number, c.title, uc.semester, uc.year, uc.grade, uc.user_id, uc.completed, c.credits
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
            // Dont add year/semester placeholder courses
            if(element.id){
                db.query(
                    `INSERT INTO user_courses (user_id, course_id, semester, year, grade, completed) VALUES (?,?,?,?,?,?)`,
                    [element.user_id, element.id, element.semester, element.year, element.grade, element.completed]
                )
            }

        });
    }   
    catch(error){
        console.error("Update failed", error);
    }
});

router.post('/generate_schedule', async (req, res) =>{
    
    const userCourseDetails = req.body.courses;
    const userCourses = extractCourseIDs(userCourseDetails);
    console.log("/generate_schedule: Original user courses", userCourses);
    const userProgress = req.body.user_progress;
    console.log("/generate_schedule: User Progress", userProgress);
    const userConcentration = req.body.concentration;
    let userStartYear = req.body.startYear;
    let userStartSemester = req.body.startSemester;
    const userID = req.body.user_id;
    const userDME = req.body.dme;
    const userThesis = req.body.thesis;
    const userCourseLimit = 3; // Default to 3 unless course per semester is implemented 
    
    if (userCourses.length !== 0){
        const upcomingSemester = getUpcomingSemester();
        userStartYear = upcomingSemester.year;
        userStartSemester = upcomingSemester.semester;
    }

    try{
        const baseSchedule = await createFullSchedule(userCourses, userProgress, userConcentration, userCourseLimit, userDME, userThesis);
        console.log("Base Schedule:",baseSchedule)
        const dateSchedule = await createDatedSchedule(userStartYear, userStartSemester, baseSchedule, userID, userCourseLimit);
        res.status(200).json(dateSchedule);
    }
    catch(error){
        res.status(400).json({error: "Error creating class schedule"})
        console.log(error)
    }

})


module.exports = router;