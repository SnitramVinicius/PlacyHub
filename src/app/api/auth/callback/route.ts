import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {

  
  const requestUrl = new URL(request.url);

  
  const code = requestUrl.searchParams.get("code");

  
  if (code) {

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error("❌ Erro:", error.message);
    }
    
    if (!error && data.session?.user) {
      const user = data.session.user;

      
      // Verificar se usuário já existe
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("email", user.email)
        .single();    
      if (!existingUser) {
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
        }
      }
    }
  }
  return NextResponse.redirect(new URL("/", requestUrl.origin));
}