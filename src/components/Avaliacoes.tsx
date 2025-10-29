"use client";

import { Star, Sparkles, CheckCircle, KeyRound, MessageSquare, MapPin, Tag } from "lucide-react";

export default function Avaliacoes() {
  const avaliacoes = [
    { titulo: "Limpeza", nota: 5.0, icone: <Sparkles className="w-5 h-5" /> },
    { titulo: "Exatidão do anúncio", nota: 5.0, icone: <CheckCircle className="w-5 h-5" /> },
    { titulo: "Check-in", nota: 5.0, icone: <KeyRound className="w-5 h-5" /> },
    { titulo: "Comunicação", nota: 5.0, icone: <MessageSquare className="w-5 h-5" /> },
    { titulo: "Localização", nota: 4.9, icone: <MapPin className="w-5 h-5" /> },
    { titulo: "Custo-benefício", nota: 4.9, icone: <Tag className="w-5 h-5" /> },
  ];

  return (
    <div className=" p-6 rounded-2xl shadow-sm mt-8 border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Star className="text-yellow-500 w-5 h-5" /> Avaliação geral
      </h2>

      <div className="flex flex-wrap items-center justify-between gap-6">
        {avaliacoes.map((item, index) => (
          <div key={index} className="flex flex-col items-center border-r border-gray-200 pr-6 last:border-none">
            <div className="text-gray-700 flex flex-col items-center">
              <div className="flex items-center gap-2 text-sm font-medium">
                {item.icone}
                <span>{item.titulo}</span>
              </div>
              <span className="text-lg font-semibold mt-1">{item.nota.toFixed(1)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
