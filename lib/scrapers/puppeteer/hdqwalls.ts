import { ImageResult } from "@/types";
import { getBrowser } from "../browser";

export async function scrapeHDQwalls(query: string): Promise<ImageResult[]> {
  let page;
  try {
    const browser = await getBrowser();
    page = await browser.newPage();

    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36");
    await page.setViewport({ width: 1280, height: 800 });
    await page.setDefaultNavigationTimeout(30000);

    const cleanQuery = query.replace(/([A-Z])/g, '-$1').trim().toLowerCase();

    await page.goto(
      `https://hdqwalls.com/search/${encodeURIComponent(cleanQuery)}/`,
      { waitUntil: "domcontentloaded", timeout: 30000 }
    );

    await new Promise(resolve => setTimeout(resolve, 2000));

    const results = await page.evaluate(() => {
      const items: any[] = [];
      document.querySelectorAll("img").forEach((img) => {
        const src = img.src;
        const alt = img.alt || "HDQwalls Image";
        const link = img.closest("a")?.href;
        if (src && src.includes("hdqwalls") && !src.includes("logo") && items.length < 5) {
          items.push({ imageUrl: src, sourceUrl: link || "https://hdqwalls.com", sourceSite: "HDQwalls", title: alt });
        }
      });
      return items;
    });

    return results;
  } catch (error) {
    console.error("HDQwalls scraper error:", error);
    return [];
  } finally {
    if (page) await page.close();
  }
}