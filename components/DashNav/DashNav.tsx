"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleTheme } from "@/store/themeSlice";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import "./DashNav.css";
import SelectLang from "../SelectLang/SelectLang";
import { useTranslations } from "next-intl";
import { showLoader } from "@/store/loaderSlice";

export default function DashNav() {
  const dispatch = useAppDispatch();
  const dark = useAppSelector((s) => s.theme.mode) === "dark";
  const { data: session } = useSession();
  const router = useRouter();
  const t = useTranslations("dashNav");

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const navLinks = t.raw("links") as { label: string; path: string }[];

  const handleLogout = async () => {
    sessionStorage.removeItem("welcomeShown");
    dispatch(showLoader());
    await signOut({ callbackUrl: "/", redirect: true });
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

  const goTo = (path: string) => {
    router.push(path);
    setMenuOpen(false);
  };

  return (
    <nav className="dash-nav">
      <div className="dash-nav-top">
        <span className="dash-logo" onClick={() => goTo("/")}>
          {t("logo")}
        </span>

        <button
          className="dash-hamburger"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((m) => !m)}
        >
          <span />
          <span />
          <span />
        </button>

        {/* Avatar stays visible on the top bar even on mobile */}
        <div className="dash-avatar-wrap dash-avatar-mobile" ref={popoverRef}>
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
                onClick={() => { setPopoverOpen(false); goTo("/profile"); }}
              >
                <span className="dash-popover-icon">{t("popover.profile_icon")}</span>
                {t("popover.profile")}
              </button>
              <button
                className="dash-popover-item"
                onClick={() => { setPopoverOpen(false); goTo("/settings"); }}
              >
                <span className="dash-popover-icon">{t("popover.settings_icon")}</span>
                {t("popover.settings")}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={`dash-nav-collapsible ${menuOpen ? "dash-nav-collapsible-open" : ""}`}>
        <ul className="dash-nav-links">
          {navLinks.map((l) => (
            <li key={l.label}>
              <button className="dash-nav-btn" onClick={() => goTo(l.path)}>
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="dash-nav-right">
          <SelectLang />

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
      </div>
    </nav>
  );
}