//CSS
import 'bootstrap/dist/css/bootstrap.css'; // Import Bootstrap CSS
import { Container, Col, Row } from 'react-bootstrap';
import '../styles.css';
//Packages 
import {React, useState, useEffect} from "react";

const ProfileBox = ({isUserSignedIn}) => {
    const [email, setEmail] = useState('');
    if (isUserSignedIn) {
        console.log('profile logged in');
        if (email === ''){
            setEmail(localStorage.getItem('userEmail'));
        }
    }
    //} else {
    //    console.log('profile not logged in')
    //}

    return (
        <Container>
            <Row>
                <Col>
                    <h6>University at Albany, SUNY</h6>
                    <p>{`Email: ${email}`}</p>
                </Col>
            </Row>
        </Container>
    )
}

export default ProfileBox