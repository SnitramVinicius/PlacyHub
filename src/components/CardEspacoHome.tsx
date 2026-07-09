// components/CardEspacoHome.tsx

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { memo } from "react";

interface Espaco {
  id: string;
  nome: string;
  preco: number;
  precoMinimoBuffet?: number | null;
  avaliacao: number;
  duracao?: number | string;
  imagem?: string;
  buffet?: boolean;
}

interface CardEspacoHomeProps {
  espaco: Espaco;
  favorito: boolean;
  onFavoritoClick: (id: string) => void;
}

function CardEspacoHome({
  espaco,
  favorito,
  onFavoritoClick,
}: CardEspacoHomeProps) {

  function getBuffetPrecoMinimo() {
    if (
      espaco.precoMinimoBuffet &&
      espaco.precoMinimoBuffet > 0
    ) {
      return espaco.precoMinimoBuffet.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }

    return null;
  }


  return (
    <Link
      href={`/espaco/${espaco.id}`}
      className="shrink-0 w-[160px] sm:w-[200px] md:w-[220px] lg:w-[240px]"
    >

      <div className="bg-white dark:bg-gray-800 w-full rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition">

        <div className="relative">

          {espaco.buffet && (
            <span className="absolute bottom-1 left-1 md:bottom-2 md:left-2 bg-blue-600 text-white text-[10px] md:text-xs px-1.5 py-0.5 md:px-2 md:py-1 rounded-full z-10">
              Buffet
            </span>
          )}


          <div className="relative w-full h-[100px] sm:h-[120px] md:h-[140px] lg:h-[160px]">

            <Image
              src={
                espaco.imagem ||
                "https://placehold.co/400x300/3b82f6/white?text=Espaço"
              }
              alt={espaco.nome || "Imagem do espaço"}
              fill
              className="object-cover"
              sizes="(max-width:768px) 160px,
              (max-width:1024px) 220px,
              240px"
              priority
            />

          </div>


          <button
            onClick={(e)=>{
              e.preventDefault();
              e.stopPropagation();
              onFavoritoClick(espaco.id);
            }}
            className="absolute top-1 right-1 md:top-2 md:right-2 rounded-full p-1 md:p-[6px]"
            aria-label="Adicionar aos favoritos"
          >

            <div
              className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center ${
                favorito
                ? "bg-red-600"
                : "bg-white/80 dark:bg-gray-600"
              }`}
            >

              <Heart
                size={16}
                className={
                  favorito
                  ? "text-white"
                  : "text-red-600"
                }
                fill={
                  favorito
                  ? "white"
                  : "transparent"
                }
              />

            </div>

          </button>


        </div>


        <div className="p-2 md:p-3">

          <div className="flex justify-between items-start">

            <p className="font-semibold text-xs sm:text-sm md:text-[14px] text-gray-900 dark:text-gray-100 leading-tight whitespace-nowrap overflow-hidden text-ellipsis w-[70%]">
              {espaco.nome}
            </p>


            <div className="flex items-center gap-1">

              <span className="text-yellow-500 text-xs">
                ★
              </span>

              <span className="text-yellow-500 text-xs font-medium">
                {espaco.avaliacao
                ? espaco.avaliacao.toFixed(1)
                : "5.0"}
              </span>

            </div>

          </div>


          <p className="text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs md:text-sm mt-1">

            {espaco.buffet ? (
              <>
                A partir de{" "}
                <span className="font-semibold text-gray-900 dark:text-gray-100">
  {getBuffetPrecoMinimo()
    ? `R$ ${getBuffetPrecoMinimo()}`
    : "Sob consulta"}
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
  );
}


export default memo(CardEspacoHome);