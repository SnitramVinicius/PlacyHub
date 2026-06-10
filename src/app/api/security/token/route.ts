import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // Pegar a sessão atual
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      console.error("❌ Erro ao buscar sessão:", error);
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }
    
    console.log("✅ Token encontrado para usuário:", session.user.id);
    
    return NextResponse.json({ 
      token: session.access_token,
      user_id: session.user.id 
    });
  } catch (error) {
    console.error("❌ Erro interno:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}