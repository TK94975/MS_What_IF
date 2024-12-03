// server/progressUtils1.js
const db = require('../config/db');

// Utility function to convert letter grades to grade points
function convertGrade(letterGrade) {
    
  const conversion = new Map([
    ['A', 4.0],
    ['A-', 3.7],
    ['B+', 3.3],
    ['B', 3.0],
    ['B-', 2.7],
    ['C+', 2.3],
    ['C', 2.0],
    ['D', 1.0],
    ['F', 0.0],
    ['E', 0.0],
    [null, 0.0], // Assume a B in a class
  ]);

  converted = conversion.get(letterGrade);
  return converted || 0.0;
}

function calculateRequirement(userCourses, allowedCourses, requiredCredits) {
  //console.log(requiredCredits)
    //Filter User Courses for Allowed Courses
    const eligibleCourses = userCourses.filter(course =>
      allowedCourses.includes(course.course_id) 
    );
    //console.log(userCourses)
    //console.log('\n-----')
    //console.log('Eligible courses')
    //console.log(eligibleCourses)
    // If no eligible courses, return zeros
    if (eligibleCourses.length === 0) {
      return {
        completed_credits: 0,
        courses: [],
        gpa: 0.0,
      };
    }
  
    // Add grade points and grade points per credit to each course
    eligibleCourses.forEach(course => {
      course.gradePoint = convertGrade(course.grade);
      course.gradePointsPerCredit = course.gradePoint; // Since credits are the same unit
    });
  
    //Sort Courses by Grade Points per Credit (Descending)
    eligibleCourses.sort((a, b) => b.gradePointsPerCredit - a.gradePointsPerCredit);
  
    // Accumulate courses to meet required credits, maximizing GPA
    let accumulatedCredits = 0;
    let selectedCourses = [];
    let totalGradePoints = 0;
  
    for (let course of eligibleCourses) {
      if (accumulatedCredits >= requiredCredits) {
        break;
      }
      //console.log('Adding course')
      //console.log(course)
      selectedCourses.push(course);
      accumulatedCredits += course.credits;
      totalGradePoints += course.gradePoint * course.credits;
    }
  
    // If accumulated credits are less than required, return what we have
    // Optionally, you can decide to only return if the required credits are met
    // For now, we'll proceed with what's accumulated
  
    //Calculate GPA
    const gpa = accumulatedCredits > 0 ? totalGradePoints / accumulatedCredits : 0.0;
  
    // Prepare the Result
    return {
      completed_credits: accumulatedCredits,
      courses: selectedCourses,
      gpa: parseFloat(gpa.toFixed(2)),
    };
  }

async function calculateRequirementForCategory(userCourses, category, concentration, requiredCredits) {
    let query = '';
    let params = [];
  
    if (category === 'core') {
      // Core courses common to all concentrations
      query = `
        SELECT cc.course_id
        FROM course_concentrations cc
        WHERE cc.concentration = 'Core' AND cc.major = 'CSI'
      `;
      params = [];
    } else if (category === 'concentration') {
      // Concentration core courses
      query = `
        SELECT cc.course_id
        FROM course_concentrations cc
        WHERE LOWER(cc.concentration) = LOWER(?) AND cc.major = 'CSI' AND cc.isConcentrationCore = 1
      `;
      params = [concentration];
    }
  
    // Get allowed courses from the database
    const [allowedCoursesRows] = await db.query(query, params);
  
    const allowedCourseIds = allowedCoursesRows.map(row => row.course_id);
  
    // Use calculateRequirement function
    const result = calculateRequirement(userCourses, allowedCourseIds, requiredCredits);
    return result;
  }

async function calculateElectiveRequirement(userCourses, concentration, requiredCredits, coreCourses, concentrationCourses) {
    // Exclude core and concentration courses
    const excludedCourseIds = [
      ...coreCourses.map(course => course.course_id),
      ...concentrationCourses.map(course => course.course_id),
    ];
  
    // Get all CSI courses numbered 500 or above
    const [allowedCoursesRows] = await db.query(
      `SELECT id
       FROM courses
       WHERE department = 'CSI' AND CAST(number AS UNSIGNED) >= 500 AND id NOT IN (?)
       `,
      [excludedCourseIds.length > 0 ? excludedCourseIds : [0]]
    );
  
    const allowedCourseIds = allowedCoursesRows.map(row => row.id);
  
    // Exclude courses that cannot be counted towards the degree
    const nonCountableNumbers = ['600', '696', '697', '720', '890', '899'];
    const [nonCountableCoursesRows] = await db.query(
      `SELECT id FROM courses WHERE number IN (?)`,
      [nonCountableNumbers]
    );
    const nonCountableCourseIds = nonCountableCoursesRows.map(row => row.id);
  
    // Remove non-countable courses from allowed courses
    const finalAllowedCourseIds = allowedCourseIds.filter(id => !nonCountableCourseIds.includes(id));
  
    // Use calculateRequirement function
    const result = calculateRequirement(userCourses, finalAllowedCourseIds, requiredCredits);
    return result;
}

async function checkBreadthRequirement(userCourses, userConcentration, coreCourses, concentrationCourses) {
    // Exclude core courses and concentration core courses
    const excludedCourseIds = [
      ...coreCourses.map(course => course.course_id),
      ...concentrationCourses.map(course => course.course_id),
    ];
  
    // Filter user courses excluding core and concentration core courses
    const userCourseIds = userCourses
      .filter(course => !excludedCourseIds.includes(course.course_id))
      .map(course => course.course_id);
  
    // Define concentration areas
    const concentrationAreas = ['Artificial Intelligence and Machine Learning', 'Systems', 'Theoretical Computer Science'];
  
    // Initialize result
    let breadthRequirementMet = true;
    const breadthCoursesTaken = {};
  
    for (const concentration of concentrationAreas) {
      // Get non-core courses for the concentration
      let areaCoursesRows = [];
      if(concentration === userConcentration){

        [areaCoursesRows] = await db.query(
          `SELECT cc.course_id
          FROM course_concentrations cc
          WHERE cc.concentration = ? AND cc.major = 'CSI' AND cc.isConcentrationCore = false`,
          [concentration]
        );
      } else {
        /*console.log("Running query:", {
          sql: `SELECT cc.course_id
                FROM course_concentrations cc
                WHERE cc.concentration = ? AND cc.major = 'CSI'`,
          params: [concentration]
        });*/
        [areaCoursesRows] = await db.query(
          `SELECT cc.course_id
          FROM course_concentrations cc
          WHERE cc.concentration = ? AND cc.major = 'CSI'`,
          [concentration]
        );
      }
      //console.log(concentration);
      //console.log(userConcentration);
      //console.log(areaCoursesRows);
      const areaCourseIds = areaCoursesRows.map(row => row.course_id);
  
      // Check if the user has taken any course from this area
      /*const coursesInArea = userCourses.filter(
        course => areaCourseIds.includes(course.course_id) && !excludedCourseIds.includes(course.course_id)
      );*/
      const coursesInArea = userCourses.filter(
        course => areaCourseIds.includes(course.course_id)
      );

      if (coursesInArea.length > 0) {
        // Record the courses taken in this concentration
        breadthCoursesTaken[concentration] = coursesInArea;
      } else {
        breadthRequirementMet = false;
        // Continue checking other concentrations
      }
    }
  
    return {
      breadthRequirementMet,
      breadthCoursesTaken, // Courses counted towards breadth requirement
    };
}
  
// Helper function to calculate project requirement
function calculateProjectRequirement(userCourses, requiredCredits) {
    const projectCourseIds = [51, 52, 53, 54, 55, 59, 60, 106];
  
    // Use calculateRequirement function
    const result = calculateRequirement(userCourses, projectCourseIds, requiredCredits);
    return result;
}

async function calculateOldCSCoreRequirement(userCourses) {
    // Mandatory core courses (CSI 503 and CSI 518)
    const mandatoryCoreCourseIds = [4, 11];
  
    // Choice core courses (choose any two)
    const choiceCoreCourseIds = [1, 6, 12, 37];
  
    // Filter user's courses for mandatory core courses
    const mandatoryCoreCourses = userCourses.filter(course =>
      mandatoryCoreCourseIds.includes(course.course_id)
    );
  
    // Check if mandatory core courses are completed
    const mandatoryCompleted = mandatoryCoreCourses.length === mandatoryCoreCourseIds.length;
  
    // Filter user's courses for choice core courses
    const choiceCoreCourses = userCourses.filter(course =>
      choiceCoreCourseIds.includes(course.course_id)
    );
  
    // Select the best two courses from choice core courses to maximize GPA
    const choiceCoreResult = calculateRequirement(choiceCoreCourses, choiceCoreCourseIds, 6); // Assuming each course is 3 credits
  
    // Total core courses
    const coreCourses = [...mandatoryCoreCourses, ...choiceCoreResult.courses];
  
    // Calculate total credits and GPA
    const totalCoreCredits = coreCourses.reduce((sum, course) => sum + course.credits, 0);
    const totalGradePoints = coreCourses.reduce(
      (sum, course) => sum + convertGrade(course.grade) * course.credits,
      0
    );
    const coreGPA = totalCoreCredits > 0 ? totalGradePoints / totalCoreCredits : 0;
  
    // Check if GPA requirement is met
    const gpaRequirementMet = coreGPA >= 3.0;
  
    return {
      completed_credits: totalCoreCredits,
      courses: coreCourses,
      gpa: parseFloat(coreGPA.toFixed(2)),
      mandatoryCompleted,
      gpaRequirementMet,
    };
}

async function calculateOldCSElectiveRequirement(userCourses, coreCourses) {
    // Exclude core courses
    const excludedCourseIds = coreCourses.map(course => course.course_id);
  
    // Allowed courses are those not in core courses
    const electiveCourses = userCourses.filter(
      course => !excludedCourseIds.includes(course.course_id)
    );
  
    // Total elective credits required: 15
    const requiredCredits = 15;
  
    // Use calculateRequirement to maximize GPA up to required credits
    const electiveResult = calculateRequirement(electiveCourses, electiveCourses.map(c => c.course_id), requiredCredits);
  
    return electiveResult;
}
  
async function calculateECEDepthRequirement(userCourses, selectedConcentration) {
    // Get courses in the selected concentration area
    const [depthCoursesRows] = await db.query(
      `SELECT cc.course_id
       FROM course_concentrations cc
       WHERE LOWER(cc.concentration) = LOWER(?) AND cc.major = 'ECE'`,
      [selectedConcentration]
    );
    const depthCourseIds = depthCoursesRows.map(row => row.course_id);
  
    // Use calculateRequirement
    const depthResult = calculateRequirement(userCourses, depthCourseIds, 12);
  
    return depthResult;
}

async function calculateECEBreadthRequirement(userCourses, selectedConcentration) {
    // Get courses outside the selected concentration area
    const [breadthCoursesRows] = await db.query(
      `SELECT cc.course_id
       FROM course_concentrations cc
       WHERE LOWER(cc.concentration) != LOWER(?) AND cc.major = 'ECE'`,
      [selectedConcentration]
    );
    const breadthCourseIds = breadthCoursesRows.map(row => row.course_id);
  
    // Use calculateRequirement
    const breadthResult = calculateRequirement(userCourses, breadthCourseIds, 6);
  
    return breadthResult;
}
  
function calculateECEMathPhysicsRequirement(userCourses) {
    // Allowed departments: MAT, PHY
    const mathPhysicsCourses = userCourses.filter(
      course => course.department === 'MAT' || course.department === 'PHY'
    );
  
    // Require 3 credits
    const requiredCredits = 3;
  
    const result = calculateRequirement(mathPhysicsCourses, mathPhysicsCourses.map(c => c.course_id), requiredCredits);
  
    return result;
}
  
function calculateECETechnicalElectiveRequirement(userCourses, coreCourses, breadthCourses, mathPhysicsCourses, option) {
  //console.log(`Option: ${option}`)  
  // Exclude courses already counted
    const excludedCourseIds = [
      ...coreCourses.map(c => c.course_id),
      ...breadthCourses.map(c => c.course_id),
      ...mathPhysicsCourses.map(c => c.course_id),
      108
    ];
  
    const electiveCourses = userCourses.filter(
      course => !excludedCourseIds.includes(course.course_id)
    );
    //console.log(`\n\nElective Courses\n\n`)
    //console.log(electiveCourses)
    // Require 3 credits (or 6 credits for Non-Thesis Option)
    var requiredCredits = 3; // Adjust as needed
    if (option === 'Thesis') {
        requiredCredits = 3;
    } else if (option === 'Project') {
        requiredCredits = 6;
    }
    let ecCID = electiveCourses.map(c => c.course_id)
    //console.log(ecCID)
  
    const result = calculateRequirement(userCourses, electiveCourses.map(c => c.course_id), requiredCredits);
  
    return result;
}

function calculateECEThesisProjectRequirement(userCourses, option) {
    let requiredCredits = 0;
    let allowedCourseIds = [];
    console.log(option);
    if (option === 'Thesis') {
      requiredCredits = 6;
      allowedCourseIds = [108];
    } else if (option === 'Project') {
      requiredCredits = 3;
      allowedCourseIds = [106];
    }
  
    const result = calculateRequirement(userCourses, allowedCourseIds, requiredCredits);
  
    return result;
}
  
  

module.exports = {
  convertGrade,
  calculateRequirement,
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
};