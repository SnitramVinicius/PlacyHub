"use client";

import { useState } from "react";
import { ChevronDown, ArrowLeft, HelpCircle, MessageCircle, Mail, Phone } from "lucide-react";
import Link from "next/link";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const perguntas = [
    {
      pergunta: "O que é o PlacyHub?",
      resposta:
        "O PlacyHub é uma plataforma para anunciar e alugar espaços para festas, eventos e confraternizações de maneira rápida, segura e totalmente online.",
    },
    {
      pergunta: "Quanto custa anunciar meu espaço?",
      resposta:
        "O anúncio é totalmente gratuito. Você só paga uma pequena taxa quando a reserva é confirmada. Sem mensalidade e sem custos iniciais.",
    },
    {
      pergunta: "Como funciona o pagamento?",
      resposta:
        "O locatário paga pela plataforma, e o valor é repassado ao anfitrião após a confirmação do evento, garantindo segurança para ambas as partes.",
    },
    {
      pergunta: "Posso editar meu anúncio depois que eu criar?",
      resposta:
        "Sim! Você pode alterar fotos, regras, agenda, preço, disponibilidade e descrição a qualquer momento.",
    },
    {
      pergunta: "Como funciona o suporte ao locador?",
      resposta:
        "Nosso suporte auxilia com dúvidas sobre cadastro, anúncios, reservas, pagamentos e regras da plataforma.",
    },
    {
      pergunta: "O PlacyHub é seguro?",
      resposta:
        "Sim. Todos os pagamentos são processados com segurança e utilizamos verificações de identidade para proteger locadores e locatários.",
    },
  ];

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
          FAQ – Perguntas Frequentes
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Aqui você encontra respostas rápidas para as dúvidas mais comuns sobre a plataforma.
        </p>
      </div>

      {/* Lista de Perguntas */}
      <div className="max-w-3xl mx-auto px-4 py-8 pb-20">
        <div className="space-y-4">
          {perguntas.map((item, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md cursor-pointer"
              onClick={() => toggle(index)}
            >
              <div className="p-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {item.pergunta}
                  </h2>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {/* Resposta com animação */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? "max-h-96 mt-4" : "max-h-0"
                  }`}
                >
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-4">
                    {item.resposta}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ainda tem dúvidas? */}
        <div className="mt-12 text-center">
          <div className="bg-sky-50 dark:bg-sky-900/20 rounded-2xl p-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Ainda tem dúvidas?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Nossa equipe está disponível para ajudar você em qualquer questão.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/suporte"
                className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-medium hover:from-sky-600 hover:to-blue-700 transition-all shadow-md"
              >
                <MessageCircle size={18} />
                Central de Ajuda
              </a>
              <a 
                href="mailto:suporte@placyhub.com"
                className="inline-flex items-center justify-center gap-2 px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              >
                <Mail size={18} />
                suporte@placyhub.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}