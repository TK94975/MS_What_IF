import axios from 'axios';
import React, { useState, useContext, useEffect} from 'react';
import {Table} from 'react-bootstrap';
import { UserContext } from '../context/userContext';

const ProgressTable = () => {
    const {
        isUserSignedIn,
        selectedConcentration,
        courses,
    } = useContext(UserContext)

    const[concentrationRequirements, setConcentrationRequirements] = useState({})
    const [userProgress, setUserProgress] = useState({});
    const [userProgressProjected, setUserProgressProjected] = useState({});

    const eceConcentrations = [
        'Signal Processing and Communications',
        'Electronic Circuits and Systems',
        'Control and Computer Systems',
      ];
      
    const isECE = eceConcentrations.includes(selectedConcentration);

    const getConcentrationRequirements = async () =>{
        console.log("Getting concentration requirements");
        try{
            const response = await axios.post(
                `${process.env.REACT_APP_SERVER_URL}/progress/concentration_requirements`, 
                {selectedConcentration});
            setConcentrationRequirements(response.data);
        }
        catch(error){
            console.log(error.status, error.data);
        }

    };
    const getUserProgress = async (calculationType) => {
        console.log(`Getting user progress for ${calculationType}`);
        try {
          const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/progress/completed_progress`, {
            user_courses: courses,
            user_concentration: selectedConcentration,
            calculation_type: calculationType,
          });
      
          console.log(response.data);
      
          if (calculationType === 'current') {
            setUserProgress(response.data);
          } else if (calculationType === 'projected') {
            setUserProgressProjected(response.data);
          }
        } catch (error) {
          console.log(`Error getting user progress (${calculationType})`, error);
        }
    };

    useEffect(() => {
        getConcentrationRequirements();
        getUserProgress('current');
        getUserProgress('projected');
    }, [selectedConcentration, isUserSignedIn]);
    
    useEffect(() => {
        getUserProgress('current');
        getUserProgress('projected');
    }, [courses]);

    useEffect(()=>{
        if(!isUserSignedIn){
            setUserProgress([]);
        }
    },[isUserSignedIn]);

    const getGPAColor = (gpa) =>({
        color: 'white',
        backgroundColor: gpa >= 3.0 ? 'green' : 'red',
    });

    const formatGPA = (gpa) => {
        return gpa !== undefined && !isNaN(gpa) ? gpa.toFixed(2) : '--';
    };

    const getCreditColor = (completed, required) => ({
        color: completed >= required ? 'white' : 'black',
        backgroundColor: completed >= required ? 'green' : 'yellow',
    });

    const formatCredits = (credits) => {
        return credits !== undefined && !isNaN(credits) ? credits : '--'
    };

    return (
        <div>
            <h1>Progress</h1>
            <Table>
                <thead>
                <tr>
                    <th></th>
                    <th>Requirements</th>
                    <th>Completed</th>
                    <th>GPA</th>
                    <th>Projected Completed</th>
                    <th>Projected GPA</th>
                </tr>
                </thead>
                <tbody>
                {isECE ? (
                    <>
                    {/* Depth */}
                    <tr>
                        <th>Depth</th>
                        <td>{formatCredits(concentrationRequirements.depth)} credits</td>
                        {/* Current Progress */}
                        <td style={getCreditColor(userProgress.depth?.completed_credits || 0, concentrationRequirements.depth || 0)}>
                        {formatCredits(userProgress.depth?.completed_credits)} credits
                        </td>
                        <td style={getGPAColor(userProgress.depth?.gpa || 0)}>
                        {formatGPA(userProgress.depth?.gpa)}
                        </td>
                        {/* Projected Progress */}
                        <td style={getCreditColor(userProgressProjected.depth?.completed_credits || 0, concentrationRequirements.depth || 0)}>
                        {formatCredits(userProgressProjected.depth?.completed_credits)} credits
                        </td>
                        <td style={getGPAColor(userProgressProjected.depth?.gpa || 0)}>
                        {formatGPA(userProgressProjected.depth?.gpa)}
                        </td>
                    </tr>
                    {/* Breadth */}
                    <tr>
                        <th>Breadth</th>
                        <td>{formatCredits(concentrationRequirements.breadth)} credits</td>
                        {/* Current Progress */}
                        <td style={getCreditColor(userProgress.breadth?.completed_credits || 0, concentrationRequirements.breadth || 0)}>
                        {formatCredits(userProgress.breadth?.completed_credits)} credits
                        </td>
                        <td style={getGPAColor(userProgress.breadth?.gpa || 0)}>
                        {formatGPA(userProgress.breadth?.gpa)}
                        </td>
                        {/* Projected Progress */}
                        <td style={getCreditColor(userProgressProjected.breadth?.completed_credits || 0, concentrationRequirements.breadth || 0)}>
                        {formatCredits(userProgressProjected.breadth?.completed_credits)} credits
                        </td>
                        <td style={getGPAColor(userProgressProjected.breadth?.gpa || 0)}>
                        {formatGPA(userProgressProjected.breadth?.gpa)}
                        </td>
                    </tr>
                    {/* Math/Physics */}
                    <tr>
                        <th>Math/Physics</th>
                        <td>{formatCredits(concentrationRequirements.mathPhysics)} credits</td>
                        {/* Current Progress */}
                        <td style={getCreditColor(userProgress.mathPhysics?.completed_credits || 0, concentrationRequirements.mathPhysics || 0)}>
                        {formatCredits(userProgress.mathPhysics?.completed_credits)} credits
                        </td>
                        <td style={getGPAColor(userProgress.mathPhysics?.gpa || 0)}>
                        {formatGPA(userProgress.mathPhysics?.gpa)}
                        </td>
                        {/* Projected Progress */}
                        <td style={getCreditColor(userProgressProjected.mathPhysics?.completed_credits || 0, concentrationRequirements.mathPhysics || 0)}>
                        {formatCredits(userProgressProjected.mathPhysics?.completed_credits)} credits
                        </td>
                        <td style={getGPAColor(userProgressProjected.mathPhysics?.gpa || 0)}>
                        {formatGPA(userProgressProjected.mathPhysics?.gpa)}
                        </td>
                    </tr>
                    {/* Technical Elective */}
                    <tr>
                        <th>Technical Elective</th>
                        <td>{formatCredits(concentrationRequirements.technicalElective)} credits</td>
                        {/* Current Progress */}
                        <td style={getCreditColor(userProgress.technicalElective?.completed_credits || 0, concentrationRequirements.technicalElective || 0)}>
                        {formatCredits(userProgress.technicalElective?.completed_credits)} credits
                        </td>
                        <td style={getGPAColor(userProgress.technicalElective?.gpa || 0)}>
                        {formatGPA(userProgress.technicalElective?.gpa)}
                        </td>
                        {/* Projected Progress */}
                        <td style={getCreditColor(userProgressProjected.technicalElective?.completed_credits || 0, concentrationRequirements.technicalElective || 0)}>
                        {formatCredits(userProgressProjected.technicalElective?.completed_credits)} credits
                        </td>
                        <td style={getGPAColor(userProgressProjected.technicalElective?.gpa || 0)}>
                        {formatGPA(userProgressProjected.technicalElective?.gpa)}
                        </td>
                    </tr>
                    {/* Thesis/Project */}
                    <tr>
                        <th>Thesis/Project</th>
                        <td>{formatCredits(concentrationRequirements.thesis || concentrationRequirements.project)} credits</td>
                        {/* Current Progress */}
                        <td style={getCreditColor(userProgress.thesisProject?.completed_credits || 0, (concentrationRequirements.thesis || concentrationRequirements.project) || 0)}>
                        {formatCredits(userProgress.thesisProject?.completed_credits)} credits
                        </td>
                        <td style={getGPAColor(userProgress.thesisProject?.gpa || 0)}>
                        {formatGPA(userProgress.thesisProject?.gpa)}
                        </td>
                        {/* Projected Progress */}
                        <td style={getCreditColor(userProgressProjected.thesisProject?.completed_credits || 0, (concentrationRequirements.thesis || concentrationRequirements.project) || 0)}>
                        {formatCredits(userProgressProjected.thesisProject?.completed_credits)} credits
                        </td>
                        <td style={getGPAColor(userProgressProjected.thesisProject?.gpa || 0)}>
                        {formatGPA(userProgressProjected.thesisProject?.gpa)}
                        </td>
                    </tr>
                    </>
                ) : (
                    <>
                    {/* Core */}
                    <tr>
                        <th>Core</th>
                        <td>{formatCredits(concentrationRequirements.core)} credits</td>
                        {/* Current Progress */}
                        <td style={getCreditColor(userProgress.core?.completed_credits || 0, concentrationRequirements.core || 0)}>
                        {formatCredits(userProgress.core?.completed_credits)} credits
                        </td>
                        <td style={getGPAColor(userProgress.core?.gpa || 0)}>
                        {formatGPA(userProgress.core?.gpa)}
                        </td>
                        {/* Projected Progress */}
                        <td style={getCreditColor(userProgressProjected.core?.completed_credits || 0, concentrationRequirements.core || 0)}>
                        {formatCredits(userProgressProjected.core?.completed_credits)} credits
                        </td>
                        <td style={getGPAColor(userProgressProjected.core?.gpa || 0)}>
                        {formatGPA(userProgressProjected.core?.gpa)}
                        </td>
                    </tr>
                    {/* Concentration */}
                    {selectedConcentration !== 'Old Computer Science' && (
                        <tr>
                        <th>Concentration</th>
                        <td>{formatCredits(concentrationRequirements.concentration)} credits</td>
                        {/* Current Progress */}
                        <td style={getCreditColor(userProgress.concentration?.completed_credits || 0, concentrationRequirements.concentration || 0)}>
                            {formatCredits(userProgress.concentration?.completed_credits)} credits
                        </td>
                        <td style={getGPAColor(userProgress.concentration?.gpa || 0)}>
                            {formatGPA(userProgress.concentration?.gpa)}
                        </td>
                        {/* Projected Progress */}
                        <td style={getCreditColor(userProgressProjected.concentration?.completed_credits || 0, concentrationRequirements.concentration || 0)}>
                            {formatCredits(userProgressProjected.concentration?.completed_credits)} credits
                        </td>
                        <td style={getGPAColor(userProgressProjected.concentration?.gpa || 0)}>
                            {formatGPA(userProgressProjected.concentration?.gpa)}
                        </td>
                        </tr>
                    )}
                    {/* Elective */}
                    <tr>
                        <th>Elective</th>
                        <td>{formatCredits(concentrationRequirements.elective)} credits</td>
                        {/* Current Progress */}
                        <td style={getCreditColor(userProgress.elective?.completed_credits || 0, concentrationRequirements.elective || 0)}>
                        {formatCredits(userProgress.elective?.completed_credits)} credits
                        </td>
                        <td style={getGPAColor(userProgress.elective?.gpa || 0)}>
                        {formatGPA(userProgress.elective?.gpa)}
                        </td>
                        {/* Projected Progress */}
                        <td style={getCreditColor(userProgressProjected.elective?.completed_credits || 0, concentrationRequirements.elective || 0)}>
                        {formatCredits(userProgressProjected.elective?.completed_credits)} credits
                        </td>
                        <td style={getGPAColor(userProgressProjected.elective?.gpa || 0)}>
                        {formatGPA(userProgressProjected.elective?.gpa)}
                        </td>
                    </tr>
                    {/* Project */}
                    <tr>
                        <th>Project</th>
                        <td>{formatCredits(concentrationRequirements.project)} credits</td>
                        {/* Current Progress */}
                        <td style={getCreditColor(userProgress.project?.completed_credits || 0, concentrationRequirements.project || 0)}>
                        {formatCredits(userProgress.project?.completed_credits)} credits
                        </td>
                        <td style={getGPAColor(userProgress.project?.gpa || 0)}>
                        {formatGPA(userProgress.project?.gpa)}
                        </td>
                        {/* Projected Progress */}
                        <td style={getCreditColor(userProgressProjected.project?.completed_credits || 0, concentrationRequirements.project || 0)}>
                        {formatCredits(userProgressProjected.project?.completed_credits)} credits
                        </td>
                        <td style={getGPAColor(userProgressProjected.project?.gpa || 0)}>
                        {formatGPA(userProgressProjected.project?.gpa)}
                        </td>
                    </tr>
                    </>
                )}
                </tbody>
            </Table>
            </div>
    );
}

export default ProgressTable;