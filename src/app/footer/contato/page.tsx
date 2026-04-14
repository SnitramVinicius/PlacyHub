
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
export default function FaleConosco() {
  return (
    <section className="w-full bg-white dark:bg-slate-900 py-16 px-6 md:px-12">
      <div className="max-w-5xl mx-auto text-center">
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
        <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">Fale Conosco</h2>
       <p className="text-gray-600 dark:text-gray-300 mb-12">
          Precisa de ajuda? Entre em contato com nosso time.
        </p>

        {/* Cards de Contato */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* WhatsApp */}
          <div className="p-6 rounded-2xl shadow-md border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">WhatsApp</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Converse com a gente pelo WhatsApp.
            </p>
            <a
              href="https://wa.me/5599999999999"
              target="_blank"
              className="inline-block bg-green-500 text-white px-5 py-2 rounded-xl font-medium hover:bg-green-600 transition"
            >
              Abrir WhatsApp
            </a>
          </div>

          {/* Email */}
          <div className="p-6 rounded-2xl shadow-md border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">E-mail</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Prefere enviar um e-mail? Responderemos o mais rápido possível.
            </p>
            <a
              href="mailto:contato@placyhub.com"
              className="inline-block bg-blue-500 text-white px-5 py-2 rounded-xl font-medium hover:bg-blue-600 transition"
            >
              Enviar E-mail
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
