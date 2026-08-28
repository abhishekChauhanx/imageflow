"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleTheme } from "@/store/themeSlice";
import BlurText from "@/components/BlurText/BlurText";
import TrueFocus from "@/components/TrueFocus/TrueFocus";
import { useTranslations } from "next-intl";
import SelectLang from "../SelectLang/SelectLang";
import "./PublicNav.css";

interface PublicNavProps {
  onNav?: (href: string) => void;
}

export default function PublicNav({ onNav }: PublicNavProps) {
  const dispatch = useAppDispatch();
  const dark = useAppSelector((s) => s.theme.mode) === "dark";
  const t = useTranslations("nav");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleClick = (href: string, e: React.MouseEvent) => {
    if (onNav) {
      e.preventDefault();
      onNav(href);
    }
    setMenuOpen(false); // close mobile menu on nav
  };

  return (
    <nav className="public-nav">
      <div className="public-nav-bar">
        <BlurText text="ImageFlow" className="nav-logo" as="span" delay={0} stepDelay={90} />

        <button
          className="nav-hamburger"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((m) => !m)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <ul className={`nav-links ${menuOpen ? "nav-links-open" : ""}`}>
        <li>
          <TrueFocus>
            <a href="#how" onClick={() => setMenuOpen(false)}>
              <BlurText text={t("how")} delay={200} stepDelay={45} />
            </a>
          </TrueFocus>
        </li>
        <li>
          <TrueFocus>
            <a href="#pricing" onClick={() => setMenuOpen(false)}>
              <BlurText text={t("pricing")} delay={380} stepDelay={45} />
            </a>
          </TrueFocus>
        </li>

        <li>
          <TrueFocus>
            
            <a  href="/account/signup"
              className="nav-signup-btn"
              onClick={(e) => handleClick("/account/signup", e)}
            >
              <BlurText text={t("signup")} delay={680} stepDelay={45} />
            </a>
          </TrueFocus>
        </li>

        <li>
          <TrueFocus>
            
            <a  href="/account/login"
              onClick={(e) => handleClick("/account/login", e)}
            >
              <BlurText text={t("signin")} delay={530} stepDelay={45} />
            </a>
          </TrueFocus>
        </li>

        <li className="nav-mobile-row">
          <SelectLang />
          <button
            className="theme-toggle"
            onClick={() => dispatch(toggleTheme())}
            aria-label="Toggle theme"
          >
            {dark ? "☀ Light" : "◐ Dark"}
          </button>
        </li>
      </ul>
    </nav>
  );
}