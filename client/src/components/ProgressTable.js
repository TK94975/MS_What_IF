import axios from 'axios';
import React, { useState, useContext, useEffect} from 'react';
import {Table} from 'react-bootstrap';
import { UserContext } from '../context/userContext';

const ProgressTable = () => {
    const {
        isUserSignedIn,
        selectedConcentration,
    } = useContext(UserContext)

    const[concentrationRequirements, setConcentrationRequirements] = useState({})

    const getConcentrationRequirements = async () =>{
        console.log(selectedConcentration);
        try{
            const response = await axios.post(
                `${process.env.REACT_APP_SERVER_URL}/progress/concentration_requirements`, 
                {selectedConcentration});
            console.log("Server: ", response.data)
            setConcentrationRequirements(response.data);
        }
        catch(error){
            console.log(error.status, error.data);
        }

    };

    useEffect(()=>{
        getConcentrationRequirements();
    },[selectedConcentration, isUserSignedIn])

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
            <tr></tr>
            <tr>
                <th>Core</th>
                <td>{concentrationRequirements.core} credits</td>
            </tr>
            <tr>
                <th>Concentration</th>
                <td>{concentrationRequirements.concentration} credits</td>
            </tr>
            <tr>
                <th>Elective</th>
                <td>{concentrationRequirements.elective} credits</td>
            </tr>
            <tr>
                <th>Project</th>
                <td>{concentrationRequirements.project} credits</td>
            </tr>
            </tbody>
        </Table>
        </div>
    );
}

export default ProgressTable;