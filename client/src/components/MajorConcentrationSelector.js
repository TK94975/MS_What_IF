//CSS
import 'bootstrap/dist/css/bootstrap.css'; // Import Bootstrap CSS
import { Container, Row, Col } from 'react-bootstrap';
import '../styles.css';
//Packages 
import {React, useState, useEffect} from "react";

const MajorConcentrationSelector = props => {
    const [majors, setMajors] = useState([
    ["cs", "Computer Science"],
    ["ece", "Electrical and Computer Engineering"],
    ]);
    const [concentrations, setConcentrations] = useState({
    cs: [
        ['ai', 'Artificial Intelligence'],
        ['systems', 'Computer Systems'],
        ['theory', 'Theoretical CS'],
        ['old', 'Pre-2024']
    ],
    ece: [
        ['none', 'None']
    ],
    });
    const [selectedMajor, setSelectedMajor] = useState('cs');
    const [selectedConcentration, setSelectedConcentration] = useState('');


    const handleMajorChange = (e) => {
        setSelectedMajor(e.target.value);
        setSelectedConcentration('');
    };

    const handleConcentrationChange = (e) => {
        setSelectedConcentration(e.target.value);
    };

    return (
        <Container>
        <Row>
            <Col xs={4}>
            <label htmlFor="majors">Major:</label>
            </Col>
            <Col xs={8}>
            <select
                name="majors"
                id="majors"
                value={selectedMajor}
                onChange={handleMajorChange}
            >
                {majors.map((major) => (
                <option key={major[0]} value={major[0]}>
                    {major[1]}
                </option>
                ))}
            </select>
            </Col>
        </Row>
        <Row>
            <Col xs={4}>
            <label htmlFor="concentrations">Concentration:</label>
            </Col>
            <Col xs={8}>
            <select
                name="concentrations"
                id="concentrations"
                value={selectedConcentration}
                onChange={handleConcentrationChange}
                disabled={!concentrations[selectedMajor]?.length}
            >
                <option value="" disabled>
                Select a concentration
                </option>
                {concentrations[selectedMajor]?.map((concentration) => (
                <option key={concentration[0]} value={concentration[0]}>
                    {concentration[1]}
                </option>
                ))}
            </select>
            </Col>
        </Row>
        </Container>
    );
};

export default MajorConcentrationSelector