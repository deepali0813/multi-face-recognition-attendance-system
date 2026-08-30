import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/",
  "/dashboard",
  "/students",
  "/attendance",
  "/cameras",
  "/process-attendance",
  "/login",
];

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublic = PUBLIC_PATHS.some((path) => {
    if (path === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(path);
  });

  // Temporary: authentication disabled for project demo
  if (isPublic) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/students/:path*",
    "/attendance/:path*",
    "/cameras/:path*",
    "/process-attendance/:path*",
    "/login",
  ],
};