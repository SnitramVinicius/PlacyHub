"use client";

import { CheckCircle, ArrowLeft, Users, Calendar, Shield, CreditCard, MapPin, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ComoFunciona() {
  const [logado, setLogado] = useState(false);

useEffect(() => {
  const verificarUsuario = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      setLogado(true);
    }
  };

  verificarUsuario();
}, []);

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
          Como funciona
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Entenda como funciona o PlacyHub e veja como é simples anunciar seu espaço 
          ou realizar uma reserva com segurança e agilidade.
        </p>
      </div>

      {/* Passo a passo */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Passo a passo
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
          <ul className="space-y-4">
            {[
              "Crie sua conta no PlacyHub",
              "Complete seu perfil com informações básicas",
              "Navegue pelos espaços disponíveis ou cadastre o seu",
              "Envie ou receba solicitações de reserva",
              "Confirme a reserva e realize o pagamento seguro"
            ].map((texto, index) => (
              <li key={index} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={14} className="text-green-500" />
                </div>
                <span>{texto}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Por que usar o PlacyHub? */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Por que usar o PlacyHub?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users size={24} className="text-sky-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Praticidade
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Encontre e reserve espaços rapidamente, sem complicação.
            </p>
          </div>
          
          {/* Card 2 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Shield size={24} className="text-sky-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Transparência
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Informações claras, avaliações reais e pagamentos seguros.
            </p>
          </div>
          
          {/* Card 3 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Calendar size={24} className="text-sky-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Flexibilidade
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Opções para todos os tipos de eventos, tamanhos e estilos.
            </p>
          </div>
        </div>
      </div>

      {/* O que você precisa saber */}
      <div className="bg-sky-50 dark:bg-sky-900/20 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
              O que você precisa saber
            </h2>
            <ul className="max-w-xl mx-auto space-y-3">
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <div className="w-1.5 h-1.5 bg-sky-500 rounded-full"></div>
                Cada reserva possui regras próprias definidas pelo anfitrião
              </li>
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <div className="w-1.5 h-1.5 bg-sky-500 rounded-full"></div>
                Cancelamentos seguem a política de cada espaço
              </li>
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <div className="w-1.5 h-1.5 bg-sky-500 rounded-full"></div>
                Pagamentos são processados com segurança
              </li>
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <div className="w-1.5 h-1.5 bg-sky-500 rounded-full"></div>
                Você pode conversar com o anfitrião antes de reservar
              </li>
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <div className="w-1.5 h-1.5 bg-sky-500 rounded-full"></div>
                O PlacyHub oferece suporte caso tenha algum problema
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      {!logado && (
        <div className="text-center py-16 pb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Pronto para usar o PlacyHub?
          </h2>
          <Link
            href="/login"
            className="inline-block px-8 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-semibold hover:from-sky-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            Criar minha conta
          </Link>
        </div>
      )}
    </div>
  );
}