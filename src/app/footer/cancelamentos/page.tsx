"use client";
import {ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PoliticasDeCancelamento() {
  return (
   <section className="w-full bg-white dark:bg-slate-900 py-20 px-6 md:px-20 lg:px-40">

      {/* Título */}
      <div className="text-center mb-14">
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
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Políticas de Cancelamento</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-4 text-lg max-w-2xl mx-auto">
          Entenda como funcionam os cancelamentos, reembolsos e alterações de reservas no PlacyHub.
        </p>
      </div>

     <div className="space-y-12 text-gray-800 dark:text-gray-200 leading-relaxed">

        {/* 1 */}
        <div>
          <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">1. Cancelamento pelo Hóspede</h2>

          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              <strong>Cancelamento gratuito – até 48 horas:</strong>  
              Se o cliente cancelar em até <strong>48 horas</strong> após a reserva 
              e faltando mais de 7 dias para o evento, ele recebe reembolso total.
            </p>

            <p>
              <strong>Cancelamento com antecedência (7 dias antes):</strong>  
              Reembolso de <strong>70%</strong> do valor pago.  
              Os 30% restantes cobrem custos operacionais.
            </p>

            <p>
              <strong>Cancelamento tardio (menos de 7 dias):</strong>  
              Não há reembolso.  
              Isso protege o anfitrião, que dificilmente conseguirá novo cliente no período.
            </p>
          </div>
        </div>

        {/* 2 */}
        <div>
          <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">2. Cancelamento pelo Anfitrião</h2>

          <p className="text-gray-700 dark:text-gray-300">
            Caso o anfitrião precise cancelar, o cliente recebe <strong>100% do valor</strong>.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            Cancelamentos recorrentes podem gerar penalidades, como:
          </p>
          <ul className="list-disc ml-6 text-gray-700 dark:text-gray-300 mt-2">
            <li>menor visibilidade nos resultados;</li>
            <li>bloqueio temporário para novas reservas.</li>
          </ul>
        </div>

        {/* 3 */}
        <div>
          <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">3. Força Maior</h2>

          <p className="text-gray-700 dark:text-gray-300">
            Em casos de eventos climáticos extremos, problemas estruturais, falta de energia,
            questões de saúde ou impedimentos legais, o cliente pode escolher entre:
          </p>
          <ul className="list-disc ml-6 text-gray-700 dark:text-gray-300 mt-2">
            <li>reembolso total;</li>
            <li>remarcação sem custo adicional.</li>
          </ul>
        </div>

        {/* 4 */}
        <div>
          <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">4. Não Comparecimento (No-Show)</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Se o cliente não comparecer no dia da reserva sem aviso prévio, 
            <strong>não haverá reembolso.</strong>
          </p>
        </div>

        {/* 5 */}
        <div>
          <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">5. Reembolsos</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Reembolsos são processados em até 
            <strong> 3 a 10 dias úteis</strong>, dependendo do banco e da forma de pagamento.
          </p>
        </div>

        {/* 6 */}
        <div>
          <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">6. Alterações de Data</h2>

          <p className="text-gray-700 dark:text-gray-300">
            Alterações podem ser feitas:
          </p>
          <ul className="list-disc ml-6 text-gray-700 dark:text-gray-300 mt-2">
            <li><strong>Sem custo</strong> — se solicitadas com mais de 7 dias de antecedência;</li>
            <li><strong>Taxa de 30%</strong> — se solicitadas com menos de 7 dias.</li>
          </ul>

          <p className="text-gray-700 dark:text-gray-300 mt-2">
            A alteração está sujeita à disponibilidade do espaço.
          </p>
        </div>

      </div>

    </section>
  );
}
