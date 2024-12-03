import 'bootstrap/dist/css/bootstrap.css'; // Import Bootstrap CSS
import '../styles.css';
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/userContext';
import MajorConcentrationSelector from "./MajorConcentrationSelector"; // Adjust the import path as necessary

const LeftSideBar = () => {
    const { selectedMajor, selectedConcentration } = useContext(UserContext); // Extract from context
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch courses based on the user's major and concentration
    const getCourses = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${process.env.REACT_APP_SERVER_URL}/course_concentrations/${selectedConcentration}`
            );
            setCourses(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching courses:', err);
            setError('Failed to load courses. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderCourses = () => {
        if (loading) return <p>Loading courses...</p>;
        if (error) return <p className="text-danger">{error}</p>;
        if (courses.length === 0) return <p>No courses found for this concentration.</p>;

        // Separate core and elective courses
        const coreCourses = courses.filter(course => course.isCore);
        const electiveCourses = courses.filter(course => !course.isCore);

        return (
            <div>
                <h4>Core Courses</h4>
                <ul>
                    {coreCourses.map((course) => (
                        <li key={course.course_id}>
                            {`${course.department} ${course.number} - ${course.title}`}
                        </li>
                    ))}
                </ul>
                <h4>Elective Courses</h4>
                <ul>
                    {electiveCourses.map((course) => (
                        <li key={course.course_id}>
                            {`${course.department} ${course.number} - ${course.title}`}
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    const majorColors = {
        CSI: "#2980b9", // Example color for a major
        "Computer Science": "#2980b9",
        ECE: "#c0392b",
        "Electrical and Computer Engineering": "#c0392b",
        default: "#7f8c8d",
    };

    const selectedMajorColor = majorColors[selectedMajor] || majorColors.default;

    return (
        <div style={styles.parent}>
            <div style={styles.spacer}></div>
                <div style={styles.sidebar}>

                <div className="container" style={styles.title}>
                    <h3>Courses for {selectedMajor || 'Unknown Major'}</h3>
                </div>
                <div
                    className="container"
                    style={{...styles.title, ...styles.concentrationSelector}}>

                    <MajorConcentrationSelector/>
                </div>

                <div style={{paddingTop: "2%"}}></div>

                <h5>Search Parameters:</h5>

                <div style={styles.parameters}>
                    <p><strong>Major:</strong> {selectedMajor || 'None'}</p>
                    <p><strong>Concentration:</strong> {selectedConcentration || 'None'}</p>
                    <button
                        style={styles.button}
                        onClick={getCourses}
                        disabled={loading || !selectedConcentration}
                    >
                        {loading ? 'Loading...' : 'Get Courses'}
                    </button>
                    <div style={styles.courseOutput(selectedMajorColor)}>{renderCourses()}</div>
                </div>
                <div style={styles.footer}>
                    <p>Please Contact your advisor for more information.</p>
                </div>
            </div>
            <div style={{padding: "10%"}}></div>
        </div>
    );
};

// Styles
const styles = {
    parent: {
        maxHeight: '65%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    spacer: {
        height: '3%',
    },
    title: {
        backgroundColor: 'lightGrey',
        borderTopRightRadius: '10px',
        borderTopLeftRadius: '10px',
        padding: '10px',
    },
    sidebar: {
        display: 'flex',
        flexDirection: 'column',
        padding: '4px',
        borderBottomRightRadius: '10px',
        borderBottomLeftRadius: '10px',
        backgroundColor: 'lightGrey',
        overflowY: 'scroll',
        maxHeight: "100%",


    },
    parameters: {
        margin: '10px 0',
        textAlign: 'left',
    },
    button: {
        marginTop: '10px',
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    footer: {
        padding: '10px',
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #dee2e6',
    },
    concentrationSelector: {
        border: '6px solid purple', // Purple border for MajorConcentrationSelector
        padding: '10px',
        borderRadius: '8px',
    },
    courseOutput: (majorColor) => ({
        border: `4px solid ${majorColor}`, // Border color based on selected major
        padding: '10px',
        borderRadius: '8px',
        marginTop: '20px',
        textAlign: 'left',
    }),
};

export default LeftSideBar;
