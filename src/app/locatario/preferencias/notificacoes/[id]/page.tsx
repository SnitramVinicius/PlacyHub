"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Mail, MessageCircle } from "lucide-react";
import { toast } from "sonner";

type Notificacao = {
  titulo: string;
  descricao: string;
};

const NOTIFICACOES_PADRAO: Record<number, Notificacao> = {
  1: {
    titulo: "Reservas e Pagamentos",
    descricao: "Alertas sobre confirmações, cancelamentos e status de pagamento",
  },
  2: {
    titulo: "Promoções e Novidades",
    descricao: "Ofertas e novidades exclusivas do PlacyHub",
  },
  3: {
    titulo: "Segurança e Conta",
    descricao: "Avisos sobre login, senha e alterações importantes",
  },
};

export default function EditarNotificacao() {
  const params = useParams();
  const id = Number(params.id);

  const dados = NOTIFICACOES_PADRAO[id];

  const [emailAtivo, setEmailAtivo] = useState(true);
  const [whatsAtivo, setWhatsAtivo] = useState(true);

  const handleSalvar = () => {
    toast.success("Configurações atualizadas com sucesso!");
  };

  if (!dados) {
    return (
      <div className="p-4 md:p-6 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Configuração não encontrada.</p>
          <Link
            href="/locatario/preferencias"
            className="text-sky-500 hover:text-sky-600 flex items-center gap-1 justify-center mt-4"
          >
            <ArrowLeft size={18} /> Voltar para preferências
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        {/* Cabeçalho com navegação */}
        <div className="mb-6">
          
          <div className="w-full mb-8 flex justify-end">
                              <Link
                                href="/locatario/preferencias"
                                className="flex items-center justify-center
                                w-10 h-10 rounded-full
                                bg-white dark:bg-slate-800
                                border border-gray-200 dark:border-slate-700
                                text-gray-500 dark:text-gray-400
                                hover:bg-gray-50 dark:hover:bg-slate-700
                                hover:border-gray-300 dark:hover:border-slate-600
                                hover:text-gray-700 dark:hover:text-gray-200
                                hover:shadow-sm
                                transition-all duration-300
                                group"
                                aria-label="Voltar"
                              >
                                <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform duration-300" />
                              </Link>
                            </div>

          <div className="space-y-2">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
              {dados.titulo}
            </h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              {dados.descricao}
            </p>
          </div>
        </div>

        {/* Card de configurações */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 md:p-6 space-y-4">
          {/* Email */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail size={20} className="text-sky-600 dark:text-sky-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Email</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Receber notificações por email
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between sm:justify-end gap-3">
              <span className="text-sm text-gray-500 dark:text-gray-400 sm:hidden">
                {emailAtivo ? "Ativado" : "Desativado"}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailAtivo}
                  onChange={() => setEmailAtivo(!emailAtivo)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-sky-300 dark:peer-focus:ring-sky-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-sky-600"></div>
              </label>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle size={20} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">WhatsApp</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Receber notificações por WhatsApp
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between sm:justify-end gap-3">
              <span className="text-sm text-gray-500 dark:text-gray-400 sm:hidden">
                {whatsAtivo ? "Ativado" : "Desativado"}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={whatsAtivo}
                  onChange={() => setWhatsAtivo(!whatsAtivo)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-sky-300 dark:peer-focus:ring-sky-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-sky-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Botão de salvar */}
        <div className="mt-6">
          <button
            onClick={handleSalvar}
            className="w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-white px-8 py-3 sm:py-2.5 rounded-xl font-semibold transition shadow-sm hover:shadow-md"
          >
            Salvar alterações
          </button>
        </div>

        {/* Informação adicional */}
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 text-center sm:text-left">
          As alterações serão aplicadas imediatamente após salvar.
        </p>
      </div>
    </div>
  );
}