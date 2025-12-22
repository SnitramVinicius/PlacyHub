import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyTokenEdge } from "./lib/auth-edge";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("placyhub_token")?.value;

  if (req.nextUrl.pathname.startsWith("/anfitriao")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const user = await verifyTokenEdge(token);

    if (!user || !user.roles?.includes("ANFITRIAO")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/anfitriao/:path*"],
};
