"use client";

import { Instagram, Facebook, ArrowLeft  } from "lucide-react";
import Link from "next/link";
export default function RedesSociais() {
  return (
    <section className="w-full bg-white dark:bg-slate-900 py-20 px-6 md:px-20 lg:px-32">

      {/* Título */}
      <div className="text-center mb-12">
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
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Redes Sociais</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-3 text-lg max-w-2xl mx-auto">
          Conecte-se com o PlacyHub e acompanhe novidades, dicas, conteúdos 
          exclusivos e inspirações para elevar seus anúncios e experiências.
        </p>
      </div>

      {/* Grid centralizado */}
      <div
        className="
          grid 
          gap-4
          place-items-center
          grid-cols-1
          md:grid-cols-2
        "
      >

        {/* Instagram */}
        <div className="group p-6 border border-gray-200 dark:border-slate-700 rounded-2xl hover:shadow-md transition-all duration-300 bg-white dark:bg-slate-800 w-full max-w-[380px] text-center">
          <Instagram className="w-10 h-10 mx-auto text-gray-800 dark:text-gray-300 group-hover:scale-110 transition" />
          <h2 className="text-xl font-semibold mt-4">Instagram</h2>
          <p className="text-gray-600 text-sm mt-2">
            Bastidores, novidades e inspirações.
          </p>
          <p className="text-blue-600 font-medium mt-3">@placyhub</p>
        </div>

        {/* Facebook */}
        <div className="group p-6 border border-gray-200 dark:border-slate-700 rounded-2xl hover:shadow-md transition-all duration-300 bg-white dark:bg-slate-800 w-full max-w-[380px] text-center">
          <Facebook className="w-10 h-10 mx-auto text-gray-800 dark:text-gray-300 group-hover:scale-110 transition" />
          <h2 className="text-xl font-semibold mt-4">Facebook</h2>
          <p className="text-gray-600 text-sm mt-2">
            Comunidade, interação e novidades.
          </p>
          <p className="text-blue-600 font-medium mt-3">facebook.com/placyhub</p>
        </div>

      </div>

    </section>
  );
}
