import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifyTokenEdge } from "@/lib/auth-edge";

export async function POST(req: NextRequest) {
  try {
   
const cookieStore = await cookies();
const token = cookieStore.get("placyhub_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Não autenticado." },
        { status: 401 }
      );
    }

    const payload = await verifyTokenEdge(token);
    if (!payload?.userId) {
      return NextResponse.json(
        { message: "Token inválido." },
        { status: 401 }
      );
    }

    const { senhaAtual, novaSenha } = await req.json();

    if (!senhaAtual || !novaSenha) {
      return NextResponse.json(
        { message: "Dados inválidos." },
        { status: 400 }
      );
    }

    // 🔒 MOCK — sem banco por enquanto
    // Aqui futuramente entra o Prisma

    return NextResponse.json({
      success: true,
      message: "Senha alterada com sucesso (mock).",
    });
  } catch (error) {
    console.error("Erro ao alterar senha:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
