// app/api/pagamento/route.ts
import { NextRequest, NextResponse } from "next/server";
import MercadoPagoConfig, { Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

console.log("MP_ACCESS_TOKEN existe?", !!process.env.MP_ACCESS_TOKEN);
console.log(
  "MP_ACCESS_TOKEN início:",
  process.env.MP_ACCESS_TOKEN?.substring(0, 20)
);
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

console.log("=================================");
console.log("TOKEN EXISTE?", !!process.env.MP_ACCESS_TOKEN);

console.log(
  "TOKEN:",
  process.env.MP_ACCESS_TOKEN?.substring(0, 25)
);

console.log("BASE URL:", process.env.NEXT_PUBLIC_BASE_URL);
console.log("=================================");

const result = await preference.create({ body });

console.log("RESULTADO MP:", result);

return NextResponse.json({ url: result.init_point });
} catch (err: any) {
  console.error("ERRO COMPLETO MP:");
  console.error(err);

  console.error("MESSAGE:", err?.message);
  console.error("STATUS:", err?.status);
  console.error("CAUSE:", err?.cause);
  console.error("RESPONSE:", err?.response?.data);

  return NextResponse.json(
    {
      error: "Erro ao criar preferência",
      details: err?.message || "Erro desconhecido",
      status: err?.status || null,
    },
    { status: 500 }
  );
}
};