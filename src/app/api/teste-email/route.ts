// src/app/api/teste-email/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    // Email para teste - coloque seu email aqui
    const emailTeste = "costa.vinicius2010@gmail.com";
    
    const { data, error } = await resend.emails.send({
      from: 'PlacyHub <onboarding@resend.dev>',
      to: emailTeste,
      subject: '🧪 Teste de Email - PlacyHub',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Teste de Email</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 20px 0; }
            .logo { font-size: 24px; font-weight: bold; color: #02b0f0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 10px; }
            .success { color: #22c55e; font-size: 48px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🏠 PlacyHub</div>
            </div>
            <div class="content">
              <div class="success">✅</div>
              <h2 style="text-align: center;">Teste de Email Funcionando!</h2>
              <p>Se você está vendo este email, o sistema de envio de emails está <strong>funcionando corretamente</strong>.</p>
              <p><strong>Detalhes do teste:</strong></p>
              <ul>
                <li>📅 Enviado em: ${new Date().toLocaleString()}</li>
                <li>🔗 Origem: PlacyHub</li>
                <li>📧 Destino: ${emailTeste}</li>
              </ul>
              <hr>
              <p style="text-align: center; color: #666; font-size: 14px;">
                Este é um email automático de teste do PlacyHub.
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} PlacyHub - Aluguel de espaços para eventos</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("❌ Erro ao enviar email:", error);
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 });
    }

    console.log("✅ Email enviado com sucesso:", data);
    return NextResponse.json({ 
      success: true, 
      message: "Email enviado com sucesso! Verifique sua caixa de entrada.",
      data 
    });

  } catch (error: any) {
    console.error("❌ Erro:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}