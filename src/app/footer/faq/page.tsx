"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

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
  <section className="w-full bg-white dark:bg-slate-900 py-20 px-6 md:px-20 lg:px-32">

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">FAQ – Perguntas Frequentes</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-3 text-lg max-w-2xl mx-auto">
          Aqui você encontra respostas rápidas para as dúvidas mais comuns sobre a plataforma.
        </p>
      </div>

      {/* Lista de Perguntas */}
      <div className="max-w-3xl mx-auto space-y-4">

        {perguntas.map((item, index) => (
          <div
            key={index}
           className="border border-gray-200 dark:border-slate-700 rounded-2xl p-5 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer"
            onClick={() => toggle(index)}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{item.pergunta}</h2>
              <ChevronDown
                className={`w-6 h-6 transition-transform ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </div>

            {/* Resposta */}
            {openIndex === index && (
              <p className="text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">
                {item.resposta}
              </p>
            )}
          </div>
        ))}

      </div>
    </section>
  );
}
