import axios from 'axios';
import React, { useState, useContext, useEffect} from 'react';
import { UserContext } from '../context/userContext';
import { Container, Row, Col } from "react-bootstrap";
import DateRange from './DateRange';
import MajorConcentrationSelector from './MajorConcentrationSelector';

const RightSideBar = props => {
    const [courses, setCourses] = useState([])
    const [desiredCourse, setDesiredCourse] = useState('')
    const [desiredDept, setDesiredDept] = useState('CSI')

    const GetClasses = async () => {
        console.log("Loading class details");
        try{
            const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/courses/expanded_details`);
            parseRawCourseDetails(response.data)
        }
        catch(error){
            console.log(error.status, error.data);
        }
    }

    const parseRawCourseDetails = (rawCourseData) => {
        console.log(rawCourseData)
        var classes = [];

        rawCourseData.forEach(element => {
            let exists = false
            let i = 0
            while (i < classes.length) {
                // We are adding another prerequisite
                if (classes[i].id == element.id) {
                    exists = true
                    classes[i].prereqs.push({"department": element.pr_department,"number": element.pr_number,"title": element.pr_title})
                    break
                }
                i+=1
            }
            if (!exists) {
                // We have not seen this class yet, so lets add it to our array
                // Does this class have a prereq attached to it?
                if(Object.is(element.pr_id, null)){
                    classes.push({
                        "id": element.id,
                        "department": element.department,
                        "number": element.number,
                        "title": element.title,
                        "description": element.description,
                        "prereqs": []
                    })
                }
                else {
                    // add its first prereq
                    classes.push({
                        "id": element.id,
                        "department": element.department,
                        "number": element.number,
                        "title": element.title,
                        "description": element.description,
                        "prereqs": [{"department": element.pr_department,"number": element.pr_number,"title": element.pr_title}]
                    })
                }
            }
        });
        console.log(classes)
        setCourses(classes)
    }

    const renderPreview = () => {
        if(desiredCourse.length === 3) {
            let c = {}
            let i = 0
            while(i < courses.length){
                if (courses[i].number == desiredCourse && courses[i].department === desiredDept){
                    return (
                        <div style={{"paddingTop":"10px"}}>
                            <h6>Title</h6>
                            <p>{courses[i].title}</p>
                            <h6>Description</h6>
                            <p>{courses[i].description}</p>
                            <p>Prerequisites:</p>
                            <ul>{courses[i].prereqs.map(element => {
                                let str = `${element.department} ${element.number}\n${element.title}`
                                return (
                                    <li>
                                        <p>{str}</p>
                                    </li>
                                )
                            })}</ul>
                        </div>
                    )
                }
                i+=1
            }
        }
    }

    useState(async () => {
        await GetClasses()
    }, [])

    return (
        <div style={styles.parent}>
            <div style={styles.spacer}>

            </div>
            <div className="container" style={styles.title}>
                <MajorConcentrationSelector/>
            </div>
            <div className="container" style={styles.title}>
                <h3 >Class Lookup</h3>
                <div style={{flexDirection:'row'}}>
                    <input type='text' placeholder='Enter course number' onChange={event => {
                        setDesiredCourse(event.target.value.substring(0,3))
                    }}/>
                    <select onChange={event => {
                        setDesiredDept(event.target.value)
                        console.log(event.target.value)
                    }}>
                        <option value={"CSI"} defaultValue={true}>CSI</option>
                        <option value={"ECE"}>ECE</option>
                        <option value={"PHY"}>PHY</option>
                        <option value={"MAT"}>MAT</option>
                    </select>
                </div>
            </div>
            <div style={styles.sidebar}>
                <div>{renderPreview()}</div>
            </div>
        </div>
    );
}

const styles = {
    "sidebar": {
        "display": "flex",
        "flexDirection": "column",
        "padding": "10px",
        "borderBottomRightRadius": "10px",
        "borderBottomLeftRadius": "10px",
        "backgroundColor": "lightGrey",
        "overflowY": "scroll",
        "maxHeight": "60%"
    },
    "title": {
        "backgroundColor": "lightGrey",
        "borderTopRightRadius": "10px",
        "borderTopLeftRadius": "10px",
        "paddingLeft": "5px",
        "paddingRight": "5px",
    },
    "spacer": {
        "height": "10%"
    },
    "parent": {
        "maxHeight": "90%",
        "justifyContent": "center"
    }
}

export default RightSideBar