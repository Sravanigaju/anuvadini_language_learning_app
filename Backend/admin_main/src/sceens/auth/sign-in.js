import React, { useState } from 'react';
import { Form, Button, Card, Image } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from '../../assets/images/auth/LrN-logo.png';
import Footer from '../../components/Footer/Footer';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
   
    navigate('/dashboard');
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {/* Logo */}
        <Image src={logo} alt="Logo" style={styles.logo} />

        {/* Login Card */}
              <Card style={styles.card}>
          <h4 style={styles.heading}>Enter Details</h4>
          <Form onSubmit={handleLogin}>
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
              <a href="#forgot" style={styles.forgot}>Forgot Password?</a>
            </div>

            <Button
              type="submit"
              className="w-100"
              style={styles.loginButton}
            >
              Login
            </Button>
          </Form>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

const styles = {
  wrapper: {
    backgroundColor: '#FFFBF5', // A lighter, creamier background to match the image
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  container: {
    paddingTop: '40px',
    paddingBottom: '60px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    width: '240px', // Adjusted size to better match the reference
    height: 'auto',
    marginBottom: '30px',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    padding: '30px 25px',
    borderRadius: '20px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', // A more subtle shadow
    border: 'none',
    backgroundColor: '#ffffff',
  },
  heading: {
    textAlign: 'center',
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '25px',
    color: '#333333',
  },
  input: {
    backgroundColor: '#FEF3E6', // A light peach/tan background for inputs
    border: '1px solid #EADDCF', // A subtle border color that complements the background
    borderRadius: '10px',
    height: '48px',
    fontSize: '15px',
    padding: '0 15px',
  },
  eyeIcon: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)', // Better vertical centering
    right: '16px',
    color: '#A0A0A0',
    cursor: 'pointer',
  },
  forgot: {
    color: '#3B82F6',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: 500,
    textDecoration: 'none', // Good practice for links styled as text
  },
  loginButton: {
    backgroundColor: '#60A5FA', // A lighter, softer blue to match the image
    fontWeight: 600,
    padding: '12px 0',
    fontSize: '16px',
    border: 'none',
    borderRadius: '50px', // Creates the pill shape consistently
  },
};

export default SignIn;
