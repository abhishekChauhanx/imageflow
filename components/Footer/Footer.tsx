"use client";

import "./Footer.css";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  const isLoginPage = pathname === "/login";

  return (
    <>

      {isLoginPage ? (
        <footer className="lp-footer">
          <span>© 2026 <span className="lp-gold">@zoker2026</span></span>
          <div className="lp-footer-icons">
            {/* LinkedIn */}
            <a href="#" aria-label="LinkedIn" className="lp-footer-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            {/* GitHub */}
            <a href="#" aria-label="GitHub" className="lp-footer-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            {/* Portfolio globe */}
            <a href="#" aria-label="Portfolio" className="lp-footer-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </a>
          </div>
        </footer>
      ) : (
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
          <a href="https://www.linkedin.com/in/abhishekchauhanx/" aria-label="LinkedIn" className="social-link">
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
          <a href="https://abhishek-woad.vercel.app" aria-label="Portfolio" className="social-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            Portfolio
          </a>

          {/* GitHub */}
          <a href="https://github.com/abhishekChauhanx" aria-label="GitHub" className="social-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
            </svg>
            GitHub
          </a>
        </div>
      </div>


        </footer>
      )}
    </>
  )


}