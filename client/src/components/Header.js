import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "../styles.css";

import ProfileBox from "./ProfileBox";
import MajorConcentrationSelector from "./MajorConcentrationSelector";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

import { UserContext } from "../context/userContext";

const Header = () => {
    const {
        isUserSignedIn,
    } = useContext(UserContext);
    return (
    <header>
        <Container>
        <Row>
            <Col>
            {isUserSignedIn ? (
                <ProfileBox/>
            ) : (
                <>
                <SignIn/>
                <SignUp/>
                </>
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

export default Header;