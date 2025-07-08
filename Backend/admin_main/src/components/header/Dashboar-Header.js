import React from 'react';
import { Navbar, Form, FormControl, Button, Image, Container } from 'react-bootstrap';
import { FaBell, FaEnvelope, FaGlobe, FaPaperPlane } from 'react-icons/fa';
import logo from '../../assets/images/auth/LrN-logo.png'; // adjust as needed
import avatar from '../../assets/images/auth/blank.png'; // your avatar image
import langIcon from '../../assets/images/auth/langIcn.png';

const AdminHeader = () => {
  return (
    <Navbar expand="lg" style={styles.navbar} sticky="top" className="shadow-sm">
      <Container fluid style={styles.container}>
        {/* Logo & Title */}
        <div style={styles.logoContainer}>
          <Image src={logo} alt="LrN Logo" style={styles.logo} />
        </div>
        <div style={styles.logoContainer}>
          <img src={langIcon} alt="Language Icon" style={styles.logo} />
        </div>
        {/* Search Box */}
        <Form style={styles.searchForm}>
          <FormControl type="text" placeholder="Search..." style={styles.searchInput} />
        </Form>

        {/* Right section */}
        <div style={styles.rightSection}>

          <FaBell style={styles.icon} />
          <FaEnvelope style={styles.icon} />

          <div style={styles.profile}>
            <Image src={avatar} alt="User" roundedCircle style={styles.avatar} />
            <div>
              <div style={styles.userName}>Austin Robertson</div>
              <div style={styles.userRole}>Professor</div>
            </div>
          </div>
        </div>
      </Container>
    </Navbar>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#ffffff',
    padding: '0.75rem 1.5rem',
    position: 'fixed',
    top: 0,
    width: '100%',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  logo: {
    height: '2.5rem',
    objectFit: 'contain',
  },
  brandText: {
    fontWeight: 600,
    fontSize: '1.25rem',
    color: '#333',
  },
  searchForm: {
    flex: 1,
    margin: '0 2rem',
    maxWidth: '400px',
  },
  searchInput: {
    borderRadius: '0.5rem',
    border: '1px solid #ccc',
    padding: '0.5rem 1rem',
    width: '100%',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  proButton: {
    backgroundColor: '#3B82F6',
    border: 'none',
    color: '#fff',
    fontWeight: 500,
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    fontSize: '1.2rem',
    color: '#555',
    cursor: 'pointer',
  },
  profile: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  avatar: {
    height: '2.5rem',
    width: '2.5rem',
  },
  userName: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#333',
  },
  userRole: {
    fontSize: '0.75rem',
    color: '#777',
  },
};

export default AdminHeader;
