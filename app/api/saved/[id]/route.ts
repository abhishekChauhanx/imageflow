import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// DELETE — remove a saved image by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Make sure the image belongs to this user
    const savedImage = await prisma.savedImage.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!savedImage) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      );
    }

    await prisma.savedImage.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: "Image removed from saved",
    });

  } catch (error) {
    console.error("Delete saved image error:", error);
    return NextResponse.json(
      { error: "Failed to delete saved image" },
      { status: 500 }
    );
  }
}