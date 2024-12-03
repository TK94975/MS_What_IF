import React, { useState, useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { UserContext } from '../context/userContext';

const SignIn = () => {
const {
	setIsUserSignedIn,
} = useContext(UserContext)

// Hiding and showing modal
const [show, setShow] = useState(false);
const handleShow = () => setShow(true);
const handleClose = () => setShow(false);
// Local user data
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
// Account creation warning
const [warning, setWarning] = useState("");

const handleSubmit = async (event) => {
	event.preventDefault();
	if (!email || !password) {
		setWarning("Please fill out all required fields.");
		return; // Prevent submission
	}
	try {
	const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/users/signin`, { email, password });
	sessionStorage.setItem('userID', response.data[0].id);
	sessionStorage.setItem('userEmail', response.data[0].email);
	sessionStorage.setItem('userMajor', response.data[0].major);
	sessionStorage.setItem('userConcentration', response.data[0].concentration)
	sessionStorage.setItem('userLoggedIn?', 'true');
	sessionStorage.setItem('userStartYear', response.data[0].start_year)
	sessionStorage.setItem('userStartSemester', response.data[0].start_semester)
	sessionStorage.setItem('passedDME', 'yes');
	sessionStorage.setItem('thesisProject', 'Project');
	console.log("session: ", response.data[0])
	setIsUserSignedIn(true);

	} catch (error) {
		if(error.status === 401){
		setWarning(error.response.data.error);
		} else {
		setWarning("Error signing in");
		}
		console.log(error);
	}
};

return (
	<div>
	<Button variant="link" onClick={handleShow}>
		Sign In
	</Button>

	{/* Modal for Sign In */}
	<Modal show={show} onHide={handleClose} centered>
		<Modal.Header closeButton>
		<Modal.Title>Sign In</Modal.Title>
		</Modal.Header>
		<Modal.Body>
		<Form onSubmit={handleSubmit}>
			<Form.Group className="mb-3" controlId="formEmail">
			<Form.Label>Email address</Form.Label>
			<Form.Control 
				type="email" 
				placeholder="Enter email" 
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				required
			/>
			<Form.Control.Feedback type="invalid">
				Please provide your email 
			</Form.Control.Feedback>
			</Form.Group>

			<Form.Group className="mb-3" controlId="formPassword">
			<Form.Label>Password</Form.Label>
			<Form.Control 
				type="password" 
				placeholder="Enter Password" 
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				required
			/>
			<Form.Control.Feedback type="invalid">
				Please provide your password
			</Form.Control.Feedback>
			</Form.Group>

			<Form.Group>
			<p className="text-danger">{warning}</p>
			</Form.Group>


			<Button variant="primary" type="submit" id="submit_signin" data-testid="submit-signin">
			Sign In
			</Button>
			
		</Form>
		</Modal.Body>
	</Modal>
	</div>
);
}

export default SignIn;