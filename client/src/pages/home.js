//CSS
import 'bootstrap/dist/css/bootstrap.css'; // Import Bootstrap CSS
import '../styles.css';
//Packages 
import React from "react";
// Components
import LeftSideBar from "../components/LeftSideBar";
import ScheduleContainer from '../components/ScheduleContainer';
import Header from '../components/Header';
import ProgressTable from '../components/ProgressTable';
import { useState, useEffect } from 'react';
// Context
import { UserContext, UserProvider } from '../context/userContext';

/*
    --------------- TITLE ------------------
    [ FLoating ][                     ][ Floating ]
    [ Side     ][       Content       ][ Side     ]
    [ Bar      ][                     ][ Bar      ]
*/
const Home = () => {
    return (
        <UserProvider>
        <div id='HOME-PD' className='container'>
            <div id='HOME-TitleRow' className='row'>
                <Header/>
            </div>
            <div id='HOME-BodyRow' className='row'>
                <div id='HOME-LSB-PD' className='col'>
                    <LeftSideBar/>
                </div>
                <div id='HOME-CONTENT-PD' className='col-8'> 
                    <ProgressTable/>
                    <ScheduleContainer/>
                </div>
                <div id='HOME-RSB-PD' className='col'>
                    <p>RIGHT SIDE BAR</p>
                </div>
            </div>
        </div>
        </UserProvider>
    )
}

export default Home;