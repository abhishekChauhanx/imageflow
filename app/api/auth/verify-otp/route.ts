import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, code, type, name, password } = await request.json();

    if (!email || !code || !type) {
      return NextResponse.json(
        { error: "Email, code and type are required" },
        { status: 400 }
      );
    }

    // Find valid OTP
    const otp = await prisma.otpCode.findFirst({
      where: {
        email,
        code: code.toUpperCase(),
        type,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otp) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // Mark OTP as used
    await prisma.otpCode.update({
      where: { id: otp.id },
      data: { used: true },
    });

    if (type === "signup") {
      // Create user account
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          emailVerified: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: "Account verified and created",
        user: { id: user.id, email: user.email, name: user.name },
      });
    }

    if (type === "login") {
      return NextResponse.json({
        success: true,
        message: "OTP verified successfully",
      });
    }

  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}