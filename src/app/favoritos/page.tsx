"use client";

import { useEffect, useState } from "react";
import { useFavoritos } from "@/hooks/useFavoritos";
import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Espaco {
  id: string;
  imagem: string;
  nome: string;
  preco: number;
  cidade: string;
  avaliacao: number;
}

export default function FavoritosPage() {
  const { favoritos, toggleFavorito, clearAll } = useFavoritos();
  const { user } = useAuth();

  const [ordenacao, setOrdenacao] = useState("popularidade");
  const [lista, setLista] = useState<Espaco[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar espaços do mock
  useEffect(() => {
    setLoading(true);

    fetch("/api/espacos")
      .then((res) => res.json())
      .then((data: Espaco[]) => {
        const filtrados = data.filter((e) => favoritos.includes(e.id));

        // Ordenação
        let ordenados = [...filtrados];

        if (ordenacao === "preco") {
          ordenados.sort((a, b) => a.preco - b.preco);
        } else if (ordenacao === "avaliacao") {
          ordenados.sort((a, b) => b.avaliacao - a.avaliacao);
        } else {
          // popularidade = maior avaliação
          ordenados.sort((a, b) => b.avaliacao - a.avaliacao);
        }

        setLista(ordenados);
        setLoading(false);
      });
  }, [favoritos, ordenacao]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
   {/* BOTÃO VOLTAR */}
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
      {/* ⭐ Mensagem especial se estiver logado */}
      {user && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
         className="text-gray-700 dark:text-gray-300 mb-4 text-sm"
        >
          Olá <strong>{user.name}</strong> Aqui estão seus espaços favoritos!
        </motion.p>
      )}

      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Meus Favoritos</h1>

      {/* Se não tiver favoritos */}
      {!loading && lista.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <p className="text-gray-500 dark:text-gray-400 text-lg">Você ainda não favoritou nenhum espaço</p>
          <Link
            href="/"
            className="mt-4 inline-block bg-[#02aeee] text-white px-6 py-3 rounded-lg shadow hover:bg-[#029bd5] transition"
          >
            Ver espaços
          </Link>
        </motion.div>
      )}

      {/* 🔽 Filtros + botão limpar */}
      {lista.length > 0 && (
        <div className="flex justify-between items-center mb-6">
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
            className="text-sm text-red-600 underline hover:text-red-700"
            onClick={clearAll}
          >
            Limpar todos
          </button>
        </div>
      )}

      {/* Skeleton */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 dark:bg-slate-700 animate-pulse rounded-lg h-[230px]"
            ></div>
          ))}
        </div>
      )}

      {/* Lista final */}
      {!loading && lista.length > 0 && (
        <motion.section
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
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
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition border border-transparent dark:border-slate-700">
                  <div className="relative">
                    <img
                      src={espaco.imagem}
                      className="w-full h-[160px] object-cover"
                    />

                    {/* FAVORITO */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorito(espaco.id);
                      }}
                     className="absolute top-2 right-2 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 rounded-full p-2 shadow-sm transition"
                    >
                      <Heart
                        size={20}
                        className="text-red-500"
                        fill="red"
                      />
                    </button>
                  </div>

                  <div className="p-3">
                    <p className="font-semibold text-[14px] whitespace-nowrap overflow-hidden text-ellipsis text-gray-900 dark:text-gray-100">
                      {espaco.nome}
                    </p>

<p className="text-xs text-gray-500 dark:text-gray-400">
  {espaco.cidade}
</p>

                    <div className="flex justify-between items-center mt-1">
                      <span className="text-gray-600 dark:text-gray-300 text-sm">
                        R$ {espaco.preco}
                      </span>

                      <span className="text-yellow-500 text-sm flex items-center gap-1">
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
