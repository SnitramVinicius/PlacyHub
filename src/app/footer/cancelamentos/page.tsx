"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PoliticasDeCancelamento() {
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
          
          <div className="w-10"></div> {/* Espaçador para centralizar a logo */}
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 text-center py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Políticas de Cancelamento
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Entenda como funcionam os cancelamentos, reembolsos e alterações de reservas no PlacyHub.
        </p>
      </div>

      {/* Conteúdo */}
      <div className="max-w-4xl mx-auto px-4 py-8 pb-20">
        <div className="space-y-8">
          
          {/* 1. Cancelamento pelo Hóspede */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              1. Cancelamento pelo Hóspede
            </h2>
            <div className="space-y-3 text-gray-600 dark:text-gray-300">
              <p>
                <span className="font-semibold text-gray-800 dark:text-gray-200">Cancelamento gratuito – até 48 horas:</span>{" "}
                Se o cliente cancelar em até <strong>48 horas</strong> após a reserva, ele recebe reembolso total.
              </p>
              <p>
                <span className="font-semibold text-gray-800 dark:text-gray-200">Cancelamento após 48hs e com antecedência de até (7 dias antes da data do evento):</span>{" "}
                Reembolso de <strong>50%</strong> do valor pago. Os 50% restantes cobrem custos operacionais.
              </p>
              <p>
                <span className="font-semibold text-gray-800 dark:text-gray-200">Cancelamento tardio (menos de 7 dias):</span>{" "}
                Não há reembolso. Isso protege o anfitrião, que dificilmente conseguirá novo cliente no período.
              </p>
            </div>
          </div>

          {/* 2. Cancelamento pelo Anfitrião */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              2. Cancelamento pelo Anfitrião
            </h2>
            <div className="space-y-3 text-gray-600 dark:text-gray-300">
              <p>
                Caso o anfitrião precise cancelar, o cliente recebe <strong>100% do valor</strong>.
              </p>
              <p>
                Cancelamentos recorrentes podem gerar penalidades, como:
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>menor visibilidade nos resultados;</li>
                <li>bloqueio temporário para novas reservas.</li>
              </ul>
            </div>
          </div>

          {/* 3. Força Maior */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              3. Força Maior
            </h2>
            <div className="space-y-3 text-gray-600 dark:text-gray-300">
              <p>
                Em casos de eventos climáticos extremos, problemas estruturais, falta de energia,
                questões de saúde ou impedimentos legais, o cliente pode:
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>remarcar sem custo adicional, de acordo com a disponibilidade do local.</li>
              </ul>
            </div>
          </div>

          {/* 4. Não Comparecimento */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              4. Não Comparecimento (No-Show)
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Se o cliente não comparecer no dia da reserva sem aviso prévio,{" "}
              <strong>não haverá reembolso.</strong>
            </p>
          </div>

          {/* 5. Reembolsos */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              5. Reembolsos
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Reembolsos são processados em até{" "}
              <strong>3 a 10 dias úteis</strong>, dependendo do banco e da forma de pagamento.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}