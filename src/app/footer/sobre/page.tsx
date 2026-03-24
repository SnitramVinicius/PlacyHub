"use client";


export default function QuemSomos() {
  return (
    <>
      {/* HERO */}
      <section className="w-full min-h-[60vh] flex flex-col justify-center items-center text-center px-6 py-20 bg-white dark:bg-slate-900">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">Quem Somos</h1>
        <p className="text-lg max-w-2xl text-gray-700 dark:text-gray-300">
          O PlacyHub nasceu com a missão de facilitar a locação de espaços para eventos,
          tornando o processo simples, seguro e acessível tanto para locadores quanto
          para quem deseja encontrar o local perfeito.
        </p>
      </section>

      {/* NOSSA HISTÓRIA */}
      <section className="px-6 md:px-20 py-16 bg-gray-100 dark:bg-slate-900">
        <h2 className="text-2xl font-bold mb-6 text-center">Nossa História</h2>
        <p className="max-w-3xl mx-auto text-gray-700 dark:text-gray-300 leading-relaxed">
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
      </section>

      {/* PROPÓSITO */}
      <section className="px-6 md:px-20 py-16 bg-white dark:bg-slate-900">
        <h2 className="text-2xl font-bold mb-6 text-center">Nosso Propósito</h2>
        <ul className="max-w-2xl mx-auto space-y-4 text-gray-700 dark:text-gray-300 text-lg">
          <li>• Tornar a locação de espaços mais simples e rápida.</li>
          <li>• Oferecer segurança e confiança para ambas as partes.</li>
          <li>• Ajudar donos de espaços a gerar renda com facilidade.</li>
          <li>• Conectar pessoas a ambientes perfeitos para momentos especiais.</li>
        </ul>
      </section>

      {/* VALORES */}
      <section className="px-6 md:px-20 py-16 bg-gray-100 dark:bg-slate-900">
        <h2 className="text-2xl font-bold mb-6 text-center">Nossos Valores</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-6 bg-white dark:bg-slate-800 shadow rounded-xl text-center border border-transparent dark:border-slate-700">
            <h3 className="font-bold text-lg">Transparência</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Tudo claro, direto e sem letras miúdas.</p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-800 shadow rounded-xl text-center border border-transparent dark:border-slate-700">
            <h3 className="font-bold text-lg">Inovação</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Buscamos sempre melhorar a experiência de uso.</p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-800 shadow rounded-xl text-center border border-transparent dark:border-slate-700">
            <h3 className="font-bold text-lg">Compromisso</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Focados em entregar suporte e ferramentas eficientes.
            </p>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
     <section className="w-full flex flex-col justify-center items-center text-center px-6 py-16 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100">
        <h2 className="text-2xl font-bold mb-4">Conheça o PlacyHub na prática</h2>
        <p className="max-w-xl text-gray-600 dark:text-gray-300 mb-6">
          Descubra como é fácil anunciar seu espaço e começar a receber reservas.
        </p>
        <a href="/cadastre-seu-espaco">
          <button className="t-8 px-8 py-3 bg-[#02aeee] text-white rounded-xl hover:bg-[#029bd5] transition">
            Criar minha conta
          </button>
        </a>
      </section>
    </>
  );
}
