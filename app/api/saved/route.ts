import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET — fetch all saved images for logged in user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const savedImages = await prisma.savedImage.findMany({
      where: { userId: user.id },
      orderBy: { savedAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      savedImages,
    });

  } catch (error) {
    console.error("Get saved images error:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved images" },
      { status: 500 }
    );
  }
}

// POST — save a new image
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { imageUrl, sourceUrl, sourceSite, title } =
      await request.json();

    if (!imageUrl || !sourceUrl || !sourceSite) {
      return NextResponse.json(
        { error: "imageUrl, sourceUrl and sourceSite are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if already saved
    const existing = await prisma.savedImage.findFirst({
      where: {
        userId: user.id,
        imageUrl,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Image already saved" },
        { status: 409 }
      );
    }

    const savedImage = await prisma.savedImage.create({
      data: {
        userId: user.id,
        imageUrl,
        sourceUrl,
        sourceSite,
        title: title || "Saved Image",
      },
    });

    return NextResponse.json({
      success: true,
      savedImage,
    });

  } catch (error) {
    console.error("Save image error:", error);
    return NextResponse.json(
      { error: "Failed to save image" },
      { status: 500 }
    );
  }
}