"use client";

import { useState } from "react";
import { Star, X } from "lucide-react";

interface Props {
  isOpen: boolean;
  nomeEspaco: string;
  onClose: () => void;
  onSubmit: (nota: number, comentario?: string) => void;
}

export default function AvaliacaoModal({
  isOpen,
  nomeEspaco,
  onClose,
  onSubmit,
}: Props) {
  const [nota, setNota] = useState<number>(0);
  const [comentario, setComentario] = useState("");
  const [erro, setErro] = useState("");

  if (!isOpen) return null;

  function enviar() {
    if (!nota) {
      setErro("Selecione pelo menos uma estrela.");
      return;
    }

    onSubmit(nota, comentario.trim() || undefined);
    setNota(0);
    setComentario("");
    setErro("");
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 relative shadow-lg text-gray-900 dark:text-gray-100">

        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
        >
          <X size={20} />
        </button>

        {/* Título */}
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">
          Avaliar espaço
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {nomeEspaco}
        </p>

        {/* ESTRELAS */}
        <div className="flex gap-2 justify-center mb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <button key={i} onClick={() => setNota(i)}>
              <Star
                size={32}
                className={
                  i <= nota
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                }
              />
            </button>
          ))}
        </div>

        {erro && (
          <p className="text-sm text-red-500 text-center mb-2">
            {erro}
          </p>
        )}

        {/* COMENTÁRIO */}
        <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
          Comentário (opcional)
        </label>

        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Conte como foi sua experiência…"
          rows={4}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-xl p-3 text-sm resize-none 
          bg-white dark:bg-gray-700 
          text-gray-900 dark:text-gray-100
          placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-sky-400"
        />

        {/* BOTÃO */}
        <button
          onClick={enviar}
          disabled={!nota}
          className={`w-full mt-4 py-3 rounded-xl font-semibold transition ${
            !nota
              ? "bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
              : "bg-sky-500 hover:bg-sky-600 text-white"
          }`}
        >
          Enviar avaliação
        </button>
      </div>
    </div>
  );
}