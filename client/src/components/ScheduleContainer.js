import 'bootstrap/dist/css/bootstrap.css'; // Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../styles.css';
import axios from 'axios';
//Packages
import {React, useState, useEffect, useContext}from "react";
import { Accordion, Form, Card, Col, Row, Button, Modal, Toast, ModalBody } from 'react-bootstrap';
import { UserContext } from '../context/userContext';
import { ColorBycore, ColorByconcentration } from "./ColorBy";
import LeftSideBar from "./LeftSideBar";


// Containers the Title and the dropdown/accordions for each semester

const ScheduleContainer =  () => {
    const {
        isUserSignedIn,
        courses,
        setCourses,
        selectedConcentration,
    } = useContext(UserContext);
    
    const gradeOptions = ["A", "A-", "B+", "B", "B-", "C+", "C", "D", "F", "E"]; // Enum for grade updating
    const semesterOptions = ['Spring','Summer','Fall','Winter'];
    const yearOptions = [2022,2023,2024,2025,2026,2027];

    
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
    const [addCourseDepartment, setAddCourseDepartment] = useState('') // Department of new class
    const [addCourseNumber, setAddCourseNumber] = useState(''); // Course # of new class
    const [addCourseBucketDepartment, setAddCourseBucketDepartment] = useState(['CSI', 'ECE','PHY','MAT']); // New class department options
    const [addCourseBucketNumber, setAddCourseBucketNumber] = useState({}) // Array of Maps {CSI: [number: id], ECE" [number:id]}

    /* Fetching user courses from the database */
    const getUserCourses = async () => {
        const user_id = sessionStorage.getItem('userID');
        try {
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/user_courses/get_user_courses`, {
                user_id,
            });
            setCourses(response.data.user_courses);
        } catch (err) {
            console.error("Error fetching courses:");
        }
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

    // Grouping courses after fetching
    useEffect(() => {
        if (courses.length > 0) {
            console.log("Grouping courses...");
            const grouped = getGroupedCourses(courses);
            setGroupedCourses(grouped);
        }
    }, [courses]);

    /* Code for course description modal */
    // handlers for show state of the modal
    const handleShowDescription = async (course_id) => {
        getCourseDescription(course_id);
        setShowDescription(true); 
    };
    const handleCloseDescription = () => {
        setShowDescription(false); 
        setCourseDescription([]);
    };
    // Backend call to get the course description
    const getCourseDescription = async (course_id) =>{
        const tempDescription = await axios.post(`${process.env.REACT_APP_SERVER_URL}/courses/course_description`, {
            course_id,
        });
        setCourseDescription(tempDescription.data);
    }

    /* Logic for changing grades in the accordian*/
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

    /* Logic for saving changes to the database */
    const handleSave = async () =>{
        setChangesMade(false);
        setSaveButtonText("Saved");
        try{
            console.log("Saving...");
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/user_courses/update_user_courses`, {
                courses,
            });
        }
        catch(error){
            console.error("Update failed", error);
            setChangesMade(true);
            setSaveButtonText("Save Changes");
        }
    };

    /* Logic for adding a semester to the schedule*/
    // Show and hide handlers for the modal
    const handleAddSemesterForm = () =>{
        setShowAddSemester(true);
    };
    const handleCloseAddSemesterForm= () =>{
        setShowAddSemester(false);
    };
    // Year and Semester state 
    const handleSetAddYear = (year) =>{
        setAddYear(year);
    };
    const handleSetAddSemester = (semester) => {
        setAddSemester(semester);
    };
    // Addes a dummy class with year and semester info so it shows up in the accordian
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

    /* Logic for removing a course from schedule */
    // Show and hide handlers for the modal
    const handleShowRemoveCourseWarning = (course) =>{
        setSelectedCourseRemove(course);
        setShowRemoveCourseWarning(true);

    }
    const handleCloseRemoveCourseWarning = () =>{
        setShowRemoveCourseWarning(false);
        setSelectedCourseRemove('');
    }
    // Actually removing the course
    const handleRemoveCourse = async (badCourse) =>{
        // TODO: Add the prereq check
        //TODO:
        let course_id = badCourse.id
        let prereq = []

        // Get the prerequisites for this new course
        try {
            let response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/course_prerequisites/inverse/${course_id}`);
            console.log('Prereqs found')
            prereq = response.data
            console.log(response.data)
        }
        catch (err) {
            console.log(err.response.data.message)
            prereq = []
        }
        
        if(prereq.length > 0) {
            // Check if the found courses exist in schedule
            let i = 0
            let j = 0
            while(i < prereq.length) {
                let dependent_class = prereq[i]
                while(j < courses.length) {
                    let current_class = courses[j]
                    if(current_class.number === dependent_class.number) {
                        alert(`Cannot remove ${badCourse.department}${badCourse.number} because ${dependent_class.department}${dependent_class.number} is dependent on it!\nPlease remove ${dependent_class.department}${dependent_class.number} first.`)
                        return;
                    }
                    j+=1
                }
                j=0
                i+=1
            }
        }
        //
        const updatedCourses = courses.filter((course) => 
            !(course.id === badCourse.id && course.year === badCourse.year && course.semester === badCourse.semester)
        );
        setCourses(updatedCourses);
        setShowRemoveCourseWarning(false);
        setChangesMade(true);
    };

    /* Logic for adding a course to the schedule*/
    // Show and hide handlers for the modal
    const handleShowAddCourseForm = () =>{
        const course_id = addCourseBucketNumber[addCourseDepartment].get(Number(addCourseNumber));
        getCourseDescription(String(course_id));
        setShowAddCourse(true);
    };
    const handleHideAddCourseForm = () =>{
        setShowAddCourse(false);
    }
    
    // Getting available course info from the database
    const getAvailableCourses = async () =>{
        console.log("Getting available courses")
        try{
            const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/courses/course_options`);
            const availableCourses = response.data;
            let csiNumbers = new Map();
            let eceNumbers = new Map();
            let phyNumbers = new Map();
            let matNumbers = new Map();
            availableCourses.forEach((course) => {
                if(course.department === 'CSI'){
                    csiNumbers.set(course.number, course.id)
                }if(course.department === 'PHY'){
                    phyNumbers.set(course.number, course.id)
                }if(course.department === 'MAT'){
                    matNumbers.set(course.number, course.id)
                } else {
                    eceNumbers.set(course.number, course.id)
                }
            });
            const formatedNumbers = {CSI: csiNumbers, ECE: eceNumbers,PHY: phyNumbers,MAT: matNumbers};
            setAddCourseBucketNumber(formatedNumbers);
            setAddCourseDepartment('CSI');
            setAddCourseNumber("500");
        }
        catch(error){
            console.error("Error getting available courses", error);
        }
    };
    // Will be called when the component is rendered
    useEffect(()=>{
        getAvailableCourses();
    },[]);
    
    // State of new course department
    const handleAddCourseDepartmentChange = (e) => {
        const dept = e.target.value; 
        setAddCourseDepartment(dept); 
    
        const firstNumber = Array.from(addCourseBucketNumber[dept]?.keys())[0];
        setAddCourseNumber(firstNumber);
    };
    // State of new course number
    const handleAddCourseNumberChange = (e) => {
        const newNumber = e.target.value;
        setAddCourseNumber(newNumber);   

    };
    // When new course number is changed, update class description
    useEffect(()=>{
        if(addCourseNumber){
            const course_id = addCourseBucketNumber[addCourseDepartment].get(Number(addCourseNumber));
            getCourseDescription(String(course_id));
        }
    },[addCourseNumber])

    // Actually adding the course
    const handleAddNewCourse = async (event) =>{
        event.preventDefault(); // Stops the page from rerendering
        console.log("handleAddNewCourse: Checking for dependency conflicts")
        //TODO:
        let course_id = addCourseBucketNumber[addCourseDepartment].get(Number(addCourseNumber))
        let prereq = []
        let prereq_satisfied = true

        // Get the prerequisites for this new course
        try {
            let response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/course_prerequisites/${course_id}`);
            console.log('Prereqs found')
            prereq = response.data
            console.log(response.data)
        }
        catch (err) {
            console.log(err.response.data.message)
            prereq = []
        }
        let any_prereq_found = prereq.length === 0
        if(prereq.length > 0) {
            let classes_found = false
            let semester_map = {
                "winter": 0,
                "spring": 1,
                "summer": 2,
                "fall": 3
            }
            prereq.map(pr => {
                let prereq_num = pr.number
                let i = 0
                while(i < courses.length) {
                    let current_course_number = courses[i].number
                    let error_msg = `${addCourseDepartment}${addCourseNumber} MUST occur after ${courses[i].semester} ${courses[i].year} (prerequisite class ${pr.department}${prereq_num})`
                    // We found the prerequisite class in the schedule
                    if(current_course_number === prereq_num) {
                        any_prereq_found = true
                        // check if there are prerequisites before this course
                        if(addYear < courses[i].year) {
                            // TODO: Error
                            prereq_satisfied = false
                            alert(error_msg)
                        }
                        else if( addYear === courses[i].year && semester_map[addSemester.toLowerCase()] <= semester_map[courses[i].semester.toLowerCase()]) {
                            //TODO: Error
                            prereq_satisfied = false
                            alert(error_msg)
                        }
                        else {
                            //This class is valid
                            classes_found = true
                            // If prereqs are valid, this will stay valid
                            prereq_satisfied = prereq_satisfied && classes_found
                        }
                    }
                    i+=1
                }
            })
            console.log(courses)
            // check if there are prerequisites after this course
        }
        if (!prereq_satisfied || !any_prereq_found) {
            //Error occured so return
            if (!any_prereq_found) {
                alert(`No prerequisite courses found in schedule! Please use the course lookup on the right sidebar for more information regarding ${addCourseDepartment}${addCourseNumber}`)
            }
            console.log("Prereq check FAILED... Exiting")
            return;
        }
        console.log("Adding new course");
        // Remove placeholder class if exists
        let updatedCourses = courses.filter(
            (course) => !(course.id === null && course.year === addYear && course.semester === addSemester)
        );
        // Create new course entry
        const newCourse = {
            id: course_id,
            year: addYear,
            semester: addSemester,
            department: addCourseDepartment,
            number: addCourseNumber,
            title: courseDescription.title,
            grade: null,
            credits: courseDescription.credits,
            user_id: sessionStorage.getItem('userID')
        }
        setCourses([...updatedCourses, newCourse]);
        setChangesMade(true);
    };

    /* Logic for the completed checkbox*/
    const handleCourseCompletionToggle = (course) => {
        const updatedCourses = courses.map((updatedCourse) =>
            updatedCourse.id === course.id && updatedCourse.year === course.year && updatedCourse.semester === course.semester
                ? { ...updatedCourse, completed: updatedCourse.completed === 'yes' ? 'no' : 'yes' }
                : updatedCourse
        );
        setCourses(updatedCourses);
        setChangesMade(true); // Track changes for saving
    };
    
    return (
        <div
            style={{backgroundColor: "lightgray"}}
        >
            <h1>Schedule</h1>
            {/* Main accordian with course information */}
            <Accordion alwaysOpen>
                {Object.keys(groupedCourses).map((year, yearIndex) => (
                    <Accordion.Item eventKey={yearIndex} key={year}>
                        <Accordion.Header>{`Year: ${year}`}</Accordion.Header>
                        <Accordion.Body
                            style={{backgroundColor: "lightgray"}}
                        >
                            {Object.keys(groupedCourses[year]).map((semester, semesterIndex) => (
                                <div key={semester}>
                                    <h5>{semester}</h5>
                                    <ul>
                                        {groupedCourses[year][semester].map((course) => {
                                            // Determine if the course is a core course
                                            return (
                                                <ColorBycore
                                                    key={course.id}
                                                    department={course.department}
                                                    title={course.title}
                                                    courseNumber={course.number}
                                                    major={course.department}
                                                    course_id={course.id}
                                                    concentration={selectedConcentration}
                                                >
                                                    <p>{`${course.id} ${course.department} ${course.number} ${selectedConcentration}`}</p>
                                                    <Card>
                                                        <ColorByconcentration concentration={selectedConcentration}>
                                                            <Row>
                                                                <Col xs={1}>
                                                                    <Button
                                                                        variant="link"
                                                                        onClick={() => handleShowDescription(course.id)}
                                                                    >
                                                                        {`${course.department} ${course.number}`}
                                                                    </Button>
                                                                </Col>
                                                                <Col xs={6} className="d-flex align-items-center">
                                                                    {course.title || "No courses entered"}
                                                                </Col>
                                                                <Col xs={2} className="d-flex align-items-center">
                                                                    <Form.Check
                                                                        type="checkbox"
                                                                        label="Completed?"
                                                                        checked={course.completed === "yes"}
                                                                        onChange={() => handleCourseCompletionToggle(course)}
                                                                    />
                                                                </Col>
                                                                {course.id && (
                                                                    <Col xs={2} className="d-flex align-items-center">
                                                                        <Form.Select
                                                                            value={course.grade || ""}
                                                                            onChange={(e) =>
                                                                                handleChangeGrade(course, e.target.value)
                                                                            }
                                                                        >
                                                                            <option value="" disabled>
                                                                                Select grade
                                                                            </option>
                                                                            {gradeOptions.map((grade) => (
                                                                                <option key={grade} value={grade}>
                                                                                    {grade}
                                                                                </option>
                                                                            ))}
                                                                        </Form.Select>
                                                                    </Col>
                                                                )}
                                                                <Col xs={1}
                                                                     className="d-flex align-items-center justify-content-center">
                                                                    <Button
                                                                        variant="danger"
                                                                        size="sm"
                                                                        onClick={() => handleShowRemoveCourseWarning(course)}
                                                                        data-testid="btn-removeCourse">
                                                                        X
                                                                    </Button>
                                                                </Col>
                                                            </Row>
                                                        </ColorByconcentration>
                                                    </Card>
                                                </ColorBycore>
                                            );
                                        })}
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
                    <Button onClick={handleAddSemesterForm} id="show_addsemester" data-testid="show_addsemester">
                    Add Semester
                    </Button>
                    <Button onClick={handleShowAddCourseForm} id="show_addcourse" data-testid="show_addcourse">
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
                                    <Form.Label id="addsemester-year-field">New Year</Form.Label>
                                    <Form.Select
                                    aria-labelledby="addsemester-year-field"
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
                                    <Form.Label id="addsemester-semester-field">New Semester</Form.Label>
                                    <Form.Select
                                    aria-labelledby="addsemester-semester-field"
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
                                data-testid="submit-addsemester"
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

            {/*Modal for the form to add a Course*/}
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
                            <Form onSubmit={handleAddNewCourse}>
                                <Form.Group className="mb-3" controlId="formYear">
                                    <Form.Label id="addcourse-year-field">Select Year</Form.Label>
                                    <Form.Select
                                    aria-labelledby="addcourse-year-field"
                                    value={addYear}
                                    onChange={(e) => handleSetAddYear(e.target.value)}
                                    required
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
                                    <Form.Label id="addcourse-semester-field" >Select Semester</Form.Label>
                                    <Form.Select
                                    aria-labelledby="addcourse-semester-field"
                                    value={addSemester}
                                    onChange={(e) => handleSetAddSemester(e.target.value)}
                                    required
                                    >
                                    <option value="" disabled>Select a semester</option>
                                    {semesterOptions.map((value) => (
                                        <option key={value} value={value}>
                                        {value}
                                        </option>
                                    ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formDepartment">
                                    <Form.Label id="addcourse-department-field">Department</Form.Label>
                                    <Form.Select
                                    aria-labelledby="addcourse-department-field"
                                    value={addCourseDepartment}
                                    onChange={handleAddCourseDepartmentChange}
                                    required
                                    >
                                    {addCourseBucketDepartment.map((value) => (
                                        <option key={value} value={value}>
                                        {value}
                                        </option>
                                    ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formNumber">
                                    <Form.Label id="addcourse-number-field">Number</Form.Label>
                                    <Form.Select
                                    aria-labelledby="addcourse-number-field"
                                    value={addCourseNumber}
                                    onChange={handleAddCourseNumberChange}
                                    disabled={!addCourseDepartment}
                                    required
                                    >
                                    {Array.from(addCourseBucketNumber[addCourseDepartment]?.entries() || []).map(
                                        ([number, id]) => (
                                            <option key={id} value={number}>
                                                {number}
                                            </option>
                                        )
                                    )}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group>
                                    <Row><h5>{courseDescription.title}</h5></Row>
                                    <Row><h6>Description</h6></Row>
                                    <Row>{courseDescription.description}</Row>
                                    <Row><h6>Prequisites</h6></Row>
                                </Form.Group>
                                <Form.Group>
                                    <Col style={{ textAlign: 'right' }}>
                                    <Button type='submit' data-testid="submit-addcourse" > 
                                        Add Course
                                    </Button>
                                    </Col>
                                </Form.Group>
                            </Form>
                    </ModalBody>
            </Modal>

        </div>
    );
}

export default ScheduleContainer