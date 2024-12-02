const db = require('../config/db');

const preferredElectives = [25, 7, 9, 21, 32, 20, 21, 17];
const ecePreferredElectives = [80, 94, 95, 107]//[63, 84, 85, 90, 97, 99, 100]

const createFullSchedule = async (userCourses, userProgress, concentration, classesPerSemester, dme, thesis) =>{
    console.log(`In createFullSchedule... concentration: ${concentration}`)
    let newSchedule = [[]]
    if (concentration === 'Old Computer Science'){
        newSchedule = await createFullOldCSISchedule(userCourses, classesPerSemester, dme, newSchedule)
    }
    else if((concentration === 'Theoretical Computer Science') || (concentration === 'Systems') || (concentration ===  'Artificial Intelligence and Machine Learning')){
        console.log('HERE')
        newSchedule = await createFullCSISchedule(userCourses, userProgress, concentration, classesPerSemester, dme, newSchedule);
    }
    else {
        // ECE
        console.log('createFullSchedule: ECE CONCENTRATION')
        newSchedule = await createFullECESchedule(userCourses, userProgress, concentration, classesPerSemester, thesis, newSchedule);
    }
    return newSchedule;
}

const createFullECESchedule = async (userCourses, userProgress, concentration, classesPerSemester, thesis, schedule) => {
    console.log(`\ncreateFullECESchedule: \nuserCourses: ${userCourses}\nuserProgress: ${userProgress}\nconcentration: ${concentration}\nclassesPerSemester: ${classesPerSemester}\nthesis: ${thesis}\nschedule: ${schedule}`)
    // Get their current progress
    let newSchedule = schedule;
    let courses = userCourses;
    //get the required prereqs
    console.log('\nGETTING CORE REQS:')
    const coreCourses = await getECECoreReqs();
    console.log('\nCORE REQS:')
    console.log(coreCourses)

    console.log('\nGETTING CONCENTRATION REQS:')
    const conCourses = await getECEConcentrationReqs(concentration);
    console.log('\nCONCENTRATION REQS:')
    console.log(conCourses)
    
    console.log('\nGETTING BREADTH REQS:')
    const breadthReqs = await getECEBreadthReqs(concentration);
    console.log('\nBREADTH REQS:')
    console.log(breadthReqs)
    
    // Check for completed electives
    const electiveCompleted = userProgress?.elective?.completed_credits || 0;
    const conCoreCredits = userProgress?.concentration?.completed_credits || 0;
    console.log(`electiveCompleted: ${electiveCompleted}`)
    console.log(`conCoreCredits: ${conCoreCredits}`)
    
    // https://www.albany.edu/graduate-bulletin/electrical-computer-engineering-ms.php
    // Technical electives 2 classes for non thesis 1 class for thesis
    // Math and Science 1 course
    // Depth (concentration) = 4
    // breadth (breadth) = 2
    let neededCourses = 6 - electiveCompleted ;
    
    // Get the core courses for this class
    console.log('\nuserProgress:\n')
    console.log(userProgress)
    console.log('\nAdding depth courses')
    if(!userProgress?.requirementsMet?.coreCourses){
        for(const course of coreCourses){
            if(!courses.includes(course)){
                const prereqs = await getPrereqs(course);
                for (const prereq of prereqs){
                    if(!courses.includes(prereq)){
                        newSchedule = addCourseToSchedule(prereq, [], newSchedule, classesPerSemester);
                        courses.push(prereq)
                    }
                }
                newSchedule = addCourseToSchedule(course, prereqs, newSchedule, classesPerSemester);
                courses.push(course);
            }
        }
    }
    console.log('new Schedule: ')
    console.log(newSchedule)
    console.log('\nAdding concentration core courses')
    if(!userProgress?.requirementsMet?.concentrationCoreCourses){
        let credits = conCoreCredits;
        console.log("Init Credits", credits);
        let tries = 0
        while (credits < 12 && conCourses.length > 3 && tries < 20){
            const randomCourse = conCourses[Math.floor(Math.random() * conCourses.length)];
            if(!courses.includes(randomCourse)){
                const prereqs = await getPrereqs(randomCourse);
                for (const prereq of prereqs){
                    if(!courses.includes(prereq)){
                        newSchedule = addCourseToSchedule(prereq, [], newSchedule, classesPerSemester);
                        courses.push(prereq);
                        neededCourses-=1
                    }
                }
                newSchedule = addCourseToSchedule(randomCourse, prereqs, newSchedule, classesPerSemester);
                courses.push(randomCourse);
                credits += 3;
                console.log("Credits", credits);
                tries+=1
            }
        }
    }
    console.log('new Schedule: ')
    console.log(newSchedule)
    console.log('\nGetting BreadthRequirements...')
    if(!userProgress?.requirementsMet?.breadthRequirements){
        electiveOneFlag = false;
        electiveTwoFlag = false;
        let tries = 0
        while(!electiveOneFlag && tries < 20){
            const randomCourse = breadthReqs[0][Math.floor(Math.random() * breadthReqs[0].length)];
            if(!courses.includes(randomCourse)){
                const prereqs = await getPrereqs(randomCourse);
                for (const prereq of prereqs){
                    if(!courses.includes(prereq)){
                        newSchedule = addCourseToSchedule(prereq, [], newSchedule, classesPerSemester);
                        courses.push(prereq);
                        neededCourses -= 1;
                    }
                }
                newSchedule = addCourseToSchedule(randomCourse, prereqs, newSchedule, classesPerSemester);
                courses.push(randomCourse);
                console.log("Breadth 1", randomCourse)
                neededCourses -= 1;
                electiveOneFlag = true;
            }
            tries+=1
        }
        tries = 0
        while(!electiveTwoFlag && tries < 20){
            const randomCourse = breadthReqs[1][Math.floor(Math.random() * breadthReqs[1].length)];
            if(!courses.includes(randomCourse)){
                const prereqs = await getPrereqs(randomCourse);
                for (const prereq of prereqs){
                    if(!courses.includes(prereq)){
                        newSchedule = addCourseToSchedule(prereq, [], newSchedule, classesPerSemester);
                        courses.push(prereq);
                        neededCourses -= 1;
                    }
                }
                newSchedule = addCourseToSchedule(randomCourse, prereqs, newSchedule, classesPerSemester);
                courses.push(randomCourse);
                console.log("Breadth 2", randomCourse)
                neededCourses -= 1;
                electiveTwoFlag = true;
            }
            tries+=1
        }
    }
    console.log('new Schedule: ')
    console.log(newSchedule)

    console.log('neededCourses')
    while (neededCourses > 0){
        const randomCourse = ecePreferredElectives[Math.floor(Math.random() * preferredElectives.length)]
        if(!courses.includes(randomCourse)){
            let prereqs = await getPrereqs(randomCourse)
            for (const prereq of prereqs){
                if(!courses.includes(prereq)){
                    if(neededCourses === 1){
                        break
                    }
                    newSchedule = addCourseToSchedule(prereq, [], newSchedule, classesPerSemester)
                    courses.push(prereq)
                    neededCourses -= 1;
                } 
            }
            newSchedule = addCourseToSchedule(randomCourse, prereqs, newSchedule, classesPerSemester)
            courses.push(randomCourse)
            neededCourses -= 1;
        }
    }
    // Add Math 
    let mathClasses = [111, 112]
    let math = mathClasses[Math.floor(Math.random() * 2)]
    console.log('Adding Math/Phys')
    newSchedule = addCourseToSchedule(math, [], newSchedule, classesPerSemester)
    // Add thesis
    if(thesis) {
        console.log('Adding Thesis')
        addCourseToSchedule(108, [], newSchedule, classesPerSemester)
    }
    else {
        console.log('Adding Additional TE')
        // Add technical Elective
        var randomCourse = ecePreferredElectives[Math.floor(Math.random() * preferredElectives.length)]
        if(!courses.includes(randomCourse)){
            let prereqs = await getPrereqs(randomCourse)
            for (const prereq of prereqs){
                if(!courses.includes(prereq)){
                    if(neededCourses === 1){
                        break
                    }
                    newSchedule = addCourseToSchedule(prereq, [], newSchedule, classesPerSemester)
                    courses.push(prereq)
                    neededCourses -= 1;
                } 
            }
            newSchedule = addCourseToSchedule(randomCourse, prereqs, newSchedule, classesPerSemester)
            courses.push(randomCourse)
            neededCourses -= 1;
        }
        // Add Project
        console.log('Adding Project')
        addCourseToSchedule(106, [], newSchedule, classesPerSemester)
    }
    return newSchedule;
}

const createFullCSISchedule = async (userCourses, userProgress, concentration, classesPerSemester, dme, schedule) =>{
    let newSchedule = schedule;
    let courses = userCourses;
    const coreCourses = await getCSICoreReqs();
    const conCourses = await getCSIConcentrationReqs(concentration);
    const breadthReqs = await getCSIBreadthReqs(concentration);

    const electiveCompleted = userProgress?.elective?.completed_credits || 0;
    const conCoreCredits = userProgress?.concentration?.completed_credits || 0;

    let neededCourses = 5 - electiveCompleted ;
    if (!dme){ 
        newSchedule = addCourseToSchedule(14, [], newSchedule, classesPerSemester)
        neededCourses -= 1;   
    }
    courses.push(14)

    if(!userProgress?.requirementsMet?.coreCourses){
        for(const course of coreCourses){
            if(!courses.includes(course)){
                const prereqs = await getPrereqs(course);
                for (const prereq of prereqs){
                    if(!courses.includes(prereq)){
                        newSchedule = addCourseToSchedule(prereq, [], newSchedule, classesPerSemester);
                        courses.push(prereq)
                    }
                }
                newSchedule = addCourseToSchedule(course, prereqs, newSchedule, classesPerSemester);
                courses.push(course);
            }
        }
    }

    if(!userProgress?.requirementsMet?.concentrationCoreCourses){
        let credits = conCoreCredits;
        console.log("Credits", credits);
        while (credits < 6){
            const randomCourse = conCourses[Math.floor(Math.random() * conCourses.length)];
            if(!courses.includes(randomCourse)){
                const prereqs = await getPrereqs(randomCourse);
                for (const prereq of prereqs){
                    if(!courses.includes(prereq)){
                        newSchedule = addCourseToSchedule(prereq, [], newSchedule, classesPerSemester);
                        courses.push(prereq);
                    }
                }
                newSchedule = addCourseToSchedule(randomCourse, prereqs, newSchedule, classesPerSemester);
                courses.push(randomCourse);
                credits += 3;
                console.log("Credits", credits);
            }
        }
    }

    console.log(breadthReqs[0])
    console.log(breadthReqs[1])

    if(!userProgress?.requirementsMet?.breadthRequirements){
        electiveOneFlag = false;
        electiveTwoFlag = false;
        while(!electiveOneFlag){
            const randomCourse = breadthReqs[0][Math.floor(Math.random() * breadthReqs[0].length)];
            if(!courses.includes(randomCourse)){
                const prereqs = await getPrereqs(randomCourse);
                for (const prereq of prereqs){
                    if(!courses.includes(prereq)){
                        newSchedule = addCourseToSchedule(prereq, [], newSchedule, classesPerSemester);
                        courses.push(prereq);
                        neededCourses -= 1;
                    }
                }
                newSchedule = addCourseToSchedule(randomCourse, prereqs, newSchedule, classesPerSemester);
                courses.push(randomCourse);
                console.log("Breadth 1", randomCourse)
                neededCourses -= 1;
                electiveOneFlag = true;
            }
        }
        while(!electiveTwoFlag){
            const randomCourse = breadthReqs[1][Math.floor(Math.random() * breadthReqs[1].length)];
            if(!courses.includes(randomCourse)){
                const prereqs = await getPrereqs(randomCourse);
                for (const prereq of prereqs){
                    if(!courses.includes(prereq)){
                        newSchedule = addCourseToSchedule(prereq, [], newSchedule, classesPerSemester);
                        courses.push(prereq);
                        neededCourses -= 1;
                    }
                }
                newSchedule = addCourseToSchedule(randomCourse, prereqs, newSchedule, classesPerSemester);
                courses.push(randomCourse);
                console.log("Breadth 2", randomCourse)
                neededCourses -= 1;
                electiveTwoFlag = true;
            }
        }
    }

    while (neededCourses > 0){
        const randomCourse = preferredElectives[Math.floor(Math.random() * preferredElectives.length)]
        if(!courses.includes(randomCourse)){
            let prereqs = await getPrereqs(randomCourse)
            if (dme){
                const newPreReq = prereqs.filter(course => course !== 14);
                prereqs = newPreReq;
            }
            for (const prereq of prereqs){
                if(!courses.includes(prereq)){
                    if(neededCourses === 1){
                        break
                    }
                    newSchedule = addCourseToSchedule(prereq, [], newSchedule, classesPerSemester)
                    courses.push(prereq)
                    neededCourses -= 1;
                } 
            }
            newSchedule = addCourseToSchedule(randomCourse, prereqs, newSchedule, classesPerSemester)
            courses.push(randomCourse)
            neededCourses -= 1;
        }
    }
    newSchedule = addCourseToSchedule(51, [], newSchedule, classesPerSemester)

    return newSchedule;
}

const getCSICoreReqs = async () =>{
    try{
        const [results] = await db.query(`
            SELECT cc.course_id
            FROM course_concentrations cc
            WHERE cc.concentration = 'Core' AND cc.major = 'CSI'
            `
        );
        return extractCourseIDs(results)
    }
    catch(error){
        console.log("Error getting core classes", error)
        return []
    }
}

const getECECoreReqs = async () =>{
    try{
        const [results] = await db.query(`
            SELECT cc.course_id
            FROM course_concentrations cc
            WHERE cc.concentration = 'Core' AND cc.major = 'ECE'
            `
        );
        return extractCourseIDs(results)
    }
    catch(error){
        console.log("Error getting core classes", error)
        return []
    }
}

const getCSIConcentrationReqs = async (concentration) =>{
    try{
        const [results] = await db.query(`
            SELECT cc.course_id
            FROM course_concentrations cc
            WHERE cc.concentration = ? AND cc.major = 'CSI' AND cc.isConcentrationCore = 1
            `, [concentration]
        );
        return extractCourseIDs(results)
    }
    catch(error){
        console.log("Error getting core classes", error)
        return []
    }
}

const getECEConcentrationReqs = async (concentration) =>{
    try{
        const [results] = await db.query(`
            SELECT cc.course_id
            FROM course_concentrations cc
            WHERE cc.concentration = ? AND cc.major = 'ECE' AND cc.isConcentrationCore = 1
            `, [concentration]
        );
        return extractCourseIDs(results)
    }
    catch(error){
        console.log("Error getting core classes", error)
        return []
    }
}

const getCSIBreadthReqs = async (concentration) => {
    const possibleConcentrations = ['Artificial Intelligence and Machine Learning', 'Systems', 'Theoretical Computer Science'];
    const requiredBreadth = possibleConcentrations.filter(choice => choice !== concentration);
    let breadthCourses = []
    for (const electiveBreadthConcentration of requiredBreadth){
        try{
            const [results] = await db.query(`
                SELECT cc.course_id
                FROM course_concentrations cc
                WHERE cc.concentration = ? AND cc.major = 'CSI'
                `, [electiveBreadthConcentration]
            );
            breadthCourses.push(extractCourseIDs(results));
        }
        catch(error){
            console.log("Error getting core classes", error)
            return []
        }
    }
    return breadthCourses
}

const getECEBreadthReqs = async (concentration) => {
    const possibleConcentrations = ['Control and Computer Systems', 'Electronic Circuits and Systems', 'Signal Processing and Communications'];
    const requiredBreadth = possibleConcentrations.filter(choice => choice !== concentration);
    let breadthCourses = []
    for (const electiveBreadthConcentration of requiredBreadth){
        try{
            const [results] = await db.query(`
                SELECT cc.course_id
                FROM course_concentrations cc
                WHERE cc.concentration = ? AND cc.major = 'ECE'
                `, [electiveBreadthConcentration]
            );
            breadthCourses.push(extractCourseIDs(results));
        }
        catch(error){
            console.log("Error getting core classes", error)
            return []
        }
    }
    return breadthCourses
}

const createFullOldCSISchedule = async (userCourses, classesPerSemester, dme, schedule) =>{
    let newSchedule = schedule;
    const oldCSICore = [4, 11, 1, 6];
    //const preferredElectives = [25, 7, 9, 21, 32, 20, 21, 17];
    let courses = userCourses;
    const completedElectives = courses.filter(course => !oldCSICore.includes(course)).length;
    let neededCourses = 5 - completedElectives;
    console.log(dme);
    if (!dme){
        newSchedule = addCourseToSchedule(14, [], newSchedule, classesPerSemester)
        neededCourses -= 1;
    }
    courses.push(14)

    for(const course of oldCSICore){
        if(!courses.includes(course)){
            const prereqs = await getPrereqs(course)
            for (const prereq of prereqs){
                if(!courses.includes(prereq)){
                    newSchedule = addCourseToSchedule(prereq, [], newSchedule, classesPerSemester)
                    courses.push(prereq)
                }
            }
            newSchedule = addCourseToSchedule(course, prereqs, newSchedule, classesPerSemester)
            courses.push(course)
        }
    }

    while (neededCourses > 0){
        const randomCourse = preferredElectives[Math.floor(Math.random() * preferredElectives.length)]
        if(!courses.includes(randomCourse)){
            let prereqs = await getPrereqs(randomCourse)
            if (dme){
                const newPreReq = prereqs.filter(course => course !== 14);
                prereqs = newPreReq;
            }
            for (const prereq of prereqs){
                if(!courses.includes(prereq)){
                    if(neededCourses === 1){
                        break
                    }
                    newSchedule = addCourseToSchedule(prereq, [], newSchedule, classesPerSemester)
                    courses.push(prereq)
                    neededCourses -= 1;
                } 
            }
            newSchedule = addCourseToSchedule(randomCourse, prereqs, newSchedule, classesPerSemester)
            courses.push(randomCourse)
            neededCourses -= 1;
        }
    }
    newSchedule = addCourseToSchedule(51, [], newSchedule, classesPerSemester)
    
    return newSchedule
}

const addCourseToSchedule= (course, prereqs, schedule, classesPerSemester) =>{
    for (let i = 0; i < schedule.length; i++) {
        const semester = schedule[i];

        let prereqsSatisfied = true;

        for (const prereq of prereqs) {
            if (prereq === 14) {
                continue;
            }
            const isSatisfied = schedule.slice(0, i).some(prevSemester => prevSemester.includes(prereq));
            if (!isSatisfied) {
                prereqsSatisfied = false;
                break;
            }
        }

        if (prereqsSatisfied && semester.length < classesPerSemester) {
            semester.push(course);
            return schedule;
        }
    }
    schedule.push([course]);
    return schedule;
}

const getPrereqs = async (course) =>{
    try{
        const [results] = await db.query(
            `SELECT prereq_course_id
            FROM course_prerequisites
            WHERE course_id = ?`,
            [course]
        );
        const prereqs = results.map(row => row.prereq_course_id);
        return prereqs;
    }
    catch(error){
        console.log("Error finding prereqs", error)
        return []
    }
}

const createDatedSchedule = async (startYear, startSemester, baseSchedule, userID, classesPerSemester) =>{
    let dateSchedule = [];
    let currentYear = parseInt(startYear);
    let currentSemester = startSemester;
    for(const semester of baseSchedule){
        let numCourses = 0;
        for(const course of semester){
            try{
                const [courseInfo] = await db.query(
                    `SELECT id, department, title, number, credits
                    FROM courses
                    WHERE id = ?`,
                    [course]
                )
                dateSchedule.push({
                    id: course,
                    department: courseInfo[0].department,
                    title: courseInfo[0].title,
                    number: courseInfo[0].number,
                    year: currentYear,
                    semester: currentSemester,
                    grade: null,
                    completed: 'no',
                    user_id: parseInt(userID) || null,
                    credits: courseInfo[0].credits,
                })
            }
            catch(error){
                console.log("Error retrieving course details for ",course, error);
            }
        }
        currentSemester = (currentSemester === 'Spring') ? "Fall" : "Spring"
        if (currentSemester === "Spring"){
            currentYear += 1;
        }
    }
    return dateSchedule;
}

const getUpcomingSemester = () => {
    const now = new Date(); 
    const currentYear = now.getFullYear(); 
    const currentMonth = now.getMonth() + 1; 

    let nextSemester;
    let nextYear = currentYear;

    if (currentMonth >= 8 && currentMonth <= 12) {
        nextSemester = "Spring";
        nextYear = currentYear + 1;
    } else {
        nextSemester = "Fall";
    } 
    return { year: nextYear, semester: nextSemester };
}

const extractCourseIDs = (courseDetails) =>{
    return courseDetails.map(course => course.id ?? course.course_id)
}

function isEarlierSemester(year1, semester1, year2, semester2) {
    const semesterOrder = ["Spring", "Fall"];

    if (year1 < year2) {
        return true;
    }
    if (year1 > year2) {
        return false;
    }

    return semesterOrder.indexOf(semester1) < semesterOrder.indexOf(semester2);
}

module.exports = {
    createFullSchedule,
    createDatedSchedule,
    getUpcomingSemester,
    extractCourseIDs,
    isEarlierSemester
};