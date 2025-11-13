"use client";

import { useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Mail, MessageCircle } from "lucide-react";
import { toast, Toaster } from "sonner";

const NOTIFICACOES_PADRAO = {
  1: {
    titulo: "Reservas e Pagamentos",
    descricao: "Alertas sobre confirmações, cancelamentos e status de pagamento.",
  },
  2: {
    titulo: "Promoções e Novidades",
    descricao: "Ofertas e novidades exclusivas do PlacyHub.",
  },
  3: {
    titulo: "Segurança e Conta",
    descricao: "Avisos sobre login, senha e alterações importantes.",
  },
};

export default function EditarNotificacao() {
  const params = useParams();
  const id = Number(params.id);

  const dados = NOTIFICACOES_PADRAO[id];

  const [emailAtivo, setEmailAtivo] = useState(true);
  const [whatsAtivo, setWhatsAtivo] = useState(true);

  const handleSalvar = () => {
    toast.success("Configurações atualizadas!");
  };

  if (!dados) {
    return <p className="p-6">Configuração não encontrada.</p>;
  }

  return (
    <div className="p-6">
      <Toaster position="top-right" richColors />

      {/* Cabeçalho */}
      <Link
        href="/locatario/preferencias"
        className="text-sky-500 hover:text-sky-600 flex items-center gap-1 mb-4"
      >
        <ArrowLeft size={18} /> Voltar
      </Link>

      <h1 className="text-2xl font-bold mb-2">{dados.titulo}</h1>
      <p className="text-gray-600 mb-6">{dados.descricao}</p>

      {/* Campos */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-6">
        {/* Email */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail size={18} />
            <span>Email</span>
          </div>
          <input
            type="checkbox"
            checked={emailAtivo}
            onChange={() => setEmailAtivo(!emailAtivo)}
            className="scale-125 accent-sky-500"
          />
        </div>

        {/* WhatsApp */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle size={18} />
            <span>WhatsApp</span>
          </div>
          <input
            type="checkbox"
            checked={whatsAtivo}
            onChange={() => setWhatsAtivo(!whatsAtivo)}
            className="scale-125 accent-sky-500"
          />
        </div>
      </div>

      {/* Botão */}
      <button
        onClick={handleSalvar}
        className="mt-6 bg-sky-500 text-white px-6 py-2 rounded-xl hover:bg-sky-600 transition"
      >
        Salvar alterações
      </button>
    </div>
  );
}
