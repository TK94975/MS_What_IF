//CSS
import 'bootstrap/dist/css/bootstrap.css'; // Import Bootstrap CSS
import '../styles.css';
//Packages 
import {React, useState, useEffect} from "react";
import { Container, Row, Col } from 'react-bootstrap';

import ProfileBox from './ProfileBox';
import MajorConcentrationSelector from './MajorConcentrationSelector';
import SignIn from './SignIn';
import SignUp from './SignUp';

const Header = ({ isUserSignedIn, onSignInSuccess }) => {
    return (
      <header>
        <Container>
            <Row>
                <Col>
                    {/* Conditional rendering based on the user's sign-in state */}
                    {isUserSignedIn ? (
                    <ProfileBox isUserSignedIn={isUserSignedIn}/>
                    ) : (
                    [<SignIn onSignInSuccess={onSignInSuccess} key={1} />, 
                    <SignUp onSignInSuccess={onSignInSuccess} key={2}/>]
                    )}
                </Col>
                <Col>
                    <MajorConcentrationSelector/>
                </Col>
            </Row>
        </Container>

      </header>
    );
  };

export default Header