"use client";

import { CheckCircle, ArrowLeft, Users, Calendar, Shield, CreditCard, TrendingUp, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PlanosEComissoes() {
  const router = useRouter();

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
          Comissão do PlacyHub
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          No PlacyHub, você só paga quando recebe. 
          Não existem mensalidades, taxas ocultas ou planos pagos.
        </p>
        <p className="text-md text-gray-500 dark:text-gray-400 max-w-xl mx-auto mt-4">
          Nosso objetivo é facilitar seu faturamento — por isso, usamos um modelo simples e transparente.
        </p>
      </div>

      {/* Como funciona a comissão */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Como funciona a comissão?
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center">
          <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp size={32} className="text-sky-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Modelo transparente
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            O PlacyHub recebe uma pequena porcentagem somente quando sua reserva é finalizada.
            Isso garante que você anuncie sem riscos e sem custos iniciais.
          </p>
        </div>
      </div>

      {/* O que está incluso */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          O que está incluso nessa comissão?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users size={24} className="text-sky-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Divulgação do seu espaço
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Sua página aparece para centenas de locatários diariamente.
            </p>
          </div>
          
          {/* Card 2 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <HelpCircle size={24} className="text-sky-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Suporte ao anfitrião
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Auxílio em reservas, problemas, pagamentos e atendimentos.
            </p>
          </div>
          
          {/* Card 3 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Shield size={24} className="text-sky-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Pagamentos seguros
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Processo automatizado com segurança e controle total.
            </p>
          </div>
        </div>
      </div>

      {/* Como tudo acontece na prática */}
      <div className="bg-sky-50 dark:bg-sky-900/20 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
              Como tudo acontece na prática
            </h2>
            <ul className="space-y-4">
              {[
                "O pagamento do cliente é confirmado",
                "A comissão é descontada automaticamente",
                "Você recebe o valor restante na sua conta após o evento"
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
      </div>

      {/* CTA Final */}
      <div className="text-center py-16 pb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Pronto para anunciar sem mensalidade?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Cadastre seu espaço gratuitamente e pague apenas quando faturar.
        </p>
        <button
          onClick={() => router.push("/?openModal=true")}
          className="px-8 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-semibold hover:from-sky-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          Começar agora
        </button>
      </div>
    </div>
  );
}