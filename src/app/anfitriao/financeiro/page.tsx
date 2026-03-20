"use client";

/* =======================
TELA DE FINANCEIRO - VERSÃO LIMPA E PROFISSIONAL
======================= */

import { useState } from "react";
import { financeiroData } from "@/lib/mock/financeiroData";

export default function FinanceiroPage() {
  const [mesSelecionado, setMesSelecionado] =
    useState<keyof typeof financeiroData>("novembro");

  const mes = financeiroData[mesSelecionado];

  const saldoDisponivel =
    mes.totalRecebido - mes.taxas - mes.estornos - mes.saldoTransferido;

  // Dados do gráfico
  const meses = Object.keys(financeiroData);
  const valores = meses.map(
    (m) => financeiroData[m as keyof typeof financeiroData].totalRecebido
  );
  const maxValor = Math.max(...valores);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
        
        {/* Cabeçalho */}
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Painel Financeiro do Anfitrião
        </h1>

        {/* Gráfico */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
            Resumo de Ganhos Mensais (2025)
          </h2>

          <div className="max-h-[280px] sm:max-h-[400px] overflow-y-auto pr-2">
            <div className="space-y-3">
              {meses.map((mes, index) => {
                const valor = valores[index];
                const largura = (valor / maxValor) * 100;
                const larguraMin = Math.max(largura, 8);
                const mesAbrev =
                  mes.slice(0, 3).charAt(0).toUpperCase() +
                  mes.slice(1, 3);

                return (
                  <div key={mes} className="flex items-center gap-3">
                    <div className="w-12 text-sm font-medium text-gray-600 dark:text-gray-400">
                      {mesAbrev}
                    </div>

                    <div className="flex-1">
                      <div className="relative group">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-8 overflow-hidden">
                          <div
                            className="bg-sky-500 h-full rounded-full flex items-center justify-end px-2 transition-all duration-500 hover:bg-sky-600"
                            style={{ width: `${larguraMin}%` }}
                          >
                            {larguraMin > 15 && (
                              <span className="text-xs text-white font-medium">
                                R$ {(valor / 1000).toFixed(1)}k
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Tooltip */}
                        <div className="absolute bottom-full left-0 mb-1 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                          R$ {valor.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="w-16 text-right">
                      <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                        R$ {(valor / 1000).toFixed(1)}k
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-3">
            ↓ Role para ver todos os meses ↓
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Total Recebido</p>
            <p className="text-base font-bold text-green-600">
              R$ {mes.totalRecebido.toFixed(2)}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm">
            <p className="text-xs text-gray-500 mb-1">A Receber</p>
            <p className="text-base font-bold text-yellow-600">
              R$ {mes.aReceber.toFixed(2)}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Taxas</p>
            <p className="text-base font-bold text-red-600">
              R$ {mes.taxas.toFixed(2)}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Estornos</p>
            <p className="text-base font-bold text-red-500">
              R$ {mes.estornos.toFixed(2)}
            </p>
          </div>

          <div className="col-span-2 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Repasses feitos</p>
            <p className="text-base font-bold text-sky-600">
              R$ {mes.saldoTransferido.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Seletor */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 mb-4">
          <label className="text-sm text-gray-600 block mb-1">Mês</label>
          <select
            className="w-full bg-transparent text-gray-900 dark:text-gray-100 font-medium focus:outline-none"
            value={mesSelecionado}
            onChange={(e) =>
              setMesSelecionado(
                e.target.value as keyof typeof financeiroData
              )
            }
          >
            {Object.keys(financeiroData).map((m) => (
              <option key={m} value={m}>
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Saldo */}
        <div className="bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/30 p-4 rounded-xl mb-6 border border-sky-200 dark:border-sky-900">
          <p className="text-sm text-gray-600 mb-1">Saldo disponível</p>
          <p className="text-2xl font-bold text-sky-600">
            R$ {saldoDisponivel.toFixed(2)}
          </p>
        </div>

        {/* Transações */}
        <div className="mb-20">
          <h3 className="text-base font-semibold text-gray-800 mb-3">
            Últimas transações
          </h3>

          <div className="space-y-3">
            {mes.transacoes.map((transacao, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4"
              >
                <div className="flex justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {transacao.espaco}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {transacao.data}
                    </p>
                  </div>

                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      transacao.status === "Confirmado"
                        ? "bg-green-100 text-green-700"
                        : transacao.status === "Pendente"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {transacao.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Tipo</p>
                    <p className="font-medium">{transacao.tipo}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Método</p>
                    <p className="font-medium">{transacao.metodo}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Valor Bruto</p>
                    <p className="font-medium">
                      R$ {transacao.valorBruto.toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Valor Líquido</p>
                    <p
                      className={`font-medium ${
                        transacao.valorLiquido >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      R$ {transacao.valorLiquido.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between pt-2 border-t">
                  <p className="text-xs text-gray-500">
                    Liberação:{" "}
                    {transacao.dataLiberacao !== "-"
                      ? transacao.dataLiberacao
                      : "—"}
                  </p>

                  {transacao.comprovante !== "-" && (
                    <a
                      href={transacao.comprovante}
                      target="_blank"
                      className="text-xs text-sky-600 font-medium hover:underline"
                    >
                      Ver comprovante →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}