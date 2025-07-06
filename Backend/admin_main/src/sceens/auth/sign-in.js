import React, { useState } from 'react';
import { Form, Button, Card, Image } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from '../../assets/images/auth/LrN-logo.png';
import languageImage from '../../assets/images/auth/Language.png';
import Footer from '../../components/Footer/Footer';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        {/* Left Side */}
        <div style={styles.leftSide}>
          <div style={styles.formContainer}>
            <Image src={logo} alt="Logo" style={styles.logo} />

            <Card style={styles.card}>
              <h4 className="text-center fw-bold text-dark mb-4">Enter Details</h4>

              <Form>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="tel"
                    placeholder="Phone Number"
                    style={styles.input}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    style={styles.input}
                  />
                </Form.Group>

                <Form.Group className="mb-3 position-relative">
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
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
                  <Button variant="link" className="p-0" style={styles.forgotLink}>
                    Forgot Password?
                  </Button>
                </div>

                <Button className="w-100 rounded-pill" style={styles.loginButton}>
                  Login
                </Button>
              </Form>
            </Card>
          </div>
        </div>

        {/* Right Side */}
        <div style={styles.rightSide}></div>
      </div>

      {/* Footer outside the container */}
      <Footer />
    </div>
  );
};

const styles = {
  pageWrapper: {
    backgroundColor: '#fff6ee',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    flex: 1,
    display: 'flex',
    height: 'calc(100vh - 120px)', // full height minus footer
    width: '100%',
  },
  leftSide: {
    width: '50%',
    backgroundColor: '#ffffff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px 20px',
  },
  formContainer: {
    width: '100%',
    maxWidth: 420,
  },
  logo: {
    maxWidth: 260,
    height: 100,
    display: 'block',
    margin: '0 auto 20px',
  },
  card: {
    backgroundColor: '#ffffff',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.06)',
    border: 'none',
    borderRadius: 20,
    padding: 30,
  },
  input: {
    backgroundColor: '#fff6ee',
    borderColor: '#ff8c42',
    borderRadius: '10px',
    height: '48px',
    fontSize: '15px',
    padding: '10px 15px',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 12,
    cursor: 'pointer',
    color: '#888',
  },
  forgotLink: {
    fontSize: 14,
    color: '#3B82F6',
    textDecoration: 'none',
    fontWeight: 600,
  },
  loginButton: {
    backgroundColor: '#3B82F6',
    border: 'none',
    padding: '12px 0',
    fontWeight: 600,
  },
  rightSide: {
    width: '50%',
    backgroundImage: `url(${languageImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
};

export default SignIn;
