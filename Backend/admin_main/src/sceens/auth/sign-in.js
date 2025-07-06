import React, { useState } from 'react';
import { Form, Button, Card, Image } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from '../../assets/images/auth/LrN-logo.png';
import languageImage from '../../assets/images/auth/Language.png';
import Footer from '../../components/Footer/Footer';
import { useNavigate } from 'react-router-dom';



const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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

                <Button
                  className="w-100 rounded-pill"
                  style={styles.loginButton}
                  onClick={() => navigate('/dashboard')} 
                >
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


// import React, { useState } from 'react';
// import { Form, Button, Card } from 'react-bootstrap';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';
// import logo from '../../assets/images/auth/LrN-logo.png';
// import rightBg from '../../assets/images/auth/Language.png'; // your blue radial image
// import { useNavigate } from 'react-router-dom';

// const SignIn = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   return (
//     <div style={styles.wrapper}>
//       {/* Left Side: Form */}
//       <div style={styles.left}>
//         <img src={logo} alt="Logo" style={styles.logo} />
//         <h2 style={styles.heading}>Sign In</h2>
//         <p style={styles.subtext}>Login to stay connected.</p>

//         <Card style={styles.card}>
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label style={styles.label}>Email</Form.Label>
//               <Form.Control type="email" placeholder="Enter your email" style={styles.input} />
//             </Form.Group>

//             <Form.Group className="mb-3 position-relative">
//               <Form.Label style={styles.label}>Password</Form.Label>
//               <Form.Control
//                 type={showPassword ? 'text' : 'password'}
//                 placeholder="Enter your password"
//                 style={styles.input}
//               />
//               <span style={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
//                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//               </span>
//             </Form.Group>

//             <div style={styles.bottomRow}>
//               <div>
//                 <input type="checkbox" />
//                 <span style={styles.rememberMe}> Remember Me</span>
//               </div>
//               <Button variant="link" style={styles.forgotLink}>Forgot Password?</Button>
//             </div>

//             <Button style={styles.signInButton} onClick={() => navigate('/dashboard')}>
//               Sign In
//             </Button>
//           </Form>

//           <p style={styles.altText}>or sign in with other accounts?</p>

//           <div style={styles.socialRow}>
//             <img src="https://img.icons8.com/ios-filled/24/000000/facebook-new.png" alt="Facebook" />
//             <img src="https://img.icons8.com/ios-filled/24/000000/google-logo.png" alt="Google" />
//             <img src="https://img.icons8.com/ios-filled/24/000000/instagram-new.png" alt="Instagram" />
//             <img src="https://img.icons8.com/ios-filled/24/000000/linkedin.png" alt="LinkedIn" />
//           </div>

//           <p style={styles.signUpText}>
//             Don’t have an account? <span style={styles.signUpLink}>Click here to sign up.</span>
//           </p>
//         </Card>
//       </div>

//       {/* Right Side: Background image */}
//       <div style={styles.right}>
//         <img src={rightBg} alt="Side Visual" style={styles.rightImage} />
//       </div>
//     </div>
//   );
// };

// const styles = {
//   wrapper: {
//     display: 'flex',
//     minHeight: '100vh',
//     backgroundColor: '#fff',
//   },
//   left: {
//     width: '50%',
//     padding: '60px 40px',
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//   },
//   logo: {
//     width: 150,
//     marginBottom: 20,
//   },
//   heading: {
//     fontWeight: '700',
//     fontSize: 32,
//     marginBottom: 5,
//   },
//   subtext: {
//     color: '#6b7280',
//     marginBottom: 30,
//   },
//   card: {
//     border: 'none',
//     padding: 0,
//     background: 'transparent',
//   },
//   label: {
//     fontWeight: 600,
//     marginBottom: 5,
//   },
//   input: {
//     height: '45px',
//     borderRadius: '10px',
//     border: '1px solid #d1d5db',
//     padding: '0 15px',
//   },
//   eyeIcon: {
//     position: 'absolute',
//     top: '45px',
//     right: 10,
//     cursor: 'pointer',
//     color: '#6b7280',
//   },
//   bottomRow: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//     fontSize: 14,
//   },
//   rememberMe: {
//     marginLeft: 5,
//   },
//   forgotLink: {
//     fontSize: 14,
//     color: '#3b82f6',
//     textDecoration: 'none',
//     fontWeight: 500,
//   },
//   signInButton: {
//     width: '100%',
//     backgroundColor: '#3b82f6',
//     color: 'white',
//     border: 'none',
//     borderRadius: 10,
//     padding: '12px',
//     fontWeight: 600,
//     marginBottom: 20,
//   },
//   altText: {
//     textAlign: 'center',
//     fontSize: 14,
//     color: '#6b7280',
//     marginBottom: 10,
//   },
//   socialRow: {
//     display: 'flex',
//     justifyContent: 'center',
//     gap: 20,
//     marginBottom: 20,
//   },
//   signUpText: {
//     fontSize: 14,
//     textAlign: 'center',
//   },
//   signUpLink: {
//     color: '#3b82f6',
//     fontWeight: 'bold',
//     cursor: 'pointer',
//   },
//   right: {
//     width: '50%',
//     backgroundColor: '#0e46a3',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   rightImage: {
//     width: '100%',
//     height: '100vh',
//     objectFit: 'cover',
//   },
// };

// export default SignIn;
