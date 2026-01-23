//*-------- Transforma um LOCATÁRIO em LOCATÁRIO + ANFITRIÃO---------------*//
import { NextResponse } from "next/server";
import { verifyToken, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("placyhub_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const user = verifyToken(token);

  if (!user) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  // 🔹 Pegando CPF do body
  const body = await req.json();
  const cpf = body?.cpf;

  if (!cpf) {
    return NextResponse.json({ error: "CPF obrigatório" }, { status: 422 });
  }

  // 🔹 Cria novo token com ANFITRIAO e mantém LOCATARIO
  const newToken = signToken({
    ...user,
    cpf, // opcionalmente armazenar no token
    roles: Array.from(new Set([...user.roles, "ANFITRIAO"])), // mantém roles existentes
  });

  // 🔹 Retorna usuário atualizado
  const response = NextResponse.json({
    success: true,
    user: {
      ...user,
      cpf,
      roles: Array.from(new Set([...user.roles, "ANFITRIAO"])),
    },
  });

  response.cookies.set("placyhub_token", newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  });

  return response;
}
