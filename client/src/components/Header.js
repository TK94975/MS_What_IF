import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "../styles.css";

import ProfileBox from "./ProfileBox";
import MajorConcentrationSelector from "./MajorConcentrationSelector";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

const Header = ({ isUserSignedIn, onSignInSuccess }) => {
    // State shared by signup and majorconcentrationselector
    const defaultConcentrations = {
        CSI: "Artificial Intelligence and Machine Learning",
        ECE: "Signal Processing and Communications",
    };
    const [selectedMajor, setSelectedMajor] = useState("CSI");
    const [selectedConcentration, setSelectedConcentration] = useState(defaultConcentrations['CSI']);
    const handleMajorChange = (major) => {
        setSelectedMajor(major);
        setSelectedConcentration(defaultConcentrations[major] || "none");
    };
    const handleConcentrationChange = (concentration) => {
        setSelectedConcentration(concentration);
    };

    // Update state after sign in to make sure
    // majorconcentrationselector shows the right values
    useEffect(() => {
    if (isUserSignedIn) {
        const userMajor = sessionStorage.getItem("userMajor");
        const userConcentration = sessionStorage.getItem("userConcentration");
        setSelectedMajor(userMajor);
        setSelectedConcentration(userConcentration);
    }
    }, [isUserSignedIn]);

    return (
    <header>
        <Container>
        <Row>
            <Col>
            {isUserSignedIn ? (
                <ProfileBox isUserSignedIn={isUserSignedIn} onSignInSuccess={onSignInSuccess} />
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
                onSignInSuccess={onSignInSuccess}
                signInMajor={selectedMajor}
                signInCon={selectedConcentration}
                onMajorChange={handleMajorChange}
                onConcentrationChange={handleConcentrationChange}
            />
            </Col>
        </Row>
        </Container>
    </header>
    );
};

export default Header;