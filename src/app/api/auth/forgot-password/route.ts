import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { randomBytes } from "crypto";
import { sendResetPasswordEmail } from "@/lib/email";  // 🔥 Importar a função

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    console.log("📝 Forgot password - Email:", email);
    
    if (!email) {
      return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 });
    }
    
    // Buscar usuário pelo email
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, email, name")
      .eq("email", email)
      .single();
    
    if (userError || !user) {
      console.log("⚠️ Usuário não encontrado:", email);
      return NextResponse.json({ 
        message: "Se o email existir, você receberá um link de recuperação" 
      });
    }
    
    console.log("✅ Usuário encontrado:", user.id);
    
    // Gerar token único
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);
    
    // Salvar token no banco
    const { error: insertError } = await supabase
      .from("password_resets")
      .insert({
        user_id: user.id,
        token: token,
        expires_at: expiresAt.toISOString(),
        used: false,
      });
    
    if (insertError) {
      console.error("❌ Erro ao salvar token:", insertError);
      return NextResponse.json({ error: "Erro ao gerar link de recuperação" }, { status: 500 });
    }
    
    console.log("✅ Token salvo com sucesso");
    
    // Link de recuperação
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const resetLink = `${baseUrl}/reset-password?token=${token}`;
    
    console.log("🔗 Link de recuperação:", resetLink);
    console.log("📧 Para email:", email);
    
    // 🔥 ENVIAR EMAIL (se tiver API key configurada)
    if (process.env.RESEND_API_KEY) {
      const emailResult = await sendResetPasswordEmail(
        user.email,
        resetLink,
        user.name.split(' ')[0]
      );
      
      if (emailResult.success) {
        console.log("📧 Email enviado com sucesso!");
      } else {
        console.log("⚠️ Falha ao enviar email, mas link gerado");
      }
    } else {
      console.log("⚠️ RESEND_API_KEY não configurada. Email não enviado.");
      console.log("💡 Para configurar: crie uma conta em resend.com e adicione a chave no .env.local");
    }
    
    return NextResponse.json({ 
      message: "Link de recuperação enviado! Verifique seu email."
    });
    
  } catch (error) {
    console.error("❌ Erro no forgot-password:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}