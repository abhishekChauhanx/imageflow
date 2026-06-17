/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import DashNav from "@/components/DashNav/DashNav";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { showLoader, hideLoader } from "@/store/loaderSlice";

interface HistoryItem {
  id: string;
  description: string;
  resultsCount: number;
  createdAt: string;
}

export default function HistoryPage() {
  const dark = useAppSelector((s) => s.theme.mode) === "dark";
  const dispatch = useAppDispatch();
  const router = useRouter();
  const t = useTranslations("history");

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // footer links is an array in JSON
  const footerLinks = t.raw("footer.links") as { label: string; path: string }[];

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

  useEffect(() => {
    fetch("/api/history")
      .then((r) => r.json())
      .then((data) => {
        setHistory(data.history || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const clearHistory = async () => {
    await fetch("/api/history", { method: "DELETE" });
    setHistory([]);
    toast.success(t("toast.history_cleared"));
  };

  return (
    <div className={`dash-page${dark ? " dash--dark" : ""}`}>
      <div className="dash-grain" />
      <DashNav />

      <main className="dash-main">
        <div style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "1px solid var(--border)", paddingBottom: "2rem" }}>
          <div>
            <p className="dash-eyebrow">
              <span className="dash-eyebrow-line" /> {t("header.eyebrow")}
            </p>
            <h1 className="dash-hero-title" style={{ fontSize: "clamp(2rem,4vw,3rem)", marginBottom: "0.5rem" }}>
              {t("header.title")}
            </h1>
            <p className="dash-state-sub">
              {t("header.subtitle", { count: history.length })}
            </p>
          </div>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="dash-card-btn dash-card-btn-view"
              style={{ width: "auto", padding: "0.6rem 1.4rem" }}
            >
              {t("header.clear_btn")}
            </button>
          )}
        </div>

        {/* ── LOADING STATE ── */}
        {loading && (
          <div className="dash-state-box">
            <div className="dash-spinner dash-spinner-lg" />
            <p className="dash-state-title">{t("loading_state.title")}</p>
          </div>
        )}

        {/* ── EMPTY STATE ── */}
        {!loading && history.length === 0 && (
          <div className="dash-state-box">
            <div className="dash-empty-icon">{t("empty_state.icon")}</div>
            <p className="dash-state-title">{t("empty_state.title")}</p>
            <p className="dash-state-sub">{t("empty_state.subtitle")}</p>
            <button
              className="dash-chip"
              style={{ marginTop: "2rem" }}
              onClick={() => handleNav("/dashboard")}
            >
              {t("empty_state.cta_btn")}
            </button>
          </div>
        )}

        {/* ── HISTORY LIST ── */}
        {!loading && history.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {history.map((item) => (
              <div
                key={item.id}
                className="dash-card"
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 1.5rem", cursor: "pointer" }}
                onClick={() => handleNav(`/dashboard?q=${encodeURIComponent(item.description)}`)}
              >
                <div>
                  <p style={{ fontSize: "0.8rem", color: "var(--ink)", marginBottom: "0.35rem" }}>
                    {item.description}
                  </p>
                  <p style={{ fontSize: "0.58rem", color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    {item.resultsCount} results · {new Date(item.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <span style={{ color: "var(--accent)", fontSize: "0.75rem" }}>{t("card.arrow")}</span>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer className="dash-footer">
        <span className="dash-footer-copy">
          {t("footer.copy")} <span className="dash-footer-accent">{t("footer.accent")}</span>
        </span>
        <div className="dash-footer-links">
          {footerLinks.map((l) => (
            <button
              key={l.label}
              className="dash-footer-link"
              onClick={() => handleNav(l.path)}
            >
              {l.label}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}