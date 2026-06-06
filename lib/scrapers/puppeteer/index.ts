import { ImageResult } from "@/types";
import { scrapeUnsplash } from "../api/unsplash";
import { scrapePexels } from "../api/pexels";
import { scrapeOpenverse } from "./openverse";
import { scrapeWallpapersCraft } from "./wallpaperscraft";
import { scrapeWallpaperCave } from "./wallpapercave";
import { scrapeHDQwalls } from "./hdqwalls";
import { scrapeWallpapersDen } from "./wallpapersden";
import { scrapeAlphaCoders } from "./alphacoders";
import { closeBrowser } from "../browser";

export async function searchAllSources(query: string): Promise<ImageResult[]> {
  console.log(` Searching all sources for: ${query}`);

  try {
    const results = await Promise.allSettled([
      scrapeUnsplash(query),
      scrapePexels(query),
      scrapeOpenverse(query),
      scrapeWallpapersCraft(query),
      scrapeWallpaperCave(query),
      scrapeHDQwalls(query),
      scrapeWallpapersDen(query),
      scrapeAlphaCoders(query),
    ]);

    const allImages: ImageResult[] = [];
    const sources = [
      "Unsplash", "Pexels", "Openverse",
      "WallpapersCraft", "WallpaperCave",
      "HDQwalls", "WallpapersDen", "AlphaCoders"
    ];

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        console.log(` ${sources[index]}: ${result.value.length} images`);
        allImages.push(...result.value);
      } else {
        console.log(` ${sources[index]}: failed`);
      }
    });

    console.log(` Total images found: ${allImages.length}`);
    return allImages;

  } finally {
    await closeBrowser();
  }
}