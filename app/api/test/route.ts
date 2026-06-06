import { NextResponse } from "next/server";
import { searchAllSources } from "@/lib/scrapers/puppeteer/index";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "sunset mountains";

  console.log(`🧪 Testing all scrapers with query: "${query}"`);

  const startTime = Date.now();
  const results = await searchAllSources(query);
  const endTime = Date.now();

  // Group results by source
  const grouped = results.reduce((acc: any, img) => {
    if (!acc[img.sourceSite]) acc[img.sourceSite] = [];
    acc[img.sourceSite].push(img);
    return acc;
  }, {});

  return NextResponse.json({
    success: true,
    query,
    totalImages: results.length,
    timeTaken: `${((endTime - startTime) / 1000).toFixed(2)} seconds`,
    breakdown: Object.entries(grouped).map(([source, images]: any) => ({
      source,
      count: images.length,
      status: images.length > 0 ? "✅ Working" : "❌ Failed",
      sampleImage: images[0]?.imageUrl || null,
    })),
    allResults: results,
  });
}