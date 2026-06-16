/* eslint-disable @next/next/no-img-element */
"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleTheme } from "@/store/themeSlice";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import "./DashNav.css";
import SelectLang from "../SelectLang/SelectLang";
import { useTranslations } from "next-intl";

export default function DashNav() {
  const dispatch = useAppDispatch();
  const dark = useAppSelector((s) => s.theme.mode) === "dark";
  const { data: session } = useSession();
  const router = useRouter();
  const t = useTranslations("dashNav");

  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // links is an array in JSON
  const navLinks = t.raw("links") as { label: string; path: string }[];

  const handleLogout = () => {
    sessionStorage.removeItem("welcomeShown");
    signOut({ callbackUrl: "/", redirect: true });
  };

  const initials =
    session?.user?.name?.charAt(0).toUpperCase() ||
    session?.user?.email?.charAt(0).toUpperCase() ||
    "?";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setPopoverOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="dash-nav">
      <span className="dash-logo" onClick={() => router.push("/")}>
        {t("logo")}
      </span>

      <ul className="dash-nav-links">
        {navLinks.map((l) => (
          <li key={l.label}>
            <button className="dash-nav-btn" onClick={() => router.push(l.path)}>
              {l.label}
            </button>
          </li>
        ))}
      </ul>

      <div className="dash-nav-right">
        <SelectLang />

        {/* ── AVATAR + POPOVER ── */}
        <div className="dash-avatar-wrap" ref={popoverRef}>
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt="avatar"
              className="dash-avatar dash-avatar-img"
              onClick={() => setPopoverOpen((p) => !p)}
            />
          ) : (
            <div
              className="dash-avatar dash-avatar-init"
              onClick={() => setPopoverOpen((p) => !p)}
            >
              {initials}
            </div>
          )}

          {popoverOpen && (
            <div className="dash-popover">
              <button
                className="dash-popover-item"
                onClick={() => { setPopoverOpen(false); router.push("/profile"); }}
              >
                <span className="dash-popover-icon">{t("popover.profile_icon")}</span>
                {t("popover.profile")}
              </button>
              <button
                className="dash-popover-item"
                onClick={() => { setPopoverOpen(false); router.push("/settings"); }}
              >
                <span className="dash-popover-icon">{t("popover.settings_icon")}</span>
                {t("popover.settings")}
              </button>
            </div>
          )}
        </div>

        <button
          className="theme-toggle"
          onClick={() => dispatch(toggleTheme())}
          aria-label="Toggle theme"
        >
          {dark ? t("theme.light") : t("theme.dark")}
        </button>

        <button className="dash-logout" onClick={handleLogout}>
          {t("logout")}
        </button>
      </div>
    </nav>
  );
}