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
      dataReserva,   // <- adicione isso no frontend
      hora,          // <- se quiser
      plano,         // opcional
      qtdPessoas,    // opcional
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
          title: `Reserva espaço ${espacoId}`,
          quantity: 1,
          unit_price: Number(total),
        },
      ],

      // 🔥 ESSENCIAL: agora o webhook vai receber os dados completos da reserva!
      metadata: {
        espacoId,
        dataReserva,
        hora,
        plano,
        qtdPessoas,
        valor: total,
      },

      back_urls: {
        success: "http://localhost:3000/pagamento/finalizado?status=success",
        failure: "http://localhost:3000/pagamento/finalizado?status=failure",
        pending: "http://localhost:3000/pagamento/finalizado?status=pending",
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
