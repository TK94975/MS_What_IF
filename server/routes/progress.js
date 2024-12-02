var express = require('express');
var router = express.Router();

//const { progressCalculator } = require('../utils/progressUtils');

const {
    calculateRequirementForCategory,
    calculateElectiveRequirement,
    calculateProjectRequirement,
    calculateECEThesisProjectRequirement,
    calculateECETechnicalElectiveRequirement,
    calculateECEMathPhysicsRequirement,
    calculateECEDepthRequirement,
    calculateECEBreadthRequirement,
    calculateOldCSElectiveRequirement,
    calculateOldCSCoreRequirement,
    checkBreadthRequirement,
  } = require('../utils/progressUtils'); // Import utility functions
  
// Define the credit mapping
const creditValues = new Map();
creditValues.set('Artificial Intelligence and Machine Learning', { core: 7, concentration: 6, elective: 15, project: 3 });
creditValues.set('Systems', { core: 7, concentration: 6, elective: 15, project: 3 });
creditValues.set('Theoretical Computer Science', { core: 7, concentration: 6, elective: 15, project: 3 });
creditValues.set('Old Computer Science', { core: 13, elective: 15, project: 3 });

// ECE curriculum
creditValues.set('ECE', {depth: 12,breadth: 6,mathPhysics: 3,technicalElective: 3, // or 6 for Non-Thesis Option
    thesis: 6, // or project: 3 for Non-Thesis Option
});

/* GET home page. */
router.post('/concentration_requirements', (req, res) => {
    const creditValues = new Map();
    creditValues.set("Artificial Intelligence and Machine Learning", {core: "7", concentration: "6", elective: "15", project: "3"})
    creditValues.set("Systems", {core: "7", concentration: "6", elective: "15", project: "3"})
    creditValues.set("Theoretical Computer Science", {core: "7", concentration: "6", elective: "15", project: "3"})
    creditValues.set("Old Computer Science", {core: "13", concentration: "0", elective: "15", project: "3"})
    creditValues.set('Signal Processing and Communications', {depth: "12",breadth: "6",mathPhysics: "3",technicalElective: "3", thesis: "6"})
    creditValues.set('Electronic Circuits and Systems', {depth: "12",breadth: "6",mathPhysics: "3",technicalElective: "3", thesis: "6"})
    creditValues.set('Control and Computer Systems', {depth: "12",breadth: "6",mathPhysics: "3",technicalElective: "3", thesis: "6"})
    try{
        const concentration = req.body.selectedConcentration;
        res.status(200).json(creditValues.get(concentration));
    }
    catch(error){
        res.status(400).json("Error retrieving concentration requirements")
    }
});
/*
router.post('/completed_progress', async (req, res) => {
    const user_courses = req.body.courses;
    const user_concentration = req.body.selectedConcentration;
    const user_department = 'CSI';
    const progress = await progressCalculator(user_courses, user_concentration);
    res.status(200).json(progress);
}); */

// POST route to calculate user progress
router.post('/completed_progress', async (req, res) => {
    let userCourses = req.body.user_courses; // Array of user's completed courses with grades
    const userConcentration = req.body.user_concentration; // String
    const calculationType = req.body.calculation_type; // 'current' or 'projected'
    //console.log(req.body)
    //console.log(userConcentration);
    //console.log(userCourses);

    try {
      // Validate input
      if (!userCourses || !Array.isArray(userCourses) || userCourses.length === 0) {
        return res.status(400).json({ error: 'User courses are required.' });
      }
      if (!userConcentration) {
        return res.status(400).json({ error: 'User concentration is required.' });
      }
      if (!calculationType || !['current', 'projected'].includes(calculationType)) {
        return res.status(400).json({ error: 'Valid calculation type is required (current or projected).' });
      }

      // Fixing course_id = id error.
      userCourses = userCourses.map(course => ({
            ...course,
            course_id: course.id,
        }));
  
      // Remove courses with null grade
      userCourses = userCourses.filter(course => course.grade !== null);
      // Remove in-progress and completed courses for current requirements calc.
      if (calculationType === 'current') {
        userCourses = userCourses.filter(course => course.completed === 'yes');
      }
  
      // Prepare the results object
      const results = {};

      if (userConcentration === 'Old Computer Science') {
            // Handle Old Computer Science curriculum
    
            // Core Courses
            const coreResult = await calculateOldCSCoreRequirement(userCourses);
            results.core = coreResult;
    
            // Electives
            const electiveResult = await calculateOldCSElectiveRequirement(userCourses, coreResult.courses);
            results.elective = electiveResult;
    
            // Project/Thesis/Internship
            const projectResult = calculateProjectRequirement(userCourses, 3);
            results.project = projectResult;
    
            // Determine overall requirements met
            const requirementsMet = {
            coreCoursesCompleted: coreResult.mandatoryCompleted && coreResult.courses.length >= 4,
            coreGpaRequirementMet: coreResult.gpaRequirementMet,
            electivesCompleted: electiveResult.completed_credits >= 15,
            projectCompleted: projectResult.completed_credits >= 3,
            };
    
            results.requirementsMet = requirementsMet;
      } else if (userConcentration === 'Signal Processing and Communications' || userConcentration ===  'Electronic Circuits and Systems' || userConcentration === 'Control and Computer Systems') {
            // Handle ECE curriculum
            console.log("ECE");
            const selectedConcentration = userConcentration;//req.body.selected_concentration; // ECE concentration area
            //const thesisOption = req.body.thesis_option; // 'Thesis' or 'Project'
            const thesisOption = 'Thesis';
            // Depth Courses
            const depthResult = await calculateECEDepthRequirement(userCourses, selectedConcentration);
            results.depth = depthResult;
    
            // Breadth Courses
            const breadthResult = await calculateECEBreadthRequirement(userCourses, selectedConcentration);
            results.breadth = breadthResult;
    
            // Math/Physics Course
            const mathPhysicsResult = calculateECEMathPhysicsRequirement(userCourses);
            results.mathPhysics = mathPhysicsResult;
    
            // Technical Elective
            const technicalElectiveResult = calculateECETechnicalElectiveRequirement(
            userCourses,
            depthResult.courses,
            breadthResult.courses,
            mathPhysicsResult.courses
            );
            results.technicalElective = technicalElectiveResult;
    
            // Thesis/Project
            const thesisProjectResult = calculateECEThesisProjectRequirement(userCourses, thesisOption);
            results.thesisProject = thesisProjectResult;
    
            // Determine overall requirements met
            const requirementsMet = {
            depthCompleted: depthResult.completed_credits >= 12,
            breadthCompleted: breadthResult.completed_credits >= 6,
            mathPhysicsCompleted: mathPhysicsResult.completed_credits >= 3,
            technicalElectiveCompleted:
                technicalElectiveResult.completed_credits >= (thesisOption === 'Thesis' ? 3 : 6),
            thesisProjectCompleted:
                thesisProjectResult.completed_credits >= (thesisOption === 'Thesis' ? 6 : 3),
            };
    
            results.requirementsMet = requirementsMet;
      }else {
            // Get required credits for the concentration
            const concentrationCredits = creditValues.get(userConcentration);
            if (!concentrationCredits) {
                return res.status(400).json({ error: 'Invalid concentration provided.' });
            }
        
            // 1. Core Courses
            const coreResult = await calculateRequirementForCategory(
                userCourses,
                'core',
                userConcentration,
                concentrationCredits.core
            );
            results.core = coreResult;
        
            // 2. Concentration Courses
            const concentrationResult = await calculateRequirementForCategory(
                userCourses,
                'concentration',
                userConcentration,
                concentrationCredits.concentration
            );
            results.concentration = concentrationResult;
        
            // 3. Electives
            const electiveResult = await calculateElectiveRequirement(
                userCourses,
                userConcentration,
                concentrationCredits.elective,
                coreResult.courses,
                concentrationResult.courses
            );
            results.elective = electiveResult;
        
            // 4. Project Courses
            const projectResult = calculateProjectRequirement(
                userCourses,
                concentrationCredits.project
            );
            results.project = projectResult;

            const breadthResult = await checkBreadthRequirement(
                userCourses,
                userConcentration,
                coreResult.courses,
                concentrationResult.courses
            );
            results.breadth = breadthResult;
            
            // Determine overall requirements met
            const requirementsMet = {
                coreCourses: coreResult.completed_credits >= concentrationCredits.core,
                concentrationCoreCourses: concentrationResult.completed_credits >= concentrationCredits.concentration,
                electives: electiveResult.completed_credits >= concentrationCredits.elective,
                project: projectResult.completed_credits >= concentrationCredits.project,
                breadthRequirement: breadthResult.breadthRequirementMet,
            };
            
            // Include the requirements met in the results
            results.requirementsMet = requirementsMet;
        }
        console.log(results);
      res.json(results);
    } catch (err) {
      console.error('Error calculating progress:', err);
      res.status(500).json({ error: 'An error occurred while calculating progress.' });
    }
});



module.exports = router;
