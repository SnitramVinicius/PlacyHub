// // app/api/pagamento/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import MercadoPagoConfig, { Preference } from "mercadopago";

// const client = new MercadoPagoConfig({
//   accessToken: process.env.MP_ACCESS_TOKEN!,
// });

// export const POST = async (req: NextRequest) => {
//   try {
//     const {
//       total,
//       espacoId,
//       nomeEspaco,
//       dataReserva,
//       dataInicio,
//       dataFim,
//       plano,
//       qtdPessoas,
//       pacote,
//       convidados,
//       reservaId, // 🔥 ADICIONAR reservaId
//     } = await req.json();

//     if (!total || isNaN(Number(total))) {
//       return NextResponse.json(
//         { error: "Valor inválido recebido.", details: total },
//         { status: 400 }
//       );
//     }

//     // 🔥 SE NÃO TIVER reservaId, NÃO CRIA PAGAMENTO
//     if (!reservaId) {
//       return NextResponse.json(
//         { error: "ID da reserva não informado" },
//         { status: 400 }
//       );
//     }

//     const preference = new Preference(client);

//     const dataFinalReserva =
//       dataReserva ||
//       (dataInicio && dataFim
//         ? `${dataInicio} até ${dataFim}`
//         : null);

//    const body = {
//   items: [
//     {
//       id: espacoId || "reserva_espaco",
//       title: nomeEspaco ? `Reserva - ${nomeEspaco}` : "Reserva de Espaço",
//       quantity: 1,
//       unit_price: Number(total),
//     },
//   ],

//   metadata: {
//     espacoId,
//     dataReserva: dataFinalReserva,
//     plano,
//     qtdPessoas,
//     pacote,
//     convidados,
//     valor: Number(total),
//     reservaId,
//   },

//   external_reference: reservaId,

//   payment_methods: {
//     excluded_payment_methods: [],
//     excluded_payment_types: [],
//   },

//   back_urls: {
//     success: `${process.env.NEXT_PUBLIC_BASE_URL}/locatario/reservas`,
//     failure: `${process.env.NEXT_PUBLIC_BASE_URL}/locatario/reservas`,
//     pending: `${process.env.NEXT_PUBLIC_BASE_URL}/locatario/reservas`,
//   },

//   notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook/mercadopago`,

//   auto_return: "approved",
// };

// console.log("Body enviado ao Mercado Pago:");
// console.log(body);

// const result = await preference.create({ body });

// console.log(
//   JSON.stringify(result.payment_methods, null, 2)
// );

// return NextResponse.json({ url: result.init_point });
// } catch (err: any) {
//   console.error("ERRO COMPLETO MP:");
//   console.error(err);

//   console.error("MESSAGE:", err?.message);
//   console.error("STATUS:", err?.status);
//   console.error("CAUSE:", err?.cause);
//   console.error("RESPONSE:", err?.response?.data);

//   return NextResponse.json(
//     {
//       error: "Erro ao criar preferência",
//       details: err?.message || "Erro desconhecido",
//       status: err?.status || null,
//     },
//     { status: 500 }
//   );
// }
// };

// app/api/pagamento/route.ts




// import { NextRequest, NextResponse } from "next/server";
// import MercadoPagoConfig, { Preference } from "mercadopago";
// import { supabaseAdmin } from "@/lib/supabaseAdmin";

// const accessToken = process.env.MP_ACCESS_TOKEN;

// if (!accessToken) {
//   throw new Error("MP_ACCESS_TOKEN não configurado.");
// }

// const client = new MercadoPagoConfig({
//   accessToken,
// });

// export const POST = async (req: NextRequest) => {
//   try {
//     const bodyRequest = await req.json();

//     const {
//       total,
//       espacoId,
//       nomeEspaco,
//       dataReserva,
//       dataInicio,
//       dataFim,
//       plano,
//       qtdPessoas,
//       pacote,
//       convidados,
//       reservaId,

//       // Dados reais do cliente, caso já estejam disponíveis
//       clienteNome,
//       clienteSobrenome,
//       clienteEmail,
//       clienteTelefone,
//       clienteCpf,
//       clienteCep,
//       clienteRua,
//       clienteNumero,
//     } = bodyRequest;

//     // ============================================
//     // VALIDAÇÕES
//     // ============================================

//     const valorTotal = Number(total);

//     if (!Number.isFinite(valorTotal) || valorTotal <= 0) {
//       return NextResponse.json(
//         {
//           error: "Valor inválido recebido.",
//           details: total,
//         },
//         { status: 400 }
//       );
//     }

//     if (!espacoId) {
//       return NextResponse.json(
//         {
//           error: "ID do espaço não informado.",
//         },
//         { status: 400 }
//       );
//     }

//     if (!reservaId) {
//       return NextResponse.json(
//         {
//           error: "ID da reserva não informado.",
//         },
//         { status: 400 }
//       );
//     }

//     // ============================================
// // BUSCAR DADOS REAIS DO CLIENTE NO BANCO
// // ============================================

// let clienteBanco: {
//   email: string | null;
//   name: string | null;
// } | null = null;

// try {
//   // Primeiro descobrimos quem é o cliente da reserva
//   const { data: reservaBanco, error: reservaBancoError } = await supabaseAdmin
//     .from("reservas")
//     .select("user_id")
//     .eq("id", reservaId)
//     .single();

//   if (reservaBancoError) {
//     console.error(
//       "⚠️ Erro ao buscar cliente da reserva:",
//       reservaBancoError
//     );
//   } else if (reservaBanco?.user_id) {
//     // Depois buscamos os dados do cliente
//     const { data: usuarioBanco, error: usuarioBancoError } =
//       await supabaseAdmin
//         .from("users")
//         .select("email, name")
//         .eq("id", reservaBanco.user_id)
//         .single();

//     if (usuarioBancoError) {
//       console.error(
//         "⚠️ Erro ao buscar dados do cliente:",
//         usuarioBancoError
//       );
//     } else {
//       clienteBanco = usuarioBanco;
//     }
//   }
// } catch (error) {
//   console.error(
//     "⚠️ Erro inesperado ao buscar dados do cliente:",
//     error
//   );
// }

//     // ============================================
//     // DATA DA RESERVA
//     // ============================================

//     const dataFinalReserva =
//       dataReserva ||
//       (dataInicio && dataFim
//         ? `${dataInicio} até ${dataFim}`
//         : null);

//     // ============================================
//     // INFORMAÇÕES DO COMPRADOR
//     // ============================================

//    const payer: any = {};

// // ============================================
// // DADOS DO CLIENTE
// // Prioridade: banco de dados
// // Fallback: dados enviados pelo frontend
// // ============================================

// const nomeRealCliente =
//   clienteBanco?.name || clienteNome || null;

// const emailRealCliente =
//   clienteBanco?.email || clienteEmail || null;

// if (nomeRealCliente) {
//   const partesNome = nomeRealCliente.trim().split(/\s+/);

//   payer.name = partesNome[0];

//   if (partesNome.length > 1) {
//     payer.surname = partesNome.slice(1).join(" ");
//   }
// }

// // E-mail vindo preferencialmente do banco
// if (emailRealCliente) {
//   payer.email = emailRealCliente.trim().toLowerCase();
// }

//     if (clienteTelefone) {
//       const telefoneLimpo = String(clienteTelefone).replace(/\D/g, "");

//       if (telefoneLimpo.length >= 10) {
//         payer.phone = {
//           area_code: telefoneLimpo.substring(0, 2),
//           number: Number(telefoneLimpo.substring(2)),
//         };
//       }
//     }

//     if (clienteCpf) {
//       const cpfLimpo = String(clienteCpf).replace(/\D/g, "");

//       if (cpfLimpo.length === 11) {
//         payer.identification = {
//           type: "CPF",
//           number: cpfLimpo,
//         };
//       }
//     }

//     if (clienteCep || clienteRua || clienteNumero) {
//       payer.address = {
//         zip_code: clienteCep
//           ? String(clienteCep).replace(/\D/g, "")
//           : undefined,

//         street_name: clienteRua || undefined,

//         street_number: clienteNumero
//           ? Number(clienteNumero)
//           : undefined,
//       };
//     }

//     // ============================================
//     // PREFERÊNCIA MERCADO PAGO
//     // ============================================

//     const preferenceBody: any = {
//       items: [
//   {
//     id: String(espacoId),

//     title: nomeEspaco
//       ? `Reserva - ${nomeEspaco}`
//       : "Reserva de Espaço",

//     description:
//       `Reserva de ${nomeEspaco || "espaço para evento"} ` +
//       `para ${dataFinalReserva || "data não informada"}.`,

//     category_id: "services",

//     quantity: 1,

//     currency_id: "BRL",

//     unit_price: Number(valorTotal.toFixed(2)),
//   },
// ],

//       external_reference: String(reservaId),

//       metadata: {
//         espacoId: String(espacoId),

//         reservaId: String(reservaId),

//         dataReserva: dataFinalReserva,

//         plano: plano ?? null,

//         qtdPessoas: qtdPessoas ?? null,

//         pacote: pacote ?? null,

//         convidados: convidados ?? null,

//         valor: Number(valorTotal.toFixed(2)),
//       },

//       payment_methods: {
//         // Não estamos bloqueando nenhum método.
//         excluded_payment_methods: [],
//         excluded_payment_types: [],
//       },

//       back_urls: {
//         success: `${process.env.NEXT_PUBLIC_BASE_URL}/locatario/reservas`,

//         failure: `${process.env.NEXT_PUBLIC_BASE_URL}/locatario/reservas`,

//         pending: `${process.env.NEXT_PUBLIC_BASE_URL}/locatario/reservas`,
//       },

//       notification_url:
//         `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook/mercadopago`,

//       auto_return: "approved",

//       additional_info: `
//         Reserva de espaço para evento.
//         Espaço: ${nomeEspaco || "Não informado"}.
//         Data: ${dataFinalReserva || "Não informada"}.
//         Quantidade de pessoas: ${qtdPessoas || "Não informada"}.
//         Reserva: ${reservaId}.
//       `.trim(),
//     };

//     // Só adiciona payer quando realmente temos dados.
//     // Não enviamos informações falsas.
//     if (Object.keys(payer).length > 0) {
//       preferenceBody.payer = payer;
//     }

//     // ============================================
//     // LOG
//     // ============================================

//     console.log("========== PREFERÊNCIA MERCADO PAGO ==========");

//     console.log(
//       JSON.stringify(
//         {
//           ...preferenceBody,

//           // Não exibir CPF/telefone/email completos no log.
//           payer: payer
//             ? {
//                 ...payer,

//                 email: payer.email
//                   ? "***"
//                   : undefined,

//                 identification: payer.identification
//                   ? {
//                       type: payer.identification.type,
//                       number: "***",
//                     }
//                   : undefined,

//                 phone: payer.phone
//                   ? {
//                       area_code: payer.phone.area_code,
//                       number: "***",
//                     }
//                   : undefined,
//               }
//             : undefined,
//         },
//         null,
//         2
//       )
//     );

//     console.log("==============================================");

//     // ============================================
//     // CRIAR PREFERÊNCIA
//     // ============================================

//     const preference = new Preference(client);

//     const result = await preference.create({
//       body: preferenceBody,
//     });

//     console.log("Preferência criada com sucesso.");
//     console.log("Preference ID:", result.id);
//     console.log("Init Point:", result.init_point);

//     console.log(
//       "Meios de pagamento:",
//       JSON.stringify(result.payment_methods, null, 2)
//     );

//     // ============================================
//     // RESPOSTA
//     // ============================================

//     if (!result.init_point) {
//       console.error(
//         "Mercado Pago não retornou init_point."
//       );

//       return NextResponse.json(
//         {
//           error: "Mercado Pago não retornou a URL de pagamento.",
//         },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json({
//       success: true,

//       url: result.init_point,

//       preferenceId: result.id,
//     });

//   } catch (err: any) {
//     console.error("========== ERRO MERCADO PAGO ==========");

//     console.error("MESSAGE:", err?.message);

//     console.error("STATUS:", err?.status);

//     console.error("CAUSE:", err?.cause);

//     console.error(
//       "RESPONSE:",
//       err?.response?.data
//     );

//     console.error("======================================");

//     return NextResponse.json(
//       {
//         error: "Erro ao criar preferência de pagamento.",

//         details:
//           err?.message ||
//           "Erro desconhecido.",

//         status:
//           err?.status ||
//           null,
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// };




import { NextRequest, NextResponse } from "next/server";
import MercadoPagoConfig, { Preference } from "mercadopago";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  calcularValorBase,
} from "@/config/taxa";

const accessToken = process.env.MP_ACCESS_TOKEN;

if (!accessToken) {
  throw new Error("MP_ACCESS_TOKEN não configurado.");
}

const client = new MercadoPagoConfig({
  accessToken,
});

const TEMPO_RESERVA_MS = 15 * 60 * 1000;

const somenteNumeros = (valor: unknown) => String(valor ?? "").replace(/\D/g, "");

const cpfValido = (valor: unknown) => {
  const cpf = somenteNumeros(valor);
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;

  const calcularDigito = (base: string, pesoInicial: number) => {
    const soma = base.split("").reduce(
      (total, digito, indice) => total + Number(digito) * (pesoInicial - indice),
      0
    );
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  return (
    calcularDigito(cpf.slice(0, 9), 10) === Number(cpf[9]) &&
    calcularDigito(cpf.slice(0, 10), 11) === Number(cpf[10])
  );
};

const dataNascimentoValida = (valor: unknown) => {
  if (!valor) return false;
  const nascimento = new Date(`${String(valor)}T12:00:00`);
  if (Number.isNaN(nascimento.getTime())) return false;

  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  if (
    hoje.getMonth() < nascimento.getMonth() ||
    (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate())
  ) {
    idade--;
  }
  return idade >= 18 && idade <= 120;
};

export const POST = async (req: NextRequest) => {
  try {
    // ============================================
    // 1. RECEBER SOMENTE O ID DA RESERVA
    // ============================================

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "");
  if (!baseUrl || !baseUrl.startsWith("https://")) {
    console.error("NEXT_PUBLIC_BASE_URL ausente ou sem HTTPS; pagamento não iniciado.");
    return NextResponse.json(
      { error: "A confirmação automática do pagamento não está configurada." },
      { status: 503 }
    );
  }

  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const {
    data: { user: authUser },
    error: authError,
  } = await supabaseAdmin.auth.getUser(token);

  if (authError || !authUser) {
    return NextResponse.json({ error: "Usuário não autenticado." }, { status: 401 });
  }

  const body = await req.json();

const { reservaId, deviceId } = body;

    if (!reservaId) {
      return NextResponse.json(
        {
          error: "ID da reserva não informado.",
        },
        { status: 400 }
      );
    }

    if (typeof deviceId !== "string" || deviceId.trim().length < 10) {
      return NextResponse.json(
        { error: "Identificador de segurança do dispositivo não recebido." },
        { status: 400 }
      );
    }

    const agora = new Date();
    const limiteExpiracao = new Date(agora.getTime() - TEMPO_RESERVA_MS).toISOString();
    await supabaseAdmin
      .from("reservas")
      .update({
        status: "cancelada",
        pagamento_status: "expired",
        pagamento_atualizado_em: agora.toISOString(),
        motivo_cancelamento: "Prazo de pagamento expirado",
        cancelado_em: agora.toISOString(),
      })
      .eq("user_id", authUser.id)
      .eq("status", "pendente")
      .lt("created_at", limiteExpiracao)
      .neq("pagamento_status", "approved");

    // ============================================
    // 2. BUSCAR A RESERVA NO BANCO
    // ============================================

    const { data: reserva, error: reservaError } = await supabaseAdmin
      .from("reservas")
      .select(`
        *,
        spaces:espaco_id (
          id,
          nome_espaco,
          user_id,
          imagem,
          cidade,
          estado
        )
      `)
      .eq("id", reservaId)
      .single();

    if (reservaError || !reserva) {
      console.error(
        "❌ Erro ao buscar reserva:",
        reservaError
      );

      return NextResponse.json(
        {
          error: "Reserva não encontrada.",
        },
        { status: 404 }
      );
    }

    if (reserva.user_id !== authUser.id) {
      return NextResponse.json(
        { error: "Você não tem permissão para pagar esta reserva." },
        { status: 403 }
      );
    }

    // ============================================
    // 3. VALIDAR STATUS DA RESERVA
    // ============================================

    if (reserva.status === "confirmada") {
      return NextResponse.json(
        {
          error: "Esta reserva já está confirmada.",
        },
        { status: 409 }
      );
    }

    if (reserva.status === "cancelada") {
      return NextResponse.json(
        {
          error: "Esta reserva está cancelada.",
        },
        { status: 400 }
      );
    }

    // ============================================
    // 4. BUSCAR DADOS DO CLIENTE NO BANCO
    // ============================================

    if (!reserva.user_id) {
      return NextResponse.json(
        {
          error: "Reserva não possui cliente vinculado.",
        },
        { status: 400 }
      );
    }

    const { data: cliente, error: clienteError } =
  await supabaseAdmin
    .from("users")
    .select(`
      id,
      name,
      email,
      telefone,
      cpf,
      cep,
      rua,
      numero,
      bairro,
      cidade,
      estado,
      data_nascimento,
      created_at
    `)
    .eq("id", reserva.user_id)
    .single();

    if (clienteError || !cliente) {
      console.error(
        "❌ Erro ao buscar cliente:",
        clienteError
      );

      return NextResponse.json(
        {
          error: "Cliente da reserva não encontrado.",
        },
        { status: 404 }
      );
    }

    if (
      reserva.pagamento_status === "preference_created" &&
      reserva.pagamento_id &&
      reserva.pagamento_atualizado_em &&
      Date.now() - new Date(reserva.pagamento_atualizado_em).getTime() < TEMPO_RESERVA_MS
    ) {
      const preferenceResponse = await fetch(
        `https://api.mercadopago.com/checkout/preferences/${encodeURIComponent(String(reserva.pagamento_id))}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (preferenceResponse.ok) {
        const preferenceExistente = await preferenceResponse.json();
        if (
          preferenceExistente.external_reference === String(reserva.id) &&
          preferenceExistente.init_point
        ) {
          return NextResponse.json({
            success: true,
            url: preferenceExistente.init_point,
            preferenceId: preferenceExistente.id,
            reused: true,
          });
        }
      }
    }

    const telefoneLimpo = somenteNumeros(cliente.telefone);
    const perfilAntifraudeValido =
      (cliente.name?.trim().split(/\s+/).length ?? 0) >= 2 &&
      /^\S+@\S+\.\S+$/.test(cliente.email?.trim() ?? "") &&
      cpfValido(cliente.cpf) &&
      [10, 11].includes(telefoneLimpo.length) &&
      somenteNumeros(cliente.cep).length === 8 &&
      Boolean(cliente.rua?.trim()) &&
      Boolean(cliente.numero?.trim()) &&
      Boolean(cliente.bairro?.trim()) &&
      Boolean(cliente.cidade?.trim()) &&
      /^[A-Z]{2}$/i.test(cliente.estado?.trim() ?? "") &&
      dataNascimentoValida(cliente.data_nascimento);

    if (!perfilAntifraudeValido) {
      return NextResponse.json(
        { error: "Complete e valide seus dados pessoais antes do pagamento." },
        { status: 422 }
      );
    }

    const { data: ultimaCompra } = await supabaseAdmin
      .from("reservas")
      .select("pagamento_atualizado_em")
      .eq("user_id", authUser.id)
      .eq("status", "confirmada")
      .neq("id", reserva.id)
      .order("pagamento_atualizado_em", { ascending: false })
      .limit(1)
      .maybeSingle();

    // ============================================
    // 5. VALIDAR ESPAÇO
    // ============================================

    if (!reserva.spaces) {
      return NextResponse.json(
        {
          error: "Espaço da reserva não encontrado.",
        },
        { status: 404 }
      );
    }

    // ============================================
    // 6. VALOR OFICIAL VEM DO BANCO
    // ============================================

    const valorTotal = Number(reserva.valor_total);

    if (!Number.isFinite(valorTotal) || valorTotal <= 0) {
      console.error(
        "❌ Valor inválido na reserva:",
        reserva.valor_total
      );

      return NextResponse.json(
        {
          error: "Valor da reserva inválido.",
        },
        { status: 400 }
      );
    }

    // Valor base somente para conferência/log.
    const valorBase = calcularValorBase(valorTotal);

    // ============================================
    // 7. DATA DA RESERVA
    // ============================================

    const dataFormatada = reserva.data_inicio
      ? new Date(reserva.data_inicio).toLocaleDateString("pt-BR")
      : "Data não informada";

    // ============================================
    // 8. MONTAR PAYER COM DADOS DO BANCO
    // ============================================

  const payer: any = {};

// ============================================
// NOME
// ============================================

if (cliente.name) {
  const partesNome = cliente.name.trim().split(/\s+/);

  payer.name = partesNome[0];

  if (partesNome.length > 1) {
    payer.surname = partesNome.slice(1).join(" ");
  }
}

// ============================================
// E-MAIL
// ============================================

if (cliente.email) {
  payer.email = cliente.email.trim().toLowerCase();
}

// ============================================
// TELEFONE
// ============================================

if (cliente.telefone) {
  if ([10, 11].includes(telefoneLimpo.length)) {
    payer.phone = {
      area_code: telefoneLimpo.substring(0, 2),
      number: Number(telefoneLimpo.substring(2)),
    };
  }
}

// ============================================
// CPF
// ============================================

if (cliente.cpf) {
  const cpfLimpo = String(cliente.cpf).replace(/\D/g, "");

  if (cpfLimpo.length === 11) {
    payer.identification = {
      type: "CPF",
      number: cpfLimpo,
    };
  }
}

// ============================================
// ENDEREÇO
// ============================================

if (
  cliente.cep ||
  cliente.rua ||
  cliente.numero
) {
  payer.address = {
    zip_code: cliente.cep
      ? String(cliente.cep).replace(/\D/g, "")
      : undefined,

    street_name: cliente.rua || undefined,

    street_number: cliente.numero
      ? Number(cliente.numero)
      : undefined,
  };
}

  payer.date_created = cliente.created_at;
  payer.authentication_type = "Web Nativa";
  payer.is_first_purchase_online = !ultimaCompra;
  if (ultimaCompra?.pagamento_atualizado_em) {
    payer.last_purchase = ultimaCompra.pagamento_atualizado_em;
  }
    

    const preferenceBody: any = {
      items: [
        {
          id: String(reserva.espaco_id),

          title: reserva.spaces.nome_espaco
            ? `Reserva - ${reserva.spaces.nome_espaco}`
            : "Reserva de Espaço",

          description:
            `Reserva de ${reserva.spaces.nome_espaco || "espaço para evento"} ` +
            `para ${dataFormatada}.`,

          category_id: "services",

          quantity: 1,

          currency_id: "BRL",

          unit_price: Number(
            valorTotal.toFixed(2)
          ),
        },
      ],

      // ID oficial da reserva.
      // O webhook usa esse valor para localizar
      // a reserva depois que o pagamento acontecer.
      external_reference: String(reserva.id),

      // Nome exibido na fatura do cartão, quando suportado pela bandeira.
      statement_descriptor: "PLACYHUB",

      metadata: {
        reservaId: String(reserva.id),
        espacoId: String(reserva.espaco_id),
        valor: Number(valorTotal.toFixed(2)),
      },

      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
      },

      back_urls: {
        success:
          `${baseUrl}/locatario/reservas`,

        failure:
          `${baseUrl}/locatario/reservas`,

        pending:
          `${baseUrl}/locatario/reservas`,
      },

      notification_url:
        `${baseUrl}/api/webhook/mercadopago`,

      auto_return: "approved",

      expires: true,
      expiration_date_from: agora.toISOString(),
      expiration_date_to: new Date(agora.getTime() + TEMPO_RESERVA_MS).toISOString(),

      additional_info: `
        Reserva de espaço para evento.
        Espaço: ${reserva.spaces.nome_espaco || "Não informado"}.
        Data: ${dataFormatada}.
        Quantidade de pessoas: ${reserva.qtd_pessoas || "Não informada"}.
        Reserva: ${reserva.id}.
      `.trim(),
    };

    // ============================================
    // 11. ADICIONAR PAYER
    // ============================================

    if (Object.keys(payer).length > 0) {
      preferenceBody.payer = payer;
    }

    // ============================================
    // 12. LOG SEGURO
    // ============================================

    console.log(
      "========== CRIANDO PREFERÊNCIA =========="
    );

    console.log(
      JSON.stringify(
        {
          reservaId: reserva.id,
          clienteId: cliente.id,
          espacoId: reserva.espaco_id,
          valorTotal,
          valorBase,
          payer: {
            name: payer.name || "***",
            surname: payer.surname || "***",
            email: payer.email ? "***" : undefined,
          },
        },
        null,
        2
      )
    );

    console.log(
      "=========================================="
    );

console.log("========== DEVICE ID NO BACKEND ==========");
console.log("reservaId:", reserva.id);
console.log(
  "deviceId:",
  deviceId ? `${deviceId.substring(0, 25)}...` : "NÃO RECEBIDO"
);
console.log(
  "meliSessionId será enviado:",
  !!deviceId
);
console.log("===========================================");

    // ============================================
    // 13. CRIAR PREFERÊNCIA
    // ============================================

    const preference = new Preference(client);

    const result = await preference.create({
  body: preferenceBody,
  requestOptions: deviceId
    ? {
        meliSessionId: deviceId,
      }
    : undefined,
});

    console.log(
      "✅ Preferência criada:",
      result.id
    );

    // ============================================
    // 14. VALIDAR URL
    // ============================================

    if (!result.init_point) {
      console.error(
        "❌ Mercado Pago não retornou init_point."
      );

      return NextResponse.json(
        {
          error:
            "Mercado Pago não retornou a URL de pagamento.",
        },
        { status: 500 }
      );
    }

    const { error: preferenceUpdateError } = await supabaseAdmin
      .from("reservas")
      .update({
        pagamento_id: result.id,
        pagamento_status: "preference_created",
        pagamento_atualizado_em: agora.toISOString(),
      })
      .eq("id", reserva.id)
      .eq("user_id", authUser.id)
      .eq("status", "pendente");

    if (preferenceUpdateError) {
      console.error("Erro ao vincular preferência à reserva:", preferenceUpdateError);
      return NextResponse.json(
        { error: "Não foi possível vincular o pagamento à reserva." },
        { status: 500 }
      );
    }

    // ============================================
    // 15. RETORNAR PARA O FRONTEND
    // ============================================

    return NextResponse.json({
      success: true,
      url: result.init_point,
      preferenceId: result.id,
    });

  } catch (error: any) {
    console.error(
      "========== ERRO MERCADO PAGO =========="
    );

    console.error(
      "MESSAGE:",
      error?.message
    );

    console.error(
      "STATUS:",
      error?.status
    );

    console.error(
      "CAUSE:",
      error?.cause
    );

    console.error(
      "RESPONSE:",
      error?.response?.data
    );

    console.error(
      "======================================="
    );

    return NextResponse.json(
      {
        error:
          "Erro ao criar preferência de pagamento.",

        details:
          error?.message ||
          "Erro desconhecido.",

        status:
          error?.status || null,
      },
      {
        status: 500,
      }
    );
  }
};

