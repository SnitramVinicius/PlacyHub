import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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
    const { data: reservaCompleta, error: reservaCompletaError } = await supabase
      .from("reservas")
      .select(`
        *,
        spaces:espaco_id (nome, user_id, imagem)
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
    const { error: updateError } = await supabase
      .from("reservas")
      .update({
        status: statusReserva,
        pagamento_id: payment.id,
        pagamento_status: payment.status,
        pagamento_atualizado_em: new Date().toISOString(),
      })
      .eq("id", reservaId);
    
    if (updateError) {
      console.error("❌ Erro ao atualizar reserva:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
    
    // ============================================
    // 🔥 NOVA FUNCIONALIDADE: Criar registro na tabela repasse
    // ============================================
       // ============================================
    // 🔥 NOVA FUNCIONALIDADE: Criar notificações e repasse
    // ============================================
    if (payment.status === "approved") {
      // Usar os dados que já buscamos (reservaCompleta) ou buscar novamente
      const { data: reserva, error: reservaError } = reservaCompleta && !reservaCompletaError
        ? { data: reservaCompleta, error: null }
        : await supabase
            .from("reservas")
            .select(`
              *,
              spaces:espaco_id (nome, user_id, imagem)
            `)
            .eq("id", reservaId)
            .single();
      
      if (!reservaError && reserva) {
        // 🔥 1. NOTIFICAÇÃO PARA O ANFITRIÃO
        const dataFormatada = new Date(reserva.data_inicio).toLocaleDateString("pt-BR");
        
        const { error: notifAnfitriaoError } = await supabase
          .from("notificacoes")
          .insert({
            usuario_id: reserva.spaces.user_id,
            tipo: "reserva",
            titulo: "Nova reserva confirmada! 🎉",
            mensagem: `Um cliente acabou de confirmar o pagamento para o espaço ${reserva.spaces.nome} no dia ${dataFormatada} para ${reserva.qtd_pessoas} pessoas. Acesse para mais detalhes.`,
            lida: false,
            link: `/anfitriao/reservas`,
            dados_extra: {
              reserva_id: reserva.id,
              espaco_id: reserva.espaco_id,
              espaco_nome: reserva.spaces.nome,
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
          console.log("✅ Notificação enviada para o ANFITRIÃO");
        }
        
        // 🔥 2. NOTIFICAÇÃO PARA O LOCATÁRIO (CLIENTE)
        const { error: notifClienteError } = await supabase
          .from("notificacoes")
          .insert({
            usuario_id: reserva.user_id,
            tipo: "reserva",
            titulo: "Pagamento confirmado! ✅",
            mensagem: `Seu pagamento para ${reserva.spaces.nome} foi confirmado. Sua reserva está garantida para o dia ${dataFormatada} para ${reserva.qtd_pessoas} pessoas.`,
            lida: false,
            link: `/locatario/reservas`,
            dados_extra: {
              reserva_id: reserva.id,
              espaco_id: reserva.espaco_id,
              espaco_nome: reserva.spaces.nome,
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
          console.log("✅ Notificação enviada para o CLIENTE");
        }
        
        // 🔥 3. CRIAR REPASSE (seu código original)
        const TAXA_PLATAFORMA = 0.10; // 10%
        const valorBruto = reserva.valor_total;
        const taxa = valorBruto * TAXA_PLATAFORMA;
        const valorLiquido = valorBruto - taxa;
        
        // Verificar se já existe repasse para esta reserva
        const { data: repasseExistente } = await supabase
          .from("repasse")
          .select("id")
          .eq("reserva_id", reservaId)
          .single();
        
        if (!repasseExistente) {
          const { error: repasseError } = await supabase
            .from("repasse")
            .insert({
              reserva_id: reservaId,
              anfitriao_id: reserva.user_id,
              valor_bruto: valorBruto,
              taxa_plataforma: taxa,
              valor_liquido: valorLiquido,
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