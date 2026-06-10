import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // Buscar espaços do Supabase
    const { data: espacos, error } = await supabase
      .from("spaces")
      .select("*")
      .eq("disponivel", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar espaços:", error);
      return NextResponse.json(
        { error: "Erro ao carregar espaços" },
        { status: 500 }
      );
    }

    return NextResponse.json(espacos || []);
  } catch (error) {
    console.error("Erro:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}