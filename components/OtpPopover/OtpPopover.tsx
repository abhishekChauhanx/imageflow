"use client";

import { useEffect, useRef, useState } from "react";
import "./OtpPopover.css";

interface OtpPopoverProps {
  email: string;
  type: "signup" | "login";
  onSuccess: () => void;
  onClose: () => void;
  signupData?: { name: string; password: string };
}

export default function OtpPopover({
  email,
  type,
  onSuccess,
  onClose,
  signupData,
}: OtpPopoverProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (resendTimer <= 0) {
      setCanResend(true);
      return;
    }
    const t = setTimeout(() => setResendTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    const val = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (!val) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }
    const newOtp = [...otp];
    newOtp[index] = val[val.length - 1];
    setOtp(newOtp);
    if (index < 5 && val) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 6);
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter all 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code,
          type,
          ...(type === "signup" && signupData),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Verification failed");
        return;
      }

      onSuccess();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setCanResend(false);
    setResendTimer(30);
    setError("");
    setOtp(["", "", "", "", "", ""]);
    inputs.current[0]?.focus();

    await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, type }),
    });
  };

  return (
    <div className="otp-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="otp-popover">

        {/* Corner ornaments */}
        {["tl", "tr", "bl", "br"].map((c) => (
          <span key={c} className={`otp-corner otp-corner-${c}`}>✦</span>
        ))}

        {/* Close button */}
        <button className="otp-close" onClick={onClose} aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* Header */}
        <div className="otp-header">
          <div className="otp-monogram">IF</div>
          <h2 className="otp-title">Verify your email</h2>
          <p className="otp-sub">
            We sent a 6-character code to
          </p>
          <p className="otp-email">{email}</p>
        </div>

        {/* OTP inputs */}
        <div className="otp-inputs" onPaste={handlePaste}>
          {otp.map((val, i) => (
            <input
              key={i}
              ref={(el) => { inputs.current[i] = el; }}
              className={`otp-input${val ? " otp-input--filled" : ""}`}
              type="text"
              maxLength={1}
              value={val}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              autoFocus={i === 0}
              autoComplete="off"
              spellCheck={false}
            />
          ))}
        </div>

        {/* Error */}
        {error && <p className="otp-error">{error}</p>}

        {/* Timer */}
        <p className="otp-timer">
          {canResend ? (
            <button className="otp-resend-btn" onClick={handleResend}>
              Resend code
            </button>
          ) : (
            <>Resend in <span className="otp-timer-num">{resendTimer}s</span></>
          )}
        </p>

        {/* Verify button */}
        <button
          className={`otp-verify-btn${loading ? " otp-verify-btn--loading" : ""}`}
          onClick={handleVerify}
          disabled={loading || otp.join("").length !== 6}
        >
          {loading ? (
            <span className="otp-spinner" />
          ) : (
            "Verify & Continue →"
          )}
        </button>

        <p className="otp-hint">Code expires in 5 minutes</p>
      </div>
    </div>
  );
}