"use client";

/* ======================= 
TELA DE RESERVAS DO ESPAÇO:
NOME DO CLIENTE, DATA, PAGAMENTO, AVALIAÇÃO E DETALHES DA RESERVA
======================= */

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { CalendarDays, Loader2, Info, X, ArrowLeft, Star } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Avaliacao {
  nota: number;
  comentario: string;
  data?: string;
}

interface Reserva {
  id: string;
  user_id: string;
  cliente: string;
  telefone?: string;
  email?: string;
  data_inicio: string;
  data_fim: string;
  status: "pendente" | "confirmada" | "cancelada" | "finalizada" | "reagendamento_proposto";
  valor_total: number;
  pagamento_status?: string;
  qtd_pessoas?: number;
  observacoes?: string;
  created_at?: string;
  avaliacao?: Avaliacao;
}

export default function ReservasEspaco() {
  const { id } = useParams();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [reservaSelecionada, setReservaSelecionada] = useState<Reserva | null>(null);

  useEffect(() => {
    const buscarReservas = async () => {
      if (!id) return;
      
      setLoading(true);
      
      try {
        // Buscar reservas do espaço específico
        const { data: reservasData, error: reservasError } = await supabase
          .from("reservas")
          .select("*")
          .eq("espaco_id", id)
          .in("status", ["finalizada", "confirmada", "cancelada", "reagendamento_proposto"])
          .order("data_inicio", { ascending: false });

        if (reservasError) throw reservasError;

        if (!reservasData || reservasData.length === 0) {
          setReservas([]);
          setLoading(false);
          return;
        }

        // Buscar dados dos clientes (users)
        const userIds = [...new Set(reservasData.map(r => r.user_id))];
        const { data: usersData, error: usersError } = await supabase
          .from("users")
          .select("id, name, telefone, email")
          .in("id", userIds);

        if (usersError) throw usersError;

        const usersMap = new Map();
        usersData?.forEach(user => {
          usersMap.set(user.id, user);
        });

        // Buscar avaliações para estas reservas
        const reservaIds = reservasData.map(r => r.id);
        const { data: avaliacoesData, error: avaliacoesError } = await supabase
          .from("avaliacoes")
          .select("*")
          .in("reserva_id", reservaIds)
          .eq("tipo", "cliente_para_anfitriao");

        if (avaliacoesError) throw avaliacoesError;

        const avaliacoesMap = new Map();
        avaliacoesData?.forEach(avaliacao => {
          avaliacoesMap.set(avaliacao.reserva_id, avaliacao);
        });

        // Formatar reservas com dados do cliente e avaliação
        const reservasFormatadas: Reserva[] = reservasData.map(reserva => {
          const user = usersMap.get(reserva.user_id);
          const avaliacao = avaliacoesMap.get(reserva.id);
          
          return {
            id: reserva.id,
            user_id: reserva.user_id,
            cliente: user?.name || "Cliente não identificado",
            telefone: user?.telefone || "(00) 00000-0000",
            email: user?.email || "Email não informado",
            data_inicio: reserva.data_inicio,
            data_fim: reserva.data_fim,
            status: reserva.status,
            valor_total: reserva.valor_total || 0,
            pagamento_status: reserva.pagamento_status,
            qtd_pessoas: reserva.qtd_pessoas,
            observacoes: reserva.observacoes,
            created_at: reserva.created_at,
            avaliacao: avaliacao ? {
              nota: avaliacao.nota,
              comentario: avaliacao.comentario || "",
              data: avaliacao.created_at,
            } : undefined,
          };
        });

        setReservas(reservasFormatadas);
      } catch (error) {
        console.error("Erro ao buscar reservas:", error);
        toast.error("Erro ao carregar reservas");
      } finally {
        setLoading(false);
      }
    };

    buscarReservas();
  }, [id]);

  const formatarData = (dataStr: string) => {
    if (!dataStr) return "";
    const [ano, mes, dia] = dataStr.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const formatarPreco = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

const getStatusColor = (status: string, dataInicio: string) => {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const [ano, mes, dia] = dataInicio.split("-");
  const dataEvento = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
  dataEvento.setHours(0, 0, 0, 0);
  const eventoJaPassou = hoje > dataEvento;
  
  // Se for confirmada mas a data já passou, mostra como finalizada (verde)
  if (status === "confirmada" && eventoJaPassou) {
    return "text-green-600 bg-green-100 dark:bg-green-900/30";
  }
  
  switch (status) {
    case "finalizada":
      return "text-green-600 bg-green-100 dark:bg-green-900/30";
    case "confirmada":
      return "text-blue-600 bg-blue-100 dark:bg-blue-900/30";
    case "cancelada":
      return "text-red-600 bg-red-100 dark:bg-red-900/30";
    case "reagendamento_proposto":
      return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
    default:
      return "text-gray-600 bg-gray-100 dark:bg-gray-700";
  }
};

const getStatusTexto = (status: string, dataInicio: string) => {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const [ano, mes, dia] = dataInicio.split("-");
  const dataEvento = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
  dataEvento.setHours(0, 0, 0, 0);
  const eventoJaPassou = hoje > dataEvento;
  
  // Se for confirmada mas a data já passou, mostra como "Finalizada"
  if (status === "confirmada" && eventoJaPassou) {
    return "Finalizada";
  }
  
  switch (status) {
    case "finalizada":
      return "Finalizada";
    case "confirmada":
      return "Confirmada";
    case "cancelada":
      return "Cancelada";
    case "reagendamento_proposto":
      return "Reagendamento solicitado";
    default:
      return status;
  }
};

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Carregando reservas...
      </div>
    );
  }

  // Filtrar apenas finalizadas para exibir (ou mostrar todas)
  const reservasFinalizadas = reservas.filter(
    (reserva) => reserva.status === "finalizada"
  );

  return (
    <div className="p-4 md:p-6">
      {/* Cabeçalho com voltar */}
      <div className="mb-6">
        <Link
          href="/anfitriao/espacos"
          className="inline-flex items-center gap-1 text-sky-500 hover:text-sky-600 transition mb-4"
        >
          <ArrowLeft size={18} /> Voltar
        </Link>

        <div className="flex items-center gap-2">
          <CalendarDays size={24} className="text-sky-500" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">
            Histórico de Reservas
          </h2>
        </div>
      </div>

     {reservas.length === 0 ? (
  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
    Nenhuma reserva encontrada para este espaço.
  </p>
) : (
  <div className="space-y-4">
    {reservas.map((reserva) => (
      <div
        key={reserva.id}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 md:p-5 rounded-xl hover:shadow-md transition"
      >
        {/* Cabeçalho do card */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-base md:text-lg">
                {reserva.cliente}
              </h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(reserva.status, reserva.data_inicio)}`}>
  {getStatusTexto(reserva.status, reserva.data_inicio)}
</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-sm">
              <span className="text-gray-600 dark:text-gray-300">
                📅 {formatarData(reserva.data_inicio)} → {formatarData(reserva.data_fim)}
              </span>
              {reserva.pagamento_status && (
                <span className="text-gray-500 dark:text-gray-400">
                  💳 {reserva.pagamento_status === "approved" ? "Pago" : reserva.pagamento_status}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
            <p className="font-bold text-sky-600 dark:text-sky-400 text-lg">
              {formatarPreco(reserva.valor_total)}
            </p>
          </div>
        </div>

        {/* Qtd de pessoas */}
        {reserva.qtd_pessoas && (
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            👥 {reserva.qtd_pessoas} pessoas
          </div>
        )}

        {/* Avaliação */}
        {reserva.avaliacao && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold text-sm">
                  {reserva.cliente[0]}
                </div>
                <div>
                  <span className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                    {reserva.cliente}
                  </span>
                  {reserva.avaliacao.data && (
                    <span className="text-xs text-gray-400 dark:text-gray-500 block sm:inline sm:ml-2">
                      {formatarData(reserva.avaliacao.data.split("T")[0])}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-1 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < reserva.avaliacao!.nota 
                    ? "text-yellow-500 fill-yellow-500" 
                    : "text-gray-300 dark:text-gray-600"
                  }
                />
              ))}
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                ({reserva.avaliacao.nota}/5)
              </span>
            </div>

            <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">
              {reserva.avaliacao.comentario}
            </p>
          </div>
        )}

        {/* Botão de detalhes */}
        <div className="flex justify-end mt-3">
          <button
            onClick={() => setReservaSelecionada(reserva)}
            className="flex items-center gap-1 text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 font-medium text-sm px-3 py-2 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-900/20 transition"
          >
            <Info size={16} /> Ver detalhes
          </button>
        </div>
      </div>
    ))}
  </div>
)}
      {/* Modal de Detalhes */}
      {reservaSelecionada && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-5 md:p-6 w-full max-w-md relative animate-fade-in max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setReservaSelecionada(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Detalhes da Reserva
            </h3>

            <div className="space-y-3 text-gray-700 dark:text-gray-300 text-sm">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {reservaSelecionada.cliente}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <p>
                  <b>Período:</b>{" "}
                  {formatarData(reservaSelecionada.data_inicio)} →{" "}
                  {formatarData(reservaSelecionada.data_fim)}
                </p>
                <p>
                  <b>Valor:</b> {formatarPreco(reservaSelecionada.valor_total)}
                </p>
                <p><b>Status:</b> {getStatusTexto(reservaSelecionada.status, reservaSelecionada.data_inicio)}</p>
                <p>
                  <b>Pagamento:</b> {reservaSelecionada.pagamento_status === "approved" ? "Aprovado" : reservaSelecionada.pagamento_status || "Pendente"}
                </p>
                {reservaSelecionada.qtd_pessoas && (
                  <p><b>Convidados:</b> {reservaSelecionada.qtd_pessoas} pessoas</p>
                )}
                <p>
                  <b>Telefone:</b> {reservaSelecionada.telefone}
                </p>
                <p>
                  <b>E-mail:</b> {reservaSelecionada.email}
                </p>
                <p>
                  <b>Observações:</b>{" "}
                  {reservaSelecionada.observacoes || "Nenhuma observação."}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setReservaSelecionada(null)}
                className="w-full sm:w-auto bg-sky-600 text-white px-6 py-3 sm:py-2 rounded-xl font-medium hover:bg-sky-700 transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}