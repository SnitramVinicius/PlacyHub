"use client";

import { useState, useEffect } from "react";

interface Transacao {
  data: string;
  espaco: string;
  tipo: string;
  metodo: string;
  valorBruto: number;
  taxa: number;
  valorLiquido: number;
  status: string;
  dataLiberacao: string;
  comprovante: string;
}

export default function FinanceiroTable({ transacoes }: { transacoes: Transacao[] }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmado":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "Pendente":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Cancelado":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400";
    }
  };

  // Versão Mobile - Cards
  if (isMobile) {
    return (
      <div className="space-y-3 mt-4">
        {transacoes.map((t, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4"
          >
            {/* Cabeçalho do card */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base">
                  {t.espaco}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {t.data}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(t.status)}`}>
                {t.status}
              </span>
            </div>

            {/* Informações principais */}
            <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Tipo</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{t.tipo}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Método</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{t.metodo}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Valor Bruto</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  R$ {t.valorBruto.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Taxa</p>
                <p className="font-medium text-red-600 dark:text-red-400">
                  - R$ {t.taxa.toFixed(2)}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">Valor Líquido</p>
                <p className={`text-base font-bold ${
                  t.valorLiquido >= 0 
                    ? "text-green-600 dark:text-green-400" 
                    : "text-red-600 dark:text-red-400"
                }`}>
                  R$ {t.valorLiquido.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Footer do card */}
            <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Liberação</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {t.dataLiberacao !== "-" ? t.dataLiberacao : "—"}
                </p>
              </div>
              {t.comprovante !== "-" ? (
                <a
                  href={t.comprovante}
                  target="_blank"
                  className="text-sky-600 dark:text-sky-400 text-sm font-medium hover:underline"
                >
                  Ver comprovante →
                </a>
              ) : (
                <span className="text-xs text-gray-400 dark:text-gray-500">Sem comprovante</span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Versão Desktop - Tabela
  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow">
        <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
          <tr>
            <th className="py-3 px-3 text-left text-sm">Data</th>
            <th className="py-3 px-3 text-left text-sm">Espaço</th>
            <th className="py-3 px-3 text-left text-sm">Tipo</th>
            <th className="py-3 px-3 text-left text-sm">Método</th>
            <th className="py-3 px-3 text-right text-sm">Valor Bruto (R$)</th>
            <th className="py-3 px-3 text-right text-sm">Taxa (R$)</th>
            <th className="py-3 px-3 text-right text-sm">Valor Líquido (R$)</th>
            <th className="py-3 px-3 text-center text-sm">Status</th>
            <th className="py-3 px-3 text-center text-sm">Liberação</th>
            <th className="py-3 px-3 text-center text-sm">Comprovante</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 dark:text-gray-200">
          {transacoes.map((t, i) => (
            <tr
              key={i}
              className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <td className="py-2 px-3 text-sm">{t.data}</td>
              <td className="py-2 px-3 text-sm">{t.espaco}</td>
              <td className="py-2 px-3 text-sm">{t.tipo}</td>
              <td className="py-2 px-3 text-sm">{t.metodo}</td>
              <td className="py-2 px-3 text-right text-sm">{t.valorBruto.toFixed(2)}</td>
              <td className="py-2 px-3 text-right text-sm">{t.taxa.toFixed(2)}</td>
              <td className="py-2 px-3 text-right text-sm font-medium">
                {t.valorLiquido.toFixed(2)}
              </td>
              <td className={`py-2 px-3 text-center text-sm ${getStatusColor(t.status)}`}>
                {t.status}
              </td>
              <td className="py-2 px-3 text-center text-sm">
                {t.dataLiberacao !== "-" ? t.dataLiberacao : "-"}
              </td>
              <td className="py-2 px-3 text-center text-sm">
                {t.comprovante !== "-" ? (
                  <a
                    href={t.comprovante}
                    target="_blank"
                    className="text-sky-600 dark:text-sky-400 hover:underline"
                  >
                    Ver
                  </a>
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}