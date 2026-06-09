"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleTheme } from "@/store/themeSlice";
import BlurText from "@/components/BlurText/BlurText";
import TrueFocus from "@/components/TrueFocus/TrueFocus";

export default function PublicNav() {
  const dispatch = useAppDispatch();
  const dark = useAppSelector((s) => s.theme.mode) === "dark";

  return (
    <nav>
      <BlurText text="ImageFlow" className="nav-logo" as="span" delay={0} stepDelay={90} />
      <ul className="nav-links">
        <li>
          <TrueFocus>
            <a href="#how">
              <BlurText text="How it works" delay={200} stepDelay={45} />
            </a>
          </TrueFocus>
        </li>
        <li>
          <TrueFocus>
            <a href="#pricing">
              <BlurText text="Pricing" delay={380} stepDelay={45} />
            </a>
          </TrueFocus>
        </li>
        <li>
          <TrueFocus>
            <a href="/login">
              <BlurText text="Sign in" delay={530} stepDelay={45} />
            </a>
          </TrueFocus>
        </li>
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