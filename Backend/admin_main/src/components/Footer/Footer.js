import React from 'react';
import anuvadiniLogo from '../../assets/images/auth/anuvadini-logo-removebg-preview.png';
import makeInIndiaLogo from '../../assets/images/auth/MakeInIndia.png';

const Footer = () => {
  return (
    <div style={styles.footerWrapper}>
      <div style={styles.footerContent}>
        
        <div style={styles.column}>
          <h5 style={styles.heading}>About</h5>
          <ul style={styles.list}>
            <li><a href="#" style={styles.link}>Overview</a></li>
            <li><a href="#" style={styles.link}>Ideal For</a></li>
            <li><a href="#" style={styles.link}>Anuvadini Team</a></li>
          </ul>
        </div>

        <div style={styles.column}>
          <h5 style={styles.heading}>Features</h5>
          <ul style={styles.list}>
            <li><a href="#" style={styles.link}>Multilingual Courses</a></li>
            <li><a href="#" style={styles.link}>Gamified Learning</a></li>
            <li><a href="#" style={styles.link}>Progress Tracking</a></li>
          </ul>
        </div>

        <div style={styles.column}>
          <h5 style={styles.heading}>Services</h5>
          <ul style={styles.list}>
            <li><a href="#" style={styles.link}>Teacher Dashboard</a></li>
            <li><a href="#" style={styles.link}>Institutional Setup</a></li>
            <li><a href="#" style={styles.link}>Support & FAQ</a></li>
          </ul>
        </div>

        <div style={styles.column}>
          <h5 style={styles.heading}>Other Links</h5>
          <ul style={styles.list}>
            <li><a href="#" style={styles.link}>Privacy Policy</a></li>
            <li><a href="#" style={styles.link}>Landing Page</a></li>
            <li><a href="#" style={styles.link}>Download</a></li>
          </ul>
        </div>

        
        <div style={styles.branding}>
          <span style={styles.poweredBy}>Powered By</span>
          <img src={anuvadiniLogo} alt="Anuvadini" style={styles.logo} />
          <img src={makeInIndiaLogo} alt="Make in India" style={styles.logo} />
          <a
            href="https://anuvadini.aicte-india.org"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.siteLink}
          >
            anuvadini.aicte-india.org
          </a>
        </div>
      </div>
    </div>
  );
};

const styles = {
  footerWrapper: {
    backgroundColor: '#fff1e6',
    borderTop: '1px solid #ffe3c2',
    padding: '24px 16px',
    marginTop: 'auto',
    fontFamily: 'inherit',
  },
  footerContent: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    maxWidth: '1200px',
    margin: '0 auto',
    gap: '30px',
  },
  column: {
    flex: '1 1 150px',
    minWidth: '140px',
  },
  heading: {
    fontSize: '16px',
    color: '#333',
    marginBottom: 10,
    fontWeight: 600,
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  link: {
    fontSize: '14px',
    color: '#3B82F6',
    textDecoration: 'none',
    display: 'block',
    marginBottom: 6,
  },
  branding: {
    flex: '1 1 200px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 12,
  },
  poweredBy: {
    fontSize: '14px',
    color: '#555',
    fontWeight: 500,
  },
  logo: {
    height: '28px',
    objectFit: 'contain',
  },
  siteLink: {
    fontSize: '14px',
    color: '#1e40af',
    textDecoration: 'none',
    marginTop: 4,
    fontWeight: 500,
  },
};

export default Footer;
