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
  const scrollRefs = useRef<Record<string, HTMLDivElement | null>>({});

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

  const renderSection = (titulo: string, lista: Espaco[], key: string, subtitulo?: string) => (
    <>
      <div className="flex flex-col px-6 md:px-10 mt-10">
        <h1 className="font-bold text-2xl text-gray-900 dark:text-gray-100">{titulo}</h1>
        {subtitulo && <p className="text-gray-500 dark:text-gray-400 -mt-1 mb-3">{subtitulo}</p>}
      </div>

      <div className="flex justify-between items-center px-6 md:px-10 mb-3">
        <div />
        <div className="flex gap-3">
          <button
            onClick={() => scrollLeft(key)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition shadow-md"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scrollRight(key)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition shadow-md"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <section
        ref={(el) => (scrollRefs.current[key] = el)}
        className="flex gap-6 overflow-x-auto scrollbar-hide px-6 md:px-10 py-4 scroll-smooth"
      >
        {lista.map((espaco) => (
          <Link key={espaco.id} href={`/espaco/${espaco.id}`} className="shrink-0 w-[240px]">
           <div className="bg-white dark:bg-gray-800 w-full rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition">
              <div className="relative">
                {espaco.buffet && (
  <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
    Buffet
  </span>
)}
                <img src={espaco.imagem} alt={espaco.nome} className="w-[240px] h-[160px] object-cover" />

                {/* Botão de Favorito */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleFavoritoClick(espaco.id);
                  }}
                  className="absolute top-2 right-2 rounded-full p-[6px] transition"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition
                     ${favoritos.includes(espaco.id) 
  ? "bg-red-600" 
  : "bg-white/80 dark:bg-gray-600"}`}
                  >
                    <Heart
                      size={18}
                      className={favoritos.includes(espaco.id) ? "text-white" : "text-red-600"}
                      fill={favoritos.includes(espaco.id) ? "white" : "transparent"}
                    />
                  </div>
                </button>
              </div>

              <div className="p-3">
                <div className="flex justify-between items-start">
                  <div className="w-[70%]">
                    <p className="font-semibold text-[14px] text-gray-900 dark:text-gray-100 leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                      {espaco.nome}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-yellow-500 text-sm">★</span>
                    <span className="text-yellow-500 text-sm font-medium">{espaco.avaliacao.toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
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
    </>
  );

  // =========================
  // RENDER PRINCIPAL
  // =========================
  if (!favoritos) return null;

  return (
    <>
      {!isLogged && (
        <>
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
        </>
      )}

      {isLogged && (
        <>
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
        </>
      )}
      {/* FOOTER */}
      <section className="bg-[#e5e5e5] dark:bg-gray-900 w-full py-16 mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 px-10 md:px-20">
          <div>
            <h1 className="font-bold mb-3 text-gray-900">Anunciantes</h1>
            <Link href="/footer/cadastre-seu-espaco"><p className="text-gray-700 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">Cadastre seu espaço</p></Link>
            <Link href="/footer/como-funciona"><p className="text-gray-700 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">Como funciona</p></Link>
            <Link href="/footer/planos-e-comissoes"><p className="text-gray-700 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">Planos e comissões</p></Link>
            <Link href="/footer/suporte-locador"><p className="text-gray-700 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">Suporte para locador</p></Link>
          </div>

          <div>
            <h1 className="font-bold mb-3 text-gray-900">Sobre o PlacyHub</h1>
            <Link href="/footer/sobre"><p className="text-gray-700 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">Quem somos</p></Link>
            <Link href="/footer/termos"><p className="text-gray-700 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">Termos de uso</p></Link>
            <Link href="/footer/privacidade"><p className="text-gray-700 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">Política de privacidade</p></Link>
          </div>

          <div>
            <h1 className="font-bold mb-3 text-gray-900">Extras</h1>
            <Link href="/footer/redes-sociais"><p className="text-gray-700 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">Redes sociais</p></Link>
            <Link href="/footer/faq"><p className="text-gray-700 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">FAQ</p></Link>
          </div>

          <div>
            <h1 className="font-bold mb-3 text-gray-900">Atendimento</h1>
            <Link href="/footer/contato"><p className="text-gray-700 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">Fale conosco</p></Link>
            <Link href="/footer/cancelamentos"><p className="text-gray-700 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">Políticas de cancelamento</p></Link>
            {/* <Link href="/footer/central-ajuda"><p className="text-gray-700 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">Central de ajuda</p></Link> */}
          </div>
        </div>
      </section>
    </>
  );
}