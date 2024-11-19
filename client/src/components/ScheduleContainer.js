import 'bootstrap/dist/css/bootstrap.css'; // Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../styles.css';
import axios from 'axios';
//Packages
import {React, useState, useEffect}from "react";
import { Accordion, Form, Card, Col, Row } from 'react-bootstrap';



// Containers the Title and the dropdown/accordions for each semester

const ScheduleContainer =  ({isUserSignedIn}) => {

    // Enum for grade updating
    const gradeOptions = ["A", "A-", "B+", "B", "B-", "C+", "C", "C", "D", "F", "E"];
    const [courses, setCourses] = useState([]);
    const [groupedCourses, setGroupedCourses] = useState({});
    const getUserCourses = async () => {
        const user_id = sessionStorage.getItem('userID');
        try {
            const response = await axios.post('http://localhost:5000/user_courses/get_user_courses', {
                user_id,
            });
            setCourses(response.data.user_courses);
        } catch (err) {
            console.error("Error fetching courses:");
        }
    };

    const getGroupedCourses = (courses) => {
        const grouped = {};
        courses.forEach((course) => {
            if (!grouped[course.year]) {
                grouped[course.year] = {};
            }
            if (!grouped[course.year][course.semester]) {
                grouped[course.year][course.semester] = [];
            }
            grouped[course.year][course.semester].push(course);
        });
        return grouped;
    };

    useEffect(() => {
        if(isUserSignedIn){
            console.log("User logged in: fetching user data")
            getUserCourses();
            console.log("Classes", courses);
            console.log("Num classes", courses.length);
        } else {
            console.log("User not logged in: skipping fetch");
        }        
    }, [isUserSignedIn]);

    useEffect(() => {
        if (courses.length > 0) {
            console.log("Grouping courses...");
            const grouped = getGroupedCourses(courses);
            setGroupedCourses(grouped);
            console.log("Grouped Data:", grouped);
        }
    }, [courses]);
    
    return (
        <div>
            <h1>Schedule</h1>
            <Accordion alwaysOpen>
                {Object.keys(groupedCourses).map((year, yearIndex) => (
                    <Accordion.Item eventKey={yearIndex} key={year}>
                        <Accordion.Header>{`Year: ${year}`}</Accordion.Header>
                        <Accordion.Body>
                            {Object.keys(groupedCourses[year]).map((semester, semesterIndex) => (
                                <div key={semester}>
                                    <h5>{semester}</h5>
                                    <ul>
                                        {groupedCourses[year][semester].map((course, courseIndex) => (
                                            <Card key={courseIndex}>
                                                <Row>
                                                    <Col xs={2}>{course.department} {course.number}</Col>
                                                    <Col xs={5}>{course.title}</Col>
                                                    <Col xs= {2}>
                                                    <Form.Select
                                                        value={course.grade || ''}
                                                    >
                                                        <option value="" disabled>Select grade</option>
                                                        {gradeOptions.map((grade) => (
                                                            <option key={grade} value={grade}>
                                                                {grade}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                    </Col>
                                                </Row>
                                            </Card>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </Accordion.Body>
                    </Accordion.Item>
                ))}
            </Accordion>
        </div>
    );
}

export default ScheduleContainer