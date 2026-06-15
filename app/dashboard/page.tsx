/* eslint-disable @next/next/no-img-element */
"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleTheme } from "@/store/themeSlice";
import "./DashboardPage.css";
import DashNav from "@/components/DashNav/DashNav";
import IFLoader from "@/components/IFLoader/IFLoader";
import { showLoader, hideLoader } from "@/store/loaderSlice";
import { useCallback } from "react";
interface ImageResult {
  imageUrl: string;
  sourceUrl: string;
  sourceSite: string;
  title: string;
}

const SUGGESTION_TAGS = [
  "sunset mountains",
  "anime girl",
  "futuristic city",
  "cute cat",
  "abstract art",
  "old lighthouse dusk",
  "misty forest autumn",
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.theme.mode);
  const dark = mode === "dark";

  const [description, setDescription] = useState("");
  const [results, setResults] = useState<ImageResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [savedImages, setSavedImages] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const visible = useAppSelector((s) => s.loader.visible);

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
    const hasShown = sessionStorage.getItem("welcomeShown");
    if (!hasShown && session?.user) {
      toast.success(
        `Welcome back, ${session.user.name?.split(" ")[0] || "there"}! 👋`,
        { duration: 4000 }
      );
      sessionStorage.setItem("welcomeShown", "true");
    }
  }, [session]);

  const handleSearch = async () => {
    if (!description.trim()) {
      toast.error("Please enter a description");
      return;
    }
    setLoading(true);
    setSearched(true);
    setResults([]);
    setActiveFilter(null);
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || "Search failed");
        return;
      }
      setResults(data.results);
      toast.success(`Found ${data.totalResults} images!`);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (image: ImageResult) => {
    try {
      const response = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(image),
      });
      if (response.ok) {
        setSavedImages((prev) => [...prev, image.imageUrl]);
        toast.success("Image saved!");
      } else {
        const data = await response.json();
        toast.error(data.error === "Image already saved" ? "Already saved!" : "Failed to save image");
      }
    } catch {
      toast.error("Failed to save image");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("welcomeShown");
    dispatch(showLoader());
    signOut({ callbackUrl: "/", redirect: true });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const uniqueSites = [...new Set(results.map((r) => r.sourceSite))];
  const filteredResults = activeFilter
    ? results.filter((r) => r.sourceSite === activeFilter)
    : results;

  const initials =
    session?.user?.name?.charAt(0).toUpperCase() ||
    session?.user?.email?.charAt(0).toUpperCase() ||
    "?";

  if (status === "loading") {
    return (
      <div className={`dash-loading${dark ? " dash--dark" : ""}`}>
        <div className="dash-spinner" />
      </div>
    );
  }

  return (

    <>
      <div
        className={`if-overlay${visible ? " if-overlay--visible" : ""}`}
        aria-hidden={!visible}
        role="status"
      >
        <IFLoader size={120} duration={2} />
        <p className="if-overlay-text">Loading…</p>
      </div>
      <div className={`dash-page${dark ? " dash--dark" : ""}`}>

        {/* ── GRAIN ── */}
        <div className="dash-grain" />

        {/* ── NAV ── */}
        <DashNav />

        {/* ── MAIN ── */}
        <main className="dash-main">

          {/* ── SEARCH HERO ── */}
          <section className="dash-hero">
            <p className="dash-eyebrow">
              <span className="dash-eyebrow-line" />
              Visual Search Engine
            </p>
            <h1 className="dash-hero-title">Find Any Image</h1>
            <p className="dash-hero-sub">
              Describe what you see in plain language — and ImageFlow surfaces it
              from across the web in under 140ms.
            </p>

            <div className="dash-search-row">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="a snowy mountain at golden hour..."
                disabled={loading}
                className="dash-input"
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="dash-search-btn"
              >
                {loading ? (
                  <><span className="dash-btn-spinner" /> Searching…</>
                ) : (
                  "Find Images"
                )}
              </button>
            </div>

            {/* suggestion chips */}
            <div className="dash-chips">
              {SUGGESTION_TAGS.map((tag) => (
                <button
                  key={tag}
                  className="dash-chip"
                  onClick={() => setDescription(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </section>

          {/* ── LOADING STATE ── */}
          {loading && (
            <div className="dash-state-box">
              <div className="dash-spinner dash-spinner-lg" />
              <p className="dash-state-title">Searching across 8 sources…</p>
              <p className="dash-state-sub">This may take 20–40 seconds</p>
            </div>
          )}

          {/* ── EMPTY STATE ── */}
          {!loading && !searched && (
            <div className="dash-state-box">
              <div className="dash-empty-icon">✦</div>
              <p className="dash-state-title">Type a description above and click Find Images</p>
              <div className="dash-stats-mini">
                {[
                  { num: "2.4B+", label: "Images indexed" },
                  { num: "140ms", label: "Avg. response" },
                  { num: "98%", label: "Match accuracy" },
                  { num: "50+", label: "Sources" },
                ].map((s, i) => (
                  <div key={i} className="dash-stat-mini">
                    <span className="dash-stat-mini-num">{s.num}</span>
                    <span className="dash-stat-mini-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── NO RESULTS ── */}
          {!loading && searched && results.length === 0 && (
            <div className="dash-state-box">
              <div className="dash-empty-icon" style={{ opacity: 0.3 }}>✦</div>
              <p className="dash-state-title">No results found</p>
              <p className="dash-state-sub">Try a different description</p>
            </div>
          )}

          {/* ── RESULTS ── */}
          {!loading && results.length > 0 && (
            <section className="dash-results">

              {/* results header */}
              <div className="dash-results-header">
                <div className="dash-results-meta">
                  <h2 className="dash-results-count">
                    <span className="dash-results-num">{filteredResults.length}</span>
                    {activeFilter ? ` from ${activeFilter}` : " images found"}
                  </h2>
                  <p className="dash-results-query">"{description}"</p>
                </div>

                <div className="dash-filters">
                  <button
                    className={`dash-filter${!activeFilter ? " dash-filter-active" : ""}`}
                    onClick={() => setActiveFilter(null)}
                  >
                    All ({results.length})
                  </button>
                  {uniqueSites.map((site) => (
                    <button
                      key={site}
                      className={`dash-filter${activeFilter === site ? " dash-filter-active" : ""}`}
                      onClick={() => setActiveFilter(activeFilter === site ? null : site)}
                    >
                      {site} ({results.filter((r) => r.sourceSite === site).length})
                    </button>
                  ))}
                </div>
              </div>

              {/* grid */}
              <div className="dash-grid">
                {filteredResults.map((image, index) => (
                  <div
                    key={index}
                    className="dash-card"
                    style={{ animationDelay: `${index * 0.04}s` }}
                  >
                    <div className="dash-card-img-wrap">
                      <img
                        src={image.imageUrl}
                        alt={image.title}
                        className="dash-card-img"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/400x225?text=Not+Available";
                        }}
                      />
                      <div className="dash-card-overlay">
                        <span className="dash-card-site">{image.sourceSite}</span>
                      </div>
                    </div>

                    <div className="dash-card-body">
                      <p className="dash-card-title">{image.title}</p>
                      <div className="dash-card-actions">
                        <a
                          href={image.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="dash-card-btn dash-card-btn-view"
                        >
                          View →
                        </a>
                        <button
                          onClick={() => handleSave(image)}
                          disabled={savedImages.includes(image.imageUrl)}
                          className={`dash-card-btn${savedImages.includes(image.imageUrl)
                              ? " dash-card-btn-saved"
                              : " dash-card-btn-save"
                            }`}
                        >
                          {savedImages.includes(image.imageUrl) ? "Saved ✓" : "Save"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* ── FOOTER ── */}
        <footer className="dash-footer">
          <span className="dash-footer-copy">
            © 2026 <span className="dash-footer-accent">@zoker2026</span>
          </span>
          <div className="dash-footer-links">
            {[
              { label: "History", path: "/history" },
              { label: "Saved", path: "/saved" },
              { label: "Home", path: "/" },
            ].map((l) => (
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
    </>


  );
}