import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { hashPassword, isPasswordReused, savePasswordToHistory, cleanupOldPasswords } from "@/lib/passwordUtils";

export async function POST(request: Request) {
  try {
    const { token, newPassword } = await request.json();
    
    console.log("📝 Reset password - Token recebido:", token?.substring(0, 20) + "...");
    
    if (!token || !newPassword) {
      return NextResponse.json({ error: "Token e nova senha são obrigatórios" }, { status: 400 });
    }
    
    // Validar padrão da senha
    const senhaRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!senhaRegex.test(newPassword)) {
      return NextResponse.json({ 
        error: "A senha deve ter no mínimo 8 caracteres, uma letra maiúscula e um número" 
      }, { status: 400 });
    }
    
    // Buscar token válido
    const { data: reset, error: resetError } = await supabase
      .from("password_resets")
      .select("*, users!inner(id, email, name)")
      .eq("token", token)
      .eq("used", false)
      .single();
    
    if (resetError || !reset) {
      return NextResponse.json({ error: "Token inválido ou já utilizado" }, { status: 400 });
    }
    
    // Verificar expiração
    const now = new Date();
    const expiresAt = new Date(reset.expires_at);
    
    if (now > expiresAt) {
      return NextResponse.json({ error: "Token expirado. Solicite um novo link." }, { status: 400 });
    }
    
    // 🔥 VERIFICAR SE SENHA JÁ FOI USADA ANTERIORMENTE
    const isReused = await isPasswordReused(reset.user_id, newPassword);
    if (isReused) {
      return NextResponse.json({ 
        error: "Você já usou esta senha anteriormente. Escolha uma senha diferente." 
      }, { status: 400 });
    }
    
    // Gerar hash da nova senha
    const passwordHash = hashPassword(newPassword);
    
    // Atualizar senha do usuário
    const { error: updateError } = await supabase
      .from("users")
      .update({ senha: passwordHash })
      .eq("id", reset.user_id);
    
    if (updateError) {
      console.error("❌ Erro ao atualizar senha:", updateError);
      return NextResponse.json({ error: "Erro ao atualizar senha" }, { status: 500 });
    }
    
    // 🔥 SALVAR NO HISTÓRICO
    await savePasswordToHistory(reset.user_id, passwordHash);
    await cleanupOldPasswords(reset.user_id);
    
    // Marcar token como usado
    await supabase
      .from("password_resets")
      .update({ used: true })
      .eq("id", reset.id);
    
    console.log("✅ Senha alterada com sucesso para:", reset.users.email);
    
    return NextResponse.json({ 
      success: true, 
      message: "Senha alterada com sucesso!" 
    });
    
  } catch (error) {
    console.error("❌ Erro no reset-password:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}