"use client";

import { useRef } from "react";
import Link from "next/link";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useFavoritos } from "@/context/FavoritosContext";
import { toast } from "sonner";
import { ESPACOS, Espaco } from "@/data/espacos";

// =========================
// LISTAS DA HOME (AUTOMÁTICAS)
// =========================

// Visitante — Indicados (melhores avaliações)
const espacosVisitante_Indicados: Espaco[] = [...ESPACOS]
  .sort((a, b) => b.avaliacao - a.avaliacao)


// Visitante — Destaque (maior popularidade)
const espacosVisitante_Destaque: Espaco[] = [...ESPACOS]
  .sort((a, b) => b.popularidade - a.popularidade)

// Visitante — Fim de semana até R$600
const espacosVisitante_FimDeSemana: Espaco[] = ESPACOS
  .filter((e) => e.preco <= 600)


// Logado — Próximos (cidade Campo Grande)
const espacosLogado_Proximos: Espaco[] = ESPACOS
  .filter((e) => e.cidade.includes("Campo Grande"))

// Logado — Recomendados (avaliação + popularidade)
const espacosLogado_Recomendados: Espaco[] = [...ESPACOS]
  .sort((a, b) => (b.avaliacao + b.popularidade) - (a.avaliacao + a.popularidade))
 

// =========================
// COMPONENTE PRINCIPAL
// =========================
export default function Home() {
  const { user } = useAuth();
  const isLogged = !!user;

  const { favoritos, toggleFavorito } = useFavoritos();
  const scrollRefs = useRef<Record<string, HTMLElement | null>>({});

  const scrollByAmount = (key: string, amount: number) => {
    const el = scrollRefs.current[key];
    if (!el) return;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  const scrollLeft = (key: string) =>
    scrollByAmount(key, -(scrollRefs.current[key]?.clientWidth ?? 0) * 0.8);

  const scrollRight = (key: string) =>
    scrollByAmount(key, (scrollRefs.current[key]?.clientWidth ?? 0) * 0.8);

  // -----------------------------
  // Favorito com alerta
  // -----------------------------
  const handleFavoritoClick = (espacoId: string) => {
    if (!isLogged) {
      toast.error("Você precisa estar logado para adicionar aos favoritos!");
      return;
    }
    toggleFavorito(espacoId);
    if (favoritos.includes(espacoId)) {
      toast.success("Espaço removido dos favoritos!");
    } else {
      toast.success("Espaço adicionado aos favoritos!");
    }
  };

  // =========================
  // SEÇÃO
  // =========================
const getBuffetPrecoMinimo = (espaco: Espaco) => {
  if (!espaco.buffet) return null;

  let menorPreco = Infinity;

  espaco.buffet.tiposFesta.forEach((tipo) => {
    tipo.pacotes.forEach((pacote) => {
      pacote.valores.forEach((valor) => {
        if (valor.preco < menorPreco) {
          menorPreco = valor.preco;
        }
      });
    });
  });

  return menorPreco === Infinity ? null : menorPreco;
};

const renderSection = (titulo: string, lista: Espaco[], key: string, subtitulo?: string) => {
  return (
    <div key={key} className="mb-6 md:mb-8">
      <div className="flex flex-col px-4 sm:px-6 md:px-10 mt-6 md:mt-10">
        <h1 className="font-bold text-xl sm:text-2xl text-gray-900 dark:text-gray-100">{titulo}</h1>
        {subtitulo && <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm -mt-1 mb-2 md:mb-3">{subtitulo}</p>}
      </div>

      <div className="flex justify-between items-center px-4 sm:px-6 md:px-10 mb-2 md:mb-3">
        <div />
        <div className="flex gap-2 md:gap-3">
          <button
            onClick={() => scrollLeft(key)}
            className="p-1.5 md:p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition shadow-md"
            aria-label="Rolar para esquerda"
          >
            <ChevronLeft size={18} className="md:w-5 md:h-5" />
          </button>
          <button
            onClick={() => scrollRight(key)}
            className="p-1.5 md:p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition shadow-md"
            aria-label="Rolar para direita"
          >
            <ChevronRight size={18} className="md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      <section
        ref={(el) => {
          scrollRefs.current[key] = el;
        }}
        className="flex gap-3 sm:gap-4 md:gap-6 overflow-x-auto scrollbar-hide px-4 sm:px-6 md:px-10 py-2 md:py-4 scroll-smooth"
      >
        {lista.map((espaco) => (
          <Link key={espaco.id} href={`/espaco/${espaco.id}`} className="shrink-0 w-[160px] sm:w-[200px] md:w-[220px] lg:w-[240px]">
            <div className="bg-white dark:bg-gray-800 w-full rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition">
              <div className="relative">
                {espaco.buffet && (
                  <span className="absolute bottom-1 left-1 md:bottom-2 md:left-2 bg-blue-600 text-white text-[10px] md:text-xs px-1.5 py-0.5 md:px-2 md:py-1 rounded-full">
                    Buffet
                  </span>
                )}
                <img 
                  src={espaco.imagem} 
                  alt={espaco.nome} 
                  className="w-full h-[100px] sm:h-[120px] md:h-[140px] lg:h-[160px] object-cover"
                />

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleFavoritoClick(espaco.id);
                  }}
                  className="absolute top-1 right-1 md:top-2 md:right-2 rounded-full p-1 md:p-[6px] transition"
                  aria-label="Adicionar aos favoritos"
                >
                  <div
                    className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center transition
                      ${favoritos.includes(espaco.id) 
                        ? "bg-red-600" 
                        : "bg-white/80 dark:bg-gray-600"}`}
                  >
                    <Heart
                      size={14}
                      className={`md:w-[18px] md:h-[18px] ${favoritos.includes(espaco.id) ? "text-white" : "text-red-600"}`}
                      fill={favoritos.includes(espaco.id) ? "white" : "transparent"}
                    />
                  </div>
                </button>
              </div>

              <div className="p-2 md:p-3">
                <div className="flex justify-between items-start">
                  <div className="w-[70%]">
                    <p className="font-semibold text-xs sm:text-sm md:text-[14px] text-gray-900 dark:text-gray-100 leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                      {espaco.nome}
                    </p>
                  </div>
                  <div className="flex items-center gap-0.5 md:gap-1 shrink-0">
                    <span className="text-yellow-500 text-[10px] md:text-sm">★</span>
                    <span className="text-yellow-500 text-[10px] md:text-sm font-medium">{espaco.avaliacao.toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs md:text-sm mt-0.5 md:mt-1">
                  {espaco.buffet ? (
                    <>
                      A partir de <span className="font-semibold text-gray-900 dark:text-gray-100">
                        R$ {getBuffetPrecoMinimo(espaco)}
                      </span>
                    </>
                  ) : (
                    <>
                      R$ {espaco.preco} • {espaco.duracao} horas
                    </>
                  )}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
};

// =========================
// RENDER PRINCIPAL
// =========================
if (!favoritos) return null;

return (
  <div className="min-h-screen">
    {!isLogged && (
      <div>
        {renderSection(
          "Explore espaços populares no Brasil",
          espacosVisitante_Indicados,
          "visit-indicados",
          "Os espaços mais reservados e avaliados pelos visitantes"
        )}

        {renderSection(
          "Em alta no momento",
          espacosVisitante_Destaque,
          "visit-destaque",
          "Os espaços mais procurados nesta semana"
        )}

        {renderSection(
          "Disponíveis para este fim de semana",
          espacosVisitante_FimDeSemana,
          "visit-fds",
          "As melhores opções para eventos rápidos"
        )}
      </div>
    )}

    {isLogged && (
      <div>
        {renderSection(
          "Perto de você",
          espacosLogado_Proximos,
          "log-proximos",
          "Opções próximas à sua região"
        )}

        {renderSection(
          "Sugestões para você",
          espacosLogado_Recomendados,
          "log-recomendados",
          "Recomendados com base no seu perfil"
        )}
      </div>
    )}

    {/* FOOTER RESPONSIVO */}
<footer className="bg-[#e5e5e5] dark:bg-gray-900 w-full py-8 sm:py-12 md:py-16 mt-8 sm:mt-10 md:mt-12">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 md:gap-10 px-4 sm:px-6 md:px-8 lg:px-10">
    <div className="text-left">
      <h2 className="font-bold text-base sm:text-lg mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">Anunciantes</h2>
      <ul className="space-y-1 sm:space-y-2">
        <li><Link href="/footer/cadastre-seu-espaco" className="text-xs sm:text-sm text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">Cadastre seu espaço</Link></li>
        <li><Link href="/footer/como-funciona" className="text-xs sm:text-sm text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">Como funciona</Link></li>
        <li><Link href="/footer/planos-e-comissoes" className="text-xs sm:text-sm text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">Planos e comissões</Link></li>
        <li><Link href="/footer/suporte-locador" className="text-xs sm:text-sm text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">Suporte para locador</Link></li>
      </ul>
    </div>

    <div className="text-left">
      <h2 className="font-bold text-base sm:text-lg mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">Sobre o PlacyHub</h2>
      <ul className="space-y-1 sm:space-y-2">
        <li><Link href="/footer/sobre" className="text-xs sm:text-sm text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">Quem somos</Link></li>
        <li><Link href="/footer/termos" className="text-xs sm:text-sm text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">Termos de uso</Link></li>
        <li><Link href="/footer/privacidade" className="text-xs sm:text-sm text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">Política de privacidade</Link></li>
      </ul>
    </div>

    <div className="text-left">
      <h2 className="font-bold text-base sm:text-lg mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">Extras</h2>
      <ul className="space-y-1 sm:space-y-2">
        <li><Link href="/footer/redes-sociais" className="text-xs sm:text-sm text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">Redes sociais</Link></li>
        <li><Link href="/footer/faq" className="text-xs sm:text-sm text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">FAQ</Link></li>
      </ul>
    </div>

    <div className="text-left">
      <h2 className="font-bold text-base sm:text-lg mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">Atendimento</h2>
      <ul className="space-y-1 sm:space-y-2">
        <li><Link href="/footer/contato" className="text-xs sm:text-sm text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">Fale conosco</Link></li>
        <li><Link href="/footer/cancelamentos" className="text-xs sm:text-sm text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">Políticas de cancelamento</Link></li>
      </ul>
    </div>
  </div>
  
  {/* Copyright */}
  <div className="text-center mt-8 sm:mt-10 md:mt-12 pt-4 sm:pt-6 border-t border-gray-300 dark:border-gray-700 mx-4 sm:mx-6 md:mx-10">
    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
      © {new Date().getFullYear()} PlacyHub. Todos os direitos reservados.
    </p>
  </div>
</footer>
  </div>
);
}