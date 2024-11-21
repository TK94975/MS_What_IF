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

    const [courses, setCourses] = useState([]); // User courses
    const [groupedCourses, setGroupedCourses] = useState({}); // User courses grouped by year and semester
    const [showDescription, setShowDescription] = useState(false); // Course description modal state
    const [courseDescription, setCourseDescription] = useState([]); // Course details for decription modal
    const [changesMade, setChangesMade] = useState(false); // Tracks if user made change to be saved
    const [saveButtonText, setSaveButtonText] = useState('Save Changes'); // String for save button text
    const [showAddSemester, setShowAddSemester] = useState(false); // Add semester modal show state
    const [showRemoveCourseWarning, setShowRemoveCourseWarning] = useState(false); // Warning modal show state
    const [selectedCourseRemove, setSelectedCourseRemove] = useState(''); // Details of course to be removed for modal
    const [showAddCourse, setShowAddCourse] = useState(false); // Add course modal show state
    const [addYear, setAddYear] = useState(''); // Year for add semester/course modal
    const [addSemester, setAddSemester] = useState(''); // Semester for add semester/course modal
    const [addCourseDepartment, setAddCourseDepartment] = useState('CSI')
    const [addCourseNumber, setAddCourseNumber] = useState('500')
    const [addCourseID, setAddCourseID] = useState('')
    const [addCourseBucket, setAddCourseBucket] = useState([]);
    const [addCourseBucketDepartment, setAddCourseBucketDepartment] = useState(['CSI', 'ECE']);
    const [addCourseBucketNumber, setAddCourseBucketNumber] = useState({})

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
        }
    }, [courses]);

    //Modal for course description
    const handleShowDescription = async (course_id) => {
        const tempDescription = await axios.post('http://localhost:5000/courses/course_description', {
            course_id,
        });
        setCourseDescription(tempDescription.data);
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
        setShowAddSemester(true);
    };
    const handleCloseAddSemesterForm= () =>{
        setShowAddSemester(false);
    };
    const handleSetAddYear = (year) =>{
        setAddYear(year);
    };
    const handleSetAddSemester = (semester) => {
        setAddSemester(semester);
    };
    const handleAddNewSemester = () => {
        if (!addYear || !addSemester) {
            alert("Please select both a year and a semester.");
            return;
        }
        // Check if the year and semester already exist
        const semesterExists = courses.some(
            (course) => course.year === addYear && course.semester === addSemester
        );
    
        if (semesterExists) {
            alert("This semester already exists in your schedule.");
            return;
        }
    
        // Add a placeholder entry for the new semester
        const placeholderEntry = {
            id: null, // No ID since this isn't tied to an actual course
            year: addYear,
            semester: addSemester,
            department: null,
            number: null,
            title: null,
            grade: null,
        };
        setCourses((prevCourses) => [...prevCourses, placeholderEntry]);
        setAddYear('');
        setAddSemester('');
        setShowAddSemester(false);
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

    // Adding a class
    const handleShowAddCourseForm = () =>{
        setShowAddCourse(true);
    };
    const handleHideAddCourseForm = () =>{
        setShowAddCourse(false);
    }
    const getAvailableCourses = async () =>{
        console.log("Getting available courses")
        try{
            const response = await axios.get('http://localhost:5000/courses/course_options');
            const availableCourses = response.data;
            let csiNumbers = new Map();
            let eceNumbers = new Map();
            availableCourses.forEach((course) => {
                if(course.department === 'CSI'){
                    csiNumbers.set(course.number, course.id)
                } else {
                    eceNumbers.set(course.number, course.id)
                }
            })
            const formatedNumbers = {CSI: csiNumbers, ECE: eceNumbers};
            setAddCourseBucketNumber(formatedNumbers);
        }
        catch(error){
            console.error("Error getting available courses", error);
        }
    }
    const handleAddCourseDepartmentChange = (e) => {
        const dept = e.target.value;
        setAddCourseDepartment(dept); 
        setAddCourseNumber(addCourseBucketNumber[dept][0]); 
      };
      const handleAddCourseNumberChange = (e) => {
        setAddCourseNumber(e.target.value); 
      };

    useEffect(()=>{
        getAvailableCourses();
    },[]);

    
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
                                                    <Col xs={6} className="d-flex align-items-center">{course.title || "No courses entered"} </Col>
                                                    {course.id && (
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
                                                    )}
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
                <Col style={{ textAlign: 'left', display: 'flex', gap: '10px' }}>
                    <Button onClick={handleAddSemesterForm}>
                    Add Semester
                    </Button>
                    <Button onClick={handleShowAddCourseForm}>
                    Add Course
                    </Button>
                </Col>
                <Col style={{ textAlign: 'right' }}>
                    {isUserSignedIn && <Button
                    disabled={!changesMade}
                    onClick={handleSave}
                    >
                        {saveButtonText}
                    </Button>}
                </Col>
            </Row>

            {/*Modal to show course description to user on request */}
            <Modal
            size = 'lg' 
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

            {/*Modal for the form to add a Semester*/}
            <Modal
            show={showAddSemester}
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

            {/*Modal for the form to add a Class*/}
            <Modal
            size='lg'
            show={showAddCourse}
            onHide={handleHideAddCourseForm}
            centered
            >
                <Modal.Header closeButton> 
                    <Modal.Title>Add a Course</Modal.Title>
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

                                <Form.Group className="mb-3" controlId="formMajor">
                                    <Form.Label>Department</Form.Label>
                                    <Form.Select
                                    value={addCourseBucketDepartment}
                                    onChange={handleAddCourseDepartmentChange}
                                    >
                                    {addCourseBucketDepartment.map(([value, label]) => (
                                        <option key={value} value={value}>
                                        {label}
                                        </option>
                                    ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formConcentration">
                                    <Form.Label>Concentration</Form.Label>
                                    <Form.Select
                                    value={addCourseBucketNumber}
                                    onChange={handleAddCourseNumberChange}
                                    disabled={!addCourseBucketDepartment}
                                    >
                                    {addCourseBucketNumber[addCourseDepartment].keys?.map(([value, label]) => (
                                        <option key={value} value={value}>
                                        {label}
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

        </div>
    );
}

export default ScheduleContainer