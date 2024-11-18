import React from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "../styles.css";

const MajorConcentrationSelector = ({
onSignInSuccess,
signInMajor,
signInCon,
onMajorChange,
onConcentrationChange,
}) => {
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

const handleMajorChange = (e) => {
    const newMajor = e.target.value;
    onMajorChange(newMajor); // Update parent state
    onConcentrationChange(""); // Reset concentration in parent state
};

const handleConcentrationChange = (e) => {
    onConcentrationChange(e.target.value); // Update parent state
};

return (
    <Container>
    <Row>
        <Form.Group as={Row}>
        <Form.Label column sm={3}>
            Major
        </Form.Label>
        <Col sm={9}>
            <Form.Select value={signInMajor} onChange={handleMajorChange}>
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
            value={signInCon}
            onChange={handleConcentrationChange}
            disabled={!concentrations[signInMajor]?.length}
            >
            {concentrations[signInMajor]?.map((concentration) => (
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