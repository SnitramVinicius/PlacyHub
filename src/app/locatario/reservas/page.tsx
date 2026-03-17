"use client";

import { useState, useEffect } from "react";
import { CalendarDays, Clock, MapPin, Star, XCircle, AlertCircle } from "lucide-react";
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
const [reportarAberto, setReportarAberto] = useState(false);
const [reservaSelecionadaReport, setReservaSelecionadaReport] = useState<Reserva | null>(null);
const [descricaoProblema, setDescricaoProblema] = useState("");

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

  const dataEventoStr = r.dataEvento || r.dataReserva || r.data || null;
  const dataEvento = dataEventoStr ? new Date(dataEventoStr) : null;
  const valorPago = r.valorPago ?? r.valor ?? r.preco ?? 0;
  const hoje = new Date();

  let status: Reserva["status"] = "Pendente";
  if (Number(valorPago) > 0) {
    status = dataEvento && dataEvento < hoje ? "Finalizada" : "Confirmada";
  }

  // 👇 SOLUÇÃO: usar 'as any' para acessar as propriedades
  const espacoAny = espacoInfo as any;
  const cidade = espacoAny?.cidade || "Cidade não encontrada";
  const estado = espacoAny?.estado || "Estado não encontrado";
  const bairro = espacoAny?.bairro || "Bairro não encontrado";

  return {
    id: r.id || `res-${index}`,
    espaco: espacoInfo?.nome || "Espaço não encontrado",
    imagem: espacoInfo?.imagem || "/default.jpg",
    data: dataEvento ? dataEvento.toLocaleDateString("pt-BR") : "—",
    dataOriginal: dataEventoStr || "",
    hora: r.horaInicio && r.horaFim ? `${r.horaInicio} às ${r.horaFim}` : "—",
    local: `${cidade}, ${estado} - ${bairro}`,
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

function abrirReportar(reserva: Reserva) {
  setReservaSelecionadaReport(reserva);
  setDescricaoProblema("");
  setReportarAberto(true);
}

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-6">Minhas Reservas</h1>

      {reservas.length === 0 ? (
        <p className="text-gray-600">Você ainda não fez nenhuma reserva.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservas.map((reserva) => (
            <div
              key={reserva.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-md transition overflow-hidden"
            >
              <img
                src={reserva.imagem}
                alt={reserva.espaco}
                className="w-full h-40 object-cover"
              />

              <div className="p-4 space-y-2">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {reserva.espaco}
                </h2>

                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm gap-2">
                  <CalendarDays size={16} />
                  {reserva.data}
                </div>

                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm gap-2">
                  <Clock size={16} />
                  {reserva.hora}
                </div>

                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm gap-2">
                  <MapPin size={16} />
                  {reserva.local}
                </div>

                <p className="text-gray-700 dark:text-gray-300 mt-2">
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
                      className="flex items-center gap-2 
bg-red-100 hover:bg-red-200 text-red-600 
dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400
px-3 py-2 rounded-xl text-sm font-semibold transition"
                    >
                      <XCircle size={16} /> Cancelar
                    </button>
                  )}

            {reserva.status === "Finalizada" && !reserva.avaliada && (
  <button
    onClick={() => handleAvaliar(reserva)}
    className="flex items-center gap-2 
bg-yellow-100 hover:bg-yellow-200 text-yellow-700 
dark:bg-yellow-900/30 dark:hover:bg-yellow-900/50 dark:text-yellow-400
px-3 py-2 rounded-xl text-sm font-semibold transition"
  >
    <Star size={16} /> Avaliar espaço
  </button>
)}


                  <button
  onClick={() => abrirReportar(reserva)}
  className="flex items-center gap-2 
bg-red-100 hover:bg-red-200 text-red-600 
dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400
px-3 py-2 rounded-xl text-sm font-semibold transition"
>
  <AlertCircle size={16} /> Reportar problema
</button>
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
    if (reservaSelecionada) {
      // Marca como avaliada
      setReservas(prev =>
        prev.map(r =>
          r.id === reservaSelecionada.id ? { ...r, avaliada: true } : r
        )
      );
    }

    setAvaliacaoAberta(false);
    setReservaSelecionada(null);

    toast.success("Avaliação enviada", {
      description: "Obrigado por compartilhar sua experiência",
    });
  }}
/>

{reportarAberto && reservaSelecionadaReport && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md text-gray-900 dark:text-gray-100">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Reportar problema</h2>
        <button
          onClick={() => setReportarAberto(false)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
          aria-label="Fechar modal"
        >
          ✕
        </button>
      </div>

      {/* Tipo de problema */}
      <select className="w-full p-2 border rounded-md mb-3 text-sm 
bg-white border-gray-300
dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
        <option>Problema com espaço</option>
        <option>Pagamento</option>
        <option>Outro</option>
      </select>

      {/* Descrição */}
      <textarea
        className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"
        rows={4}
        placeholder="Descreva o problema (mínimo 10 caracteres)"
        value={descricaoProblema}
        onChange={(e) => setDescricaoProblema(e.target.value)}
      />

      {/* Botão enviar */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          disabled={descricaoProblema.trim().length < 10}
          onClick={() => {
            if (descricaoProblema.trim().length < 10) return;

            console.log("Problema enviado:", {
              reservaId: reservaSelecionadaReport.id,
              descricao: descricaoProblema,
            });

            setReportarAberto(false);
            setDescricaoProblema("");

            toast.success("Problema enviado ao suporte", {
              description: "Nossa equipe analisará sua solicitação",
            });
          }}
          className={`w-full mt-4 py-3 rounded-xl font-semibold transition ${
            descricaoProblema.trim().length < 10
              ? "bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
              : "bg-sky-500 hover:bg-sky-600 text-white"
          }`}
        >
          Enviar para suporte
        </button>
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
        Nossa equipe analisará sua solicitação
      </p>
    </div>
  </div>
)}
    </div>
  );
}
