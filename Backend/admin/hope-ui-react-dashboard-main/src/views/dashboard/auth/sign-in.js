import React, { useState } from 'react';
import { Row, Col, Form, Button, Card, Image, Container } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from '../../../assets/images/auth/LrN-logo.png';
import Footer from '../components/Footer/Footer';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div style={styles.wrapper}>
      <Container fluid className="flex-grow-1 p-0" style={styles.content}>
        <Row className="g-0" style={{ flex: 1 }}>
          {/* LEFT SIDE - FORM */}
          <Col
            xs={12}
            md={6}
            className="d-flex align-items-center justify-content-center"
            style={styles.leftSide}
          >
            <div style={{ width: '100%', maxWidth: 420, padding: 20 }}>
              <div className="text-center mb-4">
                <Image src={logo} alt="Logo" style={{ maxWidth: 260, height: 100 }} />
              </div>

              <Card className="p-4 shadow rounded-4 border-0" style={styles.card}>
                <h4 className="text-center mb-3 fw-bold text-dark">Enter Details</h4>

                <Form.Group className="mb-3">
                  <Form.Control
                    type="tel"
                    placeholder="Phone Number"
                    disabled
                    style={styles.input}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    disabled
                    style={styles.input}
                  />
                </Form.Group>

                <Form.Group className="mb-3 position-relative">
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    disabled
                    style={styles.input}
                  />
                  <span
                    style={styles.eyeIcon}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </Form.Group>

                <div className="d-flex justify-content-end mb-3">
                  <button
                    type="button"
                    className="btn btn-link text-primary fw-semibold p-0"
                    style={{ textDecoration: 'none', fontSize: 14 }}
                  >
                    Forgot Password?
                  </button>
                </div>

                <Button className="w-100 rounded-pill" style={styles.loginButton} disabled>
                  Login
                </Button>
              </Card>
            </div>
          </Col>

          {/* RIGHT SIDE - IMAGE */}
          <Col
            md={6}
            className="d-none d-md-block"
            style={styles.rightImage}
          />
        </Row>
      </Container>

      {/* Sticky Footer */}
      <Footer />
    </div>
  );
};

const styles = {
  wrapper: {
    backgroundColor: '#fff6ee',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  leftSide: {
    backgroundColor: '#ffffff',
    padding: '40px 20px',
    height: '100%',
  },
  input: {
    backgroundColor: '#fff6ee',
    borderColor: '#ff8c42',
    borderRadius: '8px',
    height: '45px',
    fontSize: '16px',
  },
  eyeIcon: {
    position: 'absolute',
    right: '15px',
    top: '12px',
    cursor: 'pointer',
    zIndex: 1,
    color: '#888',
  },
  loginButton: {
    backgroundColor: '#3B82F6',
    border: 'none',
    padding: '12px 0',
    fontWeight: 600,
  },
  rightImage: {
    backgroundImage: `url('/images/Language.png')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100%',
  },
  card: {
    backgroundColor: '#ffffff',
    boxShadow: '0 0 16px rgba(0, 0, 0, 0.05)',
    borderRadius: 16,
  },
};

export default SignIn;
