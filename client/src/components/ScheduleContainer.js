import 'bootstrap/dist/css/bootstrap.css'; // Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../styles.css';
import axios from 'axios';
//Packages
import {React, useState, useEffect}from "react";
import { Accordion, Form, Card, Col, Row, Button, Modal, Toast, ModalBody } from 'react-bootstrap';


// Containers the Title and the dropdown/accordions for each semester

const ScheduleContainer =  ({isUserSignedIn}) => {

    // Enum for grade updating
    const gradeOptions = ["A", "A-", "B+", "B", "B-", "C+", "C", "D", "F", "E"];
    const semesterOptions = ['Spring','Summer','Fall','Winter'];
    const yearOptions = [2022,2023,2024,2025,2026,2027];

    const [courses, setCourses] = useState([]);
    const [groupedCourses, setGroupedCourses] = useState({});
    const [showDescription, setShowDescription] = useState(false);
    const [courseDescription, setCourseDescription] = useState([]);
    const [changesMade, setChangesMade] = useState(false);
    const [saveButtonText, setSaveButtonText] = useState('Save Changes');
    const [showAddClass, setShowAddClass] = useState(false);
    const [addYear, setAddYear] = useState('');
    const [addSemester, setAddSemester] = useState('');
    const [showRemoveCourseWarning, setShowRemoveCourseWarning] = useState(false);
    const [selectedCourseRemove, setSelectedCourseRemove] = useState('');


    // Getting courses from backend
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

    // Grouping courses for display
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

    // Fetching courses or clearing courses on sign in/out
    useEffect(() => {
        if(isUserSignedIn){
            console.log("User logged in: fetching user data")
            getUserCourses();
            console.log("Classes", courses);
            console.log("Num classes", courses.length);
        } else {
            console.log("User not logged in: skipping fetch and clearing courses");
            setCourses([]);
            setGroupedCourses({});
            setChangesMade(false);
        }        
    }, [isUserSignedIn]);

    // Grouping courses after fetching
    useEffect(() => {
        if (courses.length > 0) {
            console.log("Grouping courses...");
            const grouped = getGroupedCourses(courses);
            setGroupedCourses(grouped);
            console.log("Grouped Data:", grouped);
        }
    }, [courses]);

    //Modal for course description
    const handleShowDescription = async (course_id) => {
        const tempDescription = await axios.post('http://localhost:5000/courses/course_description', {
            course_id,
        });
        setCourseDescription(tempDescription.data);
        console.log(tempDescription.data);
        setShowDescription(true); 
    };

    const handleCloseDescription = () => {
        setShowDescription(false); 
        setCourseDescription([]);
    };

    // Lets the user change grades for courses
    const handleChangeGrade = (course, newGrade) => {
        // Iterate over courses
        const updatedCourses = courses.map((element) => {
            if (element.id === course.id && element.semester === course.semester && element.year === course.year) {
                // replace element with new element with updated grade
                return { ...element, grade: newGrade }; 
            }
            return element;
        });
        setCourses(updatedCourses);
        setChangesMade(true);
        setSaveButtonText("Save Changes");
    };

    // Save changes to the database
    const handleSave = async () =>{
        setChangesMade(false);
        setSaveButtonText("Saved");
        try{
            console.log("Saving...");
            const response = await axios.post('http://localhost:5000/user_courses/update_user_courses', {
                courses,
            });
        }
        catch(error){
            console.error("Update failed", error);
            setChangesMade(true);
            setSaveButtonText("Save Changes");
        }
    };

    // Adding a semester
    const handleAddSemesterForm = () =>{
        setShowAddClass(true);
    };

    const handleCloseAddSemesterForm= () =>{
        setShowAddClass(false);
    };

    const handleSetAddYear = (year) =>{
        setAddYear(year);
    };

    const handleSetAddSemester = (semester) => {
        setAddSemester(semester);
    };

    const handleAddNewSemester = () => {

    };
    //Removing a class
    const handleShowRemoveCourseWarning = (course) =>{
        setSelectedCourseRemove(course);
        setShowRemoveCourseWarning(true);

    }
    const handleCloseRemoveCourseWarning = () =>{
        setShowRemoveCourseWarning(false);
        setSelectedCourseRemove('');
    }
    const handleRemoveCourse = (badCourse) =>{
        const updatedCourses = courses.filter((course) => 
            !(course.id === badCourse.id && course.year === badCourse.year && course.semester === badCourse.semester)
        );
        setCourses(updatedCourses);
        setShowRemoveCourseWarning(false);
        setChangesMade(true);
    };
    
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
                                                    <Col xs={2}>
                                                        <Button 
                                                        variant="link" 
                                                        onClick={() => handleShowDescription(course.id)}
                                                        >
                                                        <Row> {course.department} {course.number}</Row>
                                                        </Button>
                                                    </Col>
                                                    <Col xs={6} className="d-flex align-items-center">{course.title} </Col>
                                                    <Col xs= {2} className="d-flex align-items-center">
                                                    <Form.Select
                                                        value={course.grade || ''}
                                                        onChange={(e) => handleChangeGrade(course, e.target.value)}
                                                    >
                                                        <option value="" disabled>Select grade</option>
                                                        {gradeOptions.map((grade) => (
                                                            <option key={grade} value={grade}>
                                                                {grade}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                    </Col>
                                                    <Col xs={1} className="d-flex align-items-center justify-content-center">
                                                        <Button
                                                        variant='danger'
                                                        size='sm'
                                                        onClick={()=>handleShowRemoveCourseWarning(course)}
                                                        >
                                                        X
                                                        </Button>
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

            {/* Add semester and save change buttons */}
            <Row className="align-items-center" style={{ marginTop: '20px' }}>
                <Col style={{ textAlign: 'left' }}>
                    <Button
                    onClick={handleAddSemesterForm} 
                    >
                        Add Semester
                    </Button>
                </Col>

                <Col style={{ textAlign: 'right' }}>
                    <Button
                    disabled={!changesMade}
                    onClick={handleSave}
                    >
                        {saveButtonText}
                    </Button>
                </Col>


            </Row>

            {/*Modal to show course description to user on request */}
            <Modal 
            show={showDescription} 
            onHide={handleCloseDescription} 
            centered 
            >
                <Modal.Header closeButton>
                    <Modal.Title>Course Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row><h3>{courseDescription.department} {courseDescription.number}</h3></Row>
                    <Row><h5>{courseDescription.title}</h5></Row>
                    <Row><h6>Description</h6></Row>
                    <Row>{courseDescription.description}</Row>
                    <Row><h6>Prequisites</h6></Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDescription}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/*Modal for the form to add a class*/}
            <Modal
            show={showAddClass}
            onHide={handleCloseAddSemesterForm}
            centered
            >
                <Modal.Header closeButton> 
                    <Modal.Title>Add a Semester</Modal.Title>
                </Modal.Header>
                    <ModalBody>
                            <Form>
                                <Form.Group className="mb-3" controlId="formYear">
                                    <Form.Label>Year</Form.Label>
                                    <Form.Select
                                    value={addYear}
                                    onChange={(e) => handleSetAddYear(e.target.value)}
                                    >
                                    <option value="" disabled>Select a year</option>
                                    {yearOptions.map((value) => (
                                        <option key={value} value={value}>
                                        {value}
                                        </option>
                                    ))}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formYear">
                                    <Form.Label>Semester</Form.Label>
                                    <Form.Select
                                    value={addSemester}
                                    onChange={(e) => handleSetAddSemester(e.target.value)}
                                    >
                                    <option value="" disabled>Select a semester</option>
                                    {semesterOptions.map((value) => (
                                        <option key={value} value={value}>
                                        {value}
                                        </option>
                                    ))}
                                    </Form.Select>
                                </Form.Group>
                            </Form>
                            <Col style={{ textAlign: 'right' }}>
                                <Button
                                onClick={handleAddNewSemester}
                                >
                                    Add
                                </Button>
                            </Col>
                    </ModalBody>
            </Modal>

            {/*Modal to warn the user about removing a class*/}
            <Modal
            show={showRemoveCourseWarning}
            onHide={handleCloseRemoveCourseWarning}
            centered
            >
                <Modal.Header closeButton> 
                    <Modal.Title>Are you sure?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col xs={8}>
                            Remove {selectedCourseRemove.department} {selectedCourseRemove.number}
                        </Col>
                        <Col xs={2}>
                            <Button
                                onClick={()=>handleRemoveCourse(selectedCourseRemove)}
                            >
                                Yes
                            </Button>
                        </Col>
                        <Col xs={2}>
                            <Button
                                onClick={handleCloseRemoveCourseWarning}
                            >
                                No
                            </Button>
                        </Col>
                    </Row>


                </Modal.Body>

            </Modal>
        </div>
    );
}

export default ScheduleContainer