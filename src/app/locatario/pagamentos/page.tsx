"use client";

import { useState } from "react";
import { CreditCard, Plus, Trash2, Edit3, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast, Toaster } from "sonner";

interface MetodoPagamento {
  id: number;
  tipo: "Cartão" | "Pix" | "Boleto";
  descricao: string;
  padrao?: boolean;
}

export default function PagamentosLocatario() {
  const [metodos, setMetodos] = useState<MetodoPagamento[]>([
    { id: 1, tipo: "Cartão", descricao: "Visa **** 1234", padrao: true },
    { id: 2, tipo: "Pix", descricao: "vinicius@email.com" },
  ]);

  const handleAdicionar = () => {
    const novoMetodo = {
      id: Date.now(),
      tipo: "Cartão" as const,
      descricao: "Novo cartão **** 0000",
    };
    setMetodos([...metodos, novoMetodo]);
    toast.success("Novo método adicionado!");
  };

  const handleRemover = (id: number) => {
    setMetodos(metodos.filter((m) => m.id !== id));
    toast.success("Método removido com sucesso!");
  };

  const handleDefinirPadrao = (id: number) => {
    setMetodos(metodos.map((m) => ({ ...m, padrao: m.id === id })));
    toast.success("Método definido como padrão!");
  };

  return (
    <div className="p-6">
      <Toaster position="top-right" richColors />

      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/locatario/perfil"
            className="text-sky-500 hover:text-sky-600 flex items-center gap-1"
          >
            <ArrowLeft size={18} /> Voltar
          </Link>
          <h1 className="text-2xl font-bold">Gerenciar Pagamentos</h1>
        </div>

        <button
          onClick={handleAdicionar}
          className="bg-sky-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-sky-600 transition"
        >
          <Plus size={18} /> Adicionar Método
        </button>
      </div>

      {/* Lista de métodos */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Meus Métodos de Pagamento</h2>

        <div className="flex flex-col gap-4">
          {metodos.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between border border-gray-200 rounded-xl p-4 hover:shadow-sm transition"
            >
              <div className="flex items-center gap-3">
                <CreditCard
                  className={`${
                    m.tipo === "Pix" ? "text-green-500" : "text-sky-500"
                  }`}
                  size={28}
                />
                <div>
                  <p className="font-medium">{m.descricao}</p>
                  <p className="text-gray-500 text-sm">{m.tipo}</p>
                  {m.padrao && (
                    <span className="text-xs text-green-600 font-semibold">
                      Método padrão
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {!m.padrao && (
                  <button
                    onClick={() => handleDefinirPadrao(m.id)}
                    className="text-sky-500 hover:text-sky-600 text-sm font-medium"
                  >
                    Definir padrão
                  </button>
                )}
               <Link
  href={`/locatario/pagamentos/editar/${m.id}?tipo=${m.tipo}&descricao=${encodeURIComponent(m.descricao)}`}
  className="text-gray-500 hover:text-gray-700"
>
  <Edit3 size={18} />
</Link>
                <button
                  onClick={() => handleRemover(m.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}

          {metodos.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              Nenhum método de pagamento adicionado ainda.
            </p>
          )}
        </div>
      </div>

      {/* Histórico */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Histórico de Pagamentos</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="text-left py-3 px-4">Data</th>
                <th className="text-left py-3 px-4">Descrição</th>
                <th className="text-left py-3 px-4">Valor</th>
                <th className="text-left py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="py-3 px-4">05/11/2025</td>
                <td className="py-3 px-4">Reserva - Espaço Campo do Sol</td>
                <td className="py-3 px-4">R$ 320,00</td>
                <td className="py-3 px-4 text-green-600 font-semibold">Pago</td>
              </tr>
              <tr className="border-t">
                <td className="py-3 px-4">02/10/2025</td>
                <td className="py-3 px-4">Reserva - Salão Estrela</td>
                <td className="py-3 px-4">R$ 450,00</td>
                <td className="py-3 px-4 text-red-500 font-semibold">Cancelado</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
