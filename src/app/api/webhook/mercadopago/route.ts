import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { Resend } from "resend";
import {
  TAXAS,
  calcularValorBase,
  calcularTaxaAnfitriao,
  calcularLiquidoAnfitriao,
} from "@/config/taxa";

const resend = new Resend(process.env.RESEND_API_KEY);

function assinaturaWebhookValida(request: Request, dataId: string) {
  const secret = process.env.MP_WEBHOOK_SECRET;
  const xSignature = request.headers.get("x-signature");
  const xRequestId = request.headers.get("x-request-id");

  if (!secret || !xSignature || !xRequestId || !dataId) return false;

  const partes = Object.fromEntries(
    xSignature.split(",").map((parte) => {
      const [chave, ...valor] = parte.trim().split("=");
      return [chave, valor.join("=")];
    })
  );
  if (!partes.ts || !partes.v1) return false;

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${partes.ts};`;
  const assinaturaEsperada = createHmac("sha256", secret).update(manifest).digest("hex");
  const recebida = Buffer.from(partes.v1, "utf8");
  const esperada = Buffer.from(assinaturaEsperada, "utf8");

  return recebida.length === esperada.length && timingSafeEqual(recebida, esperada);
}

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
      .select("email, name, telefone")
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

async function enviarEmailReservaConfirmada(
  destinatario: string,
  nome: string,
  reserva: any,
  tipo: "cliente" | "anfitriao",
  contatoAnfitriao?: { name?: string | null; telefone?: string | null } | null,
  contatoCliente?: { name?: string | null; telefone?: string | null } | null
) {
  const [ano, mes, dia] = String(reserva.data_inicio).slice(0, 10).split("-");
  const dataFormatada = dia && mes && ano ? `${dia}/${mes}/${ano}` : "Data não informada";
const valorPago = reserva.valor_total;

const valorBase = calcularValorBase(valorPago);

const taxaCliente = valorPago - valorBase;

const taxaAnfitriao = calcularTaxaAnfitriao(valorBase);

const valorLiquidoAnfitriao = calcularLiquidoAnfitriao(valorPago);
const moeda = (valor: number) => valor.toLocaleString("pt-BR", {
  style: "currency",
  currency: "BRL",
});
const enderecoCompleto = [
  reserva.spaces.endereco,
  reserva.spaces.bairro,
  [reserva.spaces.cidade, reserva.spaces.estado].filter(Boolean).join(" - "),
].filter(Boolean).join(", ");
const telefoneAnfitriao = contatoAnfitriao?.telefone || "";
const telefoneWhatsApp = telefoneAnfitriao.replace(/\D/g, "");
const numeroWhatsApp = telefoneWhatsApp.startsWith("55")
  ? telefoneWhatsApp
  : telefoneWhatsApp
    ? `55${telefoneWhatsApp}`
    : "";
const telefoneCliente = contatoCliente?.telefone || "";
const telefoneClienteNumeros = telefoneCliente.replace(/\D/g, "");
const whatsappCliente = telefoneClienteNumeros.startsWith("55")
  ? telefoneClienteNumeros
  : telefoneClienteNumeros
    ? `55${telefoneClienteNumeros}`
    : "";
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
           <p><strong>🏠 Valor do espaço:</strong> ${moeda(valorBase)}</p>
<p>
<strong>💳 Taxa de serviço (${TAXAS.locatario * 100}%):</strong>
${moeda(taxaCliente)}
</p>

<hr style="margin:12px 0;">

<p style="font-size:18px;">
<strong>💰 Total pago:</strong>
${moeda(valorPago)}
</p>
          ${enderecoCompleto ? `
          <div style="background:#eef8fc;padding:15px;border-radius:8px;margin:15px 0;">
            <p style="margin-top:0;"><strong>📍 Endereço completo do espaço</strong></p>
            <p>${enderecoCompleto}</p>
            <p><strong>🔑 Entrada no local:</strong> combine com o anfitrião a entrega das chaves e as orientações de acesso.</p>
            ${contatoAnfitriao?.name ? `<p><strong>👤 Anfitrião:</strong> ${contatoAnfitriao.name}</p>` : ""}
            ${telefoneAnfitriao ? `<p><strong>📱 Telefone/WhatsApp:</strong> ${telefoneAnfitriao}</p>` : ""}
            ${numeroWhatsApp ? `<p><a href="https://wa.me/${numeroWhatsApp}" style="color:#087f5b;font-weight:bold;">Conversar com o anfitrião pelo WhatsApp</a></p>` : ""}
          </div>` : ""}
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
           <p><strong>🏠 Valor da reserva:</strong> ${moeda(valorBase)}</p>

<p><strong>💳 Comissão PlacyHub (${TAXAS.anfitriao * 100}%):</strong>
${moeda(taxaAnfitriao)}</p>

<hr style="margin:12px 0;">

<p style="font-size:18px;">
<strong>💵 Valor líquido do repasse:</strong>
${moeda(valorLiquidoAnfitriao)}
</p>
          <div style="background:#eef8fc;padding:15px;border-radius:8px;margin:15px 0;">
            <p style="margin-top:0;"><strong>🔑 Combine a entrega das chaves</strong></p>
            <p>Entre em contato com o cliente para confirmar o horário de entrada, a entrega das chaves e todas as orientações de acesso ao espaço.</p>
            ${contatoCliente?.name ? `<p><strong>👤 Cliente:</strong> ${contatoCliente.name}</p>` : ""}
            ${telefoneCliente ? `<p><strong>📱 Telefone/WhatsApp:</strong> ${telefoneCliente}</p>` : ""}
            ${whatsappCliente ? `<p><a href="https://wa.me/${whatsappCliente}" style="color:#087f5b;font-weight:bold;">Conversar com o cliente pelo WhatsApp</a></p>` : ""}
          </div>
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
    const url = new URL(request.url);
    const dataIdAssinatura = url.searchParams.get("data.id") ?? String(body.data?.id ?? "");

    if (!process.env.MP_WEBHOOK_SECRET) {
      console.error("MP_WEBHOOK_SECRET não configurado.");
      return NextResponse.json({ error: "Webhook não configurado." }, { status: 503 });
    }

    if (!assinaturaWebhookValida(request, dataIdAssinatura)) {
      console.error("Webhook do Mercado Pago recusado: assinatura inválida.", {
        possuiDataId: Boolean(dataIdAssinatura),
        possuiAssinatura: Boolean(request.headers.get("x-signature")),
        possuiRequestId: Boolean(request.headers.get("x-request-id")),
      });
      return NextResponse.json({ error: "Assinatura inválida." }, { status: 401 });
    }
    // Verificar se é um pagamento
    if (body.type !== "payment") {
      return NextResponse.json({ message: "Ignorado" }, { status: 200 });
    }
    
    const paymentId = body.data?.id;
    
    if (!paymentId) {
      return NextResponse.json({ error: "No payment id" }, { status: 400 });
    }
    
    // Buscar token
    const token = process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_TOKEN;
        
    // Buscar pagamento no Mercado Pago
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
  console.error(
    "⚠️ Não foi possível encontrar o pagamento no Mercado Pago:",
    paymentId,
    "Status:",
    response.status
  );

  // Não confirmar recebimento: o 503 faz o Mercado Pago tentar novamente.
  return NextResponse.json(
    { error: "Pagamento temporariamente não encontrado." },
    { status: 503 }
  );
}
    
const payment = await response.json();

const collectorResponse = await fetch("https://api.mercadopago.com/users/me", {
  headers: { Authorization: `Bearer ${token}` },
});
if (!collectorResponse.ok) {
  return NextResponse.json({ error: "Não foi possível validar a conta recebedora." }, { status: 503 });
}
const collector = await collectorResponse.json();

console.log("========== PAGAMENTO MERCADO PAGO ==========");
console.log("ID:", payment.id);
console.log("STATUS:", payment.status);
console.log("STATUS DETAIL:", payment.status_detail);
console.log("STATUS DETAIL MESSAGE:", payment.status_detail?.message);
console.log("PAYMENT TYPE:", payment.payment_type_id);
console.log("PAYMENT METHOD:", payment.payment_method_id);
console.log("TRANSACTION AMOUNT:", payment.transaction_amount);
console.log("EXTERNAL REFERENCE:", payment.external_reference);
console.log("============================================");

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
    imagem,
    endereco,
    bairro,
    cidade,
    estado
  )
`)
      .eq("id", reservaId)
      .single();
    
    if (reservaCompletaError) {
      console.error("❌ Erro ao buscar reserva completa:", reservaCompletaError);
    }

    if (!reservaCompleta) {
      return NextResponse.json({ error: "Reserva não encontrada." }, { status: 404 });
    }

    const valorEsperado = Number(reservaCompleta.valor_total);
    const valorRecebido = Number(payment.transaction_amount);
    const valorConfere =
      Number.isFinite(valorEsperado) &&
      Number.isFinite(valorRecebido) &&
      Math.round(valorEsperado * 100) === Math.round(valorRecebido * 100);
    const moedaConfere = payment.currency_id === "BRL";
    const metadataConfere =
      !payment.metadata?.reserva_id || payment.metadata.reserva_id === reservaId;
    const collectorConfere = String(payment.collector_id) === String(collector.id);
    // O Access Token não possui um formato público confiável para extrair o
    // application_id. Valide-o apenas quando informado explicitamente.
    const applicationIdEsperado = process.env.MP_APPLICATION_ID;
    const applicationConfere =
      !applicationIdEsperado || String(payment.application_id) === applicationIdEsperado;
    const statusSubstituivel = [
      null,
      "preference_created",
      "pending",
      "in_process",
      "expired",
    ].includes(reservaCompleta.pagamento_status ?? null);
    const pagamentoJaAssociado =
      reservaCompleta.pagamento_id &&
      !statusSubstituivel &&
      String(reservaCompleta.pagamento_id) !== String(payment.id);

    if (
      !valorConfere ||
      !moedaConfere ||
      !metadataConfere ||
      !collectorConfere ||
      !applicationConfere ||
      pagamentoJaAssociado
    ) {
      console.error("Pagamento incompatível com a reserva", {
        reservaId,
        paymentId: payment.id,
        valorEsperado,
        valorRecebido,
        currencyId: payment.currency_id,
        collectorConfere,
        applicationConfere,
      });
      return NextResponse.json({ error: "Pagamento incompatível com a reserva." }, { status: 409 });
    }

    const notificacaoJaProcessada =
      String(reservaCompleta.pagamento_id) === String(payment.id) &&
      reservaCompleta.pagamento_status === payment.status;

    if (notificacaoJaProcessada) {
      return NextResponse.json({ success: true, message: "Notificação já processada." });
    }

    // Definir status da reserva
    let statusReserva = "pendente";
    if (payment.status === "approved") {
      statusReserva = "confirmada";
    } else if (payment.status === "rejected" || payment.status === "cancelled") {
      statusReserva = "cancelada";
    }
    
    // Atualizar reserva no Supabase
    const atualizacaoReserva: Record<string, unknown> = {
      status: statusReserva,
      pagamento_id: payment.id,
      pagamento_status: payment.status,
      pagamento_atualizado_em: new Date().toISOString(),
    };

    if (payment.status === "approved") {
      atualizacaoReserva.motivo_cancelamento = null;
      atualizacaoReserva.cancelado_em = null;
    }

   const { data, error: updateError } = await supabaseAdmin
  .from("reservas")
  .update(atualizacaoReserva)
  .eq("id", reservaId)
  .select();    
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
    imagem,
    endereco,
    bairro,
    cidade,
    estado
  )
`)
            .eq("id", reservaId)
            .single();
      
      if (!reservaError && reserva) {       
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
        }
        
        // ============================================
        // 2. ENVIO DE EMAIL
        // ============================================
        const [cliente, anfitriao] = await Promise.all([
          getDadosUsuario(reserva.user_id),
          getDadosUsuario(reserva.spaces.user_id),
        ]);
        
        // 🔥 Email para o CLIENTE
        const podeEmailCliente = await podeEnviarEmail(reserva.user_id, "pagamentos");
        
        if (podeEmailCliente) {
if (cliente?.email) {
  try {
    const result = await enviarEmailReservaConfirmada(
      cliente.email,
      cliente.name || "Cliente",
      reserva,
      "cliente",
      anfitriao
    );

    if (result.error) {
      console.error("❌ Erro ao enviar email para cliente:", result.error);
    } else {
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
        
        if (podeEmailAnfitriao) {
if (anfitriao?.email) {
  try {
    const result = await enviarEmailReservaConfirmada(
      anfitriao.email,
      anfitriao.name || "Anfitrião",
      reserva,
      "anfitriao",
      null,
      cliente
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
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("❌ Erro no webhook:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
