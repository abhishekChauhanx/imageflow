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
import { useTranslations } from "next-intl";

interface ImageResult {
  imageUrl: string;
  sourceUrl: string;
  sourceSite: string;
  title: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.theme.mode);
  const dark = mode === "dark";
  const t = useTranslations("dashboard");

  const [description, setDescription] = useState("");
  const [results, setResults] = useState<ImageResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [savedImages, setSavedImages] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const visible = useAppSelector((s) => s.loader.visible);

  // suggestion_tags is an array in JSON — pull it as a raw value
  const SUGGESTION_TAGS = t.raw("suggestion_tags") as string[];

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
      toast.error(t("toast.empty_description"));
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
        toast.error(data.error || t("toast.search_failed"));
        return;
      }
      setResults(data.results);
      toast.success(`Found ${data.totalResults} images!`);
    } catch {
      toast.error(t("toast.search_error"));
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
        toast.success(t("toast.image_saved"));
      } else {
        const data = await response.json();
        toast.error(
          data.error === "Image already saved"
            ? t("toast.already_saved")
            : t("toast.save_failed")
        );
      }
    } catch {
      toast.error(t("toast.save_failed"));
    }
  };



  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const uniqueSites = [...new Set(results.map((r) => r.sourceSite))];
  const filteredResults = activeFilter
    ? results.filter((r) => r.sourceSite === activeFilter)
    : results;



  if (status === "loading") {
    return (
      <div className={`dash-loading${dark ? " dash--dark" : ""}`}>
        <div className="dash-spinner" />
      </div>
    );
  }

  // stats_mini is an array in JSON
  const statsMini = t.raw("stats_mini") as { num: string; label: string }[];

  // footer links is an array in JSON
  const footerLinks = t.raw("footer.links") as { label: string; path: string }[];

  return (
    <>
      <div
        className={`if-overlay${visible ? " if-overlay--visible" : ""}`}
        aria-hidden={!visible}
        role="status"
      >
        <IFLoader size={120} duration={2} />
        <p className="if-overlay-text">{t("overlay.loading")}</p>
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
              {t("hero.eyebrow")}
            </p>
            <h1 className="dash-hero-title">{t("hero.title")}</h1>
            <p className="dash-hero-sub">{t("hero.subtitle")}</p>

            <div className="dash-search-row">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("hero.input_placeholder")}
                disabled={loading}
                className="dash-input"
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="dash-search-btn"
              >
                {loading ? (
                  <><span className="dash-btn-spinner" /> {t("hero.search_btn_loading")}</>
                ) : (
                  t("hero.search_btn")
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
              <p className="dash-state-title">{t("loading_state.title")}</p>
              <p className="dash-state-sub">{t("loading_state.subtitle")}</p>
            </div>
          )}

          {/* ── EMPTY STATE ── */}
          {!loading && !searched && (
            <div className="dash-state-box">
              <div className="dash-empty-icon">{t("empty_state.icon")}</div>
              <p className="dash-state-title">{t("empty_state.title")}</p>
              <div className="dash-stats-mini">
                {statsMini.map((s, i) => (
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
              <div className="dash-empty-icon" style={{ opacity: 0.3 }}>
                {t("empty_state.icon")}
              </div>
              <p className="dash-state-title">{t("no_results.title")}</p>
              <p className="dash-state-sub">{t("no_results.subtitle")}</p>
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
                    {activeFilter
                      ? ` ${t("results.suffix_filtered")} ${activeFilter}`
                      : ` ${t("results.suffix_all")}`}
                  </h2>
                  <p className="dash-results-query">"{description}"</p>
                </div>

                <div className="dash-filters">
                  <button
                    className={`dash-filter${!activeFilter ? " dash-filter-active" : ""}`}
                    onClick={() => setActiveFilter(null)}
                  >
                    {t("results.filter_all")} ({results.length})
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
                          {t("results.card.view_btn")}
                        </a>
                        <button
                          onClick={() => handleSave(image)}
                          disabled={savedImages.includes(image.imageUrl)}
                          className={`dash-card-btn${
                            savedImages.includes(image.imageUrl)
                              ? " dash-card-btn-saved"
                              : " dash-card-btn-save"
                          }`}
                        >
                          {savedImages.includes(image.imageUrl)
                            ? t("results.card.saved_btn")
                            : t("results.card.save_btn")}
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
    </>
  );
}