/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import DashNav from "@/components/DashNav/DashNav";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface HistoryItem {
  id: string;
  description: string;
  resultsCount: number;
  createdAt: string;
}

export default function HistoryPage() {
  const dark = useAppSelector((s) => s.theme.mode) === "dark";
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

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
    toast.success("History cleared!");
  };

  return (
    <div className={`dash-page${dark ? " dash--dark" : ""}`}>
      <div className="dash-grain" />
      <DashNav />

      <main className="dash-main">
        <div style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "1px solid var(--border)", paddingBottom: "2rem" }}>
          <div>
            <p className="dash-eyebrow">
              <span className="dash-eyebrow-line" /> Your Activity
            </p>
            <h1 className="dash-hero-title" style={{ fontSize: "clamp(2rem,4vw,3rem)", marginBottom: "0.5rem" }}>
              Search History
            </h1>
            <p className="dash-state-sub">{history.length} searches saved</p>
          </div>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="dash-card-btn dash-card-btn-view"
              style={{ width: "auto", padding: "0.6rem 1.4rem" }}
            >
              Clear All
            </button>
          )}
        </div>

        {loading && (
          <div className="dash-state-box">
            <div className="dash-spinner dash-spinner-lg" />
            <p className="dash-state-title">Loading history…</p>
          </div>
        )}

        {!loading && history.length === 0 && (
          <div className="dash-state-box">
            <div className="dash-empty-icon">✦</div>
            <p className="dash-state-title">No searches yet</p>
            <p className="dash-state-sub">Start searching to see your history here</p>
            <button
              className="dash-chip"
              style={{ marginTop: "2rem" }}
              onClick={() => router.push("/dashboard")}
            >
              Go to Search
            </button>
          </div>
        )}

        {!loading && history.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {history.map((item) => (
              <div
                key={item.id}
                className="dash-card"
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 1.5rem", cursor: "pointer" }}
                onClick={() => router.push(`/dashboard?q=${encodeURIComponent(item.description)}`)}
              >
                <div>
                  <p style={{ fontSize: "0.8rem", color: "var(--ink)", marginBottom: "0.35rem" }}>
                    {item.description}
                  </p>
                  <p style={{ fontSize: "0.58rem", color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    {item.resultsCount} results · {new Date(item.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <span style={{ color: "var(--accent)", fontSize: "0.75rem" }}>→</span>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="dash-footer">
        <span className="dash-footer-copy">© 2026 <span className="dash-footer-accent">@zoker2026</span></span>
        <div className="dash-footer-links">
          {[{ label: "Search", path: "/dashboard" }, { label: "Saved", path: "/saved" }, { label: "Home", path: "/" }].map((l) => (
            <button key={l.label} className="dash-footer-link" onClick={() => router.push(l.path)}>{l.label}</button>
          ))}
        </div>
      </footer>
    </div>
  );
}