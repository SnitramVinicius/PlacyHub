"use client";

import { useEffect, useState } from "react";
import { useFavoritos } from "@/hooks/useFavoritos";
import { motion } from "framer-motion";
import Link from "next/link";
import { Heart } from "lucide-react";
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

      {/* ⭐ Mensagem especial se estiver logado */}
      {user && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gray-700 mb-4 text-sm"
        >
          Olá <strong>{user.nome}</strong> Aqui estão seus espaços favoritos!
        </motion.p>
      )}

      <h1 className="text-3xl font-bold mb-6">Meus Favoritos</h1>

      {/* Se não tiver favoritos */}
      {!loading && lista.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <p className="text-gray-500 text-lg">Você ainda não favoritou nenhum espaço</p>
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
            className="border px-3 py-2 rounded-md text-sm"
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
              className="bg-gray-200 animate-pulse rounded-lg h-[230px]"
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
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
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
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2 shadow-sm transition"
                    >
                      <Heart
                        size={20}
                        className="text-red-500"
                        fill="red"
                      />
                    </button>
                  </div>

                  <div className="p-3">
                    <p className="font-semibold text-[14px] whitespace-nowrap overflow-hidden text-ellipsis">
                      {espaco.nome}
                    </p>

                    <div className="flex justify-between items-center mt-1">
                      <span className="text-gray-600 text-sm">
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
