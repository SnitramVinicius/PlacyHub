"use client";
/* ======================= 

TELA DE RESERVAS DO ESPAÇO:
NOME DO CLIENTE, DATA, PAGAMENTO, AVALIAÇÃO E DETALHES DA RESERVA

 ======================= */

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { CalendarDays, Loader2, Info, X } from "lucide-react";
import { ArrowLeft, Star } from "lucide-react";
import Link from "next/link";

interface Avaliacao {
  nota: number;
  comentario: string;
  data?: string;
}

interface Reserva {
  id: string;
  cliente: string;
  dataInicio: string;
  dataFim: string;
  status: "pendente" | "confirmada" | "cancelada" | "finalizada";
  valor: number;
  metodoPagamento: string;
  observacoes?: string;
  telefone?: string;
  email?: string;
  avaliacao?: Avaliacao;
}

export default function ReservasEspaco() {
  const { id } = useParams();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [reservaSelecionada, setReservaSelecionada] = useState<Reserva | null>(
    null
  );

  useEffect(() => {
    setTimeout(() => {
      setReservas([
        {
          id: "1",
          cliente: "João Silva",
          dataInicio: "2025-11-20",
          dataFim: "2025-11-22",
          status: "finalizada",
          valor: 1200,
          metodoPagamento: "Pix",
          telefone: "(67) 99999-1234",
          email: "joaosilva@email.com",
          observacoes: "Quer chegar uma hora antes para decorar o local.",
          avaliacao: {
            nota: 5,
            comentario: "O espaço elimpo e bem organizado",
            data: "2025-10-07",
          },
        },
        {
          id: "2",
          cliente: "Maria Souza",
          dataInicio: "2025-11-10",
          dataFim: "2025-11-11",
          status: "finalizada",
          valor: 450,
          metodoPagamento: "Cartão de crédito",
          telefone: "(67) 98888-6543",
          email: "maria@email.com",
          observacoes: "Levar 2 mesas extras para buffet.",
          avaliacao: {
            nota: 4,
            comentario: "O espaço estava incrível! Super recomendo.",
            data: "2025-10-07",
          },
        },
        {
          id: "3",
          cliente: "Lucas Pereira",
          dataInicio: "2025-10-05",
          dataFim: "2025-10-06",
          status: "finalizada",
          valor: 900,
          metodoPagamento: "Pix",
          telefone: "(67) 97777-1122",
          email: "lucasp@email.com",
          observacoes: "Evento corporativo, cerca de 80 pessoas.",
          avaliacao: {
            nota: 5,
            comentario: "O espaço estava incrível! Super recomendo.",
            data: "2025-10-07",
          },
        },
      ]);
      setLoading(false);
    }, 800);
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Carregando reservas...
      </div>
    );
  }

  const reservasFinalizadas = reservas.filter(
    (reserva) => reserva.status === "finalizada"
  );

  const formatarData = (dataStr: string) => {
    return new Date(dataStr).toLocaleDateString("pt-BR");
  };

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
            Reservas do Espaço
          </h2>
        </div>
      </div>

      {reservasFinalizadas.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          Nenhuma reserva encontrada.
        </p>
      ) : (
        <div className="space-y-4">
          {reservasFinalizadas.map((reserva) => (
            <div
              key={reserva.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 md:p-5 rounded-xl hover:shadow-md transition"
            >
              {/* Cabeçalho do card - Responsivo */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-base md:text-lg">
                    {reserva.cliente}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-sm">
                    <span className="text-gray-600 dark:text-gray-300">
                      📅 {formatarData(reserva.dataInicio)} → {formatarData(reserva.dataFim)}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      💳 {reserva.metodoPagamento}
                    </span>
                  </div>
                </div>

                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
                  <p className="font-bold text-sky-600 dark:text-sky-400 text-lg">
                    R$ {reserva.valor.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Avaliação */}
              {reserva.avaliacao && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  {/* Cabeçalho da avaliação - Responsivo */}
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
                            {formatarData(reserva.avaliacao.data)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Estrelas */}
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

      {/* Modal de Detalhes - Responsivo */}
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
                  {formatarData(reservaSelecionada.dataInicio)} →{" "}
                  {formatarData(reservaSelecionada.dataFim)}
                </p>
                <p>
                  <b>Valor:</b> R$ {reservaSelecionada.valor.toFixed(2)}
                </p>
                <p>
                  <b>Método de Pagamento:</b> {reservaSelecionada.metodoPagamento}
                </p>
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