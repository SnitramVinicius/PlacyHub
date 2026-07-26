"use client";

import { ArrowLeft, MessageCircle, Mail, Phone, Clock, MapPin } from "lucide-react";
import Link from "next/link";

export default function FaleConosco() {
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
          Fale Conosco
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Precisa de ajuda? Nossa equipe está disponível para atender você.
        </p>
      </div>

      {/* Cards de Contato */}
      <div className="max-w-4xl mx-auto px-4 py-12 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* WhatsApp */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 hover:shadow-md transition-all group text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <MessageCircle size={32} className="text-green-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              WhatsApp
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Converse com a gente pelo WhatsApp.
            </p>
            <a
              href="https://wa.me/5567992600081"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-all"
            >
              <MessageCircle size={18} />
              Abrir WhatsApp
            </a>
          </div>

          {/* E-mail */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 hover:shadow-md transition-all group text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Mail size={32} className="text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              E-mail
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Prefere enviar um e-mail? Responderemos o mais rápido possível.
            </p>
            <a
              href="mailto:placyhub@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-all"
            >
              <Mail size={18} />
              Enviar E-mail
            </a>
          </div>

        </div>        
      </div>
    </div>
  );
}