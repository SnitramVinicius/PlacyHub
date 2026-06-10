"use client";

import { useEffect, useState } from "react";
import { useFavoritos } from "@/hooks/useFavoritos";
import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface Espaco {
  id: string;
  imagem: string;
  nome: string;
  preco: number;
  precoMinimoBuffet?: number | null;
  buffet: boolean;
  cidade: string;
  bairro: string;
  avaliacao: number;
  duracao: number;
}

export default function FavoritosPage() {
  const router = useRouter();
  const { favoritos, toggleFavorito, clearAll } = useFavoritos();
  const { user } = useAuth();

  const [ordenacao, setOrdenacao] = useState("popularidade");
  const [lista, setLista] = useState<Espaco[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar espaços do Supabase
  useEffect(() => {
    async function fetchFavoritos() {
      setLoading(true);
      
      if (favoritos.length === 0) {
        setLista([]);
        setLoading(false);
        return;
      }
      
      try {
        // Buscar espaços que estão nos favoritos
        const { data, error } = await supabase
          .from("spaces")
          .select(`
            *,
            espaco_categorias(
              pacotes:espaco_pacotes(
                precos:espaco_precos_pacote(valor)
              )
            )
          `)
          .in("id", favoritos);
        
        if (error) {
          console.error("Erro ao buscar favoritos:", error);
          setLista([]);
          setLoading(false);
          return;
        }
        
        // Mapear os espaços
        const mappedSpaces: Espaco[] = (data || []).map((item: any) => {
          // Calcular menor preço dos pacotes (para buffets)
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
          
          const ehBuffet = precoMinimoBuffet !== null;
          
          // Obter imagem
          let imagem = 'https://placehold.co/400x300/3b82f6/white?text=Espaço';
          if (item.imagens && Array.isArray(item.imagens) && item.imagens.length > 0) {
            imagem = item.imagens[0];
          } else if (item.imagem && item.imagem !== '') {
            imagem = item.imagem;
          }
          
          return {
            id: item.id,
            nome: item.nome_espaco,
            preco: (item.preco || 0) / 100,
            precoMinimoBuffet: precoMinimoBuffet,
            buffet: ehBuffet,
            cidade: item.cidade || "",
            bairro: item.bairro || "",
            avaliacao: item.avaliacao || 5.0,
            duracao: item.duracao || 4,
            imagem: imagem,
          };
        });
        
        // Aplicar ordenação
        let ordenados = [...mappedSpaces];
        
        if (ordenacao === "preco") {
          ordenados.sort((a, b) => {
            const precoA = a.buffet ? a.precoMinimoBuffet || Infinity : a.preco;
            const precoB = b.buffet ? b.precoMinimoBuffet || Infinity : b.preco;
            return precoA - precoB;
          });
        } else if (ordenacao === "avaliacao") {
          ordenados.sort((a, b) => b.avaliacao - a.avaliacao);
        } else {
          // popularidade = maior avaliação
          ordenados.sort((a, b) => b.avaliacao - a.avaliacao);
        }
        
        setLista(ordenados);
      } catch (err) {
        console.error("Erro:", err);
        setLista([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchFavoritos();
  }, [favoritos, ordenacao]);
  
  // Função para obter o texto do preço
  const getPrecoTexto = (espaco: Espaco) => {
    if (espaco.buffet && espaco.precoMinimoBuffet) {
      return `A partir de R$ ${espaco.precoMinimoBuffet.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    }
    return `R$ ${espaco.preco.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })} • ${espaco.duracao}h`;
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* BOTÃO VOLTAR */}
      <div className="w-full mb-6 sm:mb-8 flex justify-end">
        <button
  onClick={() => router.back()}
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
</button>
      </div>
      
      {/* ⭐ Mensagem especial se estiver logado */}
      {user && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gray-700 dark:text-gray-300 mb-4 text-sm"
        >
          Olá <strong>{user.name || user.email}</strong>! Aqui estão seus espaços favoritos!
        </motion.p>
      )}
      
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Meus Favoritos
      </h1>
      
      {/* Se não tiver favoritos */}
      {!loading && lista.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 sm:py-20"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full mb-4">
            <Heart size={32} className="text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">
            Você ainda não favoritou nenhum espaço
          </p>
          <Link
            href="/"
            className="mt-4 inline-block bg-sky-500 text-white px-6 py-3 rounded-lg shadow hover:bg-sky-600 transition"
          >
            Explorar espaços
          </Link>
        </motion.div>
      )}
      
      {/* 🔽 Filtros + botão limpar */}
      {lista.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <select
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value)}
            className="border border-gray-300 dark:border-slate-600 px-3 py-2 rounded-md text-sm bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200"
          >
            <option value="popularidade">Mais populares</option>
            <option value="preco">Menor preço</option>
            <option value="avaliacao">Melhor avaliação</option>
          </select>
          
          <button
            className="text-sm text-red-600 hover:text-red-700 transition"
            onClick={clearAll}
          >
            Remover todos
          </button>
        </div>
      )}
      
      {/* Skeleton */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 dark:bg-slate-700 animate-pulse rounded-lg h-[240px]"
            ></div>
          ))}
        </div>
      )}
      
      {/* Lista final */}
      {!loading && lista.length > 0 && (
        <motion.section
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6"
        >
          {lista.map((espaco, index) => (
            <motion.div
              key={espaco.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/espaco/${espaco.id}`} className="w-full">
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-700 h-full">
                  <div className="relative">
                    {/* Tag Buffet */}
                    {espaco.buffet && (
                      <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full z-10">
                        Buffet
                      </span>
                    )}
                    <img
                      src={espaco.imagem}
                      alt={espaco.nome}
                      className="w-full h-[140px] sm:h-[160px] object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/400x300/3b82f6/white?text=Espaço';
                      }}
                    />
                    
                    {/* Botão remover favorito */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorito(espaco.id);
                      }}
                      className="absolute top-2 right-2 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 rounded-full p-1.5 sm:p-2 shadow-sm transition"
                    >
                      <Heart
                        size={16}
                        className="text-red-500 sm:w-5 sm:h-5"
                        fill="red"
                      />
                    </button>
                  </div>
                  
                  <div className="p-2 sm:p-3">
                    <p className="font-semibold text-xs sm:text-sm whitespace-nowrap overflow-hidden text-ellipsis text-gray-900 dark:text-gray-100">
                      {espaco.nome}
                    </p>
                    
                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 truncate">
                      {espaco.bairro}, {espaco.cidade}
                    </p>
                    
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-gray-600 dark:text-gray-300 text-[11px] sm:text-sm font-medium">
                        {getPrecoTexto(espaco)}
                      </span>
                      
                      <span className="text-yellow-500 text-[11px] sm:text-sm flex items-center gap-0.5">
                        ★ {espaco.avaliacao.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.section>
      )}
    </div>
  );
}