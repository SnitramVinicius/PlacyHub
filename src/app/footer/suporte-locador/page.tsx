"use client";

import { MessageSquare, HelpCircle, Wallet, PhoneCall, Mail, Ticket, BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SupportLocador() {
  return (
   <section className="py-20 bg-white dark:bg-slate-900">
   
      <div className="max-w-6xl mx-auto px-6 text-center">
 <div className="w-full mb-8 flex justify-end">
                              <Link
                                href="/"
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
        {/* Título */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Suporte para o Locador
        </h2>

        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto mb-12">
          No PlacyHub, você nunca fica sozinho. Assim que cadastra seu espaço,
          nosso time está disponível para te ajudar em cada etapa do processo.
        </p>

        {/* Blocos principais */}
        <div className="grid md:grid-cols-3 gap-8">

          <div className="p-6 bg-gray-50 dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md transition border border-transparent dark:border-slate-700">
            <MessageSquare className="mx-auto mb-3 w-10 h-10 text-gray-700 dark:text-gray-300" />
            <h3 className="text-xl font-semibold mb-3">Ajuda para Anunciantes</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Suporte sempre que você precisar durante o processo de anúncio.
            </p>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md transition border border-transparent dark:border-slate-700">
            <HelpCircle className="mx-auto mb-3 w-10 h-10 text-gray-700 dark:text-gray-300" />
            <h3 className="text-xl font-semibold mb-3">Suporte nas Reservas</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Dúvidas sobre clientes, mensagens ou confirmações? Estamos aqui.
            </p>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md transition border border-transparent dark:border-slate-700">
            <Wallet className="mx-auto mb-3 w-10 h-10 text-gray-700 dark:text-gray-300" />
            <h3 className="text-xl font-semibold mb-3">Pagamentos e Repasses</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Acompanhamento completo do processo de pagamento até o repasse.
            </p>
          </div>

        </div>

        {/* Canais de suporte */}
        <h3 className="text-2xl font-bold mt-20 mb-8">Canais de Atendimento</h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="p-6 bg-gray-50 dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md transition border border-transparent dark:border-slate-700">
            <PhoneCall className="mx-auto mb-2 w-9 h-9 text-gray-700 dark:text-gray-300" />
            <h4 className="text-lg font-semibold mb-2">WhatsApp</h4>
            <p className="text-gray-600 dark:text-gray-300">Atendimento rápido e direto.</p>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md transition border border-transparent dark:border-slate-700">
            <Mail className="mx-auto mb-2 w-9 h-9 text-gray-700 dark:text-gray-300" />
            <h4 className="text-lg font-semibold mb-2">E-mail</h4>
            <p className="text-gray-600 dark:text-gray-300">Para dúvidas mais detalhadas.</p>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md transition border border-transparent dark:border-slate-700">
            <Ticket className="mx-auto mb-2 w-9 h-9 text-gray-700 dark:text-gray-300" />
            <h4 className="text-lg font-semibold mb-2">Sistema de Tickets</h4>
            <p className="text-gray-600 dark:text-gray-300">
              Abra solicitações direto pelo painel do locador.
            </p>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md transition border border-transparent dark:border-slate-700">
            <BookOpen className="mx-auto mb-2 w-9 h-9 text-gray-700 dark:text-gray-300" />
            <h4 className="text-lg font-semibold mb-2">Central de Ajuda</h4>
            <p className="text-gray-600 dark:text-gray-300">
              Tutoriais, artigos e respostas para tudo o que você precisa.
            </p>
          </div>
          
        </div>
<p className="text-sm text-gray-500 dark:text-gray-400 mb-10 mt-5">
  Atendimento em horário comercial. Mensagens enviadas fora desse horário serão respondidas no próximo período de atendimento.
</p>
      </div>
    </section>
  );
}
