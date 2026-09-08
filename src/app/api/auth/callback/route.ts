import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  if (!code) return NextResponse.redirect(new URL("/login?oauth_error=1", requestUrl.origin));
  const destino = new URL("/login", requestUrl.origin);
  destino.searchParams.set("oauth_code", code);
  return NextResponse.redirect(destino);
}
