import { NextRequest, NextResponse } from "next/server";
import MercadoPagoConfig, { Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_TOKEN!,
});

export const POST = async (req: NextRequest) => {
  try {
    const {
      total,
      espacoId,
      dataReserva,
      hora,
      plano,
      qtdPessoas,
    } = await req.json();

    if (!total || isNaN(Number(total))) {
      return NextResponse.json(
        { error: "Valor inválido recebido.", details: total },
        { status: 400 }
      );
    }

    const preference = new Preference(client);

    const body = {
      items: [
        {
          id: espacoId || "reserva_espaco",
          title: "Reserva de Espaço",
          quantity: 1,
          unit_price: Number(total),
        },
      ],

      metadata: {
        espacoId,
        dataReserva,
        hora,
        plano,
        qtdPessoas,
        valor: Number(total),
      },

      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/pagamento/finalizado?status=success`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL}/pagamento/finalizado?status=failure`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/pagamento/finalizado?status=pending`,
      },
    };

    const result = await preference.create({ body });

    return NextResponse.json({ url: result.init_point });
  } catch (err: any) {
    console.error("ERRO MERCADO PAGO:", err);
    return NextResponse.json(
      {
        error: "Erro ao criar preferência",
        details: err.message || err,
      },
      { status: 500 }
    );
  }
};
