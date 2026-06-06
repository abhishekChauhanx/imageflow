import { ImageResult } from "@/types";

export async function scrapePexels(query: string): Promise<ImageResult[]> {
  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5`,
      {
        headers: {
          Authorization: process.env.PEXELS_API_KEY!,
        },
      }
    );

    if (!response.ok) return [];

    const data = await response.json();

    return data.photos.map((photo: any) => ({
      imageUrl: photo.src.large,
      sourceUrl: photo.url,
      sourceSite: "Pexels",
      title: photo.alt || "Pexels Image",
    }));
  } catch (error) {
    console.error("Pexels scraper error:", error);
    return [];
  }
}