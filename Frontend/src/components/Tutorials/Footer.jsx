import React from "react";

/**
 * @returns footer that generates new date every year
 */
function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-[var(--bg-secondary)] border-t border-[var(--border-color)] text-[var(--text-primary)] py-8 px-6 mt-auto text-center">
      <div className="max-w-4xl mx-auto space-y-4">
        <h3 className="text-lg font-bold">Tutor Match</h3>
        <p className="text-sm text-[var(--text-secondary)] opacity-80 max-w-md mx-auto">
          Learn smarter with expert tutors anytime, anywhere.
        </p>

        <div className="text-xs text-[var(--text-secondary)] opacity-60 border-t border-[var(--border-color)]/60 pt-4 mt-4">
          © {year} Tutor App, Inc. All Rights Reserved
        </div>
      </div>
    </footer>
  );
}

Footer.propTypes = {};

export default Footer;