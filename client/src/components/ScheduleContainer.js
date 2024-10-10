import 'bootstrap/dist/css/bootstrap.css'; // Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../styles.css';
//Packages
import {React, useState, useEffect}from "react";
import { useSearchParams } from 'react-router-dom';

// Spawn random Class Components
const spawnRandomClasses = props => {
    let classes = [
    {
        id: 'A',
        title: 'Class A',
        credits: 3,
        description: 'Class A is good',
        prerequisites: ['Y', 'Z']
    },
    {
        id: 'B',
        title: 'Class B',
        credits: 3,
        description: 'Class B is good',
        prerequisites: ['Y', 'Z']
    },
    {
        id: 'C',
        title: 'Class C',
        credits: 3,
        description: 'Class C is good',
        prerequisites: ['Y', 'Z']
    },
    {
        id: 'D',
        title: 'Class D',
        credits: 3,
        description: 'Class D is good',
        prerequisites: ['Y', 'Z']
    },
    ]
    return (
        <div id='classScroller-PD' className='d-flex flex-row'>
        {
            classes.map((data) => {
                return (
                    <div id='classEntityContainer' className='container'>
                        <div className='row'>
                            <div className='col d-flex justify-content-center'>
                                <p>{data.title}</p>
                            </div>
                            <div className='col d-flex justify-content-center'>
                                <p>{data.credits}</p>
                            </div>
                        </div>

                        <div className='row'>
                            <div className='col d-flex justify-content-center'>
                                <p>{data.description}</p>
                            </div>
                        </div>
                    </div>
                )
            })
        }
        </div>
    )
}

// Containers the Title and the dropdown/accordions for each semester
const spawnRandomYearCards = () => {
    let years = [1,2,3,4]
    return (
        <div className='accordion' id="parentYearAccordian">
            {
                years.map((year) => {
                    const [open, setOpen] = useState(false)
                    let cardTitle = `Year ${year}`
                    let cardDataTarget = `#collapseYear${year}`
                    let cardTarget = `collapseYear${year}`
                    let cardHeading = `card${year}Heading`
                    let cardDataDisplay = (open ? 'collapse show' : 'collapse')
                    return (
                        <div className="card">
                            <div className="card-header" id={cardHeading}>
                                <h5 class="mb-0">
                                    <a className='cardButton' onClick={(event) => {
                                        event.preventDefault()
                                        setOpen(!open)
                                    }}>
                                    {cardTitle}
                                    </a>
                                </h5>
                        `   </div>

                            <div id={cardTarget} className={cardDataDisplay}>
                                <div className="card-body">
                                {
                                    spawnRandomClasses()
                                }
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

const ScheduleContainer = props => {
    return (
        <div id='ScheduleContainer-PD' className='container'>
            <div className='row'>
                <div className='col'>
                    <div id='sc-title-pc' className='d-flex justify-content-center'>
                        <p>SCHEDULE</p>
                    </div>
                </div>
            </div>
            <div id="SC-FEED" className='row'>
            {
                spawnRandomYearCards()
            }
            </div>
            <></>
        </div>
    )   
}

export default ScheduleContainer