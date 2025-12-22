import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ID do pagamento vindo no webhook
    const pagamentoId = body.data.id;

    // Buscar os dados completos do pagamento
    const pagamento = await fetch(
      `https://api.mercadopago.com/v1/payments/${pagamentoId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
        }
      }
    ).then((res) => res.json());

    // Ler metadata enviada na criação da preferência
    const meta = pagamento.metadata || {};

    // Montar a reserva completa
    const reservaConvertida = {
      id: pagamentoId,
      espacoId: meta.espacoId,
      dataReserva: meta.dataReserva,
      valor: meta.valor,
      status: pagamento.status // approved, pending etc
    };

    const filePath = path.join(process.cwd(), "public", "reservas.json");

    let lista = [];
    if (fs.existsSync(filePath)) {
      const file = fs.readFileSync(filePath, "utf8");
      lista = JSON.parse(file);
    }

    lista.push(reservaConvertida);

    fs.writeFileSync(filePath, JSON.stringify(lista, null, 2));

    return Response.json({ status: "ok" });

  } catch (e) {
    console.error("Erro no webhook:", e);
    return new Response("Erro", { status: 500 });
  }
}
