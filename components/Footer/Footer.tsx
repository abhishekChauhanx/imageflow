"use client";

import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">

        {/* brand */}
        <div className="footer-brand">
          <span className="footer-logo">ImageFlow</span>
          <p className="footer-tagline">Visual search, reimagined.</p>
        </div>

        {/* links col */}
        <div className="footer-col">
          <p className="footer-col-title">Product</p>
          <a href="#">How it works</a>
          <a href="#">Pricing</a>
          <a href="#">API</a>
          <a href="#">Changelog</a>
        </div>

        <div className="footer-col">
          <p className="footer-col-title">Company</p>
          <a href="#">About</a>
          <a href="#">Blog</a>
          <a href="#">Careers</a>
          <a href="#">Contact</a>
        </div>

        <div className="footer-col">
          <p className="footer-col-title">Legal</p>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Cookie policy</a>
        </div>

      </div>

      {/* bottom bar */}
      <div className="footer-bottom">
        <span className="footer-copy">© zoker2026 — All rights reserved.</span>

        <div className="footer-social">
          {/* LinkedIn */}
          <a href="#" aria-label="LinkedIn" className="social-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="3"/>
              <line x1="8" y1="11" x2="8" y2="17"/>
              <line x1="8" y1="7" x2="8" y2="7.5"/>
              <path d="M12 17v-4a2 2 0 0 1 4 0v4"/>
              <line x1="12" y1="11" x2="12" y2="17"/>
            </svg>
            LinkedIn
          </a>

          {/* Portfolio */}
          <a href="#" aria-label="Portfolio" className="social-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            Portfolio
          </a>

          {/* GitHub */}
          <a href="#" aria-label="GitHub" className="social-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
            </svg>
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}