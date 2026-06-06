import { ImageResult } from "@/types";

export async function scrapeOpenverse(query: string): Promise<ImageResult[]> {
  try {
    const response = await fetch(
      `https://api.openverse.org/v1/images/?q=${encodeURIComponent(query)}&page_size=5`,
      {
        headers: {
          "User-Agent": "ImageFlow/1.0",
        },
      }
    );

    if (!response.ok) return [];

    const data = await response.json();

    return data.results.map((photo: any) => ({
      imageUrl: photo.url,
      sourceUrl: photo.foreign_landing_url,
      sourceSite: "Openverse",
      title: photo.title || "Openverse Image",
    }));
  } catch (error) {
    console.error("Openverse scraper error:", error);
    return [];
  }
}