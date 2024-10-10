//CSS
import 'bootstrap/dist/css/bootstrap.css'; // Import Bootstrap CSS
import '../styles.css';
//Packages 
import {React, useState, useEffect} from "react";

const ProfileBox = props => {
    const [user, setUser] = useState(props.name)
    const [email, setEmail] = useState(props.email)
    if (props.user !== null) {
        return (
            <div className='container'>
                <div className='row'>
                    <div className='col'>
                        <div className='container d-flex flex-column'>
                            <div className='row'>
                                <div className='col'>
                                    <p>{`Name: ${user}`}</p>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col d-flex'>
                                    <p>{`Email: ${email}`}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    else {
        return (
            <div className='container'>
                <a href={'http://localhost:3000/signin'}>Sign in</a>
            </div>
        )
    }
}

export default ProfileBox