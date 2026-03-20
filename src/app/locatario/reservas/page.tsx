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
  data: string;
  dataOriginal: string;
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
  const [reservaSelecionada, setReservaSelecionada] = useState<Reserva | null>(null);

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

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Confirmada": return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30";
      case "Pendente": return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30";
      case "Cancelada": return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30";
      case "Finalizada": return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700";
      default: return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700";
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Minhas Reservas</h1>

      {reservas.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Você ainda não fez nenhuma reserva.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {reservas.map((reserva) => (
            <div
              key={reserva.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-md transition overflow-hidden flex flex-col"
            >
              {/* Imagem */}
              <div className="relative h-40 sm:h-48">
                <img
                  src={reserva.imagem}
                  alt={reserva.espaco}
                  className="w-full h-full object-cover"
                />
                {/* Badge de status mobile */}
                <div className="absolute top-2 right-2 sm:hidden">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(reserva.status)}`}>
                    {reserva.status}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col">
                {/* Título e status desktop */}
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-base md:text-lg font-semibold text-gray-800 dark:text-gray-100 line-clamp-2">
                    {reserva.espaco}
                  </h2>
                  <span className={`hidden sm:inline-block text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${getStatusColor(reserva.status)}`}>
                    {reserva.status}
                  </span>
                </div>

                {/* Informações */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-500 dark:text-gray-400 gap-2">
                    <CalendarDays size={16} className="flex-shrink-0" />
                    <span className="truncate">{reserva.data}</span>
                  </div>

                  <div className="flex items-center text-gray-500 dark:text-gray-400 gap-2">
                    <Clock size={16} className="flex-shrink-0" />
                    <span className="truncate">{reserva.hora}</span>
                  </div>

                  <div className="flex items-center text-gray-500 dark:text-gray-400 gap-2">
                    <MapPin size={16} className="flex-shrink-0" />
                    <span className="truncate">{reserva.local}</span>
                  </div>
                </div>

                {/* Valor */}
                <div className="mt-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Valor pago:{" "}
                    <span className="font-semibold text-sky-600 dark:text-sky-400">
                      R$ {reserva.valor.toFixed(2)}
                    </span>
                  </p>
                </div>

                {/* Ações */}
                <div className="flex flex-col sm:flex-row gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  {reserva.status === "Pendente" && (
                    <button
                      onClick={() => handleCancelarReserva(reserva.id)}
                      className="flex-1 flex items-center justify-center gap-2 
                        bg-red-100 hover:bg-red-200 text-red-600 
                        dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400
                        px-3 py-2.5 sm:py-2 rounded-xl text-sm font-semibold transition"
                    >
                      <XCircle size={16} />
                      <span>Cancelar</span>
                    </button>
                  )}

                  {reserva.status === "Finalizada" && !reserva.avaliada && (
                    <button
                      onClick={() => handleAvaliar(reserva)}
                      className="flex-1 flex items-center justify-center gap-2 
                        bg-yellow-100 hover:bg-yellow-200 text-yellow-700 
                        dark:bg-yellow-900/30 dark:hover:bg-yellow-900/50 dark:text-yellow-400
                        px-3 py-2.5 sm:py-2 rounded-xl text-sm font-semibold transition"
                    >
                      <Star size={16} />
                      <span>Avaliar</span>
                    </button>
                  )}

                  <button
                    onClick={() => abrirReportar(reserva)}
                    className="flex-1 flex items-center justify-center gap-2 
                      bg-red-100 hover:bg-red-200 text-red-600 
                      dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400
                      px-3 py-2.5 sm:py-2 rounded-xl text-sm font-semibold transition"
                  >
                    <AlertCircle size={16} />
                    <span>Reportar</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Avaliação */}
      <AvaliacaoModal
        isOpen={avaliacaoAberta}
        nomeEspaco={reservaSelecionada?.espaco || ""}
        onClose={() => {
          setAvaliacaoAberta(false);
          setReservaSelecionada(null);
        }}
        onSubmit={(nota, comentario) => {
          if (reservaSelecionada) {
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

      {/* Modal de Reportar Problema */}
      {reportarAberto && reservaSelecionadaReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 md:p-6 w-full max-w-md text-gray-900 dark:text-gray-100 max-h-[90vh] overflow-y-auto">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Reportar problema</h2>
              <button
                onClick={() => setReportarAberto(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
                aria-label="Fechar modal"
              >
                ✕
              </button>
            </div>

            {/* Informação da reserva */}
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl mb-4">
              <p className="text-sm font-medium mb-1">{reservaSelecionadaReport.espaco}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {reservaSelecionadaReport.data} • {reservaSelecionadaReport.hora}
              </p>
            </div>

            {/* Tipo de problema */}
            <div className="mb-4">
              <label className="text-sm font-medium mb-1 block">Tipo do problema</label>
              <select 
                className="w-full p-3 rounded-xl border text-sm
                  bg-white border-gray-300
                  dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100
                  focus:ring-2 focus:ring-sky-500 outline-none"
              >
                <option>Problema com o espaço</option>
                <option>Problema com pagamento</option>
                <option>Problema com o anfitrião</option>
                <option>Outro</option>
              </select>
            </div>

            {/* Descrição */}
            <div className="mb-4">
              <label className="text-sm font-medium mb-1 block">Descrição do problema</label>
              <textarea
                className="w-full p-3 rounded-xl border resize-none
                  bg-white border-gray-300
                  dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100
                  focus:ring-2 focus:ring-sky-500 outline-none"
                rows={4}
                placeholder="Descreva o problema detalhadamente (mínimo 10 caracteres)"
                value={descricaoProblema}
                onChange={(e) => setDescricaoProblema(e.target.value)}
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {descricaoProblema.length}/10 caracteres mínimos
              </p>
            </div>

            {/* Botão enviar */}
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
                  description: "Nossa equipe analisará sua solicitação em até 24h",
                });
              }}
              className={`w-full py-3 rounded-xl font-semibold transition ${
                descricaoProblema.trim().length < 10
                  ? "bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
                  : "bg-sky-500 hover:bg-sky-600 text-white"
              }`}
            >
              Enviar para suporte
            </button>

            <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-3">
              Nossa equipe analisará sua solicitação e entrará em contato
            </p>
          </div>
        </div>
      )}
    </div>
  );
}