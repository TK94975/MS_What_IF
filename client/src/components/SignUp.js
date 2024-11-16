import React, { useState } from 'react';
import { Modal, Button, Form, Container, Col, Row } from 'react-bootstrap';
import axios from 'axios';

const SignUp = ({onSignInSuccess}) => {
  // Show or hide modal
  const [show, setShow] = useState(false);
  const handleShow = () => {
    setShow(true);
    setWarning('');
  }
  const handleClose = () => {
    setShow(false);
    setEmail("");
    setPassword("");
    setCheckPassword("");
  }
  // Login info
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  // Error message if necessary
  const [warning, setWarning] = useState("");
  // Major and concentration code
  const [majors, setMajors] = useState([
    ["cs", "Computer Science"],
    ["ece", "Electrical and Computer Engineering"],
    ]);
    const [concentrations, setConcentrations] = useState({
    cs: [
        ['ai', 'Artificial Intelligence'],
        ['systems', 'Computer Systems'],
        ['theory', 'Theoretical CS'],
        ['old', 'Pre-2024']
    ],
    ece: [
        ['none', 'None']
    ],
    });
  const [selectedMajor, setSelectedMajor] = useState('cs');
  const [selectedConcentration, setSelectedConcentration] = useState('');
  const handleMajorChange = (e) => {
    const major = e.target.value;
    setSelectedMajor(major);
    setSelectedConcentration(concentrations[major][0][0]);
  };
  const handleConcentrationChange = (e) => {
    setSelectedConcentration(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password != checkPassword) {
        setWarning("Passwords dont match");
        return
    } else {
      try {
        const response = await axios.post('http://localhost:5000/users/signup', { email, password });
        if (response.status === 201){
          console.log('Sign-up successful:', response.status);
          sessionStorage.setItem('userID', response.data[0].id);
          sessionStorage.setItem('userEmail', response.data[0].email);
          onSignInSuccess();
          setShow(false);
        }
      } catch (error) {
        if (error.status === 409){
          setWarning("User already exists");
        }
        else {
          setWarning("Error creating account");
        }
      }
    }
  }

  return (
    <div>
      <Button variant="link" onClick={handleShow}>
        Sign Up
      </Button>

      {/* Modal for Sign In */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Sign In</Modal.Title>
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
                                onChange={(e)=> setEmail(e.target.value)}
                                required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control 
                                type="password" 
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e)=> setPassword(e.target.value)}
                                required 
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formConfirmPassword">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control 
                                type="password" 
                                placeholder="Re-enter Password"
                                value={checkPassword}
                                onChange={(e)=> setCheckPassword(e.target.value)}
                                required  
                                />
                            </Form.Group>
                            <p>{warning}</p>

                            <Form.Group className="mb-3" controlId="formMajor">
                              <Form.Label>Major</Form.Label>
                              <Form.Select
                              value={selectedMajor}
                              onChange={handleMajorChange}
                              >
                              {majors.map((major) => (
                              <option key={major[0]} value={major[0]}>
                              {major[1]}
                              </option>
                              ))}
                              </Form.Select>
                            </Form.Group>
                            
                            <Form.Group className="mb-3" controlId="formConcentration">
                              <Form.Label>Concentration</Form.Label>
                              <Form.Select
                              value={selectedConcentration}
                              onChange={handleConcentrationChange}
                              >
                              {concentrations[selectedMajor]?.map((concentration) => (
                              <option key={concentration[0]} value={concentration[0]}>
                              {concentration[1]}
                              </option>
                              ))}
                              </Form.Select>
                            </Form.Group>

                            <Button variant="primary" type="submit">
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
}

export default SignUp;