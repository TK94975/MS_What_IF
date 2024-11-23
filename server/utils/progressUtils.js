const db = require('../config/db'); // Ensure this path is correct and db connection is set up

const convertGrade = (letterGrade) =>{
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
        [null, 3.0], //Assume a B in a class
    ])
    return conversion.get(letterGrade);
}

const getCourseRequirements = (user_concentration) =>{
    // Replace with database stuff eventually
    const courseRequirements = new Map();
    courseRequirements.set("Artificial Intelligence and Machine Learning", {
        core: [4, 11],
        concentration: [21,25,26], 
        chosenElectiveOne: [1,6,9,5,17,18],
        chosenElectiveTwo: [12,20,37,14,19,27],
        project: [51,52,53,54,55,59,60],
    })
    courseRequirements.set("Systems", {
        core: [4, 11],
        concentration: [1,6,9], 
        chosenElectiveOne: [21,25,26,23,30,32,50],
        chosenElectiveTwo: [12,20,37,14,19,27],
        project: [51,52,53,54,55,59,60],
    })
    courseRequirements.set("Theoretical Computer Science", {
        core: [4, 11],
        concentration: [12,20,37], 
        chosenElectiveOne: [21,25,26,23,30,32,50],
        chosenElectiveTwo: [1,6,9,5,17,18],
        project: [51,52,53,54,55,59,60],
    })
    courseRequirements.set("Old Computer Science", {
        core: [4, 11, 1, 6, 12, 37],
        concentration: [], 
        chosenElectiveOne: [],
        chosenElectiveTwo: [],
        project: [51,52,53,54,55,59,60],
    })

    const response = courseRequirements.get(user_concentration);
    return response
}

const progressCalculator = async (user_courses, user_concentration) =>{
    const creditValues = new Map();
    creditValues.set("Artificial Intelligence and Machine Learning", {core: 7, concentration: 6, elective: 15, project: 3})
    creditValues.set("Systems", {core: "7", concentration: 6, elective: 15, project: 3})
    creditValues.set("Theoretical Computer Science", {core: 7, concentration: 6, elective: 15, project: 3})
    creditValues.set("Old Computer Science", {core: 13, concentration: 0, elective: 15, project: 3})

    // Getting different concentration requirements
    const requirementValues = getCourseRequirements(user_concentration);
    const chosenCore = requirementValues.core
    const chosenConcentration = requirementValues.concentration
    const chosenProject = requirementValues.project
    const chosenElectiveOne = requirementValues.chosenElectiveOne
    const chosenElectiveTwo = requirementValues.chosenElectiveTwo

    // Core classes
    let core = 0;
    let comcore = 0;
    let coreGPA = 0;
    let comcoreGPA = 0;

    // Concentration classes
    let concentration = 0;
    let comconcentration = 0;
    let concentrationGPA = 0;
    let comconcentrationGPA = 0; 

    // Elective classes
    let elective = 0;
    let comelective = 0;
    let electiveGPA = 0
    let comelectiveGPA = 0

    // Project class
    let project = 0;
    let comproject = 0;
    let projectGPA = 0;
    let comprojectGPA = 0;

    // CSI breadth requirement
    let csiElectiveOne = false;
    let csiElectiveTwo = false;
    let comcsiElectiveOne = false;
    let comcsiElectiveTwo = false;
    let breadth = 0;
    let combreadth = 0;

    user_courses.forEach((course) => {
        // Checking for core classes
        if (chosenCore.includes(course.id)){
            if(convertGrade(course.grade) >= 3){
                if(course.completed === "yes"){
                    if(comcore < creditValues.get(user_concentration).core){
                        comcore += course.credits;
                        comcoreGPA += course.credits * convertGrade(course.grade);
                        core += course.credits;
                        coreGPA += course.credits * convertGrade(course.grade);
                    } else {
                        comelective += course.credits;
                        comelectiveGPA += course.credits * convertGrade(course.grade);
                        elective += course.credits;
                        electiveGPA += course.credits * convertGrade(course.grade);
                    }
                } else{
                    if(core < creditValues.get(user_concentration).core){
                        core += course.credits;
                        coreGPA += course.credits * convertGrade(course.grade);
                    } else {
                        elective += course.credits;
                        electiveGPA += course.credits * convertGrade(course.grade);
                    }
                }
            }
        }

        // Checking for concentration
        else if (chosenConcentration.includes(course.id)){
            if(course.completed === 'yes'){
                if(comproject < creditValues.get(user_concentration).concentration){
                    comconcentration += course.credits;
                    comconcentrationGPA += course.credits * convertGrade(course.grade);
                    concentration += course.credits;
                    concentrationGPA += course.credits * convertGrade(course.grade);
                } else {
                    comelective += course.credits;
                    comelectiveGPA += course.credits * convertGrade(course.grade);
                    elective += course.credits;
                    electiveGPA += course.credits * convertGrade(course.grade);
                }
            } else {
                if(project < creditValues.get(user_concentration).concentration){
                    concentration += course.credits;
                    concentrationGPA += course.credits * convertGrade(course.grade);
                } else {
                    elective += course.credits;
                    electiveGPA +=  course.credits * convertGrade(course.grade);
                }
            }
        }
        // Checking for project or thesis
        else if (chosenProject.includes(course.id)){
            if(course.completed === 'yes'){
                if(comproject < creditValues.get(user_concentration).project){
                    comproject += course.credits;
                    comprojectGPA += course.credits * convertGrade(course.grade);
                    project += course.credits;
                    projectGPA += course.credits * convertGrade(course.grade);
                } else {
                    comelective += course.credits;
                    comelectiveGPA += course.credits * convertGrade(course.grade);
                    elective += course.credits;
                    electiveGPA += course.credits * convertGrade(course.grade);
                }
            } else {
                if(project < creditValues.get(user_concentration).project){
                    project += course.credits;
                    projectGPA += course.credits * convertGrade(course.grade);
                } else {
                    elective += course.credits;
                    electiveGPA += course.credits * convertGrade(course.grade);
                }
            }
        }
        // Everything else is an elective
        else {
            if(course.completed === 'yes'){
                comelective += course.credits;
                comelectiveGPA += course.credits * convertGrade(course.grade);
                elective += course.credits;
                electiveGPA += course.credits * convertGrade(course.grade);
                if (chosenElectiveOne.includes(course.id)){
                    csiElectiveOne = true;
                    comcsiElectiveOne = true;
                }
                if (chosenElectiveTwo.includes(course.id)){
                    csiElectiveTwo = true
                    comcsiElectiveTwo = true;
                }
            } else {
                elective += course.credits;
                electiveGPA += course.credits * convertGrade(course.grade);
                if (chosenElectiveOne.includes(course.id)){
                    comcsiElectiveOne = true
                }
                if (chosenElectiveTwo.includes(course.id)){
                    comcsiElectiveTwo = true
                }
            }
        }
    });

    if (csiElectiveOne && csiElectiveTwo){
        breadth = 1;
    }
    if (comcsiElectiveOne && comcsiElectiveTwo){
        combreadth = 1;
    }

    const progress = {
        completedCore: comcore, 
        completedConcentration: comconcentration, 
        completedElective: comelective, 
        completedProject: comproject, 
        completedCoreGPA: comcoreGPA/comcore || 0,   
        completedConcentrationGPA: comconcentrationGPA/comconcentration || 0,
        completedElectiveGPA: comelectiveGPA/comelective || 0, 
        completedProjectGPA: comprojectGPA/comproject || 0,
        Core: core, Concentration: concentration, 
        Elective: elective, 
        Project: project,
        CoreGPA: coreGPA/core || 0, 
        ConcentrationGPA: concentrationGPA/concentration  || 0, 
        ElectiveGPA: electiveGPA/elective  || 0, 
        ProjectGPA: projectGPA/project  || 0,
        BreadthRequirement: breadth,
        comBreadthRequirement: combreadth,
        }
    return progress;
}

module.exports = { progressCalculator };