//-------------- login fake/temporário, só para testar autenticação e permissões.-------------------------//

import { NextResponse } from "next/server";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json();

  // 🔴 Simulação (por enquanto)
  const user = {
    id: "user-123",
    name: body.email.split("@")[0],
    roles: ["LOCATARIO"], // começa como locatário
  };

  const token = signToken({
    sub: user.id,
    name: user.name,
    roles: user.roles,
  });

  const response = NextResponse.json({ user });

  response.cookies.set("placyhub_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  return response;
}
