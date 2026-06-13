import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateOTP, getOTPExpiry } from "@/lib/otp";
import { sendOTPEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email, type } = await request.json();

    if (!email || !type) {
      return NextResponse.json(
        { error: "Email and type are required" },
        { status: 400 }
      );
    }

   
  // For login — check user exists
if (type === "login") {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) {
    return NextResponse.json(
      { error: "No account found with this email" },
      { status: 404 }
    );
  }
}
    // Invalidate old OTPs for this email
    await prisma.otpCode.updateMany({
      where: { email, type, used: false },
      data: { used: true },
    });

    // Generate new OTP
    const code = generateOTP();
    const expiresAt = getOTPExpiry();

    await prisma.otpCode.create({
      data: { email, code, type, expiresAt },
    });

    // Send email
    await sendOTPEmail(email, code, type);

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}