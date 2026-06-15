"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

// components
import BlurText     from "@/components/BlurText/BlurText";
import FallingText  from "@/components/FallingText/FallingText";
import TrueFocus    from "@/components/TrueFocus/TrueFocus";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import CountUp      from "@/components/CountUp/CountUp";
import Footer       from "@/components/Footer/Footer";
import PublicNav    from "@/components/PublicNav/PublicNav";
import IFLoader     from "@/components/IFLoader/IFLoader"; // ✅ reuse the component

// redux
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { showLoader, hideLoader }          from "@/store/loaderSlice";

// styles
import "./HomePage.css";

export default function Home() {
  const dark    = useAppSelector((s) => s.theme.mode) === "dark";
  const visible = useAppSelector((s) => s.loader.visible); // ✅ redux drives overlay
  const dispatch = useAppDispatch();
  const router   = useRouter();

  /* ── translations ── */
  const t   = useTranslations("home");
  const th  = useTranslations("home.hero");
  const th2 = useTranslations("home.how_it_works");
  const tf  = useTranslations("home.features");
  const tp  = useTranslations("home.pricing");
  const tc  = useTranslations("home.cta_banner");
const load = useTranslations("loading");

  const fallingLines = t.raw("hero.falling_lines") as string[];
  const statLabels   = t.raw("stats")              as { label: string }[];
  const steps        = t.raw("how_it_works.steps") as { title: string; body: string }[];
  const featureList  = t.raw("features.list")      as { label: string; desc: string }[];
  const featureTags  = t.raw("features.card.tags") as string[];
  const plans        = t.raw("pricing.plans")       as {
    name: string; unit: string; features: string[]; cta: string;
  }[];

  const planPrices = [0, 29, 99];
  const planAccent = [false, true, false];
  const handleNav = useCallback(
    (href: string) => {
      dispatch(showLoader());
      setTimeout(() => {
        router.push(href);
        setTimeout(() => dispatch(hideLoader()), 3000);
      }, 400);
    },
    [dispatch, router]
  );

  return (
    <>
   
      <div
        className={`if-overlay${visible ? " if-overlay--visible" : ""}`}
        aria-hidden={!visible}
        role="status"
        aria-label="Loading, please wait"
      >
        <IFLoader size={120} duration={2} />
        <p className="if-overlay-text">{load("load")}</p>
      </div>

      {/* ══════════════════════════════════════════════
          PAGE CONTENT
      ══════════════════════════════════════════════ */}
      <div className={`page${dark ? " page--dark" : ""}`}>
        <PublicNav onNav={handleNav} />

        {/* ── HERO ── */}
        <div className="hero">
          <div className="hero-left">
            <p className="eyebrow">
              <BlurText text={th("eyebrow")} delay={280} stepDelay={55} />
            </p>
            <FallingText
              lines={fallingLines.map((text, i) => ({ text, em: i === 1 }))}
              gravity={0.10}
              stiffness={0.22}
            />
            <p className="description">
              <BlurText text={th("description")} delay={620} stepDelay={18} />
            </p>
            <div className="cta-group">
              {/* ✅ Get Started → loader → /account/login */}
              <TrueFocus>
                <button
                  className="btn-primary"
                  onClick={() => handleNav("/account/login")}
                >
                  {th("cta_primary")}
                </button>
              </TrueFocus>

              {/* in-page anchor — no loader needed */}
              <TrueFocus>
                <a href="#how" className="btn-secondary">
                  {th("cta_secondary")}
                </a>
              </TrueFocus>
            </div>
          </div>

          <div className="hero-right">
            <span className="cross">✦</span>
            <div className="search-visual">
              <div className="search-card">
                <p className="search-label">{th("search_label")}</p>
                <p className="search-query">{th("search_query")}</p>
                <div className="result-items">
                  {[
                    { cls: "gold", short: false },
                    { cls: "dark", short: true  },
                    { cls: "",     short: false  },
                  ].map((item, i) => (
                    <div className="result-item" key={i}>
                      <div className={`result-dot ${item.cls}`} />
                      <div className={`result-line ${item.short ? "short" : ""}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="floating-tag">{th("floating_tag")}</div>
          </div>
        </div>

        {/* ── STATS ── */}
        <div className="stats-bar">
          {[
            { end: 2.4, suffix: "B+", decimals: 1 },
            { end: 140, suffix: "ms", decimals: 0 },
            { end: 98,  suffix: "%",  decimals: 0 },
            { end: 50,  suffix: "+",  decimals: 0 },
          ].map((s, i) => (
            <div className="stat" key={i}>
              <CountUp
                end={s.end}
                suffix={s.suffix}
                decimals={s.decimals}
                duration={1800}
                className="stat-number"
              />
              <span className="stat-label">{statLabels[i].label}</span>
            </div>
          ))}
        </div>

        {/* ── HOW IT WORKS ── */}
        <section id="how" className="section how-section">
          <ScrollReveal>
            <p className="section-eyebrow">{th2("eyebrow")}</p>
            <h2 className="section-title">{th2("title")}</h2>
          </ScrollReveal>
          <div className="steps-grid">
            {steps.map((step, i) => (
              <ScrollReveal key={i} delay={i * 140} direction="up">
                <div className="step-card">
                  <span className="step-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="step-icon">{["✏️", "⚡", "🎯"][i]}</span>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-body">{step.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="section features-section">
          <div className="features-left">
            <ScrollReveal direction="left">
              <p className="section-eyebrow">{tf("eyebrow")}</p>
              <h2 className="section-title">{tf("title")}</h2>
              <p className="section-body">{tf("body")}</p>
            </ScrollReveal>
            <div className="feature-list">
              {featureList.map((f, i) => (
                <ScrollReveal key={i} delay={i * 100} direction="left">
                  <div className="feature-item">
                    <span className="feature-dot" />
                    <div>
                      <p className="feature-label">{f.label}</p>
                      <p className="feature-desc">{f.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          <ScrollReveal direction="right" className="features-right-wrap">
            <div className="features-right">
              <div className="feat-card feat-card-lg">
                <p className="feat-card-label">{tf("card.query_label")}</p>
                <p className="feat-card-query">{tf("card.query_text")}</p>
                <div className="feat-tags">
                  {featureTags.map((tag, i) => (
                    <span key={i} className={`tag${i === 1 ? " accent" : ""}`}>{tag}</span>
                  ))}
                </div>
              </div>
              <div className="feat-card-row">
                <div className="feat-card feat-card-sm">
                  <p className="feat-card-label">{tf("card.api_calls_label")}</p>
                  <CountUp end={48291} suffix="" decimals={0} duration={2200} className="feat-big-num" />
                </div>
                <div className="feat-card feat-card-sm accent-card">
                  <p className="feat-card-label">{tf("card.latency_label")}</p>
                  <p className="feat-big-num">138<span style={{ fontSize: "1rem" }}>ms</span></p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ── PRICING ── */}
        <section id="pricing" className="section pricing-section">
          <ScrollReveal>
            <p className="section-eyebrow">{tp("eyebrow")}</p>
            <h2 className="section-title">{tp("title")}</h2>
          </ScrollReveal>
          <div className="pricing-grid">
            {plans.map((plan, i) => (
              <ScrollReveal key={i} delay={i * 120} direction="up">
                <div className={`pricing-card${planAccent[i] ? " pricing-card-accent" : ""}`}>
                  {planAccent[i] && (
                    <span className="pricing-badge">{tp("badge")}</span>
                  )}
                  <p className="pricing-name">{plan.name}</p>
                  <p className="pricing-price">
                    <span className="price-big">${planPrices[i]}</span>
                    {plan.unit}
                  </p>
                  <ul className="pricing-features">
                    {plan.features.map((f, j) => (
                      <li key={j}><span className="check">✓</span>{f}</li>
                    ))}
                  </ul>
                  {/* ✅ all pricing CTAs trigger loader */}
                  <button
                    className={planAccent[i] ? "btn-primary" : "btn-outline"}
                    onClick={() =>
                      handleNav(planAccent[i] ? "/account/login" : "/account/signup")
                    }
                  >
                    {plan.cta}
                  </button>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <ScrollReveal>
          <section className="cta-banner">
            <p className="cta-banner-eyebrow">{tc("eyebrow")}</p>
            <h2 className="cta-banner-title">{tc("title")}</h2>
            {/* ✅ Create free account → loader → /account/signup */}
            <button
              className="btn-primary btn-large"
              onClick={() => handleNav("/account/signup")}
            >
              {tc("cta")}
            </button>
          </section>
        </ScrollReveal>

        <Footer />
      </div>
    </>
  );
}