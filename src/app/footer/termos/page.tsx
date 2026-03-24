"use client";

import {ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermosDeUso() {
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
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">Termos de Uso</h1>
        <p className="text-lg max-w-3xl text-gray-700 dark:text-gray-100">
          Estes Termos de Uso regulam a utilização da plataforma PlacyHub,
          responsável por conectar locadores de espaços a locatários interessados. 
        </p>
      </section>

      {/* CONTEÚDO */}
      <section className="px-6 md:px-20 py-16 max-w-4xl mx-auto space-y-10 text-gray-800 dark:text-gray-300 leading-relaxed bg-white dark:bg-slate-900">

        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">1. Aceitação dos Termos</h2>
          <p>
            Ao acessar ou utilizar o PlacyHub, você declara que leu, compreendeu e 
            concorda com estes Termos de Uso. Caso não concorde, você deve interromper 
            imediatamente o uso da plataforma.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">2. Sobre o PlacyHub</h2>
          <p>
            O PlacyHub é uma plataforma que facilita a conexão entre pessoas que desejam 
            anunciar espaços e usuários que desejam locá-los. Não somos proprietários, 
            gestores ou responsáveis pelos espaços anunciados, atuando apenas como 
            intermediários tecnológicos.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">3. Cadastro de Usuário</h2>
          <p>
            Para utilizar determinados recursos, o usuário deverá criar uma conta fornecendo 
            informações verdadeiras e atualizadas. O usuário é responsável por manter a 
            confidencialidade de sua senha e por todas as atividades realizadas em sua conta.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">4. Anúncios de Espaços</h2>
          <p>
            Locadores são inteiramente responsáveis pelas informações dos anúncios, incluindo:
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>descrição do espaço;</li>
            <li>fotos publicadas;</li>
            <li>regras do local;</li> 
            <li>preços e disponibilidade;</li>
            <li>cumprimento das condições anunciadas.</li>
          </ul>
          <p className="mt-2">
            O PlacyHub poderá remover anúncios que violem estes termos ou contenham informações incorretas.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">5. Reservas e Pagamentos</h2>
          <p>
            Todas as reservas são processadas dentro da plataforma. O locador autoriza o PlacyHub 
            a realizar a intermediação financeira, recebendo o valor, descontando a taxa da plataforma 
            e repassando o restante ao locador conforme descrito nas políticas vigentes.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">6. Cancelamentos e Reembolsos</h2>
          <p>
            As regras de cancelamento variam conforme o anúncio. O locador deve definir suas regras 
            claramente, e o locatário deve concordar com elas antes de concluir a reserva.
          </p>
          <p className="mt-2">
            O PlacyHub atua apenas como intermediador no processo de reembolso, seguindo as políticas 
            definidas pelo locador e pela plataforma.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">7. Uso Indevido da Plataforma</h2>
          <p>
            É proibido utilizar o PlacyHub para atividades ilegais, fraudes, publicações enganosas 
            ou qualquer ação que prejudique outros usuários ou a integridade da plataforma.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">8. Limitação de Responsabilidade</h2>
          <p>
            O PlacyHub não é responsável por eventos ocorridos nos espaços anunciados, incluindo 
            danos, acidentes, atrasos, problemas de estrutura, condutas inadequadas ou qualquer 
            ocorrência relacionada ao uso do espaço.
          </p>
          <p className="mt-2">
            Nossa responsabilidade limita-se à operação da plataforma e ao suporte relacionado à reserva.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">9. Alterações dos Termos</h2>
          <p>
            O PlacyHub pode atualizar estes Termos de Uso quando necessário. As alterações serão 
            comunicadas na plataforma, e a continuidade do uso implica aceitação das novas condições.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">10. Contato</h2>
          <p>
            Em caso de dúvidas sobre estes termos, você pode entrar em contato pelo e-mail:
          </p>
          <p className="font-semibold mt-1">suporte@placyhub.com</p>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="w-full flex flex-col justify-center items-center text-center px-6 py-16 bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Precisa de ajuda?</h2>
        <p className="max-w-xl text-gray-700 dark:text-gray-300 mb-6">
          Nossa equipe está disponível para esclarecer dúvidas sobre o funcionamento da plataforma.
        </p>
        <a href="/suporte-locador">
          <button className="mt-8 px-8 py-3 bg-[#02aeee] text-white rounded-xl hover:bg-[#029bd5] transition">
            Ir para o Suporte
          </button>
        </a>
      </section>
    </>
  );
}
