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
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-1">
          Avaliar espaço
        </h2>
        <p className="text-sm text-gray-500 mb-4">{nomeEspaco}</p>

        {/* ESTRELAS */}
        <div className="flex gap-2 justify-center mb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <button key={i} onClick={() => setNota(i)}>
              <Star
                size={32}
                className={
                  i <= nota
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
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

        {/* COMENTÁRIO OPCIONAL */}
        <label className="text-sm text-gray-600 mb-1 block">
          Comentário (opcional)
        </label>
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Conte como foi sua experiência…"
          className="w-full border rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-sky-400"
          rows={4}
        />

        <button
          onClick={enviar}
          disabled={!nota}
          className={`w-full mt-4 py-3 rounded-xl font-semibold transition ${
            !nota
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-sky-500 hover:bg-sky-600 text-white"
          }`}
        >
          Enviar avaliação
        </button>
      </div>
    </div>
  );
}
