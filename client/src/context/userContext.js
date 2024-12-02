import React, { createContext, useState, useEffect } from "react";
import axios from "axios"; // Fix for axios is not defined

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [isUserSignedIn, setIsUserSignedIn] = useState(false);
    const defaultConcentrations = {
        CSI: "Artificial Intelligence and Machine Learning",
        ECE: "Signal Processing and Communications",
    };
    const [selectedMajor, setSelectedMajor] = useState("CSI");
    const [selectedConcentration, setSelectedConcentration] = useState(defaultConcentrations['CSI']);
    const [courses, setCourses] = useState([]); // User courses
    const [concentrationRequirements, setConcentrationRequirements] = useState({});
    const [userStartYear, setUserStartYear] = useState("");
    const [userStartSemester, setUserStartSemester] = useState("");
    const [userProgressProjected, setUserProgressProjected] = useState({});
    const [passedDME, setPassedDME] = useState(false);


    useEffect(() => {
        if (sessionStorage.getItem("userLoggedIn?") === 'true') {
            setIsUserSignedIn(true);
            setSelectedMajor(sessionStorage.getItem("userMajor") || "CSI");
            setSelectedConcentration(sessionStorage.getItem("userConcentration") || defaultConcentrations['CSI']);
            setUserStartYear(sessionStorage.getItem('userStartYear'))
            setUserStartSemester(sessionStorage.getItem('userStartSemester'))
        } else {
            setIsUserSignedIn(false);
        }
    }, []);

    useEffect(() => {
        setSelectedMajor(sessionStorage.getItem("userMajor") || "CSI");
        setSelectedConcentration(sessionStorage.getItem("userConcentration") || defaultConcentrations['CSI']);
        setUserStartYear(sessionStorage.getItem('userStartYear') || "")
        setUserStartSemester(sessionStorage.getItem('userStartSemester') || "")
        const dme = (sessionStorage?.getItem('passedDME') === 'yes') ?  true : false;
        setPassedDME(dme);
        setUserStartSemester(sessionStorage.getItem('userStartSemester') || "")
    }, [isUserSignedIn]);

    const handleMajorChange = (major) => {
        setSelectedMajor(major);
        setSelectedConcentration(defaultConcentrations[major] || "none");
    };
    const handleConcentrationChange = (concentration) => {
        setSelectedConcentration(concentration);
    };

    return (
        <UserContext.Provider
            value={{
                isUserSignedIn,
                setIsUserSignedIn,
                selectedMajor,
                handleMajorChange,
                selectedConcentration,
                concentrationRequirements, // Fixed typo here
                handleConcentrationChange,
                courses,
                setCourses,
                userStartYear,
                setUserStartYear,
                userStartSemester,
                setUserStartSemester,
                userProgressProjected,
                setUserProgressProjected,
                passedDME,
                setPassedDME
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
