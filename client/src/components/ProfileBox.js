//CSS
import 'bootstrap/dist/css/bootstrap.css'; // Import Bootstrap CSS
import { Container, Col, Row, Form, Button } from 'react-bootstrap';
import '../styles.css';

//Packages 
import {React, useState, useEffect, useContext} from "react";
//Context
import { UserContext } from '../context/userContext';

const ProfileBox = () => {
    const {
        setIsUserSignedIn,
    } = useContext(UserContext);

    const [email, setEmail] = useState(sessionStorage.getItem('userEmail') || '');

    const handleSignOut = () => {
        sessionStorage.removeItem('userID');
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('userMajor');
        sessionStorage.removeItem('userConcentration')
        sessionStorage.setItem('userLoggedIn?', "false");
        setIsUserSignedIn(false);
    }

    return (
        <Container
            style={{
                backgroundColor: "lightGrey",
                padding: "8px",
                borderRadius: "8px",
                border: "4px solid",
                borderColor: "purple",
                width: "85%",
            }}
        >
            <Col className="d-flex flex-column align-items-center"> {/* Center the content in the column */}
                <Row className="justify-content-center w-100"> {/* Ensure the row takes full width */}
                    <Form.Label className="email-label" style={{ textAlign: "center", fontWeight: "bold", textDecoration: "underline" }}>
                        {`Email:  ${email}`}
                    </Form.Label>
                </Row>
                <Row className="justify-content-center w-100" style={{ padding: "5px" }}>
                    <Button
                        variant="link"
                        onClick={handleSignOut}
                        style={{
                            padding: "5px",
                            borderRadius: "8px",
                            border: "1px solid",
                            borderColor: "black",
                            textAlign: "center", // Ensure the text inside the button is centered
                        }}
                    >
                        Sign out
                    </Button>
                </Row>
            </Col>
        </Container>
)
}

export default ProfileBox