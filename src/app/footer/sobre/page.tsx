"use client";
import { ArrowLeft, Users, Target, Heart, Sparkles, Shield, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function QuemSomos() {
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
          Quem Somos
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          O PlacyHub nasceu com a missão de facilitar a locação de espaços para eventos,
          tornando o processo simples, seguro e acessível tanto para locadores quanto
          para quem deseja encontrar o local perfeito.
        </p>
      </div>

      {/* Nossa História */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
            Nossa História
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-center">
            A ideia do PlacyHub surgiu da necessidade real de conectar pessoas que possuem
            espaços incríveis com quem busca um local ideal para festas, reuniões,
            celebrações e eventos em geral. Observamos que muitas pessoas têm espaços
            disponíveis, mas encontram dificuldades para divulgar, gerenciar e receber
            reservas de forma prática. Do outro lado, locatários enfrentam falta de opções
            confiáveis, plataformas confusas e burocracias.
            <br /><br />
            Assim, criamos uma plataforma intuitiva, moderna e transparente, que une esses
            dois mundos. O PlacyHub está em constante evolução para oferecer a melhor
            experiência possível.
          </p>
        </div>
      </div>

      {/* Nosso Propósito */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-sky-50 dark:bg-sky-900/20 rounded-2xl p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 bg-sky-100 dark:bg-sky-900/30 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Target size={40} className="text-sky-500" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Nosso Propósito
              </h2>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-2">• Tornar a locação de espaços mais simples e rápida.</li>
                <li className="flex items-center gap-2">• Oferecer segurança e confiança para ambas as partes.</li>
                <li className="flex items-center gap-2">• Ajudar donos de espaços a gerar renda com facilidade.</li>
                <li className="flex items-center gap-2">• Conectar pessoas a ambientes perfeitos para momentos especiais.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Nossos Valores */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Nossos Valores
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Valor 1 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all group text-center">
            <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Shield size={32} className="text-sky-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Transparência
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Tudo claro, direto e sem letras miúdas.
            </p>
          </div>

          {/* Valor 2 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all group text-center">
            <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Sparkles size={32} className="text-sky-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Inovação
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Buscamos sempre melhorar a experiência de uso.
            </p>
          </div>

          {/* Valor 3 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all group text-center">
            <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Heart size={32} className="text-sky-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Compromisso
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Focados em entregar suporte e ferramentas eficientes.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="text-center py-16 pb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Conheça o PlacyHub na prática
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Descubra como é fácil anunciar seu espaço e começar a receber reservas.
        </p>
        <button
          onClick={() => router.push("/?openModal=true")}
          className="px-8 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-semibold hover:from-sky-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          Iniciar cadastro
        </button>
      </div>
    </div>
  );
}