"use client";

import { CheckCircle, ArrowLeft, Camera, Users, Calendar, Shield } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CadastreSeuEspaco() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      
      {/* Header simples com logo */}
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
          Cadastre seu espaço
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Leva apenas alguns minutos para começar a anunciar e transformar seu espaço em renda.
          O cadastro é rápido, simples e totalmente gratuito.
        </p>
        
        <button
          onClick={() => router.push("/?openModal=true")}
          className="mt-8 px-8 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-semibold hover:from-sky-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          Iniciar cadastro
        </button>
      </div>

      {/* Benefícios */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
          Por que anunciar no PlacyHub?
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-12">
          Milhares de anfitriões confiam na PlacyHub para alugar seus espaços
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users size={24} className="text-sky-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Mais visibilidade
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Seu espaço aparece para centenas de locatários todos os dias, aumentando suas chances de reserva.
            </p>
          </div>
          
          {/* Card 2 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Calendar size={24} className="text-sky-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Controle total
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Gerencie agenda, regras, preços e disponibilidade facilmente pelo seu painel.
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
              Receba de forma garantida após a confirmação da reserva, com segurança e tranquilidade.
            </p>
          </div>
        </div>
      </div>

      {/* Como funciona */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
            Como funciona?
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-12">
            Simples e rápido, em apenas 4 passos
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-sky-500">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Cadastro</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Crie sua conta gratuitamente</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-sky-500">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Adicione fotos</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Mostre seu espaço aos locatários</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-sky-500">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Publique</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Seu anúncio vai ao ar</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-sky-500">4</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Receba reservas</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Comece a lucrar com seu espaço</p>
            </div>
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-sky-50 dark:bg-sky-900/20 rounded-2xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                O que você vai precisar
              </h2>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-green-500" />
                  Fotos do espaço (mínimo 5)
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-green-500" />
                  Endereço e descrição detalhada
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-green-500" />
                  Preço por diária ou hora
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-green-500" />
                  Datas disponíveis no calendário
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-green-500" />
                  Regras importantes do espaço
                </li>
              </ul>
            </div>
            
            <div className="flex-1 text-center">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                <Camera size={48} className="text-sky-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Dica importante
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Espaços com mais de 10 fotos recebem até 3x mais reservas!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="text-center pb-16">
        <button
          onClick={() => router.push("/?openModal=true")}
          className="px-8 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-semibold hover:from-sky-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          Começar agora - é grátis!
        </button>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          Sem compromisso. Cancele a qualquer momento.
        </p>
      </div>
    </div>
  );
}