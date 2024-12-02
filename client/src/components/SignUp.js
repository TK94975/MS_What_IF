import React, { useState, useContext} from "react";
import { Modal, Button, Form, Container, Col, Row } from "react-bootstrap";
import { UserContext } from "../context/userContext";
import axios from "axios";

const SignUp = () => {
	const {
		setIsUserSignedIn,
		selectedMajor,
		handleMajorChange,
		selectedConcentration,
		handleConcentrationChange,
		userStartYear,
		setUserStartYear,
		userStartSemester,
		setUserStartSemester,
	} = useContext(UserContext)

	// Showing and hiding hthe model
	const [show, setShow] = useState(false);
	const handleClose = () => {
		setShow(false);
		setEmail("");
		setPassword("");
		setCheckPassword("");
		setWarning("");
	};
	// User data
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [checkPassword, setCheckPassword] = useState("");
	// Account creation warning
	const [warning, setWarning] = useState("");
	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!email || !password || !checkPassword) {
			setWarning("Please fill out all required fields.");
			return; // Prevent submission
		}
		if (password !== checkPassword) {
		setWarning("Passwords do not match");
		return;
		}
		try {
			const major = selectedMajor;
			const concentration = selectedConcentration;
			const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/users/signup`, {
				email,
				password,
				major,
				concentration,
				start_year: userStartYear,
				start_semester: userStartSemester
			});
			if (response.status === 201) {
				sessionStorage.setItem('userID', response.data[0].id);
				sessionStorage.setItem('userEmail', response.data[0].email);
				sessionStorage.setItem('userMajor', response.data[0].major);
				sessionStorage.setItem('userConcentration', response.data[0].concentration)
				sessionStorage.setItem('userLoggedIn?', 'true');
				sessionStorage.setItem('userStartYear', response.data[0].start_year)
				sessionStorage.setItem('userStartSemester', response.data[0].start_semester)
				setIsUserSignedIn(true);
				setShow(false);
			}
		} catch (error) {
			if (error.response?.status === 409) {
				setWarning("User already exists.");
			} else {
				setWarning("Error creating account.");
			}
		}
	};


	// Major and concentration
	const [majors] = useState([
		["CSI", "Computer Science"],
		["ECE", "Electrical and Computer Engineering"],
	]);
	const concentrations = {
		CSI: [
		["Artificial Intelligence and Machine Learning", "Artificial Intelligence"],
		["Systems", "Computer Systems"],
		["Theoretical Computer Science", "Theoretical CS"],
		["Old Computer Science", "Pre-2024"],
		],
		ECE: [
		["Signal Processing and Communications", "Signal Processing"],
		["Electronic Circuits and Systems", "Electronic Circuits"],
		["Control and Computer Systems", "Control Systems"],
		],
	};
	// Starting Semester
	const semesterOptions = ['Spring','Summer','Fall','Winter'];
	const yearOptions = [2022,2023,2024,2025,2026,2027];

	return (
		<div>
		<Button variant="link" onClick={() => setShow(true)}>
			Sign Up
		</Button>

		<Modal show={show} onHide={handleClose} centered>
			<Modal.Header closeButton>
			<Modal.Title>Sign Up</Modal.Title>
			</Modal.Header>
			<Modal.Body>
			<Form onSubmit={handleSubmit}>
				<Container>
				<Row>
					<Col>
					<Form.Group className="mb-3" controlId="formEmail">
						<Form.Label>Email address</Form.Label>
						<Form.Control
						type="email"
						placeholder="Enter email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						/>
					</Form.Group>

					<Form.Group className="mb-3" controlId="formPassword">
						<Form.Label>Password</Form.Label>
						<Form.Control
						type="password"
						placeholder="Enter password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						/>
					</Form.Group>

					<Form.Group className="mb-3" controlId="formConfirmPassword">
						<Form.Label>Confirm Password</Form.Label>
						<Form.Control
						type="password"
						placeholder="Re-enter password"
						value={checkPassword}
						onChange={(e) => setCheckPassword(e.target.value)}
						required
						/>
					</Form.Group>
					

					<Form.Group className="mb-3" controlId="formMajor">
						<Form.Label>Major</Form.Label>
						<Form.Select
						value={selectedMajor}
						onChange={(e)=>handleMajorChange(e.target.value)}
						>
						{majors.map(([value, label]) => (
							<option key={value} value={value}>
							{label}
							</option>
						))}
						</Form.Select>
					</Form.Group>

					<Form.Group className="mb-3" controlId="formConcentration">
						<Form.Label>Concentration</Form.Label>
						<Form.Select
						value={selectedConcentration}
						onChange={(e) => handleConcentrationChange(e.target.value)}
						disabled={!selectedMajor}
						>
						{concentrations[selectedMajor]?.map(([value, label]) => (
							<option key={value} value={value}>
							{label}
							</option>
						))}
						</Form.Select>
					</Form.Group>
					<Form.Group className="mb-3">
						<Row>
							<Form.Label>Starting Semester</Form.Label>
							<Col sm={6}>
								<Form.Select
									value={userStartYear}
									onChange={(e) => setUserStartYear(e.target.value)}
									required
								>
									<option value="" disabled>Year</option>
									{yearOptions.map((value) => (
										<option key={value} value={value}>
											{value}
										</option>
									))}
								</Form.Select>
							</Col>
							<Col sm={6}>
								<Form.Select
									value={userStartSemester}
									onChange={(e) => setUserStartSemester(e.target.value)}
									required
								>
									<option value="" disabled>Semester</option>
									{semesterOptions.map((value) => (
										<option key={value} value={value}>
											{value}
										</option>
									))}
								</Form.Select>
							</Col>
						</Row>

					</Form.Group>

					<Form.Group>
						<p className="text-danger">{warning}</p>
					</Form.Group>

					<Button variant="primary" type="submit" id="submit_signup" data-testid="submit-signup">
						Sign Up
					</Button>
					</Col>
				</Row>
				</Container>
			</Form>
			</Modal.Body>
		</Modal>
		</div>
	);
};

export default SignUp;