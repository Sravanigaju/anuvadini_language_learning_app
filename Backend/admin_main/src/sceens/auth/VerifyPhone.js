import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header/Header';

function VerifyPhone() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = () => {
    console.log('Send OTP to:', phone);
    // Call backend API to send OTP
  };

  const handleVerifyOtp = () => {
    console.log('Verify OTP:', otp);
    // Verify OTP with backend
    navigate('/dashboard'); // Navigate after success
  };

  return ( 
    <div>
      <Header />
      <div style={styles.wrapper}>
        <div style={styles.container}>
          <Card style={styles.card}>
            <h4 style={styles.heading}>Verify Your Phone</h4>

            <Form>
              <Form.Group style={styles.formGroup}>
                <Form.Label style={styles.label}>Phone Number</Form.Label>
                <div style={{ display: 'flex', flex: 1, gap: '0.5rem' }}>
                  <Form.Control
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    style={styles.inputHorizontal}
                    required
                  />
                  <Button variant="warning" onClick={handleSendOtp} style={styles.otpButton}>
                    Send OTP
                  </Button>
                </div>
              </Form.Group>

              <Form.Group style={styles.formGroup}>
                <Form.Label style={styles.label}>Enter OTP</Form.Label>
                <div style={{ display: 'flex', flex: 1, gap: '0.5rem' }}>
                  <Form.Control
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    style={styles.inputHorizontal}
                    required
                  />
                  <Button variant="success" onClick={handleVerifyOtp} style={styles.otpVerifyButton}>
                    Verify OTP
                  </Button>
                </div>
              </Form.Group>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
  backgroundColor: '#ffffff',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',  // changed from 'center'
  paddingTop: '4rem',            // added padding to push content down a bit
},

container: {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',       // align to top
},

  card: {
    width: '100%',
    maxWidth: '500px',
    padding: '2rem',
    borderRadius: '0.75rem',
    boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.1)',
    backgroundColor: '#ffffff',
  },
  heading: {
    textAlign: 'center',
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '1.5rem',
    color: '#333',
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
    fontWeight: 500,
    color: '#333',
  },
  inputHorizontal: {
    flex: 1,
    border: '1px solid rgb(220, 166, 57)',
    borderRadius: '0.5rem',
    height: '2.75rem',
    fontSize: '1rem',
    padding: '0 1rem',
    backgroundColor: '#ffffff',
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

export default VerifyPhone;
