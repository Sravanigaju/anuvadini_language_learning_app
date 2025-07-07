import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Header from '../../components/header/Header';

function RegisterCreator() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    otp: '',
    expertise: '',
    portfolio: '',
    languages: '',
    yearsOfExperience: '',
    linkedinUrl: '',
    bio: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Creator Registration:', form);
  };

  return (
    <div>
      <Header />
      <div style={styles.wrapper}>
        <div style={styles.container}>
          <Card style={styles.card}>
            <h4 style={styles.heading}>Register as Creator</h4>
            <Form onSubmit={handleSubmit}>
              {renderFields([
                ['Name', 'name'],
                ['Email', 'email'],
                ['Expertise', 'expertise'],
                ['Portfolio', 'portfolio'],
                ['Languages', 'languages'],
                ['Years of Experience', 'yearsOfExperience'],
                ['LinkedIn URL', 'linkedinUrl'],
              ])}

              {/* Password */}
              <Form.Group style={styles.formGroup}>
                <Form.Label style={styles.label}>Password</Form.Label>
                <div style={styles.inputWrapper}>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    style={{ ...styles.inputHorizontal, paddingRight: '2.5rem' }}
                    required
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </Form.Group>

              {/* Confirm Password */}
              <Form.Group style={styles.formGroup}>
                <Form.Label style={styles.label}>Confirm Password</Form.Label>
                <div style={styles.inputWrapper}>
                  <Form.Control
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    style={{ ...styles.inputHorizontal, paddingRight: '2.5rem' }}
                    required
                  />
                  <span
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </Form.Group>

              {/* Phone */}
              <Form.Group style={styles.formGroup}>
                <Form.Label style={styles.label}>Phone</Form.Label>
                <div style={{ display: 'flex', flex: 1, gap: '0.5rem' }}>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    style={styles.inputHorizontal}
                    required
                  />
                  <Button variant="warning" style={styles.otpButton}>Send OTP</Button>
                </div>
              </Form.Group>

              {/* OTP */}
              <Form.Group style={styles.formGroup}>
                <Form.Label style={styles.label}>Enter OTP</Form.Label>
                <div style={{ display: 'flex', flex: 1, gap: '0.5rem' }}>
                  <Form.Control
                    type="text"
                    name="otp"
                    value={form.otp}
                    onChange={handleChange}
                    style={styles.inputHorizontal}
                    placeholder="Enter OTP"
                  />
                  <Button variant="success" style={styles.otpVerifyButton}>Verify OTP</Button>
                </div>
              </Form.Group>

              {/* Bio */}
              <Form.Group style={styles.formGroup}>
                <Form.Label style={styles.label}>Bio</Form.Label>
                <Form.Control
                  as="textarea"
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  style={styles.textArea}
                />
              </Form.Group>

              <Button type="submit" style={styles.submitButton}>Register</Button>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );

  function renderFields(fields) {
    return fields.map(([label, name]) => (
      <Form.Group key={name} style={styles.formGroup}>
        <Form.Label style={styles.label}>{label}</Form.Label>
        <Form.Control
          type="text"
          name={name}
          value={form[name]}
          onChange={handleChange}
          style={styles.inputHorizontal}
          required
        />
      </Form.Group>
    ));
  }
}

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
  card: {
    width: '100%',
    maxWidth: '30rem',
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
    marginBottom: '1rem',
  },
  label: {
    width: '120px',
    marginBottom: 0,
    fontWeight: '500',
    color: '#333',
  },
  inputHorizontal: {
    flex: 1,
    backgroundColor: '#ffffff',
    border: '1px solid rgb(220, 166, 57)',
    borderRadius: '0.5rem',
    height: '2.75rem',
    fontSize: '1rem',
    padding: '0 1rem',
  },
  inputWrapper: {
    flex: 1,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    color: '#888',
    zIndex: 2,
  },
  textArea: {
    flex: 1,
    backgroundColor: '#ffffff',
    border: '1px solid rgb(220, 166, 57)',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    padding: '1rem',
    minHeight: '5rem',
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
  otpButton: {
    whiteSpace: 'nowrap',
    backgroundColor: 'rgb(220, 166, 57)',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    fontWeight: '600',
  },
  otpVerifyButton: {
    whiteSpace: 'nowrap',
    backgroundColor: 'rgb(53, 168, 84)',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1.2rem',
    borderRadius: '0.5rem',
    fontWeight: '600',
  },
};

export default RegisterCreator;
