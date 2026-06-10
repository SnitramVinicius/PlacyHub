"use client";

import { MessageSquare, HelpCircle, Wallet, PhoneCall, Mail, Ticket, BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SupportLocador() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      
      {/* Header com logo e botão voltar */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-gray-300 dark:hover:border-slate-600 hover:text-gray-700 dark:hover:text-gray-200 hover:shadow-sm transition-all duration-300 group"
            aria-label="Voltar"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform duration-300" />
          </Link>
          
          <Link href="/">
            <img src="/placyhub.png" alt="PlacyHub Logo" className="h-10 w-auto" />
          </Link>
          
          <div className="w-10"></div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 text-center py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Suporte para o Locador
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          No PlacyHub, você nunca fica sozinho. Assim que cadastra seu espaço,
          nosso time está disponível para te ajudar em cada etapa do processo.
        </p>
      </div>

      {/* Blocos principais */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all group text-center">
            <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <MessageSquare size={32} className="text-sky-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Ajuda para Anunciantes
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Suporte sempre que você precisar durante o processo de anúncio.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all group text-center">
            <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <HelpCircle size={32} className="text-sky-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Suporte nas Reservas
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Dúvidas sobre clientes, mensagens ou confirmações? Estamos aqui.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all group text-center">
            <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Wallet size={32} className="text-sky-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Pagamentos e Repasses
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Acompanhamento completo do processo de pagamento até o repasse.
            </p>
          </div>

        </div>
      </div>

      {/* Canais de Atendimento */}
      <div className="bg-white dark:bg-gray-800 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Canais de Atendimento
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* WhatsApp */}
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-6 hover:shadow-md transition-all group text-center">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <PhoneCall size={28} className="text-green-500" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                WhatsApp
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Atendimento rápido e direto.
              </p>
            </div>

            {/* E-mail */}
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-6 hover:shadow-md transition-all group text-center">
              <div className="w-14 h-14 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Mail size={28} className="text-sky-500" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                E-mail
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Para dúvidas mais detalhadas.
              </p>
            </div>

            {/* Sistema de Tickets */}
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-6 hover:shadow-md transition-all group text-center">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Ticket size={28} className="text-purple-500" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Sistema de Tickets
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Abra solicitações direto pelo painel do locador.
              </p>
            </div>

            {/* Central de Ajuda */}
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-6 hover:shadow-md transition-all group text-center">
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <BookOpen size={28} className="text-orange-500" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Central de Ajuda
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tutoriais, artigos e respostas para tudo o que você precisa.
              </p>
            </div>

          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
           Atendimento em horário comercial. Mensagens enviadas fora desse horário serão respondidas no próximo período de atendimento.
          </p>
        </div>
      </div>
    </div>
  );
}