//CSS
import 'bootstrap/dist/css/bootstrap.css'; // Import Bootstrap CSS
import '../styles.css';
//Packages
import React from "react";

const LeftSideBar = props => {
    return (
        <div id="LSB-PD" >
            <div id='LSB-TOP'>
                <p>TOP</p>
            </div>
            <div id='LSB-MIDDLE'>
                <p>SIDE BAR</p>
            </div>
            <div id='LSB-BOTTOM'>
                <p>BOTTOM</p>
            </div>
        </div>
    )
}

export default LeftSideBar;