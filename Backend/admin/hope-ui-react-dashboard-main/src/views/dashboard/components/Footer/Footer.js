import React from 'react';
import anuvadiniLogo from '../../../../assets/anuvadini-logo-removebg-preview.png';
import makeInIndiaLogo from '../../../../assets/MakeInIndia.png';

const Footer = () => {
  return (
    <div style={styles.footerWrapper}>
      <div style={styles.footer}>
        <div style={styles.left}>
          <span style={styles.poweredBy}>Powered By</span>
          <img src={anuvadiniLogo} alt="Anuvadini Foundation" style={styles.logo} />
          <img src={makeInIndiaLogo} alt="Make In India" style={styles.logo} />
        </div>
        <a
          href="https://anuvadini.aicte-india.org"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.link}
        >
          anuvadini.aicte-india.org
        </a>
      </div>
    </div>
  );
};

const styles = {
  footerWrapper: {
    backgroundColor: '#ffe8d6', // A subtle contrast to #fff6ee
    boxShadow: '0px -1px 4px rgba(0, 0, 0, 0.05)',
    padding: '12px 20px',
    marginTop: 'auto',
    width: '100%',
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  poweredBy: {
    fontSize: '14px',
    color: '#444',
    fontWeight: 600,
  },
  logo: {
    height: '26px',
    objectFit: 'contain',
  },
  link: {
    color: '#1e40af', // Tailwind's blue-800
    fontSize: '14px',
    textDecoration: 'none',
    fontWeight: 500,
  },
};

export default Footer;
