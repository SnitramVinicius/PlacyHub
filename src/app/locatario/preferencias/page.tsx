"use client";

import { useState } from "react";
import { ArrowLeft, Globe, Moon, Sun, Bell, MessageCircle, Mail, Edit3 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useTema } from "@/context/TemaContext";

export default function PreferenciasGerais() {
  const { tema, setTema } = useTema();
  const [idioma, setIdioma] = useState("pt-BR");
  const [notificacoes, setNotificacoes] = useState([
    {
      id: 1,
      titulo: "Reservas e Pagamentos",
      descricao: "Alertas sobre confirmações, cancelamentos e status de pagamento",
      canais: ["Email", "WhatsApp"],
    },
    {
      id: 2,
      titulo: "Promoções e Novidades",
      descricao: "Ofertas e novidades exclusivas do PlacyHub",
      canais: ["Email"],
    },
    {
      id: 3,
      titulo: "Segurança e Conta",
      descricao: "Avisos sobre login, senha e alterações importantes",
      canais: ["Email", "WhatsApp"],
    },
  ]);

  const handleSalvar = () => {
    toast.success("Preferências salvas com sucesso!");
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <Link
          href="/locatario/perfil"
          className="text-sky-500 hover:text-sky-600 flex items-center gap-1 w-fit"
        >
          <ArrowLeft size={18} />
          <span>Voltar</span>
        </Link>
        <h1 className="text-xl md:text-2xl font-bold">Preferências da Conta</h1>
      </div>

      {/* Idioma - Novo card */}
      {/* <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 md:p-6 mb-4 md:mb-6">
        <h2 className="text-base md:text-lg font-semibold mb-3 flex items-center gap-2">
          <Globe size={20} className="text-sky-500" />
          Idioma
        </h2>
        <select
          value={idioma}
          onChange={(e) => setIdioma(e.target.value)}
          className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 md:py-2 
            bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
            focus:ring-2 focus:ring-sky-500 outline-none transition"
        >
          <option value="pt-BR">Português (Brasil)</option>
          <option value="en-US">English (US)</option>
          <option value="es">Español</option>
        </select>
      </div> */}

      {/* Tema */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 md:p-6 mb-4 md:mb-6">
        <h2 className="text-base md:text-lg font-semibold mb-3 flex items-center gap-2">
          <Moon size={20} className="text-sky-500" />
          Tema
        </h2>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={() => setTema("claro")}
            className={`flex items-center justify-center gap-2 px-4 py-3 md:py-2 rounded-xl border transition
              ${tema === "claro" 
                ? "bg-sky-500 text-white border-sky-500" 
                : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
          >
            <Sun size={18} />
            <span>Claro</span>
          </button>
          <button
            onClick={() => setTema("escuro")}
            className={`flex items-center justify-center gap-2 px-4 py-3 md:py-2 rounded-xl border transition
              ${tema === "escuro" 
                ? "bg-sky-500 text-white border-sky-500" 
                : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
          >
            <Moon size={18} />
            <span>Escuro</span>
          </button>
        </div>
      </div>

      {/* Notificações */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 md:p-6">
        <h2 className="text-base md:text-lg font-semibold mb-4 flex items-center gap-2">
          <Bell size={20} className="text-sky-500" />
          Notificações
        </h2>

        <div className="space-y-4">
          {notificacoes.map((n) => (
            <div
              key={n.id}
              className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {n.titulo}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {n.descricao}
                </p>
                <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-600 dark:text-gray-400">
                  {n.canais.includes("Email") && (
                    <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                      <Mail size={12} />
                      Email
                    </span>
                  )}
                  {n.canais.includes("WhatsApp") && (
                    <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                      <MessageCircle size={12} />
                      WhatsApp
                    </span>
                  )}
                </div>
              </div>
              
              <Link
                href={`/locatario/preferencias/notificacoes/${n.id}`}
                className="flex items-center justify-center gap-1 px-4 py-2 sm:px-3 sm:py-1 text-sm sm:text-xs font-medium text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-900/50 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-900/20 transition whitespace-nowrap"
              >
                <Edit3 size={14} />
                <span>Editar</span>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Botão de salvar */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleSalvar}
          className="w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-white px-8 py-3 md:py-2 rounded-xl font-semibold transition shadow-md hover:shadow-lg"
        >
          Salvar Preferências
        </button>
      </div>
    </div>
  );
}