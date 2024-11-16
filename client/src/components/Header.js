//CSS
import 'bootstrap/dist/css/bootstrap.css'; // Import Bootstrap CSS
import '../styles.css';
//Packages 
import {React, useState, useEffect} from "react";

import ProfileBox from './ProfileBox';
import MajorConcentrationSelector from './MajorConcentrationSelector';
import SignIn from './SignIn';
import SignUp from './SignUp';

const Header = ({ isUserSignedIn, onSignInSuccess }) => {
    return (
      <header>
        {/* Conditional rendering based on the user's sign-in state */}
        {isUserSignedIn ? (
          <p>Welcome, User!</p>
        ) : (
          // Pass the callback to SignIn
          [<SignIn onSignInSuccess={onSignInSuccess} />, <SignUp onSignInSuccess={onSignInSuccess}/>]
        )}
      </header>
    );
  };

export default Header