const db = require('../config/db');

const createFullSchedule = async (concentration, classesPerSemester, dme) =>{
    let newSchedule = [[]]
    if (concentration === 'Old Computer Science'){
        newSchedule = await createFullOldCSISchedule(concentration, classesPerSemester, dme, newSchedule)
    }
    else {
        newSchedule = [];
    }
    return newSchedule;
}

const createFullOldCSISchedule = async (concentration, classesPerSemester, dme, schedule) =>{
    let newSchedule = schedule;
    const oldCSICore = [4, 11, 1, 6];
    const preferredElectives = [25, 7, 9, 21, 32, 20, 21, 17];
    let courses = [];
    let neededCourses = 5;

    console.log(dme)
    console.log(!dme)
    if (!dme){
        newSchedule = addCourseToSchedule(14, [], newSchedule, classesPerSemester)
        neededCourses -= 1;
    }
    courses.push(14)


    for(const course of oldCSICore){
        const prereqs = await getPrereqs(course)
        for (const prereq of prereqs){
            if(!courses.includes(prereq)){
                newSchedule = addCourseToSchedule(prereq, [], newSchedule, classesPerSemester)
                courses.push(prereq)
            }
        }
        newSchedule = addCourseToSchedule(course, prereqs, newSchedule, classesPerSemester)
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
                    user_id: parseInt(userID),
                    credits: courseInfo[0].credits,
                })
                numCourses += 1;
                if (numCourses === classesPerSemester){
                    numCourses = 0;
                    currentSemester = (currentSemester === 'Spring') ? "Fall" : "Spring"
                    if (currentSemester === "Spring"){
                        currentYear += 1;
                    }
                }
            }
            catch(error){
                console.log("Error retrieving course details for ",course, error);
            }
        }
    }
    return dateSchedule;
}

module.exports = {
    createFullSchedule,
    createDatedSchedule
};