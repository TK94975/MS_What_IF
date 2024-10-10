//CSS
import 'bootstrap/dist/css/bootstrap.css'; // Import Bootstrap CSS
import '../styles.css';
//Packages 
import {React, useState, useEffect} from "react";

const MajorConcentrationSelector = props => {
    const [majors, setMajors] = useState([
        ["cs", "Computer Science"],
        ["ece", "Electrical and Computer Engineering"],
    ])
    const [concentrations, setConcentrations] = useState([
        ['ai', 'Artificial Intelligence'],
        ['systems', 'Computer Systems']
    ])
    return (
        <div className='container'>
            <div className='row d-flex flex-row'>
                <div className='col-4'>
                    <p>Major:</p>
                </div>
                <div className='col-8'>
                    <select name="majors" id="majors">
                        {majors.map((major) => {
                            return (
                                <option value={major[0]}>{major[1]}</option>
                            )
                        })}
                    </select>
                </div>
            </div>
            <div className='row'>
                <div className='col-4'>
                    <p>Concentration:</p>
                </div>
                <div className='col-8'>
                    <select name="concentrations" id="concentrations">
                        {concentrations.map((concentration) => {
                            return (
                                <option value={concentration[0]}>{concentration[1]}</option>
                            )
                        })}
                    </select>
                </div>
            </div>
        </div>
    )
}

export default MajorConcentrationSelector