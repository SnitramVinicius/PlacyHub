"use client";
import {ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PoliticaPrivacidade() {
  return (
    <>
      {/* HERO */}
      <section className="w-full min-h-[40vh] flex flex-col justify-center items-center text-center px-6 py-20 bg-white dark:bg-slate-900">
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
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">Política de Privacidade</h1>
        <p className="text-lg max-w-3xl text-gray-700 dark:text-gray-300">
          A sua privacidade é importante para nós. Esta Política descreve como coletamos,
          usamos e protegemos suas informações dentro da plataforma PlacyHub.
        </p>
      </section>

      {/* CONTEÚDO */}
      <section className="px-6 md:px-20 py-16 max-w-4xl mx-auto space-y-10 text-gray-800 dark:text-gray-300 leading-relaxed bg-white dark:bg-slate-900">

        {/* 1 */}
        <div>
         <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">1. Informações que Coletamos</h2>
          <p>Podemos coletar os seguintes tipos de informações:</p>

          <ul className="list-disc ml-6 mt-2 space-y-2">
            <li><b>Informações pessoais:</b> nome, e-mail, telefone, CPF (quando necessário), data de nascimento.</li>
            <li><b>Informações de uso:</b> páginas acessadas, tempo de navegação, cliques e interações.</li>
            <li><b>Informações de localização:</b> aproximada, quando autorizada pelo usuário.</li>
            <li><b>Dados de pagamento:</b> processados de forma segura por intermediadores financeiros.</li>
            <li><b>Fotos e dados do espaço:</b> para criação e gerenciamento de anúncios.</li>
          </ul>
        </div>

        {/* 2 */}
        <div>
         <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">2. Como Utilizamos suas Informações</h2>
          <p>Usamos seus dados para:</p>

          <ul className="list-disc ml-6 mt-2 space-y-2">
            <li>criar e gerenciar sua conta;</li>
            <li>permitir anúncios e reservas de espaços;</li>
            <li>personalizar sua experiência na plataforma;</li>
            <li>processar pagamentos de forma segura;</li>
            <li>enviar atualizações e notificações relevantes;</li>
            <li>melhorar nossos serviços através de análises internas.</li>
          </ul>
        </div>

        {/* 3 */}
        <div>
         <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">3. Compartilhamento de Informações</h2>
          <p>
            O PlacyHub não vende ou compartilha suas informações pessoais com terceiros 
            exceto nas seguintes situações:
          </p>

          <ul className="list-disc ml-6 mt-2 space-y-2">
            <li>intermediadores de pagamento para processar transações;</li>
            <li>autoridades legais, quando exigido por lei;</li>
            <li>prestadores de serviço que auxiliam na operação da plataforma.</li>
          </ul>
        </div>

        {/* 4 */}
        <div>
         <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">4. Cookies e Tecnologias de Rastreamento</h2>
          <p>
            Utilizamos cookies para melhorar sua experiência, lembrar suas preferências,
            entender o uso do site e oferecer conteúdo personalizado. Você pode desativar
            cookies diretamente no seu navegador, mas algumas funcionalidades podem ser afetadas.
          </p>
        </div>

        {/* 5 */}
        <div>
         <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">5. Proteção e Segurança dos Dados</h2>
          <p>
            Aplicamos medidas rigorosas de segurança digital, incluindo criptografia,
            firewalls e monitoramento constante para proteger seus dados contra acesso não autorizado.
          </p>
        </div>

        {/* 6 */}
        <div>
         <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">6. Retenção de Dados</h2>
          <p>
            Manteremos seus dados enquanto sua conta estiver ativa ou enquanto for
            necessário para cumprir obrigações legais, prevenir fraudes ou resolver disputas.
          </p>
        </div>

        {/* 7 */}
        <div>
         <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">7. Direitos do Usuário</h2>
          <p>Você pode, a qualquer momento:</p>

          <ul className="list-disc ml-6 mt-2 space-y-2">
            <li>solicitar acesso às suas informações;</li>
            <li>corrigir dados incorretos;</li>
            <li>solicitar a exclusão da conta e dos dados pessoais;</li>
            <li>retirar seu consentimento sobre o uso de dados;</li>
            <li>solicitar portabilidade das informações.</li>
          </ul>
        </div>

        {/* 8 */}
        <div>
         <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">8. Alterações nesta Política</h2>
          <p>
            O PlacyHub pode atualizar esta Política de Privacidade periodicamente.
            Quando isso ocorrer, informaremos na plataforma e a data da última
            atualização será sempre exibida no final do documento.
          </p>
        </div>

        {/* 9 */}
        <div>
         <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">9. Contato</h2>
          <p>
            Se você tiver dúvidas sobre o tratamento de seus dados, entre em contato:
          </p>
          <p className="font-semibold mt-1">suporte@placyhub.com</p>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="w-full flex flex-col justify-center items-center text-center px-6 py-16 bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
       <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Ficou com alguma dúvida?</h2>
        <a href="/suporte-locador">
          <button className="mt-8 px-8 py-3 bg-[#02aeee] text-white rounded-xl hover:bg-[#029bd5] transition">
            Acessar Suporte
          </button>
        </a>
      </section>
    </>
  );
}
