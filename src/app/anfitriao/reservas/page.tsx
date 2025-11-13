"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Phone, User, Search, RotateCcw } from "lucide-react";

interface Reserva {
  id: string;
  espacoId: string;
  nomeCliente: string;
  telefoneCliente: string;
  dataInicio: string;
  dataFim: string;
  valor: number;
  status: string; // "pendente" | "confirmada" | "cancelada" | "finalizada"
  espacoNome?: string;
}

export default function ReservasAnfitriao() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todas");

  // 🔹 Simulação de espaços cadastrados
useEffect(() => {
  const espacosExemplo = [
    {
      id: "espaco-001",
      nome_espaco: "Chácara do Sol",
      tipo_reserva: "manual", // precisa de aceite do anfitrião
    },
    {
      id: "espaco-002",
      nome_espaco: "Salão do Lago",
      tipo_reserva: "automatica", // confirma sozinha
    },
    {
      id: "espaco-004",
      nome_espaco: "Campo das Flores",
      tipo_reserva: "manual",
    },
  ];

  localStorage.setItem("espacos", JSON.stringify(espacosExemplo));
}, []);

  // 🔹 Dados de exemplo
  useEffect(() => {
    const reservasExemplo = [
      {
        id: "1",
        espacoId: "espaco-001",
        nomeEspaco: "Chácara do Sol",
        nomeCliente: "João da Silva",
        telefoneCliente: "(67) 99999-9999",
        dataInicio: "2025-10-10",
        dataFim: "2025-10-11",
        valor: 500,
        status: "confirmada",
      },
      {
        id: "2",
        espacoId: "espaco-002",
        nomeEspaco: "Salão do Lago",
        nomeCliente: "Maria Oliveira",
        telefoneCliente: "(67) 98888-8888",
        dataInicio: "2025-11-15",
        dataFim: "2025-11-16",
        valor: 750,
        status: "pendente",
      },
      {
        id: "4",
        espacoId: "espaco-004",
        nomeEspaco: "Campo das Flores",
        nomeCliente: "Pedro Souza",
        telefoneCliente: "(67) 97777-7777",
        dataInicio: "2025-12-02",
        dataFim: "2025-12-03",
        valor: 650,
        status: "pendente",
      },

      
    ];

    localStorage.setItem("reservas", JSON.stringify(reservasExemplo));
  }, []);

  // 🔹 Carregar e atualizar reservas (inclui finalizadas)
  useEffect(() => {
    const reservasSalvas = JSON.parse(localStorage.getItem("reservas") || "[]");
    const espacosSalvos = JSON.parse(localStorage.getItem("espacos") || "[]");

    const hoje = new Date();

const reservasAtualizadas = reservasSalvas.map((r: Reserva) => {
  const espaco = espacosSalvos.find((e: any) => e.id === r.espacoId);
  const dataFim = new Date(r.dataFim);
  const tipoReserva = espaco?.tipo_reserva || "manual"; // padrão: manual

  // 🔹 Se o espaço for automático e ainda estiver pendente → confirma automaticamente
  if (tipoReserva === "automatica" && r.status === "pendente") {
    r.status = "confirmada";
  }

  // 🔹 Se a reserva confirmada já passou → marca como finalizada
  if (r.status === "confirmada" && dataFim < hoje) {
    r.status = "finalizada";
  }

  return {
    ...r,
    espacoNome: espaco ? espaco.nome_espaco : "Espaço removido",
  };
});

    localStorage.setItem("reservas", JSON.stringify(reservasAtualizadas));
    setReservas(reservasAtualizadas);
  }, []);

  // 🔹 Atualizar status da reserva
  const atualizarStatusReserva = (id: string, novoStatus: string) => {
    const reservasSalvas = JSON.parse(localStorage.getItem("reservas") || "[]");
    const reservasAtualizadas = reservasSalvas.map((r: any) =>
      r.id === id ? { ...r, status: novoStatus } : r
    );
    localStorage.setItem("reservas", JSON.stringify(reservasAtualizadas));
    setReservas(reservasAtualizadas);
  };

  // 🔹 Filtro e busca
  const reservasFiltradas = reservas.filter((reserva) => {
    const nomeMatch = reserva.nomeCliente
      .toLowerCase()
      .includes(busca.toLowerCase());
    const statusMatch =
      filtroStatus === "todas" || reserva.status === filtroStatus;
    return nomeMatch && statusMatch;
  });

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
           Minhas Reservas
          </h2>
          <p className="text-gray-500 mb-8">
            Veja e gerencie as reservas feitas nos seus espaços cadastrados.
          </p>

          {/* 🔹 Filtros e busca */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div className="relative w-full md:w-1/2">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Buscar por nome do cliente..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>

            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="w-full md:w-48 border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
            >
              <option value="todas">Todas</option>
              <option value="pendente">Pendentes</option>
              <option value="confirmada">Confirmadas</option>
              <option value="cancelada">Canceladas</option>
              <option value="finalizada">Finalizadas</option>
            </select>
          </div>

          {/* 🔹 Lista de reservas */}
          {reservasFiltradas.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl shadow text-center text-gray-500">
              Nenhuma reserva encontrada.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reservasFiltradas.map((reserva) => (
                <div
                  key={reserva.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition p-5 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {reserva.espacoNome}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">ID: {reserva.id}</p>

                    <div className="space-y-1 text-sm text-gray-700">
                      <p className="flex items-center gap-2">
                        <User size={16} /> {reserva.nomeCliente}
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone size={16} /> {reserva.telefoneCliente}
                      </p>
                      <p className="flex items-center gap-2">
                        <CalendarDays size={16} />{" "}
                        {new Date(reserva.dataInicio).toLocaleDateString()} até{" "}
                        {new Date(reserva.dataFim).toLocaleDateString()}
                      </p>
                      <p>
                        💰 <b>Valor:</b> R$ {reserva.valor.toFixed(2)}
                      </p>
                    </div>

                    {/* 🔘 Botões de ação */}
                    <div className="flex items-center gap-3 mt-4">
                      {reserva.status === "pendente" && (
                        <>
                          <button
                            onClick={() =>
                              atualizarStatusReserva(reserva.id, "confirmada")
                            }
                            className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                          >
                            Confirmar
                          </button>
                          <button
                            onClick={() =>
                              atualizarStatusReserva(reserva.id, "cancelada")
                            }
                            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                          >
                            Cancelar
                          </button>
                        </>
                      )}

                      {reserva.status === "confirmada" && (
                        <span className="text-green-600 font-medium">
                          ✅ Confirmada
                        </span>
                      )}

                      {reserva.status === "cancelada" && (
                        <>
                          <span className="text-red-600 font-medium">
                            ❌ Cancelada
                          </span>
                          <button
                            onClick={() =>
                              atualizarStatusReserva(reserva.id, "pendente")
                            }
                            className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                          >
                            <RotateCcw size={14} />
                            Reverter
                          </button>
                        </>
                      )}

                      {reserva.status === "finalizada" && (
                        <span className="text-gray-600 font-medium">
                          🕓 Finalizada
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
