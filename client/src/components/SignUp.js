import React, { useState } from "react";
import { Modal, Button, Form, Container, Col, Row } from "react-bootstrap";
import axios from "axios";

const SignUp = ({
  onSignInSuccess,
  signInMajor,
  signInCon,
  onMajorChange,
  onConcentrationChange,
}) => {

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
    if (password !== checkPassword) {
      setWarning("Passwords do not match.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/users/signup", {
        email,
        password,
      });
      if (response.status === 201) {
        sessionStorage.setItem("userID", response.data[0].id);
        sessionStorage.setItem("userEmail", response.data[0].email);
        onSignInSuccess();
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
    ["cs", "Computer Science"],
    ["ece", "Electrical and Computer Engineering"],
  ]);
  const [concentrations] = useState({
    cs: [
      ["ai", "Artificial Intelligence"],
      ["systems", "Computer Systems"],
      ["theory", "Theoretical CS"],
      ["old", "Pre-2024"],
    ],
    ece: [["none", "None"]],
  });
  const handleMajorChange = (e) => {
    const major = e.target.value;
    onMajorChange(major); 
    onConcentrationChange(concentrations[major][0][0]); 
  };
  const handleConcentrationChange = (e) => {
    onConcentrationChange(e.target.value); 
  };

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
                  <p className="text-danger">{warning}</p>

                  <Form.Group className="mb-3" controlId="formMajor">
                    <Form.Label>Major</Form.Label>
                    <Form.Select
                      value={signInMajor}
                      onChange={handleMajorChange}
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
                      value={signInCon}
                      onChange={handleConcentrationChange}
                      disabled={!signInMajor}
                    >
                      {concentrations[signInMajor]?.map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
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
};

export default SignUp;