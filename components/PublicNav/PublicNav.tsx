"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleTheme } from "@/store/themeSlice";
import BlurText from "@/components/BlurText/BlurText";
import TrueFocus from "@/components/TrueFocus/TrueFocus";

import { useTranslations } from "next-intl";
import "./PublicNav.css"
import SelectLang from "../SelectLang/SelectLang";


export default function PublicNav() {
  const dispatch = useAppDispatch();
  const dark = useAppSelector((s) => s.theme.mode) === "dark";


  const t = useTranslations("nav");



  return (
    <nav>
      <BlurText text="ImageFlow" className="nav-logo" as="span" delay={0} stepDelay={90} />
      <ul className="nav-links">
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
        <li>
          <TrueFocus>
            <a href="/login">
              <BlurText text={t("signin")} delay={530} stepDelay={45} />
            </a>
          </TrueFocus>
        </li>

        {/* Language Switcher */}


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