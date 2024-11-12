//CSS
import 'bootstrap/dist/css/bootstrap.css'; // Import Bootstrap CSS
import '../styles.css';
//Packages 
import {React, useState, useEffect} from "react";

import ProfileBox from './ProfileBox';
import MajorConcentrationSelector from './MajorConcentrationSelector';
import SignIn from './SignIn';
import SignUp from './SignUp';


const Header = props => {

    return (
        <div className='container'>
            <div className='row'>
                <div className='col'>
                    <SignIn/> <SignUp/>
                </div>
                <div className='col'>
                    <MajorConcentrationSelector/>
                </div>
            </div>
        </div>
    )
}

export default Header