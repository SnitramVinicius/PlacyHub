import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export function middleware(request: NextRequest) {

  const response = NextResponse.next();


  response.headers.set(
    "Content-Security-Policy",
    `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: blob: https:;
      font-src 'self' data:;
      connect-src 'self' https://*.supabase.co;
      frame-src 'self';
      object-src 'none';
    `
      .replace(/\s{2,}/g, " ")
      .trim()
  );


  return response;
}


export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};