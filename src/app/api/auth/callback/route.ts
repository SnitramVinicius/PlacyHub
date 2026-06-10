import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  console.log("🔥🔥🔥 CALLBACK FOI CHAMADO! 🔥🔥🔥");
  
  const requestUrl = new URL(request.url);
  console.log("📋 URL completa:", requestUrl.toString());
  
  const code = requestUrl.searchParams.get("code");
  console.log("🔑 Code recebido:", code ? "SIM - " + code.substring(0, 20) + "..." : "NÃO");
  
  if (code) {
    console.log("🔄 Trocando código por sessão...");
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error("❌ Erro:", error.message);
    }
    
    if (!error && data.session?.user) {
      const user = data.session.user;
      console.log("👤 Usuário autenticado:", user.email);
      
      // Verificar se usuário já existe
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("email", user.email)
        .single();
      
      console.log("📋 Usuário existe na tabela?", existingUser ? "SIM" : "NÃO");
      
      if (!existingUser) {
        console.log("➕ Criando usuário...");
        const { error: insertError } = await supabase
          .from("users")
          .insert({
            id: user.id,
            email: user.email,
            name: user.user_metadata.full_name || user.email?.split("@")[0],
            is_anfitriao: false,
          });
        
        if (insertError) {
          console.error("❌ Erro ao criar:", insertError.message);
        } else {
          console.log("✅ Usuário criado com sucesso!");
        }
      }
    }
  }
  
  console.log("🔄 Redirecionando para home...");
  return NextResponse.redirect(new URL("/", requestUrl.origin));
}