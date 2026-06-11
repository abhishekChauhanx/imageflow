"use client";

import { signIn } from "next-auth/react";
import { useAppSelector } from "@/store/hooks";

import { useEffect, useRef, useState } from "react";
import "./LoginPage.css";
import Footer from "@/components/Footer/Footer";
import LoginNav from "@/components/LoginNav/loginNav";

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

/* ── Eye icon for password toggle ── */
function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

export default function LoginPage() {
  const mode = useAppSelector((s) => s.theme.mode);
  const dark = mode === "dark";

  const [hoverGH, setHoverGH] = useState(false);
  const [hoverGG, setHoverGG] = useState(false);
  const [hoverLogin, setHoverLogin] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [pwFocus, setPwFocus] = useState(false);

  return (
    <div className={`lp${dark ? " lp--dark" : ""}`}>
      <GoldenCanvas dark={dark} />
      <div className="lp-grain" />

      {/* ── LEFT PANEL ── */}
      <aside className="lp-left">
        <div className="lp-left-inner">
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
            <blockquote className="lp-quote">
              <span className="lp-quote-mark">"</span>
              The image you imagine already exists. We simply find it.
              <span className="lp-quote-mark">"</span>
            </blockquote>
          </div>

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
        <span className="lp-watermark">IMAGEFLOW</span>
      </aside>

      {/* ── RIGHT PANEL ── */}
      <main className="lp-right">
        <LoginNav />

        <div className="lp-card">
          {["tl","tr","bl","br"].map((c) => (
            <span key={c} className={`lp-corner lp-corner-${c}`}>✦</span>
          ))}

          {/* header */}
          <div className="lp-card-header">
            <div className="lp-monogram">IF</div>
            <h1 className="lp-card-title">Welcome Back</h1>
            <p className="lp-card-sub">Sign in to your atelier</p>
          </div>

          {/* ── EMAIL / PASSWORD FORM ── */}
          <div className="lp-form">

            {/* Email field */}
            <div className={`lp-field${emailFocus ? " lp-field--focus" : ""}${email ? " lp-field--filled" : ""}`}>
              <label className="lp-field-label" htmlFor="lp-email">Email address</label>
              <div className="lp-field-wrap">
                <svg className="lp-field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                <input
                  id="lp-email"
                  className="lp-field-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                  autoComplete="email"
                />
              </div>
              <span className="lp-field-line" />
            </div>

            {/* Password field */}
            <div className={`lp-field${pwFocus ? " lp-field--focus" : ""}${password ? " lp-field--filled" : ""}`}>
              <label className="lp-field-label" htmlFor="lp-password">Password</label>
              <div className="lp-field-wrap">
                <svg className="lp-field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  id="lp-password"
                  className="lp-field-input"
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPwFocus(true)}
                  onBlur={() => setPwFocus(false)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="lp-pw-toggle"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  <EyeIcon open={showPw} />
                </button>
              </div>
              <span className="lp-field-line" />
            </div>

            {/* Forgot password */}
            <div className="lp-form-meta">
              <button type="button" className="lp-forgot">Forgot password?</button>
            </div>

            {/* Login button */}
            <button
              type="button"
              className={`lp-btn lp-btn-primary${hoverLogin ? " lp-btn-hovered" : ""}`}
              onMouseEnter={() => setHoverLogin(true)}
              onMouseLeave={() => setHoverLogin(false)}
            >
              <span className="lp-btn-bg" />
              <span className="lp-btn-content">
                <span className="lp-btn-label" style={{ textAlign: "center", flex: 1 }}>Sign In</span>
                <span className="lp-btn-arrow">→</span>
              </span>
            </button>

            {/* Create account */}
            <p className="lp-create">
              New here?{" "}
              <button type="button" className="lp-create-link">Create an account</button>
            </p>
          </div>

          {/* rule with text */}
          <div className="lp-rule-row">
            <span className="lp-rule" />
            <span className="lp-rule-text">Or continue with</span>
            <span className="lp-rule" />
          </div>

          {/* ── OAUTH BUTTONS ── */}
          <div className="lp-btns">
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

        <Footer />
      </main>
    </div>
  );
}