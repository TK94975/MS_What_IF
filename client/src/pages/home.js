//CSS
import 'bootstrap/dist/css/bootstrap.css'; // Import Bootstrap CSS
import '../styles.css';
//Packages 
import React from "react";
// Components
import LeftSideBar from "../components/LeftSideBar";
import ScheduleContainer from '../components/ScheduleContainer';
import Header from '../components/Header';
import { useState, useEffect } from 'react';

/*
    --------------- TITLE ------------------
    [ FLoating ][                     ][ Floating ]
    [ Side     ][       Content       ][ Side     ]
    [ Bar      ][                     ][ Bar      ]
*/
const Home = () => {
    const [isUserSignedIn, setIsUserSignedIn] = useState(false);

    const handleSignInSuccess = (event) => {
      setIsUserSignedIn(event);
    };

    useEffect(() => {
        if (sessionStorage.getItem("userLoggedIn?") === 'true') {
            setIsUserSignedIn(true);
        } else{
            setIsUserSignedIn(false);
        }
    }, []);

    return (
        <div id='HOME-PD' className='container'>
            <div id='HOME-TitleRow' className='row'>
                <Header isUserSignedIn={isUserSignedIn} onSignInSuccess={handleSignInSuccess} />
            </div>
            <div id='HOME-BodyRow' className='row'>
                <div id='HOME-LSB-PD' className='col'>
                    <LeftSideBar/>
                </div>
                <div id='HOME-CONTENT-PD' className='col-8'> 
                    <ScheduleContainer isUserSignedIn={isUserSignedIn} />
                </div>
                <div id='HOME-RSB-PD' className='col'>
                    <p>RIGHT SIDE BAR</p>
                </div>
            </div>
        </div>
    )
}

export default Home;