"use client";

import { CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CadastreSeuEspaco() {
  return (
    <>

      {/* HERO */}
      <section className="w-full min-h-[60vh] flex flex-col justify-center items-center text-center px-6 py-20">
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
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">Cadastre seu espaço</h1>
        <p className="text-lg max-w-2xl text-gray-700 dark:text-gray-300">
          Leva apenas alguns minutos para começar a anunciar e transformar seu espaço em renda.
          O cadastro é rápido, simples e totalmente gratuito.
        </p>

        <button className="mt-8 px-8 py-3 bg-[#02aeee] text-white rounded-xl hover:bg-gray-900 transition">
          Iniciar cadastro
        </button>
      </section>

      {/* BENEFÍCIOS */}
      <section className="px-6 md:px-20 py-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Por que anunciar no PlacyHub?</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-gray-50 dark:bg-slate-800 rounded-xl shadow border border-transparent dark:border-slate-700">
            <h3 className="font-bold text-lg">Mais visibilidade</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Seu espaço aparece para centenas de locatários todos os dias.</p>
          </div>
          <div className="p-6 bg-gray-50 dark:bg-slate-800 rounded-xl shadow border border-transparent dark:border-slate-700">
            <h3 className="font-bold text-lg">Controle total</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Gerencie agenda, regras, preços e disponibilidade facilmente.</p>
          </div>
          <div className="p-6 bg-gray-50 dark:bg-slate-800 rounded-xl shadow border border-transparent dark:border-slate-700">
            <h3 className="font-bold text-lg">Pagamentos seguros</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Receba de forma garantida após a confirmação da reserva.</p>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="px-6 md:px-20 py-16 bg-gray-100 dark:bg-slate-900">
        <h2 className="text-2xl font-bold mb-8 text-center">Como funciona?</h2>

        <ul className="max-w-2xl mx-auto space-y-4 text-gray-700 dark:text-gray-300">
          <li className="flex items-center gap-3">
            <CheckCircle className="text-green-600" /> Faça seu cadastro
          </li>
          <li className="flex items-center gap-3">
            <CheckCircle className="text-green-600" /> Adicione fotos e informações do espaço
          </li>
          <li className="flex items-center gap-3">
            <CheckCircle className="text-green-600" /> Publique o anúncio
          </li>
          <li className="flex items-center gap-3">
            <CheckCircle className="text-green-600" /> Receba reservas e pagamentos
          </li>
        </ul>
      </section>

      {/* CHECKLIST */}
      <section className="px-6 md:px-20 py-16">
        <h2 className="text-2xl font-bold mb-8 text-center">O que você vai precisar</h2>

        <ul className="max-w-xl mx-auto space-y-3 text-gray-700 dark:text-gray-300">
          <li>• Fotos do espaço</li>
          <li>• Endereço e descrição</li>
          <li>• Preço por diária ou hora</li>
          <li>• Datas disponíveis</li>
          <li>• Regras importantes</li>
        </ul>
      </section>

      {/* CTA FINAL */}
      <section className="w-full flex flex-col justify-center items-center text-center px-6 py-16 bg-gray-100 dark:bg-slate-900 dark:text-gray-100 text-black">
        <h2 className="text-2xl font-bold mb-4">Pronto para começar?</h2>
        <button className="mt-8 px-8 py-3 bg-[#02aeee] text-white rounded-xl hover:bg-gray-900 transition">
          Começar agora
        </button>
      </section>
    </>
  );
}
