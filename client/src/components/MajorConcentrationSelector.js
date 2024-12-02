import React, { useContext, useEffect, useState} from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "../styles.css";
import { UserContext } from "../context/userContext";
import {ColorByconcentration, ColorByMajor, ColorPartByconcentration} from "./ColorBy";
import axios from 'axios';

const MajorConcentrationSelector = () => {
    const {
        isUserSignedIn,
        selectedMajor,
        handleMajorChange,
        selectedConcentration,
        handleConcentrationChange,
        userStartYear,
        setUserStartYear,
        userStartSemester,
        setUserStartSemester,
        passedDME,
        setPassedDME,
        thesisProject,
        setThesisProject
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
        const [changesMade, setChangesMade] = useState(false); // Tracks if user made change to be saved
        const [saveButtonText, setSaveButtonText] = useState('Save Changes'); // String for save button text

        const handleUserStartYear = (year) =>{
            setUserStartYear(year);
            setChangesMade(true);
        }
        const handleUserStartSemester = (semester) =>{
            setUserStartSemester(semester);
            setChangesMade(true);
        }
        const localHandleMajorChange = (e) =>{
            handleMajorChange(e);
            setChangesMade(true);
        }
        const localHandleConcentrationChange = (e) =>{
            handleConcentrationChange(e)
            setChangesMade(true);
        }
        const handleSave = async () =>{
            setChangesMade(false);
            setSaveButtonText("Saved");
            try{
                console.log("Saving...");
                const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/users/update_user`, {
                    id: sessionStorage.getItem('userID'),
                    start_year: userStartYear,
                    start_semester: userStartSemester,
                    major: selectedMajor,
                    concentration: selectedConcentration,
                    passed_dme: (passedDME) ? 'yes' : 'no'
                });
            }
            catch(error){
                console.error("Update failed", error);
                setChangesMade(true);
                setSaveButtonText("Save Changes");
            }
        };

    return (
        <Container>
        <Row style={{paddingBottom: "1px"}}>
            <ColorByMajor major={selectedMajor}>
            <h6 >Major</h6>
            <Form.Group className="mb-3">
            <Col sm={20}>
                <Form.Select 
                    aria-labelledby="major-label"
                    value={selectedMajor} 
                    onChange={(e) => localHandleMajorChange(e.target.value)}
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
        <Row style={{padding: "3px"}}>
            <ColorPartByconcentration concentration={selectedConcentration}>
            <h6 >Concentration</h6>
            <Form.Group className="mb-3">
            <Col sm={20}>
                <Form.Select
                aria-labelledby="concentration-label"
                value={selectedConcentration}
                onChange={(e) => localHandleConcentrationChange(e.target.value)}
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
            </ColorPartByconcentration>
        </Row>
        <Row style={{padding: "3px"}}>
            <ColorByMajor major={selectedMajor}>
                <h6>Starting Semester</h6>
                <Form.Group as={Row} className="mb-3">
                    <Col sm={7}>
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
                    <Col sm={8} >
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
        <Row style={{paddingTop: "3px",}}>
            <ColorPartByconcentration concentration={selectedConcentration}>
                <Col sm={10}>
                    <h6>Discrete Math Exam</h6>
                    <Form.Group as={Row} className="mb-3 align-items-center">
                        <Col>
                            <Form.Check
                                type="checkbox"
                                label="Passed?"
                                checked={passedDME}
                                onChange={() => setPassedDME(!passedDME)}
                            />
                            <h6>Thesis Requirement</h6>
                            <Form.Check
                                type="checkbox"
                                label="Thesis?"
                                checked={(thesisProject === 'Thesis')}
                                onChange={() => {
                                    console.log('Thesis Hit')
                                    console.log(`current Thesis: ${thesisProject}`)
                                    console.log(`Setting thesis to: ${((thesisProject === 'Thesis') ? 'Project' : 'Thesis')}`)
                                    setThesisProject((thesisProject === 'Thesis') ? 'Project' : 'Thesis')
                                }}
                            />
                        </Col>
                    </Form.Group>
                </Col>
            </ColorPartByconcentration>
        </Row>
        <Row className="align-items-center" style={{ marginTop: '10px' }}>
                <Col style={{ textAlign: 'right' }}>
                    {isUserSignedIn && <Button
                    disabled={!changesMade}
                    onClick={handleSave}
                    >
                        {saveButtonText}
                    </Button>}
                </Col>
            </Row>
        </Container>
    );
};

export default MajorConcentrationSelector;