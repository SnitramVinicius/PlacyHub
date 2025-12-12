"use client";

import Navbar2 from "@/components/navbar2";
import { CheckCircle } from "lucide-react";

export default function PlanosEComissoes() {
  return (
    <>

      {/* HERO */}
      <section className="w-full min-h-[60vh] flex flex-col justify-center items-center text-center px-6 py-20">
        <h1 className="text-4xl font-bold mb-4">Comissão do PlacyHub</h1>

        <p className="text-lg max-w-2xl text-gray-700">
          No PlacyHub, você só paga quando recebe. 
          Não existem mensalidades, taxas ocultas ou planos pagos.
        </p>

        <p className="text-lg max-w-xl mt-4 text-gray-700">
          Nosso objetivo é facilitar seu faturamento — por isso, usamos um modelo simples e transparente.
        </p>
      </section>

      {/* POR QUE COMISSÃO */}
      <section className="px-6 md:px-20 py-16 bg-gray-100">
        <h2 className="text-2xl font-bold mb-8 text-center">Como funciona a comissão?</h2>

        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">
          <h3 className="text-xl font-semibold mb-4"> Modelo transparente</h3>
          <p className="text-gray-700">
            O PlacyHub recebe uma pequena porcentagem somente quando sua reserva é confirmada.
          </p>

          <p className="text-gray-700 mt-3">
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

          <div className="p-6 bg-gray-50 rounded-xl shadow">
            <h3 className="font-bold text-lg">Divulgação do seu espaço</h3>
            <p className="text-gray-600 mt-2">
              Sua página aparece para centenas de locatários diariamente.
            </p>
          </div>

          <div className="p-6 bg-gray-50 rounded-xl shadow">
            <h3 className="font-bold text-lg">Suporte ao anfitrião</h3>
            <p className="text-gray-600 mt-2">
              Auxílio em reservas, problemas, pagamentos e atendimentos.
            </p>
          </div>

          <div className="p-6 bg-gray-50 rounded-xl shadow">
            <h3 className="font-bold text-lg">Pagamentos seguros</h3>
            <p className="text-gray-600 mt-2">
              Processo automatizado com segurança e controle total.
            </p>
          </div>

        </div>
      </section>

      {/* ETAPAS */}
      <section className="px-6 md:px-20 py-16 bg-gray-100">
        <h2 className="text-2xl font-bold mb-8 text-center">Como tudo acontece na prática</h2>

        <ul className="max-w-2xl mx-auto space-y-4 text-gray-700">
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
      <section className="w-full flex flex-col justify-center items-center text-center px-6 py-16 bg-white text-black">
        <h2 className="text-2xl font-bold mb-4">Pronto para anunciar sem mensalidade?</h2>
        <p className="mb-6">Cadastre seu espaço gratuitamente e pague apenas quando faturar.</p>

        <a href="/cadastre-seu-espaco">
          <button className="mt-8 px-8 py-3 bg-[#02aeee] text-white rounded-xl hover:bg-gray-900 transition">
            Começar agora
          </button>
        </a>
      </section>

    </>
  );
}
