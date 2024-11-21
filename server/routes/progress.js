var express = require('express');
var router = express.Router();

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

router.post('/completed_progress', (req, res) => {
    const oldCompSciCore = [4, 11, 1, 6, 12, 37];
    const oldCompSciProject = [51,52,53,54,55,59,60];
    const user_courses = req.body.courses;
    const user_concentration = req.body.selectedConcentration;

    let core = 0;
    let comcore = 0;
    let coreGPA = 0;
    let comcoreGPA = 0;

    let concentration = 0;
    let comconcentration = 0;
    let concentrationGPA = 0;
    let comconcentrationGPA = 0; 

    let elective = 0;
    let comelective = 0;
    let electiveGPA = 0
    let comelectiveGPA = 0

    let project = 0;
    let comproject = 0;
    let projectGPA = 0;
    let comprojectGPA = 0;

    if (user_concentration === "Old Computer Science"){
        user_courses.forEach((course) => {
            // Checking for core classes
            if (oldCompSciCore.includes(course.id)){
                if(convertGrade(course.grade) >= 3){
                    if(course.completed === "yes"){
                        if(comcore <15){
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
                        if(core < 15){
                            core += course.credits;
                            coreGPA += course.credits * convertGrade(course.grade);
                        } else {
                            elective += course.credits;
                            electiveGPA += course.credits * convertGrade(course.grade);
                        }
                    }
                }
            }
            // Checking for project or thesis
            else if (oldCompSciProject.includes(course.id)){
                if(course.completed === 'yes'){
                    if(comproject < 4){
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
                    if(project < 4){
                        project += course.credits;
                        projectGPA += course.credits * convertGrade(course.grade);
                    } else {
                        elective += course.credits;
                        electiveGPA += projectGPA += course.credits * convertGrade(course.grade);
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
                } else {
                    if(project < 4){
                        project += course.credits;
                        projectGPA += course.credits * convertGrade(course.grade);
                    } else {
                        elective += course.credits;
                        electiveGPA += projectGPA += course.credits * convertGrade(course.grade);
                    }
                }
            }
        });
        console.log(comcore);
        console.log(comcoreGPA/comcore || 0);
        console.log(core);
        console.log(coreGPA/core || 0);

        console.log(comproject);
        console.log(comprojectGPA/comproject || 0);
        console.log(project);
        console.log(projectGPA/project);

        console.log(comelective);
        console.log(comelectiveGPA/comelective || 0);
        console.log(elective);
        console.log(electiveGPA/elective || 0);

        const progress = {completedCore: comcore, completedConcentration: 0, completedElective: comelective, completedProject: comproject, 
                        completedCoreGPA: comcoreGPA/comcore.toFixed(2) || 0, completedConcentrationGPA: 0,
                        completedElectiveGPA: comelectiveGPA/comelective.toFixed(2)  || 0, completedProjectGPA: comprojectGPA/comproject.toFixed(2)  || 0,
                        Core: core, Concentration: concentration, Elective: elective, Project: project,
                        CoreGPA: coreGPA/core.toFixed(2)  || 0, ConcentrationGPA: concentrationGPA/concentration.toFixed(2)  || 0, 
                        ElectiveGPA: electiveGPA/elective.toFixed(2)  || 0, ProjectGPA: projectGPA/project.toFixed(2)  || 0,
                        }

        res.status(200).json(progress);
    }
});

module.exports = router;
