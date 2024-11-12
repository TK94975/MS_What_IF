import React, { useState } from 'react';
import { Modal, Button, Form, Container, Col, Row } from 'react-bootstrap';

function SignUp() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [warning, setWarning] = useState("");

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const handleSubmit = () => {
    if (password != checkPassword) {
        setWarning("Passwords dont match");
    }
    else {
        setWarning("");
        console.log(email);
        console.log(password);
        console.log(firstName);
        console.log(lastName);
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
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control 
                                type="password" 
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e)=> setPassword(e.target.value)} 
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formConfirmPassword">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control 
                                type="password" 
                                placeholder="Re-enter Password"
                                value={checkPassword}
                                onChange={(e)=> setCheckPassword(e.target.value)}  
                                />
                            </Form.Group>
                            {warning}

                            <Button variant="primary" type="submit">
                            Sign Up
                            </Button>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="formFirstName">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control 
                                type="firstName" 
                                placeholder="Enter First Name"
                                value={firstName}
                                onChange={(e)=> setFirstName(e.target.value)}   
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formLastName">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control 
                                type="LastName" 
                                placeholder="Enter Last Name"
                                value={lastName}
                                onChange={(e)=> setLastName(e.target.value)}    
                                />
                            </Form.Group>
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