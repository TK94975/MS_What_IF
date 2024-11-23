var express = require('express');
var router = express.Router();

const { progressCalculator } = require('../utils/progressUtils');


/* GET home page. */
router.post('/concentration_requirements', (req, res) => {
    const creditValues = new Map();
    creditValues.set("Artificial Intelligence and Machine Learning", {core: "7", concentration: "6", elective: "15", project: "3"})
    creditValues.set("Systems", {core: "7", concentration: "6", elective: "15", project: "3"})
    creditValues.set("Theoretical Computer Science", {core: "7", concentration: "6", elective: "15", project: "3"})
    creditValues.set("Old Computer Science", {core: "13", concentration: "0", elective: "15", project: "3"})
    try{
        const concentration = req.body.selectedConcentration;
        res.status(200).json(creditValues.get(concentration));
    }
    catch(error){
        res.status(400).json("Error retrieving concentration requirements")
    }
});

router.post('/completed_progress', async (req, res) => {
    const user_courses = req.body.courses;
    const user_concentration = req.body.selectedConcentration;

    const progress = await progressCalculator(user_courses, user_concentration);
    res.status(200).json(progress);
});

module.exports = router;
