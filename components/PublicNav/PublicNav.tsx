"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleTheme } from "@/store/themeSlice";
import BlurText  from "@/components/BlurText/BlurText";
import TrueFocus from "@/components/TrueFocus/TrueFocus";
import { useTranslations } from "next-intl";
import SelectLang from "../SelectLang/SelectLang";
import "./PublicNav.css";

interface PublicNavProps {
  onNav?: (href: string) => void;
}

export default function PublicNav({ onNav }: PublicNavProps) {
  const dispatch = useAppDispatch();
  const dark     = useAppSelector((s) => s.theme.mode) === "dark";
  const t        = useTranslations("nav");

  const handleClick = (href: string, e: React.MouseEvent) => {
    if (onNav) {
      e.preventDefault();
      onNav(href);
    }
  };

  return (
    <nav>
      <BlurText text="ImageFlow" className="nav-logo" as="span" delay={0} stepDelay={90} />

      <ul className="nav-links">
        {/* in-page anchors — no loader */}
        <li>
          <TrueFocus>
            <a href="#how">
              <BlurText text={t("how")} delay={200} stepDelay={45} />
            </a>
          </TrueFocus>
        </li>
        <li>
          <TrueFocus>
            <a href="#pricing">
              <BlurText text={t("pricing")} delay={380} stepDelay={45} />
            </a>
          </TrueFocus>
        </li>

        {/* ✅ Sign up — triggers loader */}
        <li>
          <TrueFocus>
            <a
              href="/account/signup"
              className="nav-signup-btn"
              onClick={(e) => handleClick("/account/signup", e)}
            >
              <BlurText text={t("signup")} delay={680} stepDelay={45} />
            </a>
          </TrueFocus>
        </li>

        {/* ✅ Sign in — triggers loader */}
        <li>
          <TrueFocus>
            <a
              href="/account/login"
              onClick={(e) => handleClick("/account/login", e)}
            >
              <BlurText text={t("signin")} delay={530} stepDelay={45} />
            </a>
          </TrueFocus>
        </li>

        <SelectLang />

        <li>
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