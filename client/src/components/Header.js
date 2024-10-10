//CSS
import 'bootstrap/dist/css/bootstrap.css'; // Import Bootstrap CSS
import '../styles.css';
//Packages 
import {React, useState, useEffect} from "react";

import ProfileBox from './ProfileBox';
import MajorConcentrationSelector from './MajorConcentrationSelector';


const Header = props => {

    return (
        <div className='container'>
            <div className='row'>
                <div className='col'>
                    <h6>SUNY University at Albany</h6>
                    <ProfileBox name={"Dawson Geist"} email={"dgeist@albany.edu"}/>
                </div>
                <div className='col'>
                    <MajorConcentrationSelector/>
                </div>
            </div>
        </div>
    )
}

export default Header