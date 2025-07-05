import React, { useState } from 'react';
import { Row, Col, Form, Button, Card, Image } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';






const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Row className="justify-content-center align-items-center vh-100 m-0" style={{ backgroundColor: '#fff6ee' }}>
            <Col md={5}>
                <div className="text-center mb-4">
                    <Image src="/images/LrN-logo.png" alt="Logo" style={{ maxWidth: 260, height: 100 }} />


                </div>
                <Card className="p-4 shadow rounded-4 border-0" style={{ backgroundColor: '#ffffff' }}>
                    <h4 className="text-center mb-3 fw-bold text-dark">Enter Details</h4>

                    <Form.Group className="mb-3">
                        <Form.Control
                            type="tel"
                            placeholder="Phone Number"
                            disabled
                            style={{
                                backgroundColor: '#fff6ee',
                                borderColor: '#ff8c42',
                                borderRadius: '8px',
                                height: '45px',
                                fontSize: '16px',
                            }}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control
                            type="email"
                            placeholder="Email"
                            disabled
                            style={{
                                backgroundColor: '#fff6ee',
                                borderColor: '#ff8c42',
                                borderRadius: '8px',
                                height: '45px',
                                fontSize: '16px',
                            }}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3 position-relative">
                        <Form.Control
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            disabled
                            style={{
                                backgroundColor: '#fff6ee',
                                borderColor: '#ff8c42',
                                borderRadius: '8px',
                                height: '45px',
                                fontSize: '16px',
                            }}
                        />
                        <span
                            style={{
                                position: 'absolute',
                                right: '15px',
                                top: '12px',
                                cursor: 'pointer',
                                zIndex: 1,
                                color: '#888'
                            }}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </Form.Group>

                    <div className="d-flex justify-content-end mb-3">
                        <button
                            type="button"
                            className="btn btn-link text-primary fw-semibold p-0"
                            style={{ textDecoration: 'none' }}
                        >
                            Forgot Password?
                        </button>

                    </div>

                    <Button
                        className="w-100 rounded-pill"
                        style={{ backgroundColor: '#3B82F6', border: 'none', padding: '12px 0', fontWeight: 600 }}
                        disabled
                    >
                        Login
                    </Button>
                </Card>
            </Col>
        </Row>
    );
};

export default SignIn;
