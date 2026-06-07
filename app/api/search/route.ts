import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { searchAllSources } from "@/lib/scrapers/puppeteer";

export async function POST(request: Request) {
  try {
    // Check if user is logged in
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get description from request body
    const { description } = await request.json();
    if (!description || typeof description !== "string") {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Run all scrapers in parallel
    const results = await searchAllSources(description);

    // Save search to history
    await prisma.searchHistory.create({
      data: {
        userId: user.id,
        description,
        resultsCount: results.length,
      },
    });

    return NextResponse.json({
      success: true,
      description,
      totalResults: results.length,
      results,
    });

  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Search failed. Please try again." },
      { status: 500 }
    );
  }
}