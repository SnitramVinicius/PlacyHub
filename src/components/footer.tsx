
import Link from "next/link";

export default function Footer() {
  return (

<footer className="bg-[#e5e5e5] dark:bg-gray-900 w-full py-8 sm:py-12 md:py-16 mt-8 sm:mt-10 md:mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 md:gap-10 px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="text-left">
            <h2 className="font-bold text-base sm:text-lg mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
              Anunciantes
            </h2>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <Link
                  href="/footer/cadastre-seu-espaco"
                  className="text-xs sm:text-sm text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                >
                  Cadastre seu espaço
                </Link>
              </li>
              <li>
                <Link
                  href="/footer/como-funciona"
                  className="text-xs sm:text-sm text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                >
                  Como funciona
                </Link>
              </li>
              <li>
                <Link
                  href="/footer/planos-e-comissoes"
                  className="text-xs sm:text-sm text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                >
                  Planos e comissões
                </Link>
              </li>
              <li>
                <Link
                  href="/footer/suporte-locador"
                  className="text-xs sm:text-sm text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                >
                  Suporte para locador
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-left">
            <h2 className="font-bold text-base sm:text-lg mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
              Sobre o PlacyHub
            </h2>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <Link
                  href="/footer/sobre"
                  className="text-xs sm:text-sm text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                >
                  Quem somos
                </Link>
              </li>
              <li>
                <Link
                  href="/footer/termos"
                  className="text-xs sm:text-sm text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                >
                  Termos de uso
                </Link>
              </li>
              <li>
                <Link
                  href="/footer/privacidade"
                  className="text-xs sm:text-sm text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                >
                  Política de privacidade
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-left">
            <h2 className="font-bold text-base sm:text-lg mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
              Extras
            </h2>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <Link
                  href="/footer/redes-sociais"
                  className="text-xs sm:text-sm text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                >
                  Redes sociais
                </Link>
              </li>
              <li>
                <Link
                  href="/footer/faq"
                  className="text-xs sm:text-sm text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-left">
            <h2 className="font-bold text-base sm:text-lg mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
              Atendimento
            </h2>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <Link
                  href="/footer/contato"
                  className="text-xs sm:text-sm text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                >
                  Fale conosco
                </Link>
              </li>
              <li>
                <Link
                  href="/footer/cancelamentos"
                  className="text-xs sm:text-sm text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                >
                  Políticas de cancelamento
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-8 sm:mt-10 md:mt-12 pt-4 sm:pt-6 border-t border-gray-300 dark:border-gray-700 mx-4 sm:mx-6 md:mx-10">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} PlacyHub. Todos os direitos
            reservados.
          </p>
        </div>
      </footer>
        );
}