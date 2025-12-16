"use client";

import { useState, useEffect } from "react";
import { CalendarDays, Clock, MapPin, Star, XCircle } from "lucide-react";
import { ESPACOS } from "@/data/espacos";
import AvaliacaoModal from "@/components/AvaliacaoModal";
import { toast } from "sonner";

interface Reserva {
  id: string;
  espaco: string;
  imagem: string;
  data: string;            // data formatada (exibição)
  dataOriginal: string;    // data real (comparação)
  hora: string;
  local: string;
  valor: number;
  status: "Confirmada" | "Pendente" | "Cancelada" | "Finalizada";
  avaliada?: boolean;
}

export default function ReservasPage() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [avaliacaoAberta, setAvaliacaoAberta] = useState(false);
const [reservaSelecionada, setReservaSelecionada] =
  useState<Reserva | null>(null);

  useEffect(() => {
    async function carregarReservas() {
      try {
        const res = await fetch("/reservas.json");
        const json = await res.json();

        const hoje = new Date();
const convertido: Reserva[] = json.map((r: any, index: number) => {
  const espacoInfo = ESPACOS.find((e) => e.id === r.espacoId);

  const dataEventoStr =
    r.dataEvento || r.dataReserva || r.data || null;

  const dataEvento = dataEventoStr
    ? new Date(dataEventoStr)
    : null;

  const valorPago =
    r.valorPago ?? r.valor ?? r.preco ?? 0;

  const hoje = new Date();

  let status: Reserva["status"] = "Pendente";

  if (Number(valorPago) > 0) {
    status =
      dataEvento && dataEvento < hoje
        ? "Finalizada"
        : "Confirmada";
  }

  return {
    id: r.id || `res-${index}`,

    espaco: espacoInfo?.nome || "Espaço não encontrado",
    imagem: espacoInfo?.imagem || "/default.jpg",

    data: dataEvento
      ? dataEvento.toLocaleDateString("pt-BR")
      : "—",

    dataOriginal: dataEventoStr ?? "",

    hora:
      r.horaInicio && r.horaFim
        ? `${r.horaInicio} às ${r.horaFim}`
        : "—",

    local: espacoInfo
      ? `${espacoInfo.cidade}, ${espacoInfo.estado} - ${espacoInfo.bairro}`
      : "—",

    valor: Number(valorPago),

    status,
    avaliada: Boolean(r.avaliada),
  };
});

        setReservas(convertido);
      } catch (err) {
        console.error("Erro ao carregar reservas:", err);
      }
    }

    carregarReservas();
  }, []);

  function handleCancelarReserva(id: string) {
    setReservas((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "Cancelada" } : r
      )
    );
  }

 function handleAvaliar(reserva: Reserva) {
  setReservaSelecionada(reserva);
  setAvaliacaoAberta(true);
}

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Minhas Reservas</h1>

      {reservas.length === 0 ? (
        <p className="text-gray-600">Você ainda não fez nenhuma reserva.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservas.map((reserva) => (
            <div
              key={reserva.id}
              className="bg-white rounded-2xl shadow hover:shadow-md transition overflow-hidden"
            >
              <img
                src={reserva.imagem}
                alt={reserva.espaco}
                className="w-full h-40 object-cover"
              />

              <div className="p-4 space-y-2">
                <h2 className="text-lg font-semibold text-gray-800">
                  {reserva.espaco}
                </h2>

                <div className="flex items-center text-gray-500 text-sm gap-2">
                  <CalendarDays size={16} />
                  {reserva.data}
                </div>

                <div className="flex items-center text-gray-500 text-sm gap-2">
                  <Clock size={16} />
                  {reserva.hora}
                </div>

                <div className="flex items-center text-gray-500 text-sm gap-2">
                  <MapPin size={16} />
                  {reserva.local}
                </div>

                <p className="text-gray-700 mt-2">
                  Valor pago:{" "}
                  <span className="font-semibold text-sky-600">
                    R$ {reserva.valor.toFixed(2)}
                  </span>
                </p>

                <p
                  className={`text-sm font-medium mt-2 ${
                    reserva.status === "Confirmada"
                      ? "text-green-600"
                      : reserva.status === "Pendente"
                      ? "text-yellow-600"
                      : reserva.status === "Cancelada"
                      ? "text-red-600"
                      : "text-gray-500"
                  }`}
                >
                  {reserva.status}
                </p>

                <div className="flex gap-2 mt-4">
                  {reserva.status === "Pendente" && (
                    <button
                      onClick={() => handleCancelarReserva(reserva.id)}
                      className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-600 px-3 py-2 rounded-xl text-sm font-semibold transition"
                    >
                      <XCircle size={16} /> Cancelar
                    </button>
                  )}

              {reserva.status === "Finalizada" && !reserva.avaliada && (
  <button
    onClick={() => handleAvaliar(reserva)}
    className="flex items-center gap-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-2 rounded-xl text-sm font-semibold transition"
  >
    <Star size={16} /> Avaliar
  </button>
)}

                  {reserva.avaliada && (
                    <span className="text-sm text-green-600 font-semibold">
                      Avaliação enviada ✔
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <AvaliacaoModal
  isOpen={avaliacaoAberta}
  nomeEspaco={reservaSelecionada?.espaco || ""}
  onClose={() => {
    setAvaliacaoAberta(false);
    setReservaSelecionada(null);
  }}
  onSubmit={(nota, comentario) => {
    setReservas((prev) =>
      prev.map((r) =>
        r.id === reservaSelecionada?.id
          ? { ...r, avaliada: true }
          : r
      )
    );

    console.log("Avaliação enviada:", {
      reservaId: reservaSelecionada?.id,
      nota,
      comentario,
    });

    setAvaliacaoAberta(false);
    setReservaSelecionada(null);
    toast.success("Avaliação enviada", {
  description: "Obrigado por compartilhar sua experiência",
});

  }}
/>

    </div>
  );
}
