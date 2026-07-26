"use client";

import { ArrowLeft, Shield, Eye, Lock, Database, UserCheck, Mail, Clock, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function PoliticaPrivacidade() {
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
          Política de Privacidade
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          A sua privacidade é importante para nós. Esta Política descreve como coletamos,
          usamos e protegemos suas informações dentro da plataforma PlacyHub.
        </p>
      </div>

      {/* Conteúdo */}
      <div className="max-w-4xl mx-auto px-4 py-8 pb-20">
        <div className="space-y-6">
          
          {/* 1. Informações que Coletamos */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center">
                <Database size={20} className="text-sky-500" />
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                1. Informações que Coletamos
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-3">Podemos coletar os seguintes tipos de informações:</p>
            <ul className="list-disc ml-6 space-y-2 text-gray-600 dark:text-gray-300">
              <li><span className="font-semibold">Informações pessoais:</span> nome, e-mail, telefone, CPF (quando necessário), data de nascimento.</li>
              <li><span className="font-semibold">Informações de uso:</span> páginas acessadas, tempo de navegação, cliques e interações.</li>
              <li><span className="font-semibold">Informações de localização:</span> aproximada, quando autorizada pelo usuário.</li>
              <li><span className="font-semibold">Dados de pagamento:</span> processados de forma segura por intermediadores financeiros.</li>
              <li><span className="font-semibold">Fotos e dados do espaço:</span> para criação e gerenciamento de anúncios.</li>
            </ul>
          </div>

          {/* 2. Como Utilizamos suas Informações */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center">
                <Eye size={20} className="text-sky-500" />
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                2. Como Utilizamos suas Informações
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-3">Usamos seus dados para:</p>
            <ul className="list-disc ml-6 space-y-2 text-gray-600 dark:text-gray-300">
              <li>criar e gerenciar sua conta;</li>
              <li>permitir anúncios e reservas de espaços;</li>
              <li>personalizar sua experiência na plataforma;</li>
              <li>processar pagamentos de forma segura;</li>
              <li>enviar atualizações e notificações relevantes;</li>
              <li>melhorar nossos serviços através de análises internas.</li>
            </ul>
          </div>

          {/* 3. Compartilhamento de Informações */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center">
                <UserCheck size={20} className="text-sky-500" />
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                3. Compartilhamento de Informações
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-3">
              O PlacyHub não vende ou compartilha suas informações pessoais com terceiros 
              exceto nas seguintes situações:
            </p>
            <ul className="list-disc ml-6 space-y-2 text-gray-600 dark:text-gray-300">
              <li>intermediadores de pagamento para processar transações;</li>
              <li>autoridades legais, quando exigido por lei;</li>
              <li>prestadores de serviço que auxiliam na operação da plataforma.</li>
            </ul>
          </div>

          {/* 4. Cookies e Tecnologias de Rastreamento */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center">
                <AlertTriangle size={20} className="text-sky-500" />
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                4. Cookies e Tecnologias de Rastreamento
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Utilizamos cookies para melhorar sua experiência, lembrar suas preferências,
              entender o uso do site e oferecer conteúdo personalizado. Você pode desativar
              cookies diretamente no seu navegador, mas algumas funcionalidades podem ser afetadas.
            </p>
          </div>

          {/* 5. Proteção e Segurança dos Dados */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center">
                <Lock size={20} className="text-sky-500" />
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                5. Proteção e Segurança dos Dados
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Aplicamos medidas rigorosas de segurança digital, incluindo criptografia,
              firewalls e monitoramento constante para proteger seus dados contra acesso não autorizado.
            </p>
          </div>

          {/* 6. Retenção de Dados */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center">
                <Clock size={20} className="text-sky-500" />
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                6. Retenção de Dados
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Manteremos seus dados enquanto sua conta estiver ativa ou enquanto for
              necessário para cumprir obrigações legais, prevenir fraudes ou resolver disputas.
            </p>
          </div>

          {/* 7. Direitos do Usuário */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center">
                <UserCheck size={20} className="text-sky-500" />
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                7. Direitos do Usuário
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-3">Você pode, a qualquer momento:</p>
            <ul className="list-disc ml-6 space-y-2 text-gray-600 dark:text-gray-300">
              <li>solicitar acesso às suas informações;</li>
              <li>corrigir dados incorretos;</li>
              <li>solicitar a exclusão da conta e dos dados pessoais;</li>
              <li>retirar seu consentimento sobre o uso de dados;</li>
              <li>solicitar portabilidade das informações.</li>
            </ul>
          </div>

          {/* 8. Alterações nesta Política */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center">
                <AlertTriangle size={20} className="text-sky-500" />
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                8. Alterações nesta Política
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              O PlacyHub pode atualizar esta Política de Privacidade periodicamente.
              Quando isso ocorrer, informaremos na plataforma e a data da última
              atualização será sempre exibida no final do documento.
            </p>
          </div>

          {/* 9. Contato */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center">
                <Mail size={20} className="text-sky-500" />
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                9. Contato
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Se você tiver dúvidas sobre o tratamento de seus dados, entre em contato:
            </p>
            <p className="font-semibold text-sky-600 dark:text-sky-400 mt-2">
              placyhub@gmail.com
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}