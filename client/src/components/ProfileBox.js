//CSS
import 'bootstrap/dist/css/bootstrap.css'; // Import Bootstrap CSS
import { Container, Col, Row } from 'react-bootstrap';
import '../styles.css';
//Packages 
import {React, useState, useEffect} from "react";

const ProfileBox = props => {
    const [email, setEmail] = useState(props.email)
    if (props.email !== null) {
        return (
            <Container>
                <Row>
                    <Col>
                        <p>{`Email: ${email}`}</p>
                    </Col>
                </Row>
            </Container>
        )
    }
    else {
        return (
            <div className='container'>
                <a href={'http://localhost:3000/signin'}>Sign in</a>
            </div>
        )
    }
}

export default ProfileBox