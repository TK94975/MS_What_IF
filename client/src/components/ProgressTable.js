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
    const[userProgress, setUserProgress] = useState({});

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
    const getUserProgress = async () =>{
        console.log("Getting user requirements");
            try{
                const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/progress/completed_progress`, {
                    courses,
                    selectedConcentration,
                });
                console.log(response.data);
                setUserProgress(response.data);
            }
            catch(error){
                console.log("Error getting user progress", error);
            }
    };

    useEffect(()=>{
        getConcentrationRequirements();
        getUserProgress();
    },[selectedConcentration, isUserSignedIn])

    useEffect(()=>{
        getUserProgress();
    },[courses]);

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
                        <th>Projected</th>
                        <th>GPA</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>Core</th>
                        <td>{formatCredits(concentrationRequirements.core)} credits</td>
                        <td style={getCreditColor(userProgress.completedCore || 0, concentrationRequirements.core || 0)}>
                            {formatCredits(userProgress.completedCore)} credits
                        </td>
                        <td style={getGPAColor(userProgress.completedCoreGPA || 0)}>
                            {formatGPA(userProgress.completedCoreGPA)}
                        </td>
                        <td style={getCreditColor(userProgress.Core || 0, concentrationRequirements.core || 0)}>
                            {formatCredits(userProgress.Core)} credits
                        </td>
                        <td style={getGPAColor(userProgress.CoreGPA || 0)}>
                            {formatGPA(userProgress.CoreGPA)}
                        </td>
                    </tr>
                    {selectedConcentration !== 'Old Computer Science' && (
                        <tr>
                            <th>Concentration</th>
                            <td>{formatCredits(concentrationRequirements.concentration)} credits</td>
                            <td
                                style={getCreditColor(
                                    userProgress.completedConcentration || 0,
                                    concentrationRequirements.concentration || 0
                                )}
                            >
                                {formatCredits(userProgress.completedConcentration)} credits
                            </td>
                            <td style={getGPAColor(userProgress.completedConcentrationGPA || 0)}>
                                {formatGPA(userProgress.completedConcentrationGPA)}
                            </td>
                            <td
                                style={getCreditColor(
                                    userProgress.Concentration || 0,
                                    concentrationRequirements.concentration || 0
                                )}
                            >
                                {formatCredits(userProgress.Concentration)} credits
                            </td>
                            <td style={getGPAColor(userProgress.ConcentrationGPA || 0)}>
                                {formatGPA(userProgress.ConcentrationGPA)}
                            </td>
                        </tr>
                    )}
                    <tr>
                        <th>Elective</th>
                        <td>{formatCredits(concentrationRequirements.elective)} credits</td>
                        <td
                            style={getCreditColor(
                                userProgress.completedElective || 0,
                                concentrationRequirements.elective || 0
                            )}
                        >
                            {formatCredits(userProgress.completedElective)} credits
                        </td>
                        <td style={getGPAColor(userProgress.completedElectiveGPA || 0)}>
                            {formatGPA(userProgress.completedElectiveGPA)}
                        </td>
                        <td
                            style={getCreditColor(
                                userProgress.Elective || 0,
                                concentrationRequirements.elective || 0
                            )}
                        >
                            {formatCredits(userProgress.Elective)} credits
                        </td>
                        <td style={getGPAColor(userProgress.ElectiveGPA || 0)}>
                            {formatGPA(userProgress.ElectiveGPA)}
                        </td>
                    </tr>
                    <tr>
                        <th>Project</th>
                        <td>{formatCredits(concentrationRequirements.project)} credits</td>
                        <td
                            style={getCreditColor(
                                userProgress.completedProject || 0,
                                concentrationRequirements.project || 0
                            )}
                        >
                            {formatCredits(userProgress.completedProject)} credits
                        </td>
                        <td style={getGPAColor(userProgress.completedProjectGPA || 0)}>
                            {formatGPA(userProgress.completedProjectGPA)}
                        </td>
                        <td
                            style={getCreditColor(
                                userProgress.Project || 0,
                                concentrationRequirements.project || 0
                            )}
                        >
                            {formatCredits(userProgress.Project)} credits
                        </td>
                        <td style={getGPAColor(userProgress.ProjectGPA || 0)}>
                            {formatGPA(userProgress.ProjectGPA)}
                        </td>
                    </tr>
                </tbody>
            </Table>
        </div>
    );
}

export default ProgressTable;