import React from "react";
import "../assets/styles/Landing.css";

/**
 * @returns footer that generates new date every year
 */
function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footerContent">
        <h3>Tutor Match</h3>
        <p>Learn smarter with expert tutors anytime, anywhere.</p>

        <div className="footerBottom">
          © {year} Tutor App, Inc. All Rights Reserved
        </div>
      </div>
    </footer>
  );
}

Footer.propTypes = {};

export default Footer;