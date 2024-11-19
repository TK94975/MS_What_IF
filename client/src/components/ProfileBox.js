//CSS
import 'bootstrap/dist/css/bootstrap.css'; // Import Bootstrap CSS
import { Container, Col, Row, Form, Button } from 'react-bootstrap';
import '../styles.css';
//Packages 
import {React, useState, useEffect} from "react";

const ProfileBox = ({isUserSignedIn, onSignInSuccess}) => {
    const [email, setEmail] = useState(sessionStorage.getItem('userEmail') || '');

    const handleSignOut = () => {
        sessionStorage.removeItem('userID');
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('userMajor');
        sessionStorage.removeItem('userConcentration')
        sessionStorage.setItem('userLoggedIn?', "false");
        onSignInSuccess(false);
    }

    return (
        <Container>
            <Col className="d-flex flex-column align-items-start">
                <Row className="justify-content-start">
                    <Form.Label>{`Email: ${email}`}</Form.Label>
                </Row>
                <Row className="justify-content-start">
                    <Button variant="link" onClick={handleSignOut}>
                        Sign out
                    </Button>
                </Row>
            </Col>
        </Container>
    )
}

export default ProfileBox