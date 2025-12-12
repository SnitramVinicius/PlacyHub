"use client";

import { MessageSquare, HelpCircle, Wallet, PhoneCall, Mail, Ticket, BookOpen } from "lucide-react";

export default function SupportLocador() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">

        {/* Título */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          Suporte para o Locador
        </h2>

        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-12">
          No PlacyHub, você nunca fica sozinho. Assim que cadastra seu espaço,
          nosso time está disponível para te ajudar em cada etapa do processo.
        </p>

        {/* Blocos principais */}
        <div className="grid md:grid-cols-3 gap-8">

          <div className="p-6 bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition">
            <MessageSquare className="mx-auto mb-3 w-10 h-10 text-gray-700" />
            <h3 className="text-xl font-semibold mb-3">Ajuda para Anunciantes</h3>
            <p className="text-gray-600">
              Suporte sempre que você precisar durante o processo de anúncio.
            </p>
          </div>

          <div className="p-6 bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition">
            <HelpCircle className="mx-auto mb-3 w-10 h-10 text-gray-700" />
            <h3 className="text-xl font-semibold mb-3">Suporte nas Reservas</h3>
            <p className="text-gray-600">
              Dúvidas sobre clientes, mensagens ou confirmações? Estamos aqui.
            </p>
          </div>

          <div className="p-6 bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition">
            <Wallet className="mx-auto mb-3 w-10 h-10 text-gray-700" />
            <h3 className="text-xl font-semibold mb-3">Pagamentos e Repasses</h3>
            <p className="text-gray-600">
              Acompanhamento completo do processo de pagamento até o repasse.
            </p>
          </div>

        </div>

        {/* Canais de suporte */}
        <h3 className="text-2xl font-bold mt-20 mb-8">Canais de Atendimento</h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="p-6 bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition">
            <PhoneCall className="mx-auto mb-2 w-9 h-9 text-gray-700" />
            <h4 className="text-lg font-semibold mb-2">WhatsApp</h4>
            <p className="text-gray-600">Atendimento rápido e direto.</p>
          </div>

          <div className="p-6 bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition">
            <Mail className="mx-auto mb-2 w-9 h-9 text-gray-700" />
            <h4 className="text-lg font-semibold mb-2">E-mail</h4>
            <p className="text-gray-600">Para dúvidas mais detalhadas.</p>
          </div>

          <div className="p-6 bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition">
            <Ticket className="mx-auto mb-2 w-9 h-9 text-gray-700" />
            <h4 className="text-lg font-semibold mb-2">Sistema de Tickets</h4>
            <p className="text-gray-600">
              Abra solicitações direto pelo painel do locador.
            </p>
          </div>

          <div className="p-6 bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition">
            <BookOpen className="mx-auto mb-2 w-9 h-9 text-gray-700" />
            <h4 className="text-lg font-semibold mb-2">Central de Ajuda</h4>
            <p className="text-gray-600">
              Tutoriais, artigos e respostas para tudo o que você precisa.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
