import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  const cookieStore = await cookies(); // 👈 OBRIGATÓRIO
  const token = cookieStore.get("placyhub_token")?.value;

  if (!token) {
    return NextResponse.json({ user: null });
  }

  const user = verifyToken(token);

  return NextResponse.json({ user });
}
