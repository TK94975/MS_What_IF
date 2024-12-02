import 'bootstrap/dist/css/bootstrap.css'; // Import Bootstrap CSS
import '../styles.css';
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/userContext'; // Adjust the import path as necessary

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

    return (
        <div style={styles.parent}>
            <div style={styles.spacer}></div>
            <div className="container" style={styles.title}>
                <h3>Courses for {selectedMajor || 'Unknown Major'}</h3>
                <p>Concentration: {selectedConcentration || 'Unknown Concentration'}</p>
            </div>
            <div style={styles.sidebar}>
                <div>{renderCourses()}</div>
                <div style={styles.parameters}>
                    <p>
                        <strong>Search Parameters:</strong>
                    </p>
                    <p>Major: {selectedMajor || 'None'}</p>
                    <p>Concentration: {selectedConcentration || 'None'}</p>
                    <button
                        style={styles.button}
                        onClick={getCourses}
                        disabled={loading || !selectedConcentration}
                    >
                        {loading ? 'Loading...' : 'Get Courses'}
                    </button>
                </div>
                <div style={styles.footer}>
                    <p>Contact your advisor for more information.</p>
                </div>
            </div>
        </div>
    );
};

// Styles
const styles = {
    parent: {
        maxHeight: '75%',
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
        maxHeight: '100%',
    },
    parameters: {
        margin: '10px 0',
        textAlign: 'center',
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
};

export default LeftSideBar;
