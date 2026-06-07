"use client";

import { signIn } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleTheme } from "@/store/themeSlice";
import { useEffect, useRef, useState } from "react";
import "./LoginPage.css";

/* ── animated canvas: slow golden particle field ── */
function GoldenCanvas({ dark }: { dark: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const raf = useRef<number>(0);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    type P = { x: number; y: number; r: number; vx: number; vy: number; op: number; pulse: number; phase: number };
    const pts: P[] = Array.from({ length: 55 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.8 + 0.3,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      op: Math.random() * 0.35 + 0.08,
      pulse: Math.random() * 0.008 + 0.003,
      phase: Math.random() * Math.PI * 2,
    }));

    /* thin connecting lines between nearby points */
    const connect = () => {
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 130) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(200,169,110,${(1 - d / 130) * 0.08})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      t += 0.016;
      pts.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        const op = p.op * (0.6 + 0.4 * Math.sin(t * p.pulse * 60 + p.phase));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,169,110,${op})`;
        ctx.fill();
      });
      connect();

      /* large slow rings */
      [
        { cx: W * 0.15, cy: H * 0.25, r: 180, sp: 0.0015 },
        { cx: W * 0.85, cy: H * 0.7,  r: 240, sp: 0.001  },
        { cx: W * 0.5,  cy: H * 0.5,  r: 320, sp: 0.0008 },
      ].forEach(({ cx, cy, r, sp }) => {
        const pulse = 0.85 + 0.15 * Math.sin(t * sp * 60);
        ctx.beginPath();
        ctx.arc(cx, cy, r * pulse, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(200,169,110,${0.04 * pulse})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      raf.current = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf.current); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}
    />
  );
}

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((s) => s.theme.mode);
  const dark = mode === "dark";
  const [hoverGH, setHoverGH] = useState(false);
  const [hoverGG, setHoverGG] = useState(false);

  return (
    <div className={`lp${dark ? " lp--dark" : ""}`}>
      <GoldenCanvas dark={dark} />

      {/* grain */}
      <div className="lp-grain" />

      {/* ── LEFT PANEL — editorial art side ── */}
      <aside className="lp-left">
        <div className="lp-left-inner">

          {/* decorative roman numeral frame */}
          <div className="lp-roman-frame">
            <span className="lp-roman">I</span>
            <div className="lp-roman-rule" />
            <span className="lp-roman">X</span>
          </div>

          <div className="lp-left-content">
            <p className="lp-left-eyebrow">Est. 2024 · Visual Intelligence</p>

            <h2 className="lp-left-headline">
              See the<br />
              <em>world</em><br />
              differently.
            </h2>

            <div className="lp-left-divider" />

            <p className="lp-left-body">
              Two billion four hundred million images.<br />
              One sentence. Infinite possibility.
            </p>

            {/* ornate quote */}
            <blockquote className="lp-quote">
              <span className="lp-quote-mark">"</span>
              The image you imagine already exists. We simply find it.
              <span className="lp-quote-mark">"</span>
            </blockquote>
          </div>

          {/* bottom stats */}
          <div className="lp-left-stats">
            {[
              { num: "2.4B+", label: "Images Indexed" },
              { num: "140ms", label: "Avg. Latency"  },
              { num: "50+",   label: "Sources"        },
            ].map((s, i) => (
              <div key={i} className="lp-left-stat">
                <span className="lp-left-stat-num">{s.num}</span>
                <span className="lp-left-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* vertical text watermark */}
        <span className="lp-watermark">IMAGEFLOW</span>
      </aside>

      {/* ── RIGHT PANEL — login form ── */}
      <main className="lp-right">

        {/* top bar */}
        <div className="lp-topbar">
          <span className="lp-logo">ImageFlow</span>
          <button
            className="lp-theme-btn"
            onClick={() => dispatch(toggleTheme())}
            aria-label="Toggle theme"
          >
            {dark ? "☀ Light" : "◐ Dark"}
          </button>
        </div>

        {/* centre card */}
        <div className="lp-card">

          {/* four corner ornaments */}
          {["tl","tr","bl","br"].map((c) => (
            <span key={c} className={`lp-corner lp-corner-${c}`}>✦</span>
          ))}

          {/* header */}
          <div className="lp-card-header">
            <div className="lp-monogram">IF</div>
            <h1 className="lp-card-title">Welcome Back</h1>
            <p className="lp-card-sub">Sign in to your atelier</p>
          </div>

          {/* rule with text */}
          <div className="lp-rule-row">
            <span className="lp-rule" />
            <span className="lp-rule-text">Continue with</span>
            <span className="lp-rule" />
          </div>

          {/* ── BUTTONS ── */}
          <div className="lp-btns">

            {/* GitHub */}
            <button
              className={`lp-btn lp-btn-gh${hoverGH ? " lp-btn-hovered" : ""}`}
              onMouseEnter={() => setHoverGH(true)}
              onMouseLeave={() => setHoverGH(false)}
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            >
              <span className="lp-btn-bg" />
              <span className="lp-btn-content">
                <svg className="lp-btn-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
                </svg>
                <span className="lp-btn-label">Continue with GitHub</span>
                <span className="lp-btn-arrow">→</span>
              </span>
            </button>

            {/* Google */}
            <button
              className={`lp-btn lp-btn-gg${hoverGG ? " lp-btn-hovered" : ""}`}
              onMouseEnter={() => setHoverGG(true)}
              onMouseLeave={() => setHoverGG(false)}
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            >
              <span className="lp-btn-bg" />
              <span className="lp-btn-content">
                <svg className="lp-btn-icon" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="lp-btn-label">Continue with Google</span>
                <span className="lp-btn-arrow">→</span>
              </span>
            </button>
          </div>

          {/* terms */}
          <p className="lp-terms">
            By signing in you agree to our{" "}
            <span className="lp-terms-link">Terms of Service</span> &amp;{" "}
            <span className="lp-terms-link">Privacy Policy</span>
          </p>
        </div>

        {/* footer */}
        <footer className="lp-footer">
          <span>© 2026 <span className="lp-gold">@zoker2026</span></span>
          <div className="lp-footer-icons">
            {/* LinkedIn */}
            <a href="#" aria-label="LinkedIn" className="lp-footer-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            {/* GitHub */}
            <a href="#" aria-label="GitHub" className="lp-footer-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            {/* Portfolio globe */}
            <a href="#" aria-label="Portfolio" className="lp-footer-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}