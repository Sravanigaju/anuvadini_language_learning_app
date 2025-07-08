import React, { useState } from 'react';
import { Form, Button, Card, Image } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from '../../assets/images/auth/LrN-logo.png';
import Footer from '../../components/Footer/Footer';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header/Header';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (event) => {
    event.preventDefault();
    // Add your registration logic here
    navigate('/dashboard');
  };

  return (
    <div>
      <Header />
      <div style={styles.wrapper}>
        <div style={styles.container}>
          <Image src={logo} alt="Logo" style={styles.logo} />

          <Card style={styles.card}>
            <h4 style={styles.heading}>ADMIN REGISTRATION</h4>
            <Form onSubmit={handleRegister}>
              <Form.Group className="mb-3" style={styles.formGroup}>
                <Form.Label style={styles.label}>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Full Name"
                  style={styles.inputHorizontal}
                />
              </Form.Group>

              <Form.Group className="mb-3" style={styles.formGroup}>
                <Form.Label style={styles.label}>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Email"
                  style={styles.inputHorizontal}
                />
              </Form.Group>
            
              <Form.Group className="mb-3" style={styles.formGroup}>
                <Form.Label style={styles.label}>Mobile</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Email"
                  style={styles.inputHorizontal}
                />
              </Form.Group>

              <Form.Group className="mb-3" style={styles.formGroup}>
                <Form.Label style={styles.label}>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Username"
                  style={styles.inputHorizontal}
                />
              </Form.Group>

              <Form.Group className="mb-3" style={styles.formGroup}>
                <Form.Label style={styles.label}>Password</Form.Label>
                <div style={styles.inputWrapper}>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    style={styles.inputWithIcon}
                  />
                  <span
                    style={styles.eyeIconAbsolute}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </Form.Group>

            <Form.Group className="mb-3" style={styles.formGroup}>
                <Form.Label style={styles.label}> Confirm Password</Form.Label>
                <div style={styles.inputWrapper}>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    style={styles.inputWithIcon}
                  />
                  <span
                    style={styles.eyeIconAbsolute}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </Form.Group>

              <Button type="submit" style={styles.submitButton}>
                Register
              </Button>
            </Form>
          </Card>
        </div>
        <Footer />
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  container: {
    paddingTop: '2.5rem',
    paddingBottom: '3rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    width: '15rem',
    height: 'auto',
    marginBottom: '1.5rem',
  },
  card: {
    width: '100%',
    maxWidth: '26rem',
    padding: '2rem',
    borderRadius: '0.75rem',
    boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.1)',
    border: 'none',
    backgroundColor: '#ffffff',
  },
  heading: {
    textAlign: 'center',
    fontSize: '1.25rem',
    fontWeight: '700',
    marginBottom: '1.5rem',
    color: '#333333',
  },
  formGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  label: {
    width: '100px',
    marginBottom: 0,
    fontWeight: '500',
    color: '#333',
  },
  inputHorizontal: {
    flex: 1,
    marginTop: '0.5rem',
    backgroundColor: '#ffffff',
    border: '1px solid rgb(220, 166, 57)',
    borderRadius: '0.5rem',
    height: '2.75rem',
    fontSize: '1rem',
    padding: '0 1rem',
  },
  inputWrapper: {
    position: 'relative',
    flex: 1,
  },
  inputWithIcon: {
    width: '94%',
    backgroundColor: '#ffffff',
    border: '1px solid rgb(220, 166, 57)',
    borderRadius: '0.5rem',
    height: '2.75rem',
    fontSize: '1rem',
    padding: '0 0 0 1rem',
    marginTop: '0.5rem',
  },
  eyeIconAbsolute: {
    position: 'absolute',
    top: '60%',
    right: '1rem',
    transform: 'translateY(-50%)',
    color: '#A0A0A0',
    cursor: 'pointer',
  },
  submitButton: {
    backgroundColor: 'rgb(53, 168, 84)',
    color: '#fff',
    fontWeight: 600,
    padding: '0.75rem 0',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '0.5rem',
    width: '100%',
    marginTop: '1rem',
  },
};

export default Register;
