"use client";

import { useState, useRef, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import toast from "react-hot-toast";
import LoginNav from "@/components/LoginNav/loginNav";
import Footer from "@/components/Footer/Footer";
import "../LoginPage.css";
import { useTranslations } from "next-intl";
import OtpPopover from "@/components/OtpPopover/OtpPopover";
function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default function SignUpPage() {
  const dark = useAppSelector((s) => s.theme.mode) === "dark";
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [nameFocus, setNameFocus] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [pwFocus, setPwFocus] = useState(false);
  const [confirmFocus, setConfirmFocus] = useState(false);

  const [hoverGH, setHoverGH] = useState(false);
  const [hoverGG, setHoverGG] = useState(false);
  const [hoverBtn, setHoverBtn] = useState(false);

  const t = useTranslations("signup");


  const [showOtp, setShowOtp] = useState(false);
  const [pendingData, setPendingData] = useState<{
    name: string;
    email: string;
    password: string;
  } | null>(null);

  const handleSignup = async () => {
    if (!name || !email || !password || !confirm) {
      toast.error("All fields are required");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    // Check if email already exists
    const checkRes = await fetch("/api/auth/check-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const checkData = await checkRes.json();
    if (checkData.exists) {
      toast.error("Account already exists with this email");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type: "signup" }),
      });

      if (res.ok) {
        setPendingData({ name, email, password });
        setShowOtp(true);
        toast.success("OTP sent to your email!");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to send OTP");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSuccess = async () => {
    setShowOtp(false);
    toast.success("Account created! Signing you in...");
    await signIn("credentials", {
      email: pendingData?.email,
      password: pendingData?.password,
      callbackUrl: "/dashboard",
      redirect: true,
    });
  };
  return (
    <div className={`lp${dark ? " lp--dark" : ""}`}>
      <div className="lp-grain" />

      {/* LEFT PANEL */}
      <aside className="lp-left">
        <div className="lp-left-inner">
          <div className="lp-roman-frame">
            <span className="lp-roman">I</span>
            <div className="lp-roman-rule" />
            <span className="lp-roman">X</span>
          </div>
          <div className="lp-left-content">
            <p className="lp-left-eyebrow">{t("left.eyebrow")}</p>
            <h2 className="lp-left-headline">
              {t("left.headline_line1")}<br />
              <em>{t("left.headline_em")}</em><br />
              {t("left.headline_line2")}
            </h2>
            <div className="lp-left-divider" />
            <p className="lp-left-body">
              {t("left.body_line1")}<br />
              {t("left.body_line2")}
            </p>
            <blockquote className="lp-quote">
              <span className="lp-quote-mark">"</span>
              {t("left.quote")}
              <span className="lp-quote-mark">"</span>
            </blockquote>
          </div>
          <div className="lp-left-stats">
            {[
              { num: "2.4B+", label: t("left.stats.images") },
              { num: "140ms", label: t("left.stats.latency") },
              { num: "50+", label: t("left.stats.sources") },
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

      {/* RIGHT PANEL */}
      <main className="lp-right">
        <LoginNav />

        <div className="lp-card">
          {["tl", "tr", "bl", "br"].map((c) => (
            <span key={c} className={`lp-corner lp-corner-${c}`}>✦</span>
          ))}

          <div className="lp-card-header">
            <div className="lp-monogram">IF</div>
            <h1 className="lp-card-title">{t("card.title")}</h1>
            <p className="lp-card-sub">{t("card.subtitle")}</p>
          </div>

          {/* FORM */}
          <div className="lp-form">

            {/* Name */}
            <div className={`lp-field${nameFocus ? " lp-field--focus" : ""}${name ? " lp-field--filled" : ""}`}>
              <label className="lp-field-label" htmlFor="lp-name">{t("form.name_label")}</label>
              <div className="lp-field-wrap">
                <svg className="lp-field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  id="lp-name"
                  className="lp-field-input"
                  type="text"
                  placeholder={t("form.name_placeholder")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setNameFocus(true)}
                  onBlur={() => setNameFocus(false)}
                  autoComplete="name"
                />
              </div>
              <span className="lp-field-line" />
            </div>

            {/* Email */}
            <div className={`lp-field${emailFocus ? " lp-field--focus" : ""}${email ? " lp-field--filled" : ""}`}>
              <label className="lp-field-label" htmlFor="lp-email">{t("form.email_label")}</label>
              <div className="lp-field-wrap">
                <svg className="lp-field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <input
                  id="lp-email"
                  className="lp-field-input"
                  type="email"
                  placeholder={t("form.email_placeholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                  autoComplete="email"
                />
              </div>
              <span className="lp-field-line" />
            </div>

            {/* Password */}
            <div className={`lp-field${pwFocus ? " lp-field--focus" : ""}${password ? " lp-field--filled" : ""}`}>
              <label className="lp-field-label" htmlFor="lp-password">{t("form.password_label")}</label>
              <div className="lp-field-wrap">
                <svg className="lp-field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  id="lp-password"
                  className="lp-field-input"
                  type={showPw ? "text" : "password"}
                  placeholder={t("form.password_placeholder")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPwFocus(true)}
                  onBlur={() => setPwFocus(false)}
                  autoComplete="new-password"
                />
                <button type="button" className="lp-pw-toggle" onClick={() => setShowPw((v) => !v)}>
                  <EyeIcon open={showPw} />
                </button>
              </div>
              <span className="lp-field-line" />
            </div>

            {/* Confirm Password */}
            <div className={`lp-field${confirmFocus ? " lp-field--focus" : ""}${confirm ? " lp-field--filled" : ""}`}>
              <label className="lp-field-label" htmlFor="lp-confirm">{t("form.confirm_label")}</label>
              <div className="lp-field-wrap">
                <svg className="lp-field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <input
                  id="lp-confirm"
                  className="lp-field-input"
                  type={showConfirm ? "text" : "password"}
                  placeholder={t("form.confirm_placeholder")}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  onFocus={() => setConfirmFocus(true)}
                  onBlur={() => setConfirmFocus(false)}
                  autoComplete="new-password"
                />
                <button type="button" className="lp-pw-toggle" onClick={() => setShowConfirm((v) => !v)}>
                  <EyeIcon open={showConfirm} />
                </button>
              </div>
              <span className="lp-field-line" />
            </div>

            {/* Submit */}
            <button
              type="button"
              disabled={loading}
              className={`lp-btn lp-btn-primary${hoverBtn ? " lp-btn-hovered" : ""}`}
              onMouseEnter={() => setHoverBtn(true)}
              onMouseLeave={() => setHoverBtn(false)}
              onClick={handleSignup}
            >
              <span className="lp-btn-bg" />
              <span className="lp-btn-content">
                <span className="lp-btn-label" style={{ textAlign: "center", flex: 1 }}>
                  {loading ? t("form.submitting") : t("form.submit")}
                </span>
                {!loading && <span className="lp-btn-arrow">→</span>}
              </span>
            </button>

            <p className="lp-create">
              {t("form.have_account")}{" "}
              <button
                type="button"
                className="lp-create-link"
                onClick={() => router.push("/account/login")}
              >
                {t("form.sign_in")}
              </button>
            </p>
          </div>

          <div className="lp-rule-row">
            <span className="lp-rule" />
            <span className="lp-rule-text">{t("divider")}</span>
            <span className="lp-rule" />
          </div>

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
                <span className="lp-btn-label">{t("oauth.github")}</span>
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
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="lp-btn-label">{t("oauth.google")}</span>
                <span className="lp-btn-arrow">→</span>
              </span>
            </button>
          </div>

          <p className="lp-terms">
            {t("terms.prefix")}{" "}
            <span className="lp-terms-link">{t("terms.tos")}</span>{" "}
            <span dangerouslySetInnerHTML={{ __html: t("terms.and") }} />{" "}
            <span className="lp-terms-link">{t("terms.privacy")}</span>
          </p>
        </div>

        <Footer />
      </main>

      {showOtp && pendingData && (
        <OtpPopover
          email={pendingData.email}
          type="signup"
          signupData={{ name: pendingData.name, password: pendingData.password }}
          onSuccess={handleOtpSuccess}
          onClose={() => setShowOtp(false)}
        />
      )}
    </div>
  );
}