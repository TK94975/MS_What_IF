import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from '../context/userContext'; // Adjust the import path as necessary

// Define colors for each department
const majorColors = {
    CSI: "#2980b9",
    "Computer Science": "#2980b9",
    ECE: "#c0392b",
    "Electrical and Computer Engineering": "#c0392b",
    default: "#7f8c8d",
};

// Define colors for core vs elective courses
const concentrationCoreColors = {
    core: "#FFD700", // Core Course
    elective: "#800080", // Open Elective
    loading: "lightgray",
    concentrationElective: "linear-gradient(45deg, #800080, #FFD700)", // Gradient for Concentration Elective
    null: "pink", // "Consult Your Advisor"
};

// Define colors for each concentration
const concentrationColors = {
    "Artificial Intelligence and Machine Learning": "#ff5733",
    "Artificial Intelligence": "#ff5733",
    "Systems": "#3498db",
    "Computer Systems": "#3498db",
    "Theoretical Computer Science": "#9b59b8",
    "Theoretical CS": "#9b59b8",
    "Old Computer Science": "#34495e",
    "Pre-2024": "#34495e",
    "Signal Processing and Communications": "#e67e22",
    "Signal Processing": "#e67e22",
    "Electronic Circuits and Systems": "#1abc9c",
    "Electronic Circuits": "#1abc9c",
    "Control and Computer Systems": "#e74c3c",
    "Control Systems": "#e74c3c",
    default: "pink",
};


/**
 * Component to color-code courses based on courses core status
 */
const ColorBycore = ({ course_id, children }) => {
    const { selectedMajor, selectedConcentration } = useContext(UserContext); // Get major and concentration from context
    const [courseType, setCourseType] = useState(null); // 'core', 'concentrationElective', 'openElective', or null
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_SERVER_URL}/course_concentrations/${selectedConcentration}`
                );

                // Extract all courses from the response
                const courses = response.data;

                // Separate core and elective courses
                const coreCourses = courses.filter(course => course.isCore);
                const concentrationElectiveCourses = courses.filter(course => !course.isCore);

                // Determine the course type
                if (coreCourses.some(course => course.course_id === course_id)) {
                    setCourseType("core");
                } else if (concentrationElectiveCourses.some(course => course.course_id === course_id)) {
                    setCourseType("concentrationElective");
                } else {
                    setCourseType("elective"); // Open Elective
                }
            } catch (error) {
                console.error("Error fetching course data:", error);
                setCourseType(null); // Default to "Consult Your Advisor" on error
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [course_id, selectedConcentration]); // Dependency on course_id and selectedConcentration

    // Define styles based on course type and loading state
    const coreStyle = {
        padding: "10px",
        borderRadius: "8px",
        background: loading
            ? concentrationCoreColors.loading
            : courseType === "concentrationElective"
                ? concentrationCoreColors.concentrationElective
                : concentrationCoreColors[courseType] || concentrationCoreColors.null,
        marginBottom: "5px",
        color: "#fff",
    };

    return (
        <div style={coreStyle}>
            <p style={{ margin: "0px", fontWeight: "bold", textAlign: "center" }}>
                {loading
                    ? "Loading..."
                    : courseType === null
                        ? "Consult Your Advisor"
                        : courseType === "core"
                            ? "Core Course"
                            : courseType === "concentrationElective"
                                ? "Concentration Elective"
                                : "Open Elective"}
            </p>
            {children}
        </div>
    );
};

/**
 * Component to color-code small parts courses based on their concentration.
 */
const ColorPartByconcentration = ({ concentration, course_id, children }) => {
    const backgroundColor = concentrationColors[concentration] || concentrationColors.default;

    return (
        <div
            style={{
                backgroundColor,
                borderRadius: "8px",
                color: "black",
            }}
        >
            {children}
        </div>
    );
};








/**
 * Component to color-code courses based on their concentration.
 */
const ColorByconcentration = ({ department, course_id, children }) => {
    const [backgroundColor, setBackgroundColor] = useState(concentrationColors.default);

    useEffect(() => {
      const fetchConcentration = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/course_concentrations/${department}/${course_id}/concentration`);
          const concentration = response.data.concentration;

          // Set the background color based on concentration
          setBackgroundColor(concentrationColors[concentration] || concentrationColors.default);
        } catch (error) {
          console.error("Error fetching course concentration:", error);
          // Set to default color if no concentration is found or error occurs
          setBackgroundColor(concentrationColors.default);
        }
      };

      if (course_id) {
        fetchConcentration();
      }
    }, [department, course_id]);

    return (
        <div
            style={{
                backgroundColor,
                borderRadius: "8px",
                color: "black",
            }}
        >
            {children}
        </div>
    );
};

/**
 * Component to color-code courses based on the user's major.
 */
const ColorByMajor = ({ children }) => {
    const { selectedMajor } = useContext(UserContext); // Accessing major from context
    const backgroundColor = majorColors[selectedMajor] || majorColors.default;

    return (
        <div
            style={{
                backgroundColor,
                padding: "5px",
                scrollPadding: "8px",
                borderRadius: "8px",
                color: "black",
            }}
        >
            {children}
        </div>
    );
};

/**
 * Component to color-code based on user login status.
 */
const ColorUserArea = ({ userLoggedIn, children }) => {
    if (userLoggedIn) {
        return (
            <div
                style={{
                    backgroundColor: "gold",  // Gold for logged-in user
                    padding: "8px",
                    borderRadius: "8px",
                    border: "5px solid",
                    borderColor: "purple",
                }}
            >
                {children}
            </div>
        );
    } else {
        return (
            <div
                style={{
                    backgroundColor: "white",  // White for logged-out user
                    padding: "5px",
                    borderRadius: "8px",
                    border: "5px solid",
                    borderColor: "purple",
                }}
            >
                {children}
            </div>
        );
    }
};

export { ColorBycore, ColorByconcentration, ColorUserArea, ColorByMajor,ColorPartByconcentration };
