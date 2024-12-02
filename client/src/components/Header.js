import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "../styles.css";
import ProfileBox from "./ProfileBox";
import MajorConcentrationSelector from "./MajorConcentrationSelector";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { UserContext } from "../context/userContext";
import {ColorUserArea} from "./ColorBy";
import {usersData} from "./UsersTable";

import logo from "../context/UAlbanyMark_F_S03B_HEX_Purple_White.png"; // Adjust the path as needed



const Header = () => {
    const {
        isUserSignedIn,
    } = useContext(UserContext);
    return (
    <header>
        <Container
            style={{
                padding: "2px",
                width:"100%",
        }}
        >
            <ColorUserArea userLoggedIn={isUserSignedIn}>

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
                    {/* Display the logo image */}
                    <img src={logo} alt="UAlbany Logo" style={{ width: "100%", height: "auto" }} />
                </Col>
            <Col>
                <MajorConcentrationSelector/>
            </Col>

    </Row>
            </ColorUserArea>

        </Container>
    </header>
    );
};

export default Header;