//CSS
import 'bootstrap/dist/css/bootstrap.css'; // Import Bootstrap CSS
import { Container, Col, Row, Form } from 'react-bootstrap';
import '../styles.css';
//Packages 
import {React, useState, useEffect} from "react";

const ProfileBox = ({isUserSignedIn}) => {
    const [email, setEmail] = useState(sessionStorage.getItem('userEmail') || '');

    return (
        <Container>
                <Col>
                    <Row>
                        <Form.Label>University at Albany, SUNY</Form.Label>
                    </Row>
                    <Row>
                        <Form.Label>{`Email: ${email}`}</Form.Label>
                    </Row>
                </Col>
        </Container>
    )
}

export default ProfileBox