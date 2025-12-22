import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken, signToken } from "@/lib/auth";

export async function POST() {
const cookieStore = await cookies();
const token = cookieStore.get("placyhub_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const user = verifyToken(token);

  if (!user) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  const newToken = signToken({
    ...user,
    roles: ["LOCATARIO", "ANFITRIAO"],
  });

  const response = NextResponse.json({ success: true });

response.cookies.set("placyhub_token", newToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 🔥 ESSA LINHA É A CHAVE (7 dias)
});

  return response;
}
