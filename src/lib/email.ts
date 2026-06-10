import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// 🔥 FUNÇÃO CORRETA PARA ENVIO DE EMAIL DE RECUPERAÇÃO
export async function sendResetPasswordEmail(to: string, resetLink: string, userName: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'PlacyHub <onboarding@resend.dev>',
      to,
      subject: '🔐 Redefinição de Senha - PlacyHub',
      html: getResetPasswordEmailTemplate(resetLink, userName),
    });
    
    if (error) {
      console.error('❌ Erro ao enviar email:', error);
      return { success: false, error };
    }
    
    console.log(`📧 Email enviado para ${to}:`, data?.id);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    return { success: false, error };
  }
}

// Template de recuperação de senha
export function getResetPasswordEmailTemplate(resetLink: string, userName: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Redefinir Senha - PlacyHub</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; }
        .logo { font-size: 24px; font-weight: bold; color: #02b0f0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 10px; }
        .button { 
          display: inline-block; 
          padding: 12px 24px; 
          background-color: #02b0f0; 
          color: white; 
          text-decoration: none; 
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        .warning { color: #ff9800; font-size: 12px; margin-top: 15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🏠 PlacyHub</div>
        </div>
        <div class="content">
          <h2>Olá, ${userName}!</h2>
          <p>Recebemos uma solicitação para redefinir a senha da sua conta no PlacyHub.</p>
          <p>Clique no botão abaixo para criar uma nova senha:</p>
          
          <div style="text-align: center;">
            <a href="${resetLink}" class="button">Redefinir minha senha</a>
          </div>
          
          <p>Se o botão não funcionar, copie e cole o link abaixo no seu navegador:</p>
          <p style="background: #eee; padding: 10px; word-break: break-all; font-size: 12px;">
            ${resetLink}
          </p>
          
          <div class="warning">
            ⚠️ Este link é válido por apenas 1 hora.
          </div>
          <p>
            Se você não solicitou essa redefinição, ignore este email. Sua senha permanecerá a mesma.
          </p>
          <hr>
          <p>
            Atenciosamente,<br>
            <strong>Equipe PlacyHub</strong>
          </p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} PlacyHub - Aluguel de espaços para eventos</p>
        </div>
      </div>
    </html>
  `;
}