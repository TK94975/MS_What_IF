import React, { useContext } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "../styles.css";
import { UserContext } from "../context/userContext";

const MajorConcentrationSelector = () => {
const {
    isUserSignedIn,
    setIsUserSignedIn,
    selectedMajor,
    handleMajorChange,
    selectedConcentration,
    handleConcentrationChange,
} = useContext
const majors = [
    ["CSI", "Computer Science"],
    ["ECE", "Electrical and Computer Engineering"],
];

const concentrations = {
    CSI: [
    ["Artificial Intelligence and Machine Learning", "Artificial Intelligence"],
    ["Systems", "Computer Systems"],
    ["Theoretical Computer Science", "Theoretical CS"],
    ["Old Computer Science", "Pre-2024"],
    ],
    ECE: [
    ["Signal Processing and Communications", "Signal Processing"],
    ["Electronic Circuits and Systems", "Electronic Circuits"],
    ["Control and Computer Systems", "Control Systems"],
    ],
};

return (
    <Container>
    <Row>
        <Form.Group as={Row}>
        <Form.Label column sm={3}>
            Major
        </Form.Label>
        <Col sm={9}>
            <Form.Select value={selectedMajor} onChange={handleMajorChange}>
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
        <Form.Label column sm={3}>
            Concentration
        </Form.Label>
        <Col sm={9}>
            <Form.Select
            value={selectedConcentration}
            onChange={handleConcentrationChange}
            disabled={!concentrations[selectedMajor]?.length}
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

export default MajorConcentrationSelector;