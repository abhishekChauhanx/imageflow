/* eslint-disable @next/next/no-img-element */
"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface ImageResult {
  imageUrl: string;
  sourceUrl: string;
  sourceSite: string;
  title: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [results, setResults] = useState<ImageResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [savedImages, setSavedImages] = useState<string[]>([]);

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
    } catch (error) {
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
        toast.success("Image saved! 💾");
      } else {
        const data = await response.json();
        if (data.error === "Image already saved") {
          toast.error("Already saved!");
        } else {
          toast.error("Failed to save image");
        }
      }
    } catch {
      toast.error("Failed to save image");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("welcomeShown");
    signOut({ callbackUrl: "/", redirect: true });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* Navbar */}
      <nav className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">🔍 ImageFlow</h1>

        <div className="flex items-center gap-6">
          <button
            onClick={() => router.push("/history")}
            className="text-zinc-400 hover:text-white text-sm transition"
          >
            History
          </button>
          <button
            onClick={() => router.push("/saved")}
            className="text-zinc-400 hover:text-white text-sm transition"
          >
            Saved
          </button>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-zinc-400 text-sm hidden md:block">
            {session?.user?.email}
          </span>

          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt="avatar"
              className="w-9 h-9 rounded-full object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              {session?.user?.name?.charAt(0).toUpperCase() ||
                session?.user?.email?.charAt(0).toUpperCase() ||
                "?"}
            </div>
          )}

          <button
            onClick={handleLogout}
            className="text-zinc-400 hover:text-red-400 text-sm transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-16">

        {/* Search Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Find Any Image</h2>
          <p className="text-zinc-400 mb-8">
            Describe the image you are looking for and we will find it across the web
          </p>

          <div className="flex gap-3 max-w-2xl mx-auto">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="a snowy mountain at golden hour..."
              disabled={loading}
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 disabled:opacity-50 transition"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-zinc-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Searching...
                </>
              ) : (
                "Find Images"
              )}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-zinc-400 text-lg">Searching across 8 sources...</p>
            <p className="text-zinc-600 text-sm mt-2">This may take 20-40 seconds</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !searched && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-zinc-500 text-lg">
              Type a description above and click Find Images
            </p>
            <div className="flex flex-wrap gap-2 justify-center mt-6">
              {["sunset mountains", "anime girl", "futuristic city", "cute cat", "abstract art"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setDescription(tag)}
                  className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-full text-zinc-400 text-sm hover:border-indigo-500 hover:text-white transition"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && searched && results.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😕</div>
            <p className="text-zinc-400 text-lg">No results found</p>
            <p className="text-zinc-600 text-sm mt-2">Try a different description</p>
          </div>
        )}

        {/* Results Grid */}
        {!loading && results.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">
                Found {results.length} images
              </h3>
              <div className="flex gap-2 flex-wrap">
                {[...new Set(results.map((r) => r.sourceSite))].map((site) => (
                  <span
                    key={site}
                    className="px-3 py-1 bg-zinc-800 rounded-full text-zinc-400 text-xs"
                  >
                    {site}: {results.filter((r) => r.sourceSite === site).length}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {results.map((image, index) => (
                <div
                  key={index}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 transition group"
                >
                  {/* Image Preview */}
                  <div className="aspect-video bg-zinc-800 overflow-hidden">
                    <img
                      src={image.imageUrl}
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/400x225?text=Image+Not+Available";
                      }}
                    />
                  </div>

                  {/* Card Info */}
                  <div className="p-3">
                    <p className="text-xs text-zinc-500 mb-1">{image.sourceSite}</p>
                    <p className="text-sm text-zinc-300 truncate mb-3">
                      {image.title}
                    </p>

                    <div className="flex gap-2">
                      
                      <a  href={image.sourceUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="flex-1 text-center text-xs bg-zinc-800 hover:bg-zinc-700 text-white py-2 rounded-lg transition"
>{"View →"}</a>
                      <button
                        onClick={() => handleSave(image)}
                        disabled={savedImages.includes(image.imageUrl)}
                        className={`flex-1 text-xs py-2 rounded-lg transition ${
                          savedImages.includes(image.imageUrl)
                            ? "bg-green-900 text-green-400 cursor-default"
                            : "bg-zinc-800 hover:bg-indigo-700 text-white"
                        }`}
                      >
                        {savedImages.includes(image.imageUrl) ? "Saved ✓" : "Save 💾"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}