// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // If no token for protected routes:
  const protectedPaths = ["/orderhistory", "/checkout", "/settings"];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // If user tries to access /admin, but they're not valid → redirect
  if (pathname.startsWith("/admin") && !token?.valid) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/orderhistory/:path*",
    "/checkout/:path*",
    "/settings/:path*",
    "/admin/:path*",
  ],
};
