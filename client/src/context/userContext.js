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
    const [userProgressProjected, setUserProgressProjected] = useState({});
    const [passedDME, setPassedDME] = useState(false);
    const [userStartYear, setUserStartYear] = useState("");
    const [userStartSemester, setUserStartSemester] = useState("");

    const getUpcomingSemester = () => {
        const now = new Date(); 
        const currentYear = now.getFullYear(); 
        const currentMonth = now.getMonth() + 1; 
    
        let nextSemester;
        let nextYear = currentYear;
    
        if (currentMonth >= 8 && currentMonth <= 12) {
            nextSemester = "Spring";
            nextYear = currentYear + 1;
        } else {
            nextSemester = "Fall";
        } 
        return { year: nextYear, semester: nextSemester };
    }



    useEffect(() => {
        if (sessionStorage.getItem("userLoggedIn?") === 'true') {
            setIsUserSignedIn(true);
            setSelectedMajor(sessionStorage.getItem("userMajor") || "CSI");
            setSelectedConcentration(sessionStorage.getItem("userConcentration") || defaultConcentrations['CSI']);
            setUserStartYear(sessionStorage.getItem('userStartYear') || "")
            setUserStartSemester(sessionStorage.getItem('userStartSemester') || "")
        } else {
            setIsUserSignedIn(false);
        }
    }, []);

    useEffect(() => {
        const nextSemester = getUpcomingSemester()
        console.log(nextSemester);
        setSelectedMajor(sessionStorage.getItem("userMajor") || "CSI");
        setSelectedConcentration(sessionStorage.getItem("userConcentration") || defaultConcentrations['CSI']);
        setUserStartYear(sessionStorage.getItem('userStartYear') || nextSemester.year)
        setUserStartSemester(sessionStorage.getItem('userStartSemester') || nextSemester.semester)
        const dme = (sessionStorage?.getItem('passedDME') === 'yes') ?  true : false;
        setPassedDME(dme);
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
