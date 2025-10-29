"use client";
import { useState } from "react";
import Image from "next/image";
import { User } from "lucide-react";


interface Comentario {
  id: number;
  nome: string;
  tempo: string;
  comentario: string;
  foto?: string;
  estrelas: number;
}

const comentariosFake: Comentario[] = [
  {
    id: 1,
    nome: "Andrey",
    tempo: "1 semana atrás",
    comentario: "Tudo muito bom, voltaria com toda certeza! Espaço limpo e bem organizado.",
    estrelas: 5,
  },
  {
    id: 2,
    nome: "Gabriella",
    tempo: "2 semanas atrás",
    comentario: "Espaço incrível! Tudo conforme o anúncio, muito bem localizado e limpo.",
    estrelas: 5,
  },
  {
    id: 3,
    nome: "Priscila",
    tempo: "3 semanas atrás",
    comentario: "Lugar ótimo para eventos, o atendimento foi excelente e o ambiente é lindo.",
    estrelas: 4,
  },
  {
    id: 4,
    nome: "Morgana",
    tempo: "1 mês atrás",
    comentario: "Super aconchegante, os anfitriões foram muito atenciosos! Voltarei com certeza.",
    estrelas: 5,
  },
  {
    id: 5,
    nome: "João",
    tempo: "2 meses atrás",
    comentario: "Bom custo-benefício, mas o som ambiente poderia ser melhor.",
    estrelas: 4,
  },
  // Adicione um comentário sem foto para testar o ícone padrão
  {
    id: 6,
    nome: "Sem Foto",
    tempo: "Agora mesmo",
    comentario: "Testando o ícone padrão.",
    estrelas: 3,
  },
];

export default function Comentarios() {
  const [mostrarTodos, setMostrarTodos] = useState(false);

  const comentariosVisiveis = mostrarTodos
    ? comentariosFake
    : comentariosFake.slice(0, 3);

  return (
    <div className="mt-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold mb-6">Comentários de hóspedes</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {comentariosVisiveis.map((comentario) => (
          <div key={comentario.id} className="flex flex-col gap-2 border-b pb-4">
            <div className="flex items-center gap-3">
              {/* Lógica unificada para foto ou ícone padrão */}
              {comentario.foto ? (
                <Image
                  src={comentario.foto}
                  alt={comentario.nome}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200">
                  <User className="text-gray-500" size={24} />
                </div>
              )}
              {/* Informações do usuário */}
              <div>
                <p className="font-semibold">{comentario.nome}</p>
                <p className="text-xs text-gray-500">{comentario.tempo}</p>
              </div>
            </div>

            <div className="flex gap-1 text-yellow-500">
              {Array.from({ length: comentario.estrelas }).map((_, i) => (
                <span key={i}>⭐</span>
              ))}
              {Array.from({ length: 5 - comentario.estrelas }).map((_, i) => (
                <span key={i} className="text-gray-300">⭐</span>
              ))}
            </div>

            <p className="text-gray-700 text-sm">{comentario.comentario}</p>
          </div>
        ))}
      </div>

      {comentariosFake.length > 3 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setMostrarTodos(!mostrarTodos)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100 transition"
          >
            {mostrarTodos
              ? "Mostrar menos comentários"
              : `Mostrar todos os ${comentariosFake.length} comentários`}
          </button>
        </div>
      )}
    </div>
  );
}