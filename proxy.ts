import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  console.log("Proxy triggered for path:", pathname);

  const token = req.cookies.get("token")?.value;

  // Allow login page
  if (pathname === "/") {
    return NextResponse.next();
  }

  // If no token → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

