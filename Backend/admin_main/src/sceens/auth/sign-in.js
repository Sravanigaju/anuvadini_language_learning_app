import React, { useState } from 'react';
import { Form, Button, Card, Image } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from '../../assets/images/auth/LrN-logo.png';
import Footer from '../../components/Footer/Footer';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header/Header';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div>
      <Header />
      <div style={styles.wrapper}>
        <div style={styles.container}>
          <Image src={logo} alt="Logo" style={styles.logo} />

          <Card style={styles.card}>
            <h4 style={styles.heading}>ADMIN LOGIN</h4>
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3" style={styles.formGroup}>
                <Form.Label style={styles.label}>User Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="User Name"
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


              <Button type="submit" style={styles.submitButton}>
                Submit
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
  label: {
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#333',
  },
  captchaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  captchaBox: {
    backgroundColor: '#f0f0f0',
    padding: '0.5rem 1rem',
    fontWeight: 'bold',
    fontSize: '1rem',
    borderRadius: '0.25rem',
  },
  refreshIcon: {
    cursor: 'pointer',
    fontSize: '1.2rem',
    marginLeft: '0.5rem',
  },
  submitButton: {
    backgroundColor: 'rgb(53, 168, 84)', // green button
    color: '#fff',
    fontWeight: 600,
    padding: '0.75rem 0',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '0.5rem',
    width: '100%',
    marginTop: '0.5rem',
  },
  formGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  label: {
    width: '100px', // set a fixed width for alignment
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
    paddingRight: '2.5rem', // 👈 add this
  },
  passwordWrapper: {
    position: 'relative',
    flex: 1,
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
    padding: '0 0 0 1rem', // extra right padding for icon
    marginTop: '0.5rem'
  },

  eyeIconAbsolute: {
    position: 'absolute',
    top: '60%',
    right: '1rem',
    transform: 'translateY(-50%)',
    color: '#A0A0A0',
    cursor: 'pointer',
  },

};

export default SignIn;
