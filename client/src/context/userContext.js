import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [isUserSignedIn, setIsUserSignedIn] = useState(false);
    const defaultConcentrations = {
        CSI: "Artificial Intelligence and Machine Learning",
        ECE: "Signal Processing and Communications",
    };
    const [selectedMajor, setSelectedMajor] = useState("CSI");
    const [selectedConcentration, setSelectedConcentration] = useState(defaultConcentrations['CSI']);

    useEffect(() => {
        if (sessionStorage.getItem("userLoggedIn?") === 'true') {
            setIsUserSignedIn(true);
            setSelectedMajor(sessionStorage.getItem("userMajor") || "CSI");
            setSelectedConcentration(sessionStorage.getItem("userConcentration") || defaultConcentrations['CSI']);
        } else {
            setIsUserSignedIn(false);
        }
    }, []);

    useEffect(() => {
        setSelectedMajor(sessionStorage.getItem("userMajor") || "CSI");
        setSelectedConcentration(sessionStorage.getItem("userConcentration") || defaultConcentrations['CSI']);
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
                handleConcentrationChange,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};