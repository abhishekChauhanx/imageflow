/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import DashNav from "@/components/DashNav/DashNav";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { showLoader, hideLoader } from "@/store/loaderSlice";

interface SavedImage {
  id: string;
  imageUrl: string;
  sourceUrl: string;
  sourceSite: string;
  title: string;
  savedAt: string;
}

export default function SavedPage() {
  const dark = useAppSelector((s) => s.theme.mode) === "dark";
  const dispatch = useAppDispatch();
  const router = useRouter();
  const t = useTranslations("saved");

  const [images, setImages] = useState<SavedImage[]>([]);
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
    fetch("/api/saved")
      .then((r) => r.json())
      .then((data) => {
        setImages(data.savedImages || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/saved/${id}`, { method: "DELETE" });
    if (res.ok) {
      setImages((prev) => prev.filter((img) => img.id !== id));
      toast.success(t("toast.image_removed"));
    }
  };

  return (
    <div className={`dash-page${dark ? " dash--dark" : ""}`}>
      <div className="dash-grain" />
      <DashNav />

      <main className="dash-main">
        <div style={{ marginBottom: "3rem", borderBottom: "1px solid var(--border)", paddingBottom: "2rem" }}>
          <p className="dash-eyebrow">
            <span className="dash-eyebrow-line" /> {t("header.eyebrow")}
          </p>
          <h1 className="dash-hero-title" style={{ fontSize: "clamp(2rem,4vw,3rem)", marginBottom: "0.5rem" }}>
            {t("header.title")}
          </h1>
          <p className="dash-state-sub">
            {t("header.subtitle", { count: images.length })}
          </p>
        </div>

        {/* ── LOADING STATE ── */}
        {loading && (
          <div className="dash-state-box">
            <div className="dash-spinner dash-spinner-lg" />
            <p className="dash-state-title">{t("loading_state.title")}</p>
          </div>
        )}

        {/* ── EMPTY STATE ── */}
        {!loading && images.length === 0 && (
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

        {/* ── GRID ── */}
        {!loading && images.length > 0 && (
          <div className="dash-grid">
            {images.map((image) => (
              <div key={image.id} className="dash-card">
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
                  <p style={{ fontSize: "0.55rem", color: "var(--muted)", marginBottom: "0.75rem", letterSpacing: "0.08em" }}>
                    {new Date(image.savedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                  <div className="dash-card-actions">
                   <a 
                      href={image.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="dash-card-btn dash-card-btn-view"
                    >
                      {t("card.view_btn")}
                    </a>
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="dash-card-btn dash-card-btn-save"
                    >
                      {t("card.remove_btn")}
                    </button>
                  </div>
                </div>
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