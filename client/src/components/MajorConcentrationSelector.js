import React, { useContext } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "../styles.css";
import { UserContext } from "../context/userContext";
import {ColorByconcentration,ColorByMajor} from "./ColorBy";

const MajorConcentrationSelector = () => {
    const {
        selectedMajor,
        handleMajorChange,
        selectedConcentration,
        handleConcentrationChange,
        userStartYear,
        setUserStartYear,
        userStartSemester,
        setUserStartSemester,
        passedDME,
        setPassedDME
    } = useContext(UserContext)

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
        const semesterOptions = ['Spring','Summer','Fall','Winter'];
        const yearOptions = [2022,2023,2024,2025,2026,2027];

        const handleUserStartYear = (year) =>{
            setUserStartYear(year);
        }
        const handleUserStartSemester = (semester) =>{
            setUserStartSemester(semester);
        }


    return (
        <Container>
        <Row>
            <ColorByMajor major={selectedMajor}>
            <h3 >Major</h3>
            <Form.Group className="mb-3">
            <Col sm={9}>
                <Form.Select 
                    aria-labelledby="major-label"
                    value={selectedMajor} 
                    onChange={(e) => handleMajorChange(e.target.value)}
                >
                    {majors.map((major) => (
                    <option key={major[0]} value={major[0]}>
                    {major[1]}
                    </option>
                ))}
                </Form.Select>
            </Col>
            </Form.Group>
            </ColorByMajor>
        </Row>
        <Row>
            <ColorByconcentration concentration={selectedConcentration}>
            <h3 >Concentration</h3>
            <Form.Group className="mb-3">
            <Col sm={9}>
                <Form.Select
                aria-labelledby="concentration-label"
                value={selectedConcentration}
                onChange={(e) => handleConcentrationChange(e.target.value)}
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
            </ColorByconcentration>
        </Row>
        <Row>
            <ColorByMajor major={selectedMajor}>
                <h3>Starting Semester</h3>
                <Form.Group as={Row} className="mb-3">
                    <Col sm={6}>
                        <Form.Select
                            value={userStartYear}
                            onChange={(e) => handleUserStartYear(e.target.value)}
                            required
                        >
                            <option value="" disabled>Year</option>
                            {yearOptions.map((value) => (
                                <option key={value} value={value}>
                                    {value}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>
                    <Col sm={6}>
                        <Form.Select
                            value={userStartSemester}
                            onChange={(e) => handleUserStartSemester(e.target.value)}
                            required
                        >
                            <option value="" disabled>Semester</option>
                            {semesterOptions.map((value) => (
                                <option key={value} value={value}>
                                    {value}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>
                </Form.Group>
            </ColorByMajor>
        </Row>
        <Row>
            <ColorByconcentration concentration={selectedConcentration}>
                <Col sm={8}>
                    <h3>Discrete Mathematics Exam</h3>
                    <Form.Group as={Row} className="mb-3 align-items-center">
                        <Col>
                            <Form.Check
                                type="checkbox"
                                label="Passed?"
                                checked={passedDME}
                                onChange={() => setPassedDME(!passedDME)}
                            />
                        </Col>
                    </Form.Group>
                </Col>
            </ColorByconcentration>
        </Row>
        </Container>
    );
};

export default MajorConcentrationSelector;