"use client";

import { 
  ArrowLeft, 
  FileText, 
  Shield, 
  CreditCard, 
  Calendar, 
  AlertCircle, 
  Mail, 
  Users, 
  XCircle,
  CheckCircle 
} from "lucide-react";
import Link from "next/link";

export default function TermosDeUso() {
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
          Termos de Uso
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Estes Termos de Uso regulam a utilização da plataforma PlacyHub,
          responsável por conectar locadores de espaços a locatários interessados.
        </p>
      </div>

      {/* Conteúdo */}
      <div className="max-w-4xl mx-auto px-4 py-8 pb-20">
        <div className="space-y-6">
          
          {/* 1. Aceitação dos Termos */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center">
                <CheckCircle size={20} className="text-sky-500" />
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                1. Aceitação dos Termos
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Ao acessar ou utilizar o PlacyHub, você declara que leu, compreendeu e 
              concorda com estes Termos de Uso. Caso não concorde, você deve interromper 
              imediatamente o uso da plataforma.
            </p>
          </div>

          {/* 2. Sobre o PlacyHub */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center">
                <Users size={20} className="text-sky-500" />
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                2. Sobre o PlacyHub
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              O PlacyHub é uma plataforma que facilita a conexão entre pessoas que desejam 
              anunciar espaços e usuários que desejam locá-los. Não somos proprietários, 
              gestores ou responsáveis pelos espaços anunciados, atuando apenas como 
              intermediários tecnológicos.
            </p>
          </div>

          {/* 3. Cadastro de Usuário */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center">
                <Users size={20} className="text-sky-500" />
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                3. Cadastro de Usuário
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Para utilizar determinados recursos, o usuário deverá criar uma conta fornecendo 
              informações verdadeiras e atualizadas. O usuário é responsável por manter a 
              confidencialidade de sua senha e por todas as atividades realizadas em sua conta.
            </p>
          </div>

          {/* 4. Anúncios de Espaços */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center">
                <Calendar size={20} className="text-sky-500" />
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                4. Anúncios de Espaços
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Locadores são inteiramente responsáveis pelas informações dos anúncios, incluindo:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-600 dark:text-gray-300">
              <li>descrição do espaço;</li>
              <li>fotos publicadas;</li>
              <li>regras do local;</li>
              <li>preços e disponibilidade;</li>
              <li>cumprimento das condições anunciadas.</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              O PlacyHub poderá remover anúncios que violem estes termos ou contenham informações incorretas.
            </p>
          </div>

          {/* 5. Reservas e Pagamentos */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center">
                <CreditCard size={20} className="text-sky-500" />
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                5. Reservas e Pagamentos
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Todas as reservas são processadas dentro da plataforma. O locador autoriza o PlacyHub 
              a realizar a intermediação financeira, recebendo o valor, descontando a taxa da plataforma 
              e repassando o restante ao locador conforme descrito nas políticas vigentes.
            </p>
          </div>

          {/* 6. Cancelamentos e Reembolsos */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center">
                <XCircle size={20} className="text-sky-500" />
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                6. Cancelamentos e Reembolsos
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              As regras de cancelamento variam conforme o anúncio. O locador deve definir suas regras 
              claramente, e o locatário deve concordar com elas antes de concluir a reserva.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              O PlacyHub atua apenas como intermediador no processo de reembolso, seguindo as políticas 
              definidas pelo locador e pela plataforma.
            </p>
          </div>

          {/* 7. Uso Indevido da Plataforma */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center">
                <AlertCircle size={20} className="text-sky-500" />
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                7. Uso Indevido da Plataforma
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              É proibido utilizar o PlacyHub para atividades ilegais, fraudes, publicações enganosas 
              ou qualquer ação que prejudique outros usuários ou a integridade da plataforma.
            </p>
          </div>

          {/* 8. Limitação de Responsabilidade */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center">
                <Shield size={20} className="text-sky-500" />
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                8. Limitação de Responsabilidade
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              O PlacyHub não é responsável por eventos ocorridos nos espaços anunciados, incluindo 
              danos, acidentes, atrasos, problemas de estrutura, condutas inadequadas ou qualquer 
              ocorrência relacionada ao uso do espaço.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Nossa responsabilidade limita-se à operação da plataforma e ao suporte relacionado à reserva.
            </p>
          </div>

          {/* 9. Alterações dos Termos */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center">
                <Calendar size={20} className="text-sky-500" />
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                9. Alterações dos Termos
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              O PlacyHub pode atualizar estes Termos de Uso quando necessário. As alterações serão 
              comunicadas na plataforma, e a continuidade do uso implica aceitação das novas condições.
            </p>
          </div>

          {/* 10. Contato */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center">
                <Mail size={20} className="text-sky-500" />
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                10. Contato
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Em caso de dúvidas sobre estes termos, você pode entrar em contato pelo e-mail:
            </p>
            <p className="font-semibold text-sky-600 dark:text-sky-400 mt-2">
              suporte@placyhub.com
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}