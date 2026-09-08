import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(_request: NextRequest) {
  const response = NextResponse.next();
  const scripts = process.env.NODE_ENV === "production"
    ? "'self' 'unsafe-inline' https://www.mercadopago.com"
    : "'self' 'unsafe-inline' 'unsafe-eval' https://www.mercadopago.com";
  const csp = [
    "default-src 'self'",
    `script-src ${scripts}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://servicodados.ibge.gov.br https://api.mercadopago.com https://www.mercadolibre.com https://*.mercadolibre.com",
    "frame-src 'self' https://www.mercadopago.com https://*.mercadopago.com https://www.mercadolibre.com https://*.mercadolibre.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://*.mercadopago.com",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(self)");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  if (process.env.NODE_ENV === "production") {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
