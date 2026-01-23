"use client";

import { useState } from "react";
import { ArrowLeft, Globe, Moon, Sun, Bell, MessageCircle, Mail, Edit3 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useTema } from "@/context/TemaContext";

export default function PreferenciasGerais() {
  const { tema, setTema } = useTema(); // usar tema global
  const [idioma, setIdioma] = useState("pt-BR");
  const [notificacoes, setNotificacoes] = useState([
    {
      id: 1,
      titulo: "Reservas e Pagamentos",
      descricao: "Alertas sobre confirmações, cancelamentos e status de pagamento.",
      canais: ["Email", "WhatsApp"],
    },
    {
      id: 2,
      titulo: "Promoções e Novidades",
      descricao: "Ofertas e novidades exclusivas do PlacyHub.",
      canais: ["Email"],
    },
    {
      id: 3,
      titulo: "Segurança e Conta",
      descricao: "Avisos sobre login, senha e alterações importantes.",
      canais: ["Email", "WhatsApp"],
    },
  ]);

  const handleSalvar = () => {
    toast.success("Preferências salvas com sucesso!");
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">

      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/locatario/perfil"
            className="text-sky-500 hover:text-sky-600 flex items-center gap-1"
          >
            <ArrowLeft size={18} /> Voltar
          </Link>
          <h1 className="text-2xl font-bold">Preferências da Conta</h1>
        </div>
      </div>

      {/* Tema */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Moon size={20} /> Tema
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => setTema("claro")}
            className={`px-4 py-2 rounded-xl border ${
              tema === "claro" ? "bg-sky-500 text-white" : "hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <Sun size={16} className="inline mr-1" /> Claro
          </button>
          <button
            onClick={() => setTema("escuro")}
            className={`px-4 py-2 rounded-xl border ${
              tema === "escuro" ? "bg-sky-500 text-white" : "hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            🌙 Escuro
          </button>
        </div>
      </div>

      {/* Idioma */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Globe size={20} /> Idioma
        </h2>
       <select
  value={idioma}
  onChange={(e) => setIdioma(e.target.value as "pt-BR" | "en-US" | "es-ES")}
  className="border rounded-xl px-4 py-2 w-full max-w-sm focus:ring-2 focus:ring-sky-400 outline-none dark:bg-gray-700 dark:text-gray-100"
>
  <option value="pt-BR">Português (Brasil)</option>
  <option value="en-US">Inglês (EUA)</option>
  <option value="es-ES">Espanhol</option>
</select>
      </div>

      {/* Notificações */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Bell size={20} /> Notificações
        </h2>

        <div className="space-y-4">
          {notificacoes.map((n) => (
            <div
              key={n.id}
              className="border-b border-gray-100 dark:border-gray-700 pb-3 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{n.titulo}</h3>
                <p className="text-gray-500 dark:text-gray-300 text-sm">{n.descricao}</p>
                <div className="flex gap-3 mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {n.canais.includes("Email") && (
                    <span className="flex items-center gap-1">
                      <Mail size={14} /> Email
                    </span>
                  )}
                  {n.canais.includes("WhatsApp") && (
                    <span className="flex items-center gap-1">
                      <MessageCircle size={14} /> WhatsApp
                    </span>
                  )}
                </div>
              </div>
              <Link
                href={`/locatario/preferencias/notificacoes/${n.id}`}
                className="text-sky-500 hover:text-sky-600 flex items-center gap-1"
              >
                <Edit3 size={16} /> Editar
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Botão de salvar */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleSalvar}
          className="bg-sky-500 text-white px-6 py-2 rounded-xl hover:bg-sky-600 transition"
        >
          Salvar Preferências
        </button>
      </div>

    </div>
  );
}
