"use client";

import Navbar2 from "@/components/navbar2";
import { CheckCircle } from "lucide-react";

export default function ComoFunciona() {
  return (
    <>

      {/* HERO */}
      <section className="w-full min-h-[60vh] flex flex-col justify-center items-center text-center px-6 py-20">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">Como funciona</h1>

        <p className="text-lg max-w-2xl text-gray-700 dark:text-gray-300">
          Entenda como funciona o PlacyHub e veja como é simples anunciar seu espaço 
          ou realizar uma reserva com segurança e agilidade.
        </p>
      </section>

      {/* PASSO A PASSO */}
      <section className="px-6 md:px-20 py-16 bg-gray-100 dark:bg-slate-900">
        <h2 className="text-2xl font-bold mb-8 text-center">Passo a passo</h2>

        <ul className="max-w-2xl mx-auto space-y-4 text-gray-700 dark:text-gray-300">
          <li className="flex items-center gap-3">
            <CheckCircle className="text-green-600" /> Crie sua conta no PlacyHub
          </li>
          <li className="flex items-center gap-3">
            <CheckCircle className="text-green-600" /> Complete seu perfil com informações básicas
          </li>
          <li className="flex items-center gap-3">
            <CheckCircle className="text-green-600" /> Navegue pelos espaços disponíveis ou cadastre o seu
          </li>
          <li className="flex items-center gap-3">
            <CheckCircle className="text-green-600" /> Envie ou receba solicitações de reserva
          </li>
          <li className="flex items-center gap-3">
            <CheckCircle className="text-green-600" /> Confirme a reserva e realize o pagamento seguro
          </li>
        </ul>
      </section>

      {/* BENEFÍCIOS */}
      <section className="px-6 md:px-20 py-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Por que usar o PlacyHub?</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-gray-50 dark:bg-slate-800 rounded-xl shadow border border-transparent dark:border-slate-700">
            <h3 className="font-bold text-lg">Praticidade</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Encontre e reserve espaços rapidamente, sem complicação.
            </p>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-slate-800 rounded-xl shadow border border-transparent dark:border-slate-700">
            <h3 className="font-bold text-lg">Transparência</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Informações claras, avaliações reais e pagamentos seguros.
            </p>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-slate-800 rounded-xl shadow border border-transparent dark:border-slate-700">
            <h3 className="font-bold text-lg">Flexibilidade</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Opções para todos os tipos de eventos, tamanhos e estilos.
            </p>
          </div>
        </div>
      </section>

      {/* CHECKLIST */}
      <section className="px-6 md:px-20 py-16 bg-gray-100 dark:bg-slate-900">
        <h2 className="text-2xl font-bold mb-8 text-center">
          O que você precisa saber
        </h2>

        <ul className="max-w-xl mx-auto space-y-3 text-gray-700 dark:text-gray-300">
          <li>• Cada reserva possui regras próprias definidas pelo anfitrião</li>
          <li>• Cancelamentos seguem a política de cada espaço</li>
          <li>• Pagamentos são processados com segurança</li>
          <li>• Você pode conversar com o anfitrião antes de reservar</li>
          <li>• O PlacyHub oferece suporte caso tenha algum problema</li>
        </ul>
      </section>

      {/* CTA FINAL */}
      <section className="w-full flex flex-col justify-center items-center text-center px-6 py-16 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100">
        <h2 className="text-2xl font-bold mb-4">Pronto para usar o PlacyHub?</h2>
        <button className="mt-8 px-8 py-3 bg-[#02aeee] text-white rounded-xl hover:bg-[#029bd5] transition">
          Criar minha conta
        </button>
      </section>

    </>
  );
}
