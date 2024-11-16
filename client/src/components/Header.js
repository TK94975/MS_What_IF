import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "../styles.css";

import ProfileBox from "./ProfileBox";
import MajorConcentrationSelector from "./MajorConcentrationSelector";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

const Header = ({ isUserSignedIn, onSignInSuccess }) => {
// State is shared between signup and major concentration components
// so the main state is stored here
  const [selectedMajor, setSelectedMajor] = useState("cs");
  const [selectedConcentration, setSelectedConcentration] = useState("");
  const handleMajorChange = (major) => {
    setSelectedMajor(major);
    setSelectedConcentration(""); // Reset concentration when major changes
  };
  const handleConcentrationChange = (concentration) => {
    setSelectedConcentration(concentration);
  };

  return (
    <header>
      <Container>
        <Row>
          <Col>
            {isUserSignedIn ? (
              <ProfileBox isUserSignedIn={isUserSignedIn} />
            ) : (
              <>
                <SignIn onSignInSuccess={onSignInSuccess} />
                <SignUp
                  onSignInSuccess={onSignInSuccess}
                  signInMajor={selectedMajor}
                  signInCon={selectedConcentration}
                  onMajorChange={handleMajorChange}
                  onConcentrationChange={handleConcentrationChange}
                />
              </>
            )}
          </Col>
          <Col>
            <MajorConcentrationSelector
              signUpMajor={handleMajorChange}
              signUpCon={handleConcentrationChange}
            />
          </Col>
        </Row>
      </Container>
    </header>
  );
};

export default Header;