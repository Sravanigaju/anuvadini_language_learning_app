import React from "react";
import mainLogo from "../../assets/images/auth/LrN-logo.png";
import langIcon from "../../assets/images/auth/langIcn.png"; // adjust path


const Header = () => {
  return (
    <header style={styles.header}>
      <div style={styles.container}>
        {/* Left section with stacked text and logos */}
        <div style={styles.left}>
          <div style={styles.logoRow}>
            <img src={mainLogo} alt="LrN Logo" style={styles.mainLogo} />
          </div>
        </div>

        {/* Round icon */}
        <div>
          <img src={langIcon} alt="Language Icon" style={styles.langIcon} />
        </div>

        {/* Nav */}
        <nav style={styles.nav}>
          <a href="#about" style={styles.navLink}>ABOUT</a>
          <a href="#features" style={styles.navLink}>FEATURES</a>
          <a href="#reviews" style={styles.navLink}>SERVICES</a>
          <a href="#download" style={styles.navLink}>DOWNLOAD</a>
          <a href="#contact-us" style={styles.navLink}>IDEAL FOR</a>
          <a
            href="https://anuvadini.aicte-india.org/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...styles.navLink, color: "#286bda", fontWeight: "bold" }}
          >
            ANUVADINI
          </a>
        </nav>
      </div>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: "#fff",
    boxShadow: "0 0.125rem 0.375rem rgba(0,0,0,0.05)", // already in rem
    position: "sticky",
    top: 0,
    zIndex: 999,
    padding: "0.625rem 0", // 10px → 0.625rem
  },
  container: {
    maxWidth: "87.5rem", // 1400px → 87.5rem
    margin: "0 auto",
    padding: "0 1.25rem", // 20px → 1.25rem
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginRight: "0.9375rem", // 15px → 0.9375rem
  },
  topText: {
    fontSize: "0.8125rem", // 13px → 0.8125rem
    fontWeight: "500",
    textAlign: "center",
    marginBottom: "0.125rem", // 2px → 0.125rem
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.625rem", // 10px → 0.625rem
  },
  mainLogo: {
    height: "3.4375rem", // 55px → 3.4375rem
  },
  bottomText: {
    fontSize: "0.75rem", // 12px → 0.75rem
    color: "#333",
    textAlign: "center",
    lineHeight: "1.2",
  },
  langIcon: {
    height: "3.125rem", // 50px → 3.125rem
  },
  nav: {
    display: "flex",
    gap: "6rem", // already in rem
    alignItems: "center",
  },
  navLink: {
    textDecoration: "none",
    color: "#000",
    fontWeight: "600",
    fontSize: "0.875rem", // 14px → 0.875rem
  },
};

export default Header;
