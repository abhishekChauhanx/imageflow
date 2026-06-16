import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const locales = ["en", "hi", "zh", "id", "ko","ja"];
const defaultLocale = "en";

export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isProtected =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/history") ||
    request.nextUrl.pathname.startsWith("/saved");

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/account/login", request.url)); // ← Only this changed
  }

  const response = NextResponse.next();

  const localeCookie = request.cookies.get("locale")?.value;
  if (!localeCookie || !locales.includes(localeCookie)) {
    const acceptLang = request.headers.get("accept-language") ?? "";
    const browserLang = acceptLang.split(",")[0].split("-")[0];
    const detected = locales.includes(browserLang) ? browserLang : defaultLocale;
    response.cookies.set("locale", detected, { path: "/" });
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/history/:path*", "/saved/:path*"],
};