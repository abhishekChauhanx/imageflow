"use client";

import Link from "next/link";
import BlurText from "@/components/BlurText/BlurText";
import FallingText from "@/components/FallingText/FallingText";
import TrueFocus from "@/components/TrueFocus/TrueFocus";
import "./HomePage.css";

export default function Home() {
  return (
    <div className="page">

      {/* ── NAV ─────────────────────────────── */}
      <nav>
        {/* logo — blur in on mount */}
        <BlurText text="ImageFlow" className="nav-logo" as="span" delay={0} stepDelay={90} />

        <ul className="nav-links">
          <li>
            <TrueFocus>
              <a href="#">
                <BlurText text="How it works" delay={200} stepDelay={45} />
              </a>
            </TrueFocus>
          </li>
          <li>
            <TrueFocus>
              <a href="#">
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
        </ul>
      </nav>

      {/* ── HERO ────────────────────────────── */}
      <div className="hero">
        <div className="hero-left">

          {/* eyebrow */}
          <p className="eyebrow">
            <BlurText text="Visual Search Engine" delay={280} stepDelay={55} />
          </p>

          {/* h1 — FallingText on hover */}
          <FallingText
            lines={[
              { text: "Describe it." },
              { text: "Find it.", em: true },
              { text: "Anywhere." },
            ]}
          />

          {/* description */}
          <p className="description">
            <BlurText
              text="Type what you see in plain language — a red vintage car on a coastal road, a woman in a yellow dress reading — and ImageFlow surfaces it from across the web."
              delay={620}
              stepDelay={18}
            />
          </p>

          {/* CTAs */}
          <div className="cta-group">
            <TrueFocus>
              <Link href="/login" className="btn-primary">
                Get Started
              </Link>
            </TrueFocus>

            <TrueFocus>
              <a href="#" className="btn-secondary">
                See how it works
              </a>
            </TrueFocus>
          </div>
        </div>

        {/* ── RIGHT PANEL ─────────────────────── */}
        <div className="hero-right">
          <span className="cross">✦</span>

          <div className="search-visual">
            <div className="search-card">
              <p className="search-label">Your description</p>
              <p className="search-query">old lighthouse at dusk, orange sky</p>

              <div className="result-items">
                {[
                  { cls: "gold", short: false },
                  { cls: "dark", short: true },
                  { cls: "",     short: false },
                ].map((item, i) => (
                  <div className="result-item" key={i}>
                    <div className={`result-dot ${item.cls}`} />
                    <div className={`result-line ${item.short ? "short" : ""}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="floating-tag">12 matches found</div>
        </div>
      </div>

      {/* ── STATS ───────────────────────────── */}
      <div className="stats-bar">
        <div className="stat">
          <BlurText text="2.4B+"           className="stat-number" as="span" delay={820}  stepDelay={60} />
          <BlurText text="Images indexed"  className="stat-label"  as="span" delay={920}  stepDelay={38} />
        </div>
        <div className="stat">
          <BlurText text="140ms"           className="stat-number" as="span" delay={980}  stepDelay={60} />
          <BlurText text="Avg. search time" className="stat-label" as="span" delay={1060} stepDelay={38} />
        </div>
        <div className="stat">
          <BlurText text="98%"             className="stat-number" as="span" delay={1130} stepDelay={60} />
          <BlurText text="Match accuracy"  className="stat-label"  as="span" delay={1210} stepDelay={38} />
        </div>
        <div className="stat">
          <BlurText text="50+"             className="stat-number" as="span" delay={1280} stepDelay={60} />
          <BlurText text="Supported sources" className="stat-label" as="span" delay={1360} stepDelay={38} />
        </div>
      </div>

    </div>
  );
}