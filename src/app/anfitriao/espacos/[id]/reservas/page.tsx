"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  CalendarDays,
  CheckCircle,
  XCircle,
  Loader2,
  Info,
  X,
} from "lucide-react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

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
}

export default function ReservasEspaco() {
  const { id } = useParams();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [reservaSelecionada, setReservaSelecionada] = useState<Reserva | null>(
    null
  );

  useEffect(() => {
    // 🔹 Simulação de dados
    setTimeout(() => {
      setReservas([
        {
          id: "1",
          cliente: "João Silva",
          dataInicio: "2025-11-20",
          dataFim: "2025-11-22",
          status: "confirmada",
          valor: 1200,
          metodoPagamento: "Pix",
          telefone: "(67) 99999-1234",
          email: "joaosilva@email.com",
          observacoes: "Quer chegar uma hora antes para decorar o local.",
        },
        {
          id: "2",
          cliente: "Maria Souza",
          dataInicio: "2025-11-10",
          dataFim: "2025-11-11",
          status: "pendente",
          valor: 450,
          metodoPagamento: "Cartão de crédito",
          telefone: "(67) 98888-6543",
          email: "maria@email.com",
          observacoes: "Levar 2 mesas extras para buffet.",
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

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
                <Link
                      href="/anfitriao/espacos"
                      className="text-sky-500 hover:text-sky-600 flex items-center gap-1"
                    >
                      <ArrowLeft size={18} /> Voltar
                    </Link>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <CalendarDays size={24} /> Reservas do Espaço
      </h2>

      {reservas.length === 0 ? (
        <p className="text-gray-500 text-center">Nenhuma reserva encontrada.</p>
      ) : (
        <div className="space-y-4">
          {reservas.map((reserva) => (
            <div
              key={reserva.id}
              className="border p-4 rounded-xl hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {reserva.cliente}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(reserva.dataInicio).toLocaleDateString()} →{" "}
                    {new Date(reserva.dataFim).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    💳 {reserva.metodoPagamento}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-sky-600">
                    R$ {reserva.valor.toFixed(2)}
                  </p>
                  <p
                    className={`text-sm font-medium ${
                      reserva.status === "confirmada"
                        ? "text-green-600"
                        : reserva.status === "pendente"
                        ? "text-amber-500"
                        : reserva.status === "cancelada"
                        ? "text-red-600"
                        : "text-gray-500"
                    }`}
                  >
                    {reserva.status.charAt(0).toUpperCase() +
                      reserva.status.slice(1)}
                  </p>
                </div>
              </div>

              {/* Botões de ação */}
              <div className="flex gap-3 mt-4 text-sm">
                {reserva.status === "pendente" && (
                  <>
                    <button className="flex items-center gap-1 text-green-600 hover:text-green-700 font-medium">
                      <CheckCircle size={16} /> Confirmar
                    </button>
                    <button className="flex items-center gap-1 text-red-600 hover:text-red-700 font-medium">
                      <XCircle size={16} /> Recusar
                    </button>
                  </>
                )}

                {reserva.status === "confirmada" && (
                  <button className="flex items-center gap-1 text-gray-600 hover:text-gray-700 font-medium">
                    ✅ Marcar como finalizada
                  </button>
                )}

                <button
                  onClick={() => setReservaSelecionada(reserva)}
                  className="flex items-center gap-1 text-sky-600 hover:text-sky-700 font-medium"
                >
                  <Info size={16} /> Ver detalhes
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🔹 Modal de Detalhes */}
      {reservaSelecionada && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative animate-fade-in">
            <button
              onClick={() => setReservaSelecionada(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Detalhes da Reserva
            </h3>

            <div className="space-y-2 text-gray-700 text-sm">
              <p>
                <b>Cliente:</b> {reservaSelecionada.cliente}
              </p>
              <p>
                <b>Período:</b>{" "}
                {new Date(reservaSelecionada.dataInicio).toLocaleDateString()} →{" "}
                {new Date(reservaSelecionada.dataFim).toLocaleDateString()}
              </p>
              <p>
                <b>Valor:</b> R$ {reservaSelecionada.valor.toFixed(2)}
              </p>
              <p>
                <b>Status:</b>{" "}
                <span
                  className={`font-medium ${
                    reservaSelecionada.status === "confirmada"
                      ? "text-green-600"
                      : reservaSelecionada.status === "pendente"
                      ? "text-amber-500"
                      : reservaSelecionada.status === "cancelada"
                      ? "text-red-600"
                      : "text-gray-500"
                  }`}
                >
                  {reservaSelecionada.status}
                </span>
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

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setReservaSelecionada(null)}
                className="bg-sky-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-sky-700 transition"
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
