"use client";
interface Espaco {
  id: string;
  nome: string;
  preco: number;
  precoMinimoBuffet?: number | null;
  avaliacao: number;
  popularidade: number;
  cidade?: string;
  duracao?: number | string;
  imagem?: string;
  buffet?: boolean;
  tipo?: string;
}

import { useRef } from "react";
import Link from "next/link";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useFavoritos } from "@/context/FavoritosContext";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import TesteSupabase from "@/components/TesteSupabase";

export default function Home() {
  const { user } = useAuth();
  const isLogged = !!user;

  const [supabaseSpaces, setSupabaseSpaces] = useState<Espaco[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSpaces() {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("spaces")
        .select(`
          *,
          espaco_categorias(
            pacotes:espaco_pacotes(
              precos:espaco_precos_pacote(valor)
            )
          )
        `);

      if (error) {
        console.log("ERRO:", error);
        setSupabaseSpaces([]);
        setLoading(false);
        return;
      }

      console.log("DO BANCO:", data);

      const mappedSpaces = data?.map((item: any) => {
        // Calcular o menor preço dos pacotes
        let precoMinimoBuffet = null;
        
        if (item.espaco_categorias && item.espaco_categorias.length > 0) {
          for (const categoria of item.espaco_categorias) {
            if (categoria.pacotes && categoria.pacotes.length > 0) {
              for (const pacote of categoria.pacotes) {
                if (pacote.precos && pacote.precos.length > 0) {
                  for (const preco of pacote.precos) {
                    const valor = preco.valor;
                    if (valor && (precoMinimoBuffet === null || valor < precoMinimoBuffet)) {
                      precoMinimoBuffet = valor;
                    }
                  }
                }
              }
            }
          }
        }

        const ehBuffet = precoMinimoBuffet !== null || item.buffet === true;

        return {
          id: item.id,
          nome: item.nome_espaco,
          preco: (item.preco || 0) / 100,
          precoMinimoBuffet: precoMinimoBuffet,
          avaliacao: item.avaliacao || 5.0,
          popularidade: item.popularidade || 0,
          cidade: item.cidade || "",
          duracao: item.duracao || 4,
          imagem: (() => {
            if (item.imagens && Array.isArray(item.imagens) && item.imagens.length > 0) {
              return item.imagens[0];
            }
            if (item.imagem && item.imagem !== '') {
              return item.imagem;
            }
            return 'https://placehold.co/400x300/3b82f6/white?text=Espaço';
          })(),
          buffet: ehBuffet,
          tipo: item.tipo_espaco,
        };
      }) || [];

      console.log("ESPAÇOS MAPEADOS:", mappedSpaces);
      setSupabaseSpaces(mappedSpaces);
      setLoading(false);
    }

    fetchSpaces();
  }, []);

  const getEspacosIndicados = () => {
    return [...supabaseSpaces].sort((a, b) => b.avaliacao - a.avaliacao);
  };

  const getEspacosDestaque = () => {
    return [...supabaseSpaces].sort((a, b) => b.popularidade - a.popularidade);
  };

  const getEspacosFimDeSemana = () => {
    return supabaseSpaces.filter((e) => e.preco <= 600);
  };

  const getEspacosProximos = () => {
    return supabaseSpaces.filter((e) => e.cidade?.includes("Campo Grande"));
  };

  const getEspacosRecomendados = () => {
    return [...supabaseSpaces].sort(
      (a, b) => b.avaliacao + b.popularidade - (a.avaliacao + a.popularidade)
    );
  };

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

  const getBuffetPrecoMinimo = (espaco: Espaco) => {
    if (espaco.precoMinimoBuffet && espaco.precoMinimoBuffet > 0) {
      return espaco.precoMinimoBuffet.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
    return null;
  };

  const renderSection = (
    titulo: string,
    lista: Espaco[],
    key: string,
    subtitulo?: string
  ) => {
    if (lista.length === 0) return null;

    return (
      <div key={key} className="mb-6 md:mb-8">
        <div className="flex flex-col px-4 sm:px-6 md:px-10 mt-6 md:mt-10">
          <h1 className="font-bold text-xl sm:text-2xl text-gray-900 dark:text-gray-100">
            {titulo}
          </h1>
          {subtitulo && (
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm -mt-1 mb-2 md:mb-3">
              {subtitulo}
            </p>
          )}
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
            <Link
              key={espaco.id}
              href={`/espaco/${espaco.id}`}
              className="shrink-0 w-[160px] sm:w-[200px] md:w-[220px] lg:w-[240px]"
            >
              <div className="bg-white dark:bg-gray-800 w-full rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition">
                <div className="relative">
                  {espaco.buffet && (
                    <span className="absolute bottom-1 left-1 md:bottom-2 md:left-2 bg-blue-600 text-white text-[10px] md:text-xs px-1.5 py-0.5 md:px-2 md:py-1 rounded-full">
                      Buffet
                    </span>
                  )}
                  <img
                    src={
                      espaco.imagem ||
                      "https://placehold.co/400x300/3b82f6/white?text=Espaço"
                    }
                    alt={espaco.nome}
                    className="w-full h-[100px] sm:h-[120px] md:h-[140px] lg:h-[160px] object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/400x300/3b82f6/white?text=Espaço";
                    }}
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
                      ${
                        favoritos.includes(espaco.id)
                          ? "bg-red-600"
                          : "bg-white/80 dark:bg-gray-600"
                      }`}
                    >
                      <Heart
                        size={14}
                        className={`md:w-[18px] md:h-[18px] ${
                          favoritos.includes(espaco.id)
                            ? "text-white"
                            : "text-red-600"
                        }`}
                        fill={
                          favoritos.includes(espaco.id) ? "white" : "transparent"
                        }
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
                      <span className="text-yellow-500 text-[10px] md:text-sm">
                        ★
                      </span>
                      <span className="text-yellow-500 text-[10px] md:text-sm font-medium">
                        {espaco.avaliacao ? espaco.avaliacao.toFixed(1) : "5.0"}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs md:text-sm mt-0.5 md:mt-1">
                    {espaco.buffet ? (
                      <>
                        A partir de{" "}
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          R$ {getBuffetPrecoMinimo(espaco)}
                        </span>
                      </>
                    ) : (
                      <>
                        R$ {espaco.preco} • {espaco.duracao || 4} horas
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Carregando espaços...</p>
        </div>
      </div>
    );
  }

  if (supabaseSpaces.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Nenhum espaço encontrado.</p>
          <Link
            href="/anfitriao/espacos/novo"
            className="text-sky-500 hover:text-sky-600"
          >
            Cadastre seu primeiro espaço
          </Link>
        </div>
      </div>
    );
  }

  if (!favoritos) return null;

  return (
    <div className="min-h-screen">
      

      {!isLogged && (
        <div>
          {renderSection(
            "Explore espaços populares no Brasil",
            getEspacosIndicados(),
            "visit-indicados",
            "Os espaços mais reservados e avaliados pelos visitantes"
          )}

          {renderSection(
            "Em alta no momento",
            getEspacosDestaque(),
            "visit-destaque",
            "Os espaços mais procurados nesta semana"
          )}

          {renderSection(
            "Disponíveis para este fim de semana",
            getEspacosFimDeSemana(),
            "visit-fds",
            "As melhores opções para eventos rápidos"
          )}
        </div>
      )}

      {isLogged && (
        <div>
          {renderSection(
            "Perto de você",
            getEspacosProximos(),
            "log-proximos",
            "Opções próximas à sua região"
          )}

          {renderSection(
            "Sugestões para você",
            getEspacosRecomendados(),
            "log-recomendados",
            "Recomendados com base no seu perfil"
          )}
        </div>
      )}

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
    </div>
  );
}