const db = require('../config/db');

const preferredElectives = [25, 7, 9, 21, 32, 20, 21, 17];

const createFullSchedule = async (userCourses, userProgress, concentration, classesPerSemester, dme) =>{
    let newSchedule = [[]]
    if (concentration === 'Old Computer Science'){
        newSchedule = await createFullOldCSISchedule(userCourses, classesPerSemester, dme, newSchedule)
    }
    else if(concentration === 'Theoretical Computer Science' || 'Systems' || 'Artificial Intelligence and Machine Learning'){
        newSchedule = await createFullCSISchedule(userCourses, userProgress, concentration, classesPerSemester, dme, newSchedule);
    }
    return newSchedule;
}

const createFullCSISchedule = async (userCourses, userProgress, concentration, classesPerSemester, dme, schedule) =>{
    let newSchedule = schedule;
    let courses = userCourses;
    console.log("courses")
    const coreCourses = await getCSICoreReqs();
    const conCourses = await getCSIConcentrationReqs(concentration);
    const breadthReqs = await getCSIBreadthReqs();

    const electiveCompleted = userProgress?.elective?.completed_credits/3 || 0;
    const conCoreCredits = userProgress?.concentration?.completed_credits || 0;

    let neededCourses = 5 - electiveCompleted ;
    console.log("Needed courses", neededCourses)
    if (!dme){
        if(!courses.includes(14)){
            newSchedule = addCourseToSchedule(14, [], newSchedule, classesPerSemester)
            console.log("Added DME")
            neededCourses -= 1;
            console.log("Needed courses", neededCourses)  
        
        } 
    }
    courses.push(14) 

    if(userProgress?.requirementsMet?.coreCourses === false || userProgress?.requirementsMet?.coreCourses == null ){
        console.log("core requirement not met")
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
                console.log("added core:", course)
            }
        }
    }

    if(userProgress?.requirementsMet?.concentrationCoreCourses === false || userProgress?.requirementsMet?.concentrationCoreCourses == null){
        let credits = conCoreCredits;
        //console.log("Credits", credits);
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
                console.log("added concentration:", randomCourse)
                credits += 3;
            }
        }
    }

    console.log("Needed courses", neededCourses);
    if(userProgress?.requirementsMet?.breadthRequirement === false || userProgress?.requirementsMet?.breadthRequirement == null){
        ({ newSchedule, courses, neededCourses } = await addBreadthCourse(breadthReqs[0], courses, newSchedule, classesPerSemester, neededCourses));
        console.log("Needed courses", neededCourses);
        ({ newSchedule, courses, neededCourses } = await addBreadthCourse(breadthReqs[1], courses, newSchedule, classesPerSemester, neededCourses));
        console.log("Needed courses", neededCourses);
        ({ newSchedule, courses, neededCourses } = await addBreadthCourse(breadthReqs[2], courses, newSchedule, classesPerSemester, neededCourses));
        console.log("Needed courses", neededCourses);
    }
    

    while (neededCourses > 0){
        console.log("Elective requirement not met")
        const availableElectives = preferredElectives.filter(course => !courses.includes(course));
        const randomCourse = availableElectives[Math.floor(Math.random() * availableElectives.length)];
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
            console.log("added elective", randomCourse);
            neededCourses -= 1;
        }
        console.log("Needed courses", neededCourses);
    }

    if(userProgress?.requirementsMet?.project === false || userProgress?.requirementsMet?.project == null){
        console.log("Project requirement not met")
        newSchedule = addCourseToSchedule(51, [], newSchedule, classesPerSemester)
    }
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

const getCSIBreadthReqs = async () => {
    const requiredBreadth = ['Artificial Intelligence and Machine Learning', 'Systems', 'Theoretical Computer Science'];
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

const addBreadthCourse = async (breadthList, courses, newSchedule, classesPerSemester, neededCourses) => {
    const availableCourses = breadthList.filter(course => !courses.includes(course));
    const randomCourse = availableCourses[Math.floor(Math.random() * availableCourses.length)];

    const prereqs = await getPrereqs(randomCourse);
    for (const prereq of prereqs) {
        if (!courses.includes(prereq)) {
            newSchedule = addCourseToSchedule(prereq, [], newSchedule, classesPerSemester);
            console.log("added breadth prereq", prereq)
            courses.push(prereq);
            neededCourses -= 1;
        }
    }
    newSchedule = addCourseToSchedule(randomCourse, prereqs, newSchedule, classesPerSemester);
    courses.push(randomCourse);
    neededCourses -= 1;
    console.log("Added Breadth Course", randomCourse);
    return { newSchedule, courses, neededCourses };
}

const createFullOldCSISchedule = async (userCourses, classesPerSemester, dme, schedule) =>{
    let newSchedule = schedule;
    const oldCSICore = [4, 11, 1, 6];
    //const preferredElectives = [25, 7, 9, 21, 32, 20, 21, 17];
    let courses = userCourses;
    const completedElectives = courses.filter(course => !oldCSICore.includes(course)).length;
    let neededCourses = 5 - completedElectives;
    if (!dme){
        if(!courses.includes(14)){
            newSchedule = addCourseToSchedule(14, [], newSchedule, classesPerSemester)
            neededCourses -= 1;
            courses.push(14)
        }
    }
    
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
    if(!courses.includes(51)){
        newSchedule = addCourseToSchedule(51, [], newSchedule, classesPerSemester)
    }
    
    
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
                    grade: 'B',
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