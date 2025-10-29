// components/CardEspaco.tsx
import { Heart } from "lucide-react";

interface CardEspacoProps {
  imagem: string;
  nome: string;
  preco: string;
  duracao: string;
  avaliacao: number;
}

export default function CardEspaco({
  imagem,
  nome,
  preco,
  duracao,
  avaliacao,
}: CardEspacoProps) {
  return (
    <div className="bg-white rounded-2xl w-[360px] shadow-md overflow-hidden">
      <div className="relative">
        <img
          src={imagem}
          alt={nome}
          className="w-full h-[200px] object-cover"
        />
        <button className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition">
          <Heart size={20} className="text-[#02aeee]" />
        </button>
      </div>

      <div className="p-3">
        <p className="font-semibold text-[16px]">{nome}</p>
        <p className="text-gray-500 text-sm mt-1">{preco}</p>
        <p className="text-gray-500 text-sm">{duracao}</p>

        <div className="flex items-center gap-1 mt-1">
          <span className="text-yellow-500">★</span>
          <p className="text-gray-700 text-sm font-medium">{avaliacao.toFixed(1)}</p>
        </div>
      </div>
    </div>
  );
}
