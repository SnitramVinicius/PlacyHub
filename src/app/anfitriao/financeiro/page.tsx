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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Painel Financeiro do Anfitrião</h1>

      {/* Gráfico */}
      <div className="bg-white p-4 rounded-2xl shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">Ganhos Mensais (2025)</h2>
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
        <select
          className="border rounded-lg px-3 py-2"
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
        <div className="bg-white p-4 rounded-2xl shadow text-center">
          <p className="text-gray-600 text-sm">Total Recebido</p>
          <p className="text-lg font-bold text-green-600">
            R$ {mes.totalRecebido.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow text-center">
          <p className="text-gray-600 text-sm">A Receber</p>
          <p className="text-lg font-bold text-yellow-600">
            R$ {mes.aReceber.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow text-center">
          <p className="text-gray-600 text-sm">Taxas</p>
          <p className="text-lg font-bold text-red-600">
            R$ {mes.taxas.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow text-center">
          <p className="text-gray-600 text-sm">Estornos</p>
          <p className="text-lg font-bold text-red-500">
            R$ {mes.estornos.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow text-center">
          <p className="text-gray-600 text-sm">Saldo Transferido</p>
          <p className="text-lg font-bold text-sky-600">
            R$ {mes.saldoTransferido.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Tabela de transações */}
      <FinanceiroTable transacoes={mes.transacoes} />

      {/* Área de saque */}
      <div className="bg-white mt-8 p-6 rounded-2xl shadow space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Área de Saques</h2>

        <p className="text-gray-600">
          Saldo disponível:{" "}
          <span className="text-green-600 font-bold">
            R$ {saldoDisponivel.toFixed(2)}
          </span>
        </p>

        <button
          onClick={() => setMostrarModal(true)}
          className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-4 py-2 rounded-xl transition"
        >
          Solicitar Saque
        </button>

        {/* Modal de saque */}
        {mostrarModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-6 w-96 shadow-xl space-y-4">
              <h3 className="text-lg font-semibold">Solicitar Saque</h3>
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Valor do saque:
                </label>
                <input
                  type="number"
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Ex: 250.00"
                  value={valorSaque}
                  onChange={(e) => setValorSaque(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Método:
                </label>
                <select
                  className="w-full border rounded-lg px-3 py-2"
                  value={metodo}
                  onChange={(e) => setMetodo(e.target.value)}
                >
                  <option value="Pix">Pix</option>
                  <option value="Conta Bancária">Conta Bancária</option>
                </select>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setMostrarModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSolicitarSaque}
                  className="px-4 py-2 rounded-lg bg-sky-500 text-white font-semibold hover:bg-sky-600"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Histórico de saques */}
        <div>
          <h3 className="font-semibold mt-4 mb-2 text-gray-700">
            Histórico de Saques
          </h3>
          <table className="w-full text-sm text-left">
            <thead className="text-gray-600 border-b">
              <tr>
                <th className="py-2">Data</th>
                <th>Valor</th>
                <th>Método</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {historicoSaques.map((s, i) => (
                <tr key={i} className="border-b last:border-none">
                  <td className="py-2">{s.data}</td>
                  <td>R$ {s.valor.toFixed(2)}</td>
                  <td>{s.metodo}</td>
                  <td>{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
