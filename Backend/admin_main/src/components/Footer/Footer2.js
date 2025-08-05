import React from 'react';
// import './font-awesome/css/font-awesome.min.css'; 

const Footer2 = () => {
  return (
    <div id="footer" style={styles.footerSection}>
      <div style={styles.footerBg}>
        <div style={styles.container}>
          <div style={styles.row}>
            <div style={styles.centerBlock}>
              <p style={styles.textCenter}>
                © 2025 All rights reserved, Powered By -{' '}
                <a
                  href="https://anuvadini.aicte-india.org/"
                  style={styles.anuLnk}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Anuvadini AI
                </a>, Ministry of Education, Government of India
                <span style={styles.footerSocialIcon}>
                  <a href="#" style={styles.iconLink}>
                    <i className="fa fa-linkedin-square" aria-hidden="true"></i>
                  </a>
                  <a href="#" style={styles.iconLink}>
                    <i className="fa fa-twitter"></i>
                  </a>
                  <a href="#" style={styles.iconLink}>
                    <i className="fa fa-youtube-square" aria-hidden="true"></i>
                  </a>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  footerSection: {
  backgroundColor: '#286bda',
  padding: '10px 0', 
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  fontSize: '13px',  
  color: '#fff',
  borderTop: '1px solid #eaeaea',
},

textCenter: {
  textAlign: 'center',
  margin: 0,
  lineHeight: '1.4', 
},

iconLink: {
  margin: '0 6px',
  color: '#fff',
  textDecoration: 'none',
  fontSize: '16px', 
  transition: 'color 0.3s ease',
},

footerBg: {
  backgroundColor: 'transparent', 
},
anuLnk: {
  color: '#fff', 
  fontWeight: 'bold',
  textDecoration: 'underline',
},
  container: {
    maxWidth: '1140px',
    margin: '0 auto',
    padding: '0 15px',
  },
  row: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  centerBlock: {
    textAlign: 'center',
    width: '100%',
  },
  footerSocialIcon: {
    marginLeft: '10px',
  },
  
};

export default Footer2;
