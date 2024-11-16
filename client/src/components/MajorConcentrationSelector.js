//CSS
import 'bootstrap/dist/css/bootstrap.css'; // Import Bootstrap CSS
import { Container, Row, Col, Form } from 'react-bootstrap';
import '../styles.css';
//Packages 
import {React, useState} from "react";

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
            <Form.Group as={Row}>
                <Form.Label column sm={3}>Major</Form.Label>
                <Col sm={9}>
                    <Form.Select
                    value={selectedMajor}
                    onChange={handleMajorChange}
                    >
                    {majors.map((major) => (
                    <option key={major[0]} value={major[0]}>
                    {major[1]}
                    </option>
                    ))}
                    </Form.Select>
                </Col>
            </Form.Group>

        </Row>
        <Row>
            <Form.Group as={Row}>
                <Form.Label column sm={3}>Concentration</Form.Label>
                <Col sm={9}>
                    <Form.Select
                    value={selectedConcentration}
                    onChange={handleConcentrationChange}
                    >
                    {concentrations[selectedMajor]?.map((concentration) => (
                    <option key={concentration[0]} value={concentration[0]}>
                    {concentration[1]}
                    </option>
                    ))}
                    </Form.Select>
                </Col>
            </Form.Group>
        </Row>
        </Container>
    );
};

export default MajorConcentrationSelector