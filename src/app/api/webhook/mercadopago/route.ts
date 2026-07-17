import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { Resend } from "resend";
import {
  TAXAS,
  calcularValorBase,
  calcularTaxaAnfitriao,
  calcularLiquidoAnfitriao,
} from "@/config/taxa";

const resend = new Resend(process.env.RESEND_API_KEY);

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

async function podeEnviarEmail(usuarioId: string, tipo: string): Promise<boolean> {
  if (!usuarioId) return false;

  try {
    const { data, error } = await supabaseAdmin
      .from("user_notificacoes_settings")
      .select("email")
      .eq("user_id", usuarioId)
      .eq("tipo", tipo)
      .single();

    if (error && error.code === "PGRST116") {
      return true;
    }

    if (error) {
      console.error("Erro ao verificar preferência:", error);
      return true;
    }

    return data?.email !== false;
  } catch (error) {
    console.error("Erro ao verificar preferência:", error);
    return true;
  }
}

async function getDadosUsuario(usuarioId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("email, name")
      .eq("id", usuarioId)
      .single();

    if (error) {
      console.error("Erro ao buscar usuário:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return null;
  }
}

async function enviarEmailReservaConfirmada(destinatario: string, nome: string, reserva: any, tipo: "cliente" | "anfitriao") {
  const dataFormatada = new Date(reserva.data_inicio).toLocaleDateString("pt-BR");
const valorPago = reserva.valor_total;

const valorBase = calcularValorBase(valorPago);

const taxaCliente = valorPago - valorBase;

const taxaAnfitriao = calcularTaxaAnfitriao(valorBase);

const valorLiquidoAnfitriao = calcularLiquidoAnfitriao(valorPago);
  if (tipo === "cliente") {
    return await resend.emails.send({
      from: 'PlacyHub <onboarding@resend.dev>',
      to: destinatario,
      subject: '✅ Pagamento confirmado!',
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><title>Pagamento confirmado</title></head>
        <body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
          <h1 style="color:#02b0f0;">✅ Pagamento Confirmado!</h1>
          <p>Olá <strong>${nome}</strong>!</p>
          <p>
Seu pagamento foi confirmado com sucesso e sua reserva está garantida.
</p>

<p>
Espaço reservado:
<strong>${reserva.spaces.nome_espaco}</strong>
</p>
          <div style="background:#f5f5f5;padding:15px;border-radius:8px;margin:15px 0;">
            <p><strong>📅 Data do evento:</strong> ${dataFormatada}</p>
            <p><strong>👥 Quantidade de pessoas:</strong> ${reserva.qtd_pessoas}</p>
           <p><strong>🏠 Valor do espaço:</strong> R$ ${valorBase.toFixed(2)}</p>
<p>
<strong>💳 Taxa de serviço (${TAXAS.locatario * 100}%):</strong>
R$ ${taxaCliente.toFixed(2)}
</p>

<hr style="margin:12px 0;">

<p style="font-size:18px;">
<strong>💰 Total pago:</strong>
R$ ${valorPago.toFixed(2)}
</p>
          <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/locatario/reservas" style="background:#02b0f0;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;">Ver minhas reservas</a></p>
          <hr>
          <p style="color:#666;font-size:12px;">PlacyHub - Aluguel de espaços para eventos</p>
        </body>
        </html>
      `,
    });
  } else {
    return await resend.emails.send({
      from: 'PlacyHub <onboarding@resend.dev>',
      to: destinatario,
      subject: '🎉 Nova reserva confirmada!',
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><title>Nova reserva</title></head>
        <body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
          <h1 style="color:#02b0f0;">🎉 Nova Reserva Confirmada!</h1>
          <p>Olá <strong>${nome}</strong>!</p>
         <p>
Parabéns! Você recebeu uma nova reserva confirmada.
</p>

<p>
Espaço:
<strong>${reserva.spaces.nome_espaco}</strong>
</p>
          <div style="background:#f5f5f5;padding:15px;border-radius:8px;margin:15px 0;">
            <p><strong>📅 Data do evento:</strong> ${dataFormatada}</p>
            <p><strong>👥 Quantidade de pessoas:</strong> ${reserva.qtd_pessoas}</p>
           <p><strong>🏠 Valor da reserva:</strong> R$ ${valorBase.toFixed(2)}</p>

<p><strong>💳 Comissão PlacyHub (${TAXAS.anfitriao * 100}%):</strong>
R$ ${taxaAnfitriao.toFixed(2)}</p>

<hr style="margin:12px 0;">

<p style="font-size:18px;">
<strong>💵 Valor líquido do repasse:</strong>
R$ ${valorLiquidoAnfitriao.toFixed(2)}
</p>
          <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/anfitriao/reservas" style="background:#02b0f0;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;">Ver reservas</a></p>
          <hr>
          <p style="color:#666;font-size:12px;">PlacyHub - Aluguel de espaços para eventos</p>
        </body>
        </html>
      `,
    });
  }
}

// ============================================
// WEBHOOK PRINCIPAL
// ============================================

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("📦 Webhook recebido:", body);
    
    // Verificar se é um pagamento
    if (body.type !== "payment") {
      console.log("ℹ️ Ignorado - não é pagamento");
      return NextResponse.json({ message: "Ignorado" }, { status: 200 });
    }
    
    const paymentId = body.data?.id;
    console.log("💰 Payment ID:", paymentId);
    
    if (!paymentId) {
      return NextResponse.json({ error: "No payment id" }, { status: 400 });
    }
    
    // Buscar token
    const token = process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_TOKEN;
    console.log("🔑 Token existe:", !!token);
    
    // Buscar pagamento no Mercado Pago
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      console.error("❌ Erro ao buscar pagamento:", response.status);
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }
    
    const payment = await response.json();
    console.log("💳 Pagamento:", { 
      id: payment.id, 
      status: payment.status, 
      reservaId: payment.external_reference 
    });
    
    const reservaId = payment.external_reference;
    
    if (!reservaId) {
      console.error("❌ Reservation ID não encontrado");
      return NextResponse.json({ error: "No reservation id" }, { status: 400 });
    }
    
    // 🔥 Buscar dados completos da reserva (antes de atualizar)
    const { data: reservaCompleta, error: reservaCompletaError } = await supabaseAdmin
      .from("reservas")
      .select(`
  *,
  spaces:espaco_id (
    nome_espaco,
    user_id,
    imagem
  )
`)
      .eq("id", reservaId)
      .single();
    
    if (reservaCompletaError) {
      console.error("❌ Erro ao buscar reserva completa:", reservaCompletaError);
    }

    // Definir status da reserva
    let statusReserva = "pendente";
    if (payment.status === "approved") {
      statusReserva = "confirmada";
    } else if (payment.status === "rejected" || payment.status === "cancelled") {
      statusReserva = "cancelada";
    }
    
    // Atualizar reserva no Supabase
   const { data, error: updateError } = await supabaseAdmin
  .from("reservas")
  .update({
    status: statusReserva,
    pagamento_id: payment.id,
    pagamento_status: payment.status,
    pagamento_atualizado_em: new Date().toISOString(),
  })
  .eq("id", reservaId)
  .select();

console.log("UPDATE RESULT:", data);
console.log("UPDATE ERROR:", updateError);
    
    if (updateError) {
      console.error("❌ Erro ao atualizar reserva:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
    
    // ============================================
    // APENAS PARA PAGAMENTOS APROVADOS
    // ============================================
    if (payment.status === "approved") {
      const { data: reserva, error: reservaError } = reservaCompleta && !reservaCompletaError
        ? { data: reservaCompleta, error: null }
        : await supabaseAdmin
            .from("reservas")
            .select(`
  *,
  spaces:espaco_id (
    nome_espaco,
    user_id,
    imagem
  )
`)
            .eq("id", reservaId)
            .single();
      
      if (!reservaError && reserva) {
        // ============================================
        // 🔥 DEPURAÇÃO - LOGS EXTRAS
        // ============================================
        console.log("🔍 1 - Webhook processado para reserva:", reservaId);
        console.log("🔍 2 - Status do pagamento:", payment.status);
        console.log("🔍 3 - Dados da reserva:", reserva);
        console.log("🔍 4 - Cliente:", await getDadosUsuario(reserva.user_id));
console.log("🔍 5 - Anfitrião:", await getDadosUsuario(reserva.spaces?.user_id));
        console.log("🔍 6 - Preferência cliente (pagamentos):", await podeEnviarEmail(reserva.user_id, "pagamentos"));
        console.log("🔍 7 - Preferência anfitrião (reservas):", await podeEnviarEmail(reserva.spaces?.user_id, "reservas"));
        
        const dataFormatada = new Date(reserva.data_inicio).toLocaleDateString("pt-BR");
        
        // ============================================
        // 1. NOTIFICAÇÃO NO SISTEMA (tabela notificacoes)
        // ============================================
        
        // Para o ANFITRIÃO
        const { error: notifAnfitriaoError } = await supabaseAdmin
          .from("notificacoes")
          .insert({
            usuario_id: reserva.spaces.user_id,
            tipo: "reserva",
            titulo: "Nova reserva confirmada! 🎉",
            mensagem: `Um cliente acabou de confirmar o pagamento para o espaço ${reserva.spaces.nome_espaco} no dia ${dataFormatada} para ${reserva.qtd_pessoas} pessoas. Acesse para mais detalhes.`,
            lida: false,
            link: `/anfitriao/reservas`,
            dados_extra: {
              reserva_id: reserva.id,
              espaco_id: reserva.espaco_id,
              espaco_nome: reserva.spaces.nome_espaco,
              data_inicio: reserva.data_inicio,
              data_fim: reserva.data_fim,
              qtd_pessoas: reserva.qtd_pessoas,
              valor_total: reserva.valor_total,
              cliente_id: reserva.user_id
            },
            created_at: new Date().toISOString()
          });
        
        if (notifAnfitriaoError) {
          console.error("❌ Erro ao criar notificação para anfitrião:", notifAnfitriaoError);
        } else {
          console.log("✅ Notificação no sistema enviada para o ANFITRIÃO");
        }
        
        // Para o CLIENTE
        const { error: notifClienteError } = await supabaseAdmin
          .from("notificacoes")
          .insert({
            usuario_id: reserva.user_id,
            tipo: "reserva",
            titulo: "Pagamento confirmado! ✅",
            mensagem: `Seu pagamento para ${reserva.spaces.nome_espaco} foi confirmado. Sua reserva está garantida para o dia ${dataFormatada} para ${reserva.qtd_pessoas} pessoas.`,
            lida: false,
            link: `/locatario/reservas`,
            dados_extra: {
              reserva_id: reserva.id,
              espaco_id: reserva.espaco_id,
              espaco_nome: reserva.spaces.nome_espaco,
              data_inicio: reserva.data_inicio,
              data_fim: reserva.data_fim,
              qtd_pessoas: reserva.qtd_pessoas,
              valor_total: reserva.valor_total
            },
            created_at: new Date().toISOString()
          });
        
        if (notifClienteError) {
          console.error("❌ Erro ao criar notificação para cliente:", notifClienteError);
        } else {
          console.log("✅ Notificação no sistema enviada para o CLIENTE");
        }
        
        // ============================================
        // 2. ENVIO DE EMAIL
        // ============================================
        
        // 🔥 Email para o CLIENTE
        const podeEmailCliente = await podeEnviarEmail(reserva.user_id, "pagamentos");
        console.log(`📧 Cliente (${reserva.user_id}) pode receber email de pagamentos? ${podeEmailCliente}`);
        
        if (podeEmailCliente) {
          const cliente = await getDadosUsuario(reserva.user_id);

console.log(`📧 Email do cliente: ${cliente?.email}`);

if (cliente?.email) {
  try {
    const result = await enviarEmailReservaConfirmada(
      cliente.email,
      cliente.name || "Cliente",
      reserva,
      "cliente"
    );

    if (result.error) {
      console.error("❌ Erro ao enviar email para cliente:", result.error);
    } else {
      console.log(`✅ Email de pagamento enviado para ${cliente.email}`);
    }
  } catch (emailError) {
    console.error("❌ Erro ao enviar email para cliente:", emailError);
  }

          } else {
            console.log(`⚠️ Cliente ${reserva.user_id} não tem email cadastrado`);
          }
        } else {
          console.log(`⏭️ Cliente optou por NÃO receber emails de pagamentos`);
        }
        
        // 🔥 Email para o ANFITRIÃO
        const podeEmailAnfitriao = await podeEnviarEmail(reserva.spaces.user_id, "reservas");
        console.log(`📧 Anfitrião (${reserva.spaces.user_id}) pode receber email de reservas? ${podeEmailAnfitriao}`);
        
        if (podeEmailAnfitriao) {
          const anfitriao = await getDadosUsuario(reserva.spaces.user_id);

console.log(`📧 Email do anfitrião: ${anfitriao?.email}`);

if (anfitriao?.email) {
  try {
    const result = await enviarEmailReservaConfirmada(
      anfitriao.email,
      anfitriao.name || "Anfitrião",
      reserva,
      "anfitriao"
    );

    if (result.error) {
      console.error("❌ Erro ao enviar email para anfitrião:", result.error);
    } else {
      console.log(`✅ Email de nova reserva enviado para ${anfitriao.email}`);
    }
  } catch (emailError) {
    console.error("❌ Erro ao enviar email para anfitrião:", emailError);
  }
} else {
  console.log(`⚠️ Anfitrião ${reserva.spaces.user_id} não tem email cadastrado`);
}
        } else {
          console.log(`⏭️ Anfitrião optou por NÃO receber emails de reservas`);
        }
        
        // ============================================
        // 3. CRIAR REPASSE
        // ============================================
      const valorPagoCliente = reserva.valor_total;

const valorBaseReserva = calcularValorBase(valorPagoCliente);

const taxa = calcularTaxaAnfitriao(valorBaseReserva);

const valorLiquido = calcularLiquidoAnfitriao(valorPagoCliente);

const valorBruto = Number(valorBaseReserva.toFixed(2));
const taxaPlataforma = Number(taxa.toFixed(2));
const valorFinal = Number(valorLiquido.toFixed(2));
        
        const { data: repasseExistente } = await supabaseAdmin
          .from("repasse")
          .select("id")
          .eq("reserva_id", reservaId)
          .single();
        
        if (!repasseExistente) {
         const { error: repasseError } = await supabaseAdmin
  .from("repasse")
  .insert({
    reserva_id: reservaId,
    anfitriao_id: reserva.spaces.user_id,
    valor_bruto: valorBruto,
    taxa_plataforma: taxaPlataforma,
    valor_liquido: valorFinal,
    status: "pendente",
    data_solicitacao: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
          
          if (repasseError) {
            console.error("❌ Erro ao criar repasse:", repasseError);
          } else {
            console.log(`✅ Repasse criado para reserva ${reservaId}, valor líquido: R$ ${valorLiquido}`);
          }
        } else {
          console.log(`ℹ️ Repasse já existe para reserva ${reservaId}`);
        }
      } else {
        console.error("❌ Erro ao buscar dados da reserva:", reservaError);
      }
    }
    
    console.log(`✅ Reserva ${reservaId} atualizada para ${statusReserva}`);
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("❌ Erro no webhook:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}