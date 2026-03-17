"use client";

import { Search, HelpCircle, Shield, MessageCircle } from "lucide-react";

export default function CentralDeAjuda() {
  return (
    <section className="w-full bg-white dark:bg-slate-900 py-20 px-6 md:px-20 lg:px-40">

      {/* TÍTULO */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Central de Ajuda</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-4 text-lg max-w-2xl mx-auto">
          Encontre respostas rápidas, tire dúvidas e receba suporte sempre que precisar.
        </p>
      </div>

      {/* CAMPO DE BUSCA */}
      <div className="max-w-2xl mx-auto mb-16">
        <div className="flex items-center gap-3 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 shadow-sm bg-white dark:bg-slate-800">
          <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            placeholder="Busque por palavras-chave (ex: cancelamento, pagamento...)"
            className="w-full outline-none text-gray-700 dark:text-gray-200 bg-transparent"
          />
        </div>
      </div>

      {/* CATEGORIAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">

        {/* Dúvidas Frequentes */}
        <div className="p-8 border border-gray-200 dark:border-slate-700 rounded-2xl hover:shadow-md transition bg-white dark:bg-slate-800 text-center cursor-pointer">
          <HelpCircle className="w-10 h-10 mx-auto text-gray-700 dark:text-gray-300" />
          <h2 className="text-xl font-semibold mt-4">Dúvidas Frequentes</h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
            Veja as respostas para as perguntas mais comuns dos usuários.
          </p>
        </div>

        {/* Segurança e Problemas */}
        <div className="p-8 border border-gray-200 dark:border-slate-700 rounded-2xl hover:shadow-md transition bg-white dark:bg-slate-800 text-center cursor-pointer">
          <Shield className="w-10 h-10 mx-auto text-gray-700 dark:text-gray-300" />
          <h2 className="text-xl font-semibold mt-4">Segurança</h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
            Informações sobre proteção, denúncias e confiança na plataforma.
          </p>
        </div>

        {/* Suporte */}
        <div className="p-8 border border-gray-200 dark:border-slate-700 rounded-2xl hover:shadow-md transition bg-white dark:bg-slate-800 text-center cursor-pointer">
          <MessageCircle className="w-10 h-10 mx-auto text-gray-700 dark:text-gray-300" />
          <h2 className="text-xl font-semibold mt-4">Fale com o Suporte</h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
            Entre em contato diretamente com nossa equipe de atendimento.
          </p>
        </div>

      </div>

      {/* SEÇÃO DE LINKS ÚTEIS */}
      <div className="space-y-10">
        
        <div>
          <h3 className="text-xl font-semibold">Assuntos mais procurados</h3>
          <ul className="mt-4 space-y-3 text-gray-700 dark:text-gray-300">
            <li>• Como cancelar uma reserva</li>
            <li>• Como alterar data do evento</li>
            <li>• Métodos de pagamento aceitos</li>
            <li>• Regras para anfitriões</li>
            <li>• Como anunciar meu espaço</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold">Precisa resolver algo específico?</h3>
          <ul className="mt-4 space-y-3 text-blue-600 dark:text-blue-400 font-medium">
            <li className="cursor-pointer hover:underline">→ Políticas de cancelamento</li>
            <li className="cursor-pointer hover:underline">→ Suporte para locador</li>
            <li className="cursor-pointer hover:underline">→ Segurança e denúncias</li>
            <li className="cursor-pointer hover:underline">→ Termos de uso</li>
            <li className="cursor-pointer hover:underline">→ Política de privacidade</li>
          </ul>
        </div>

      </div>

    </section>
  );
}
