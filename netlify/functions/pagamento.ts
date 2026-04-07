import MercadoPagoConfig, { Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_TOKEN!,
});

export const handler = async (event: any) => {
  try {
    const {
      total,
      espacoId,
      dataReserva,
      dataInicio,
      dataFim,
      plano,
      qtdPessoas,
      pacote,
      convidados,
    } = JSON.parse(event.body);

    const dataFinalReserva =
      dataReserva ||
      (dataInicio && dataFim
        ? `${dataInicio} até ${dataFim}`
        : null);

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
        dataReserva: dataFinalReserva,
        plano,
        qtdPessoas,
        pacote,
        convidados,
        valor: Number(total),
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/pagamento/finalizado?status=success`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL}/pagamento/finalizado?status=failure`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/pagamento/finalizado?status=pending`,
      },
    };

    const result = await preference.create({ body });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: result.init_point }),
    };
  } catch (err: any) {
    console.error("ERRO:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Erro ao criar pagamento",
        details: err.message,
      }),
    };
  }
};