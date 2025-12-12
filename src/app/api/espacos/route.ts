// src/app/api/espacos/route.ts

import { NextResponse } from "next/server";
import { ESPACOS } from "@/data/espacos";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const cidade = searchParams.get("cidade");
  const ordenacao = searchParams.get("ordenacao") || "popularidade";

  let espacos = [...ESPACOS];

  // 🔍 Filtrar por cidade
  if (cidade) {
    espacos = espacos.filter(
      (e) => e.cidade.toLowerCase() === cidade.toLowerCase()
    );
  }

  // 🔄 Ordenação
  if (ordenacao === "preco") {
    espacos.sort((a, b) => a.preco - b.preco);
  } else if (ordenacao === "avaliacao") {
    espacos.sort((a, b) => b.avaliacao - a.avaliacao);
  } else {
    // popularidade
    espacos.sort((a, b) => b.avaliacao - a.avaliacao);
  }

  return NextResponse.json(espacos);
}
