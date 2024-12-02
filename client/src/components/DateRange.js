//CSS
import 'bootstrap/dist/css/bootstrap.css'; // Import Bootstrap CSS
import { Container, Col, Row, Form, Button } from 'react-bootstrap';
import '../styles.css';
//Packages 
import {React, useState, useEffect, useContext} from "react";
//Context
import { UserContext } from '../context/userContext';

const DateRange = () => {
    const {
        userStartYear,
        setUserStartYear,
        userStartSemester,
        setUserStartSemester
    } = useContext(UserContext);

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
    <Col className="d-flex flex-column align-items-start">
        <Form>
            <Row className="align-items-center">
                <Col xs={6}>
                    <Form.Group className="mb-3" controlId="formYear">
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
                    </Form.Group>
                </Col>
                <Col xs={6}>
                    <Form.Group className="mb-3" controlId="formSemester">
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
                    </Form.Group>
                </Col>
            </Row>
        </Form>
    </Col>
</Container>
    )
}

export default DateRange