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

import { NextRequest, NextResponse } from "next/server";
import MercadoPagoConfig, { Preference } from "mercadopago";

const accessToken = process.env.MP_ACCESS_TOKEN;

if (!accessToken) {
  throw new Error("MP_ACCESS_TOKEN não configurado.");
}

const client = new MercadoPagoConfig({
  accessToken,
});

export const POST = async (req: NextRequest) => {
  try {
    const bodyRequest = await req.json();

    const {
      total,
      espacoId,
      nomeEspaco,
      dataReserva,
      dataInicio,
      dataFim,
      plano,
      qtdPessoas,
      pacote,
      convidados,
      reservaId,

      // Dados reais do cliente, caso já estejam disponíveis
      clienteNome,
      clienteSobrenome,
      clienteEmail,
      clienteTelefone,
      clienteCpf,
      clienteCep,
      clienteRua,
      clienteNumero,
    } = bodyRequest;

    // ============================================
    // VALIDAÇÕES
    // ============================================

    const valorTotal = Number(total);

    if (!Number.isFinite(valorTotal) || valorTotal <= 0) {
      return NextResponse.json(
        {
          error: "Valor inválido recebido.",
          details: total,
        },
        { status: 400 }
      );
    }

    if (!espacoId) {
      return NextResponse.json(
        {
          error: "ID do espaço não informado.",
        },
        { status: 400 }
      );
    }

    if (!reservaId) {
      return NextResponse.json(
        {
          error: "ID da reserva não informado.",
        },
        { status: 400 }
      );
    }

    // ============================================
    // DATA DA RESERVA
    // ============================================

    const dataFinalReserva =
      dataReserva ||
      (dataInicio && dataFim
        ? `${dataInicio} até ${dataFim}`
        : null);

    // ============================================
    // INFORMAÇÕES DO COMPRADOR
    // ============================================

    const payer: any = {};

    if (clienteNome) {
      payer.name = clienteNome;
    }

    if (clienteSobrenome) {
      payer.surname = clienteSobrenome;
    }

    if (clienteEmail) {
      payer.email = clienteEmail;
    }

    if (clienteTelefone) {
      const telefoneLimpo = String(clienteTelefone).replace(/\D/g, "");

      if (telefoneLimpo.length >= 10) {
        payer.phone = {
          area_code: telefoneLimpo.substring(0, 2),
          number: Number(telefoneLimpo.substring(2)),
        };
      }
    }

    if (clienteCpf) {
      const cpfLimpo = String(clienteCpf).replace(/\D/g, "");

      if (cpfLimpo.length === 11) {
        payer.identification = {
          type: "CPF",
          number: cpfLimpo,
        };
      }
    }

    if (clienteCep || clienteRua || clienteNumero) {
      payer.address = {
        zip_code: clienteCep
          ? String(clienteCep).replace(/\D/g, "")
          : undefined,

        street_name: clienteRua || undefined,

        street_number: clienteNumero
          ? Number(clienteNumero)
          : undefined,
      };
    }

    // ============================================
    // PREFERÊNCIA MERCADO PAGO
    // ============================================

    const preferenceBody: any = {
      items: [
        {
          id: String(espacoId),

          title: nomeEspaco
            ? `Reserva - ${nomeEspaco}`
            : "Reserva de Espaço",

          description:
            "Reserva de espaço para evento através da PlacyHub.",

          category_id: "services",

          quantity: 1,

          currency_id: "BRL",

          unit_price: Number(valorTotal.toFixed(2)),
        },
      ],

      external_reference: String(reservaId),

      metadata: {
        espacoId: String(espacoId),

        reservaId: String(reservaId),

        dataReserva: dataFinalReserva,

        plano: plano ?? null,

        qtdPessoas: qtdPessoas ?? null,

        pacote: pacote ?? null,

        convidados: convidados ?? null,

        valor: Number(valorTotal.toFixed(2)),
      },

      payment_methods: {
        // Não estamos bloqueando nenhum método.
        excluded_payment_methods: [],
        excluded_payment_types: [],
      },

      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/locatario/reservas`,

        failure: `${process.env.NEXT_PUBLIC_BASE_URL}/locatario/reservas`,

        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/locatario/reservas`,
      },

      notification_url:
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook/mercadopago`,

      auto_return: "approved",

      additional_info: `
        Reserva de espaço para evento.
        Espaço: ${nomeEspaco || "Não informado"}.
        Data: ${dataFinalReserva || "Não informada"}.
        Quantidade de pessoas: ${qtdPessoas || "Não informada"}.
        Reserva: ${reservaId}.
      `.trim(),
    };

    // Só adiciona payer quando realmente temos dados.
    // Não enviamos informações falsas.
    if (Object.keys(payer).length > 0) {
      preferenceBody.payer = payer;
    }

    // ============================================
    // LOG
    // ============================================

    console.log("========== PREFERÊNCIA MERCADO PAGO ==========");

    console.log(
      JSON.stringify(
        {
          ...preferenceBody,

          // Não exibir CPF/telefone/email completos no log.
          payer: payer
            ? {
                ...payer,

                email: payer.email
                  ? "***"
                  : undefined,

                identification: payer.identification
                  ? {
                      type: payer.identification.type,
                      number: "***",
                    }
                  : undefined,

                phone: payer.phone
                  ? {
                      area_code: payer.phone.area_code,
                      number: "***",
                    }
                  : undefined,
              }
            : undefined,
        },
        null,
        2
      )
    );

    console.log("==============================================");

    // ============================================
    // CRIAR PREFERÊNCIA
    // ============================================

    const preference = new Preference(client);

    const result = await preference.create({
      body: preferenceBody,
    });

    console.log("Preferência criada com sucesso.");
    console.log("Preference ID:", result.id);
    console.log("Init Point:", result.init_point);

    console.log(
      "Meios de pagamento:",
      JSON.stringify(result.payment_methods, null, 2)
    );

    // ============================================
    // RESPOSTA
    // ============================================

    if (!result.init_point) {
      console.error(
        "Mercado Pago não retornou init_point."
      );

      return NextResponse.json(
        {
          error: "Mercado Pago não retornou a URL de pagamento.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,

      url: result.init_point,

      preferenceId: result.id,
    });

  } catch (err: any) {
    console.error("========== ERRO MERCADO PAGO ==========");

    console.error("MESSAGE:", err?.message);

    console.error("STATUS:", err?.status);

    console.error("CAUSE:", err?.cause);

    console.error(
      "RESPONSE:",
      err?.response?.data
    );

    console.error("======================================");

    return NextResponse.json(
      {
        error: "Erro ao criar preferência de pagamento.",

        details:
          err?.message ||
          "Erro desconhecido.",

        status:
          err?.status ||
          null,
      },
      {
        status: 500,
      }
    );
  }
};