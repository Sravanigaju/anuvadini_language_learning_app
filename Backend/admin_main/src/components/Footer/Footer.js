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
    borderTop: '0.0625rem solid #ffe3c2',       // 1px
    padding: '1.5rem 1rem',                     // 24px 16px
    marginTop: 'auto',
    fontFamily: 'inherit',
  },
  footerContent: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    maxWidth: '75rem',                         // 1200px
    margin: '0 auto',
    gap: '1.875rem',                           // 30px
  },
  column: {
    flex: '1 1 9.375rem',                      // 150px
    minWidth: '8.75rem',                       // 140px
  },
  heading: {
    fontSize: '1rem',                          // 16px
    color: '#333',
    marginBottom: '0.625rem',                  // 10px
    fontWeight: 600,
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  link: {
    fontSize: '0.875rem',                      // 14px
    color: '#3B82F6',
    textDecoration: 'none',
    display: 'block',
    marginBottom: '0.375rem',                  // 6px
  },
  branding: {
    flex: '1 1 12.5rem',                       // 200px
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.625rem',                           // 10px
    marginTop: '0.75rem',                      // 12px
  },
  poweredBy: {
    fontSize: '0.875rem',                      // 14px
    color: '#555',
    fontWeight: 500,
  },
  logo: {
    height: '1.75rem',                         // 28px
    objectFit: 'contain',
  },
  siteLink: {
    fontSize: '0.875rem',                      // 14px
    color: '#1e40af',
    textDecoration: 'none',
    marginTop: '0.25rem',                      // 4px
    fontWeight: 500,
  },
};


export default Footer;
