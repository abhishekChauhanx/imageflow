import { ImageResult } from "@/types";

export async function scrapeUnsplash(query: string): Promise<ImageResult[]> {
  try {
    const cleanQuery = query.replace(/([A-Z])/g, ' $1').trim().toLowerCase();

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(cleanQuery)}&per_page=5&order_by=relevant`,
      {
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) return [];
    const data = await response.json();

    return data.results.map((photo: any) => ({
      imageUrl: photo.urls.regular,
      sourceUrl: photo.links.html,
      sourceSite: "Unsplash",
      title: photo.alt_description || photo.description || "Unsplash Image",
    }));
  } catch (error) {
    console.error("Unsplash scraper error:", error);
    return [];
  }
}