"use client";

import { useState, useEffect } from "react";
import { Heart, MapPin, Users } from "lucide-react";

interface EspacoFavorito {
  id: string;
  nome: string;
  imagem: string;
  local: string;
  capacidade: number;
  valor: number;
}

export default function FavoritosPage() {
  const [favoritos, setFavoritos] = useState<EspacoFavorito[]>([]);

  useEffect(() => {
    // Simulação de dados — futuramente você pode puxar do localStorage ou backend
    const dadosFake: EspacoFavorito[] = [
      {
        id: "1",
        nome: "Chácara Paraíso",
        imagem: "/espaco1.jpg",
        local: "Campo Grande - MS",
        capacidade: 100,
        valor: 750,
      },
      {
        id: "2",
        nome: "Espaço Garden",
        imagem: "/espaco2.jpg",
        local: "Terenos - MS",
        capacidade: 80,
        valor: 500,
      },
      {
        id: "3",
        nome: "Salão Primavera",
        imagem: "/espaco3.jpg",
        local: "Sidrolândia - MS",
        capacidade: 60,
        valor: 350,
      },
    ];

    setFavoritos(dadosFake);
  }, []);

  function handleRemoverFavorito(id: string) {
    setFavoritos((prev) => prev.filter((f) => f.id !== id));
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Meus Favoritos</h1>

      {favoritos.length === 0 ? (
        <p className="text-gray-600">
          Você ainda não adicionou nenhum espaço aos favoritos.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoritos.map((espaco) => (
            <div
              key={espaco.id}
              className="bg-white rounded-2xl shadow hover:shadow-md transition overflow-hidden relative"
            >
              {/* Botão de remover */}
              <button
                onClick={() => handleRemoverFavorito(espaco.id)}
                className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-red-100 transition"
              >
                <Heart className="text-red-500 fill-red-500" size={20} />
              </button>

              <img
                src={espaco.imagem}
                alt={espaco.nome}
                className="w-full h-40 object-cover"
              />

              <div className="p-4 space-y-2">
                <h2 className="text-lg font-semibold text-gray-800">
                  {espaco.nome}
                </h2>

                <div className="flex items-center text-gray-500 text-sm gap-2">
                  <MapPin size={16} />
                  {espaco.local}
                </div>

                <div className="flex items-center text-gray-500 text-sm gap-2">
                  <Users size={16} />
                  Capacidade: {espaco.capacidade} pessoas
                </div>

                <p className="text-gray-700 font-medium mt-2">
                  R$ {espaco.valor.toFixed(2)}
                </p>

                <button
                  className="mt-3 w-full bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-xl font-semibold transition"
                  onClick={() => alert(`Abrir página do espaço ${espaco.nome}`)}
                >
                  Ver detalhes
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
