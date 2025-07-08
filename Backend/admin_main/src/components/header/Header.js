import React from 'react';
import { Link } from 'react-router-dom';
import mainLogo from '../../assets/images/auth/LrN-logo.png';
import langIcon from '../../assets/images/auth/langIcn.png';
import '../../App.css'; // adjust path if it's in a different folder

const Header = () => {
  return (
    <header style={styles.header}>
      <div style={styles.container}>

        {/* Left Section: ABOUT + langIcon */}
        <div style={styles.leftSection}>
          <img src={mainLogo} alt="LrN Logo" style={styles.mainLogo} />
        </div>

        {/* Center Logo */}
        <div style={styles.logoSection}>
          <img src={langIcon} alt="Language Icon" style={styles.langIcon} />
        </div>

        {/* Right Section: Other Nav Links */}
       <nav style={styles.rightNav}>
          <a href="#about" className="nav-link" style={styles.navLink}>ABOUT</a>
          <a href="#features" className="nav-link" style={styles.navLink}>FEATURES</a>
          <a href="#reviews" className="nav-link" style={styles.navLink}>SERVICES</a>
          <a href="#download" className="nav-link" style={styles.navLink}>DOWNLOAD</a>
          <a href="#contact-us" className="nav-link" style={styles.navLink}>IDEAL FOR</a>
          <a
            href="https://anuvadini.aicte-india.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
            style={{ ...styles.navLink, color: '#286bda', fontWeight: 'bold' }}
          >
            ANUVADINI
          </a>


          {/* Contribute Dropdown */}
          {/* <span style={{ ...styles.navLink, cursor: 'pointer' }}>CONTRIBUTE ▾</span> */}
          <div style={styles.dropdown}>
            <div style={styles.dropdownContent}>
              <div style={styles.dropdownItem}>
                Registration ▸
                <div style={styles.subDropdown}>
                  <a href="#register-institution">Institution</a>
                  <a href="#register-validator">Validator</a>
                  <a href="#register-creator">Creator</a>
                </div>
              </div>
              <div style={styles.dropdownItem}>
                Login ▸
                <div style={styles.subDropdown}>
                  <a href="https://chatgpt.com/c/686b9b19-548c-8002-90ca-ad7589a29198" target="_blank" rel="noreferrer">Institution</a>
                  <a href="#login-validator">Validator</a>
                  <a href="#login-creator">Creator</a>
                </div>
              </div>
            </div>
          </div>
        </nav>

      </div>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: '#fff',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    padding: '10px 0',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px', // was 20px
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
  },
  rightNav: {
    display: 'flex',
    gap: '40px',
    alignItems: 'center',
    position: 'relative',
    // zIndex:999,

  },
  mainLogo: {
  height: '56px',  // previously '58px'
  objectFit: 'contain',
  marginLeft: '20px', // Adjusted for better spacing
},

langIcon: {
  height: '52px',
  objectFit: 'contain',
},
  navLink: {
  textDecoration: 'none',
  color: '#000',
  fontWeight: 700,
  fontSize: '14px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
},

  dropdown: {
    position: 'relative',
    display: 'inline-block',
  },
  dropdownContent: {
    display: 'none',
    position: 'absolute',
    top: '100%',
    left: 0,
    backgroundColor: '#fff',
    minWidth: '180px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    padding: '10px',
    zIndex: 10,
  },
  dropdownItem: {
    position: 'relative',
    padding: '5px 10px',
    fontWeight: 500,
    cursor: 'pointer',
  },
  subDropdown: {
    display: 'none',
    position: 'absolute',
    left: '100%',
    top: 0,
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    padding: '10px',
    minWidth: '160px',
  },
};

export default Header;
