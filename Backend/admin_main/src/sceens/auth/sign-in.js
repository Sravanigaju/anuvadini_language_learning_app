import React, { useState } from 'react';
import { Form, Button, Card, Image } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from '../../assets/images/auth/LrN-logo.png';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header/Header';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();

    if (captchaInput.trim() !== '7') {
      setCaptchaError('Incorrect CAPTCHA answer. Please try again.');
      return;
    }

    console.log({ role });
    navigate('/dashboard');
  };

  return (
    <div>
      <Header />
      <div style={styles.wrapper}>
        <div style={styles.container}>

          <Card style={styles.card}>
            <h4 style={styles.heading}>ADMIN LOGIN</h4>
            <Form onSubmit={handleLogin}>

              {/* Role Dropdown */}
              <Form.Group className="mb-3" style={styles.formGroup}>
                <Form.Label style={styles.label}>Role</Form.Label>
                <Form.Select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={styles.inputHorizontal}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="Institution">Institution</option>
                  <option value="Validator">Validator</option>
                  <option value="Creator">Creator</option>
                </Form.Select>
              </Form.Group>

              {/* Username */}
              <Form.Group className="mb-3" style={styles.formGroup}>
                <Form.Label style={styles.label}>User Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="User Name"
                  style={styles.inputHorizontal}
                  required
                />
              </Form.Group>

              {/* Password */}
              <Form.Group className="mb-3" style={styles.formGroup}>
                <Form.Label style={styles.label}>Password</Form.Label>
                <div style={styles.inputWrapper}>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    style={styles.inputHorizontal}
                    required
                  />

                  <span
                    style={styles.eyeIconAbsolute}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </Form.Group>

              {/* Temporary CAPTCHA */}
              <Form.Group className="mb-3" style={styles.formGroup}>
                <Form.Label style={styles.label}>CAPTCHA</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="What is 4 + 3?"
                  value={captchaInput}
                  onChange={(e) => {
                    setCaptchaInput(e.target.value);
                    setCaptchaError('');
                  }}
                  style={styles.inputHorizontal}
                  required
                />
              </Form.Group>
              {captchaError && <div style={{ color: 'red', marginBottom: '1rem' }}>{captchaError}</div>}

              {/* Submit */}
              <Button type="submit" style={styles.submitButton}>
                Submit
              </Button>
            </Form>
          </Card>
        </div>
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
    boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.7)',
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
  justifyContent: 'space-between',
  marginBottom: '1rem',
  maxWidth: '500px',
  width: '100%',
},

  label: {
  width: '120px', // slightly wider for consistent alignment
  marginBottom: 0,
  fontWeight: '500',
  color: '#333',
},

  inputHorizontal: {
  width: '100%',
  backgroundColor: '#ffffff',
  border: '1px solid rgb(220, 166, 57)',
  borderRadius: '0.5rem',
  height: '2.75rem',
  fontSize: '1rem',
  padding: '0 2.5rem 0 1rem', // ← note right padding increased to avoid eye overlap
},


inputWrapper: {
  position: 'relative',
  width: '100%',
},

  inputWithIcon: {
  width: '100%',
  backgroundColor: '#ffffff',
  border: '1px solid rgb(220, 166, 57)',
  borderRadius: '0.5rem',
  height: '2.75rem',
  fontSize: '1rem',
  padding: '0 1rem',
  paddingRight: '2.5rem',
},

  eyeIconAbsolute: {
  position: 'absolute',
  top: '50%',
  right: '0.75rem',
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
    marginTop: '0.5rem',
  },
};

export default SignIn;
