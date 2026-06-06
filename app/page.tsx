"use client";

import Link from "next/link";
import BlurText from "@/components/BlurText/BlurText";
import FallingText from "@/components/FallingText/FallingText";
import TrueFocus from "@/components/TrueFocus/TrueFocus";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import CountUp from "@/components/CountUp/CountUp";
import Footer from "@/components/Footer/Footer";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleTheme } from "@/store/themeSlice";
import "./HomePage.css";

export default function Home() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.theme.mode);
  const dark = mode === "dark";

  return (
    <div className={`page${dark ? " page--dark" : ""}`}>

      {/* ── NAV ─────────────────────────────── */}
      <nav>
        <BlurText text="ImageFlow" className="nav-logo" as="span" delay={0} stepDelay={90} />
        <ul className="nav-links">
          <li><TrueFocus><a href="#how"><BlurText text="How it works" delay={200} stepDelay={45} /></a></TrueFocus></li>
          <li><TrueFocus><a href="#pricing"><BlurText text="Pricing" delay={380} stepDelay={45} /></a></TrueFocus></li>
          <li><TrueFocus><a href="/login"><BlurText text="Sign in" delay={530} stepDelay={45} /></a></TrueFocus></li>
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

      {/* ── HERO ────────────────────────────── */}
      <div className="hero">
        <div className="hero-left">
          <p className="eyebrow">
            <BlurText text="Visual Search Engine" delay={280} stepDelay={55} />
          </p>
          <FallingText
            lines={[
              { text: "Describe it." },
              { text: "Find it.", em: true },
              { text: "Anywhere." },
            ]}
            gravity={0.10}
            stiffness={0.22}
          />
          <p className="description">
            <BlurText
              text="Type what you see in plain language — a red vintage car on a coastal road, a woman in a yellow dress reading — and ImageFlow surfaces it from across the web."
              delay={620}
              stepDelay={18}
            />
          </p>
          <div className="cta-group">
            <TrueFocus><Link href="/login" className="btn-primary">Get Started</Link></TrueFocus>
            <TrueFocus><a href="#how" className="btn-secondary">See how it works</a></TrueFocus>
          </div>
        </div>

        <div className="hero-right">
          <span className="cross">✦</span>
          <div className="search-visual">
            <div className="search-card">
              <p className="search-label">Your description</p>
              <p className="search-query">"old lighthouse at dusk, orange sky"</p>
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

      {/* ── STATS (count-up on scroll) ───────── */}
      <div className="stats-bar">
        {[
          { end: 2.4, suffix: "B+", decimals: 1, label: "Images indexed" },
          { end: 140,  suffix: "ms", decimals: 0, label: "Avg. search time" },
          { end: 98,   suffix: "%",  decimals: 0, label: "Match accuracy" },
          { end: 50,   suffix: "+",  decimals: 0, label: "Supported sources" },
        ].map((s, i) => (
          <div className="stat" key={i}>
            <CountUp
              end={s.end}
              suffix={s.suffix}
              decimals={s.decimals}
              duration={1800}
              className="stat-number"
            />
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── HOW IT WORKS ────────────────────── */}
      <section id="how" className="section how-section">
        <ScrollReveal>
          <p className="section-eyebrow">How it works</p>
          <h2 className="section-title">Three steps to any image</h2>
        </ScrollReveal>

        <div className="steps-grid">
          {[
            {
              n: "01",
              title: "Describe",
              body: "Write what you see in plain English. No keywords, no tags — just a natural sentence.",
              icon: "✏️",
            },
            {
              n: "02",
              title: "Search",
              body: "Our multimodal model converts your words into a visual embedding and scans 2.4B images in under 140ms.",
              icon: "⚡",
            },
            {
              n: "03",
              title: "Find",
              body: "Ranked results surface the closest visual matches with source attribution and licensing info.",
              icon: "🎯",
            },
          ].map((step, i) => (
            <ScrollReveal key={i} delay={i * 140} direction="up">
              <div className="step-card">
                <span className="step-num">{step.n}</span>
                <span className="step-icon">{step.icon}</span>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-body">{step.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── FEATURES ────────────────────────── */}
      <section className="section features-section">
        <div className="features-left">
          <ScrollReveal direction="left">
            <p className="section-eyebrow">Features</p>
            <h2 className="section-title">Built for creators<br />and developers</h2>
            <p className="section-body">
              ImageFlow speaks both languages. A clean UI for designers and
              photographers, a powerful REST API for engineers building
              visual search into their products.
            </p>
          </ScrollReveal>

          <div className="feature-list">
            {[
              { label: "Natural language queries", desc: "No boolean operators or tags — just describe what you see." },
              { label: "REST & GraphQL API",       desc: "Full programmatic access with SDKs for JS, Python and Go." },
              { label: "Reverse image search",     desc: "Upload an image and find visually similar results instantly." },
              { label: "Batch processing",         desc: "Run thousands of queries asynchronously via webhooks." },
            ].map((f, i) => (
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
              <p className="feat-card-label">Query</p>
              <p className="feat-card-query">"misty forest path in autumn, golden light"</p>
              <div className="feat-tags">
                <span className="tag">Nature</span>
                <span className="tag accent">98.2% match</span>
                <span className="tag">Royalty free</span>
              </div>
            </div>
            <div className="feat-card-row">
              <div className="feat-card feat-card-sm">
                <p className="feat-card-label">API calls today</p>
                <CountUp end={48291} suffix="" decimals={0} duration={2200} className="feat-big-num" />
              </div>
              <div className="feat-card feat-card-sm accent-card">
                <p className="feat-card-label">Avg latency</p>
                <p className="feat-big-num">138<span style={{fontSize:"1rem"}}>ms</span></p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── PRICING ─────────────────────────── */}
      <section id="pricing" className="section pricing-section">
        <ScrollReveal>
          <p className="section-eyebrow">Pricing</p>
          <h2 className="section-title">Simple, transparent</h2>
        </ScrollReveal>

        <div className="pricing-grid">
          {[
            {
              name: "Free",
              price: 0,
              unit: "/mo",
              features: ["500 queries / month", "Web UI access", "Community support", "3 sources"],
              cta: "Get started",
              accent: false,
            },
            {
              name: "Pro",
              price: 29,
              unit: "/mo",
              features: ["50 000 queries / month", "REST & GraphQL API", "Priority support", "50+ sources", "Batch processing"],
              cta: "Start free trial",
              accent: true,
            },
            {
              name: "Enterprise",
              price: 99,
              unit: "+ custom /mo",
              features: ["Unlimited queries", "Dedicated infra", "SLA guarantee", "Custom sources", "SSO / SAML"],
              cta: "Contact us",
              accent: false,
            },
          ].map((plan, i) => (
            <ScrollReveal key={i} delay={i * 120} direction="up">
              <div className={`pricing-card ${plan.accent ? "pricing-card-accent" : ""}`}>
                {plan.accent && <span className="pricing-badge">Most popular</span>}
                <p className="pricing-name">{plan.name}</p>
                <p className="pricing-price">
                  {plan.price !== null
                    ? <><span className="price-big">${plan.price}</span>{plan.unit}</>
                    : <span className="price-big">—</span>
                  }
                </p>
                <ul className="pricing-features">
                  {plan.features.map((f, j) => (
                    <li key={j}><span className="check">✓</span>{f}</li>
                  ))}
                </ul>
                <a href={plan.accent ? "/login" : "#"} className={plan.accent ? "btn-primary" : "btn-outline"}>
                  {plan.cta}
                </a>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ──────────────────────── */}
      <ScrollReveal>
        <section className="cta-banner">
          <p className="cta-banner-eyebrow">Ready to search smarter?</p>
          <h2 className="cta-banner-title">Start for free.<br /><em>Scale when you're ready.</em></h2>
          <TrueFocus>
            <Link href="/login" className="btn-primary btn-large">Create free account</Link>
          </TrueFocus>
        </section>
      </ScrollReveal>

      {/* ── FOOTER ──────────────────────────── */}
      <Footer />

    </div>
  );
}