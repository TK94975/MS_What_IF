//CSS
import 'bootstrap/dist/css/bootstrap.css'; // Import Bootstrap CSS
import '../styles.css';
//Packages 
import React from "react";
// Components
import LeftSideBar from "../components/LeftSideBar";
import RightSideBar from '../components/RightSideBar';
import ScheduleContainer from '../components/ScheduleContainer';
import Header from '../components/Header';
import ProgressTable from '../components/ProgressTable';
import ChatbaseChatbot from '../components/ChatbaseChatbot';
import ColorLegend from '../components/ColorLegend';
// Context
import { UserProvider } from '../context/userContext';


/*
    --------------- TITLE ------------------
    [ FLoating ][                     ][ Floating ]
    [ Side     ][       Content       ][ Side     ]
    [ Bar      ][                     ][ Bar      ]
*/
const Home = () => {
    return (
        <UserProvider>
            <div id='HOME-PD' className='container'
                 style={{backgroundColor: "lightgray"}}
            >
                <div id='HOME-TitleRow' className='row'>
                    <Header/>
                </div>
                <div id='HOME-BodyRow' className='row'
                     style={{backgroundColor: "lightgray"}}
                >
                    <div id='HOME-LSB-PD' className='col'>
                        {<LeftSideBar/>}
                    </div>
                    <div id='HOME-CONTENT-PD' className='col-8'>
                        <ProgressTable/>
                        <ScheduleContainer/>
                        <ChatbaseChatbot/>
                    </div>
                    <div id='HOME-RSB-PD' className='col'>
                        <RightSideBar/>
                        <ColorLegend/>
                    </div>
                </div>
            </div>
        </UserProvider>
    );
};


export default Home;