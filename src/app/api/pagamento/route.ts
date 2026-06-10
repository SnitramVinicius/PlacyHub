// app/api/pagamento/route.ts
import { NextRequest, NextResponse } from "next/server";
import MercadoPagoConfig, { Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export const POST = async (req: NextRequest) => {
  try {
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
      reservaId, // 🔥 ADICIONAR reservaId
    } = await req.json();

    if (!total || isNaN(Number(total))) {
      return NextResponse.json(
        { error: "Valor inválido recebido.", details: total },
        { status: 400 }
      );
    }

    // 🔥 SE NÃO TIVER reservaId, NÃO CRIA PAGAMENTO
    if (!reservaId) {
      return NextResponse.json(
        { error: "ID da reserva não informado" },
        { status: 400 }
      );
    }

    const preference = new Preference(client);

    const dataFinalReserva =
      dataReserva ||
      (dataInicio && dataFim
        ? `${dataInicio} até ${dataFim}`
        : null);

    const body = {
      items: [
        {
          id: espacoId || "reserva_espaco",
          title: nomeEspaco ? `Reserva - ${nomeEspaco}` : "Reserva de Espaço",
          quantity: 1,
          unit_price: Number(total),
        },
      ],
      metadata: {
        espacoId,
        dataReserva: dataFinalReserva,
        plano,
        qtdPessoas,
        pacote,
        convidados,
        valor: Number(total),
        reservaId, // 🔥 ADICIONAR reservaId no metadata
      },
      // 🔥 ADICIONAR external_reference (obrigatório para o webhook)
      external_reference: reservaId,
      back_urls: {
  success: `${process.env.NEXT_PUBLIC_BASE_URL}/locatario/reservas`,
  failure: `${process.env.NEXT_PUBLIC_BASE_URL}/locatario/reservas`,
  pending: `${process.env.NEXT_PUBLIC_BASE_URL}/locatario/reservas`,
},
      notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook/mercadopago`,
       auto_return: "approved",
    };

console.log("BODY ENVIADO:", JSON.stringify(body, null, 2));

const result = await preference.create({ body });

console.log("RESULTADO MP:", result);

return NextResponse.json({ url: result.init_point });
  } catch (err: any) {
    console.error("ERRO MERCADO PAGO:", JSON.stringify(err, null, 2));
    return NextResponse.json(
      {
        error: "Erro ao criar preferência",
        details: err.message || err,
      },
      { status: 500 }
    );
  }
};