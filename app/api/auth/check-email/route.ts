import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const { email } = await request.json();
  const user = await prisma.user.findUnique({ where: { email } });
  return NextResponse.json({ exists: !!user });
}