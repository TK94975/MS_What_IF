import React, { useState } from 'react';
import { Modal, Button, Form, Container, Col, Row } from 'react-bootstrap';
import axios from 'axios';

const SignUp = ({onSignInSuccess}) => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [warning, setWarning] = useState("");

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setEmail("");
    setPassword("");
    setCheckPassword("");
  }

  const handleSubmit = async (event) => {
    if (password != checkPassword) {
        setWarning("Passwords dont match");
        return
    } else {
      try {
        const response = await axios.post('http://localhost:5000/users/signup', { email, password });
        console.log('Sign-up successful:', response.status);
        onSignInSuccess();

      } catch (error) {
        console.error('Sign-in failed:', error);
      }
    }

  }

  return (
    <div>
      {/* Sign In Link */}
      <a href="#" onClick={handleShow}>
        Sign Up
      </a>

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