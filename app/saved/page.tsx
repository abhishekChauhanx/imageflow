/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import DashNav from "@/components/DashNav/DashNav";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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
  const router = useRouter();
  const [images, setImages] = useState<SavedImage[]>([]);
  const [loading, setLoading] = useState(true);

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
      toast.success("Image removed!");
    }
  };

  return (
    <div className={`dash-page${dark ? " dash--dark" : ""}`}>
      <div className="dash-grain" />
      <DashNav />

      <main className="dash-main">
        <div style={{ marginBottom: "3rem", borderBottom: "1px solid var(--border)", paddingBottom: "2rem" }}>
          <p className="dash-eyebrow">
            <span className="dash-eyebrow-line" /> Your Collection
          </p>
          <h1 className="dash-hero-title" style={{ fontSize: "clamp(2rem,4vw,3rem)", marginBottom: "0.5rem" }}>
            Saved Images
          </h1>
          <p className="dash-state-sub">{images.length} images saved</p>
        </div>

        {loading && (
          <div className="dash-state-box">
            <div className="dash-spinner dash-spinner-lg" />
            <p className="dash-state-title">Loading saved images…</p>
          </div>
        )}

        {!loading && images.length === 0 && (
          <div className="dash-state-box">
            <div className="dash-empty-icon">✦</div>
            <p className="dash-state-title">No saved images yet</p>
            <p className="dash-state-sub">Save images from search results to see them here</p>
            <button
              className="dash-chip"
              style={{ marginTop: "2rem" }}
              onClick={() => router.push("/dashboard")}
            >
              Go to Search
            </button>
          </div>
        )}

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
                    
                    <a  href={image.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="dash-card-btn dash-card-btn-view"
                    >{"View →"}</a>
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="dash-card-btn dash-card-btn-save"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="dash-footer">
        <span className="dash-footer-copy">© 2026 <span className="dash-footer-accent">@zoker2026</span></span>
        <div className="dash-footer-links">
          {[{ label: "Search", path: "/dashboard" }, { label: "History", path: "/history" }, { label: "Home", path: "/" }].map((l) => (
            <button key={l.label} className="dash-footer-link" onClick={() => router.push(l.path)}>{l.label}</button>
          ))}
        </div>
      </footer>
    </div>
  );
}