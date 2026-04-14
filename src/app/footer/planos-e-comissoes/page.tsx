"use client";

import { CheckCircle, ArrowLeft} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PlanosEComissoes() {

    const router = useRouter();
  return (
    <>

      {/* HERO */}
      <section className="w-full min-h-[60vh] flex flex-col justify-center items-center text-center px-6 py-20">
         <div className="max-w-5xl mx-auto w-full">
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
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">Comissão do PlacyHub</h1>

        <p className="text-lg max-w-2xl text-gray-700 dark:text-gray-300">
          No PlacyHub, você só paga quando recebe. 
          Não existem mensalidades, taxas ocultas ou planos pagos.
        </p>

        <p className="text-lg max-w-xl mt-4 text-gray-700 dark:text-gray-300">
          Nosso objetivo é facilitar seu faturamento — por isso, usamos um modelo simples e transparente.
        </p>
      </section>

      {/* POR QUE COMISSÃO */}
      <section className="px-6 md:px-20 py-16 bg-gray-100
       dark:bg-slate-900">
        <h2 className="text-2xl font-bold mb-8 text-center">Como funciona a comissão?</h2>

        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-xl shadow border border-transparent dark:border-slate-700">
          <h3 className="text-xl font-semibold mb-4"> Modelo transparente</h3>
          <p className="text-gray-700 dark:text-gray-300">
            O PlacyHub recebe uma pequena porcentagem somente quando sua reserva é finalizada.
          </p>

          <p className="text-gray-700 dark:text-gray-300 mt-3">
            Isso garante que você anuncie sem riscos e sem custos iniciais.
          </p>
        </div>
      </section>

      {/* BENEFÍCIOS DA COMISSÃO */}
      <section className="px-6 md:px-20 py-16">
        <h2 className="text-2xl font-bold text-center mb-8">
          O que está incluso nessa comissão?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="p-6 bg-gray-50 dark:bg-slate-800 rounded-xl shadow border border-transparent dark:border-slate-700">
            <h3 className="font-bold text-lg">Divulgação do seu espaço</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Sua página aparece para centenas de locatários diariamente.
            </p>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-slate-800 rounded-xl shadow border border-transparent dark:border-slate-700">
            <h3 className="font-bold text-lg">Suporte ao anfitrião</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Auxílio em reservas, problemas, pagamentos e atendimentos.
            </p>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-slate-800 rounded-xl shadow border border-transparent dark:border-slate-700">
            <h3 className="font-bold text-lg">Pagamentos seguros</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Processo automatizado com segurança e controle total.
            </p>
          </div>

        </div>
      </section>

      {/* ETAPAS */}
      <section className="px-6 md:px-20 py-16 bg-gray-100
       dark:bg-slate-900">
        <h2 className="text-2xl font-bold mb-8 text-center">Como tudo acontece na prática</h2>

        <ul className="max-w-2xl mx-auto space-y-4 text-gray-700 dark:text-gray-300">
          <li className="flex items-center gap-3">
            <CheckCircle className="text-green-600" /> Você aceita a reserva no seu painel
          </li>
          <li className="flex items-center gap-3">
            <CheckCircle className="text-green-600" /> O pagamento do cliente é confirmado
          </li>
          <li className="flex items-center gap-3">
            <CheckCircle className="text-green-600" /> A comissão é descontada automaticamente
          </li>
          <li className="flex items-center gap-3">
            <CheckCircle className="text-green-600" /> Você recebe o valor restante na sua conta
          </li>
        </ul>
      </section>

      {/* CTA */}
      <section className="w-full flex flex-col justify-center items-center text-center px-6 py-16 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100">
        <h2 className="text-2xl font-bold mb-4">Pronto para anunciar sem mensalidade?</h2>
        <p className="mb-6">Cadastre seu espaço gratuitamente e pague apenas quando faturar.</p>

     
<button
  onClick={() => router.push("/?openModal=true")}
  className="mt-8 px-8 py-3 bg-[#02aeee] text-white rounded-xl hover:bg-gray-900 transition"
>
  Começar agora
</button>
      </section>

    </>
  );
}
