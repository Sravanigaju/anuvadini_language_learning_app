import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header/Header';
import Footer2 from '../../components/Footer/Footer2';
import captchaImg from '../../assets/images/auth/captcha.png';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    if (captchaInput.trim() !== 'Td4eva') {
      setCaptchaError('Incorrect CAPTCHA answer. Please try again.');
      return;
    }
    console.log({ role });
    navigate('/dashboard');
  };

  return (
    <div style={styles.fullPage}>
      <Header />
      <div style={styles.scrollableContent}>
        <div style={styles.wrapper}>
          <Card style={styles.card}>
            <h4 style={styles.heading}>ADMIN LOGIN</h4>
            <Form onSubmit={handleLogin}>
              {/* Role */}
              <Form.Group style={styles.formGroup}>
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

              {/* Email */}
              <Form.Group style={styles.formGroup}>
                <Form.Label style={styles.label}>Email ID</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Email"
                  style={styles.inputHorizontal}
                  required
                />
              </Form.Group>

              {/* Phone Number */}
              <Form.Group style={styles.formGroup}>
                <Form.Label style={styles.label}>Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="Phone Number"
                  style={styles.inputHorizontal}
                  pattern="[0-9]{10}"
                  required
                />
              </Form.Group>

              {/* Password */}
              <Form.Group style={styles.formGroup}>
                <Form.Label style={styles.label}>Password</Form.Label>
                <div style={styles.inputWrapper}>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    style={styles.inputWithIcon}
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

              {/* CAPTCHA */}
              <Form.Group style={styles.formGroup}>
                <Form.Label style={styles.label}>CAPTCHA</Form.Label>
                <div style={styles.captchaRow}>
                  <img src={captchaImg} alt="CAPTCHA" style={styles.captchaImage} />
                  <Form.Control
                    type="text"
                    placeholder="Enter Captcha"
                    value={captchaInput}
                    onChange={(e) => {
                      setCaptchaInput(e.target.value);
                      setCaptchaError('');
                    }}
                    style={styles.captchaInput}
                    required
                  />
                </div>
                {captchaError && <div style={styles.errorText}>{captchaError}</div>}
              </Form.Group>

              <Button type="submit" style={styles.submitButton}>Submit</Button>
            </Form>
          </Card>
        </div>
      </div>
      <Footer2 />
    </div>
  );
};

const styles = {
  fullPage: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  scrollableContent: {
    flex: 1,
    overflowY: 'auto',
    backgroundColor: '#fff',
  },
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem',
  },
  card: {
    width: '100%',
    maxWidth: '24rem',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.15)',
    border: 'none',
    backgroundColor: '#ffffff',
  },
  heading: {
    textAlign: 'center',
    fontSize: '1.25rem',
    fontWeight: '700',
    marginBottom: '1.25rem',
    color: '#333333',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '0.75rem',
  },
  label: {
    fontWeight: '500',
    color: '#333',
    marginBottom: '0.25rem',
  },
  inputHorizontal: {
    width: '100%',
    backgroundColor: '#ffffff',
    border: '1px solid rgb(220, 166, 57)',
    borderRadius: '0.5rem',
    height: '2.5rem',
    fontSize: '1rem',
    padding: '0 1rem',
  },
  inputWrapper: {
    position: 'relative',
  },
  inputWithIcon: {
    width: '100%',
    backgroundColor: '#ffffff',
    border: '1px solid rgb(220, 166, 57)',
    borderRadius: '0.5rem',
    height: '2.5rem',
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
  captchaRow: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
  },
  captchaImage: {
    width: '120px',
    height: '40px',
    objectFit: 'contain',
    border: '1px solid #ddd',
    borderRadius: '0.25rem',
  },
  captchaInput: {
    flex: 1,
    height: '2.5rem',
    fontSize: '1rem',
    backgroundColor: '#fff',
    border: '1px solid rgb(220, 166, 57)',
    borderRadius: '0.5rem',
    padding: '0 1rem',
  },
  errorText: {
    color: 'red',
    fontSize: '0.875rem',
    marginTop: '0.25rem',
  },
  submitButton: {
    backgroundColor: 'rgb(53, 168, 84)',
    color: '#fff',
    fontWeight: 600,
    padding: '0.6rem',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '0.5rem',
    width: '100%',
    marginTop: '0.5rem',
  },
};

export default SignIn;
