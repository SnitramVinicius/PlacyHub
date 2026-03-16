"use client";

/* ======================= TELA DE FINANCEIRO
INFORMAÇÕES DETALHAS DO FINANCEIROS DOS ESPAÇOS.
 ======================= */

import { useState } from "react";
import { financeiroData } from "@/lib/mock/financeiroData";
import FinanceiroTable from "@/components/FinanceiroTable";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function FinanceiroPage() {
  const [mesSelecionado, setMesSelecionado] = useState<keyof typeof financeiroData>("novembro");
  const mes = financeiroData[mesSelecionado];
  const [mostrarModal, setMostrarModal] = useState(false);
  const [valorSaque, setValorSaque] = useState("");
  const [metodo, setMetodo] = useState("Pix");
  const [historicoSaques, setHistoricoSaques] = useState<
    { data: string; valor: number; metodo: string; status: string }[]
  >([
    { data: "01/11/2025", valor: 820, metodo: "Pix", status: "Concluído" },
    { data: "28/10/2025", valor: 250, metodo: "Conta Bancária", status: "Pendente" },
  ]);

  const chartData = Object.entries(financeiroData).map(([mes, dados]) => ({
    mes,
    total: dados.totalRecebido,
  }));

  const saldoDisponivel =
    mes.totalRecebido - mes.taxas - mes.estornos - mes.saldoTransferido;

  function handleSolicitarSaque() {
    if (!valorSaque || parseFloat(valorSaque) <= 0) return;
    const novo = {
      data: new Date().toLocaleDateString("pt-BR"),
      valor: parseFloat(valorSaque),
      metodo,
      status: "Pendente",
    };
    setHistoricoSaques((prev) => [novo, ...prev]);
    setValorSaque("");
    setMostrarModal(false);
  }

  return (
    <div className="p-6 text-zinc-800 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-4">Painel Financeiro do Anfitrião</h1>

      {/* Gráfico */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow mb-6">
        <h2 className="text-lg font-semibold mb-2 text-zinc-800 dark:text-gray-100">Ganhos Mensais (2025)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#38bdf8" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Seletor */}
      <div className="mb-4">
        <label className="font-medium mr-2">Selecionar Mês:</label>
        <select className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-zinc-800 dark:text-gray-100 rounded-lg px-3 py-2"
          value={mesSelecionado}
          onChange={(e) => setMesSelecionado(e.target.value as keyof typeof financeiroData)}
        >
          {Object.keys(financeiroData).map((m) => (
            <option key={m} value={m}>
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow text-center">
          <p className="text-gray-600 dark:text-gray-300 text-sm">Total Recebido</p>
          <p className="text-lg font-bold text-green-600">
            R$ {mes.totalRecebido.toFixed(2)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow text-center">
          <p className="text-gray-600 dark:text-gray-300 text-sm">A Receber</p>
          <p className="text-lg font-bold text-yellow-600">
            R$ {mes.aReceber.toFixed(2)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow text-center">
          <p className="text-gray-600 dark:text-gray-300 text-sm">Taxas</p>
          <p className="text-lg font-bold text-red-600">
            R$ {mes.taxas.toFixed(2)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow text-center">
          <p className="text-gray-600 dark:text-gray-300 text-sm">Estornos</p>
          <p className="text-lg font-bold text-red-500">
            R$ {mes.estornos.toFixed(2)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow text-center">
          <p className="text-gray-600 dark:text-gray-300 text-sm">Saldo Transferido</p>
          <p className="text-lg font-bold text-sky-600">
            R$ {mes.saldoTransferido.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Tabela de transações */}
      <FinanceiroTable transacoes={mes.transacoes} />

        </div>
  );
}
