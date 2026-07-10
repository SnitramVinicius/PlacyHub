  "use client";

import { memo, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";

interface ImageGalleryProps {
  imagens: string[];
}

function ImageGallery({ imagens }: ImageGalleryProps) {
  
  const [indexAtual, setIndexAtual] = useState(0);
     const touchStartX = useRef(0);
   const touchEndX = useRef(0);
    const [modalImagemAberto, setModalImagemAberto] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const handleTouchStart = (e: React.TouchEvent) => {
  touchStartX.current = e.changedTouches[0].screenX;
};

const handleTouchEnd = (e: React.TouchEvent) => {
  touchEndX.current = e.changedTouches[0].screenX;
  handleSwipe();
};

const handleSwipe = () => {
  if (listaImagens.length <= 1) return;

  const distance = touchStartX.current - touchEndX.current;

  if (distance > 50) {
    proximaImagem();
  }

  if (distance < -50) {
    imagemAnterior();
  }
};

const proximaImagem = () => {
  setIndexAtual(prev => (prev + 1) % listaImagens.length);
};

const imagemAnterior = () => {
  setIndexAtual(prev =>
    prev === 0
      ? listaImagens.length - 1
      : prev - 1
  );
};

const selecionarImagem = (index: number) => {
  setIndexAtual(index);
};

 useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  handleResize();

  window.addEventListener("resize", handleResize);

  return () => window.removeEventListener("resize", handleResize);
}, []);

const listaImagens =
  imagens.length > 0
    ? imagens
    : ["/images/placeholder-space.jpg"];

  return (
    <>
 
 <div className="mb-6">
  
 <div className="relative rounded-2xl overflow-hidden shadow-xl">
<div className="relative w-full h-[450px]">
  <Image
    src={listaImagens[indexAtual]}
    alt="Imagem do espaço"
    fill
    sizes="100vw"
    priority
    onTouchStart={handleTouchStart}
    onTouchEnd={handleTouchEnd}
    onClick={() => setModalImagemAberto(true)}
    className="object-cover transition-all duration-300 cursor-pointer"
  />
</div>
    
    {!isMobile && listaImagens.length > 1 && (
      <>
       <button
  onClick={imagemAnterior}
  className="absolute left-4 top-1/2 -translate-y-1/2
  w-11 h-11 flex items-center justify-center
  rounded-full
  bg-white/20 backdrop-blur-md
  border border-white/30
  shadow-lg
  hover:bg-white/30 hover:scale-105
  active:scale-95
  transition-all duration-300"
>
  <ChevronLeft className="text-white" size={22} />
</button>

       <button
  onClick={proximaImagem}
  className="absolute right-4 top-1/2 -translate-y-1/2
  w-11 h-11 flex items-center justify-center
  rounded-full
  bg-white/20 backdrop-blur-md
  border border-white/30
  shadow-lg
  hover:bg-white/30 hover:scale-105
  active:scale-95
  transition-all duration-300"
>
  <ChevronRight className="text-white" size={22} />
</button>
      </>
    )}
    </div>
  </div>

  
  {isMobile && listaImagens.length > 1 && (
    <div className="flex gap-2 overflow-x-auto mt-2 pb-2">
      {listaImagens.map((img, index) => (
        <div
  key={index}
  className={`relative h-20 w-32 rounded-lg overflow-hidden cursor-pointer ${
    index === indexAtual ? "ring-2 ring-blue-500" : ""
  }`}
  onClick={() => selecionarImagem(index)}
>
  <Image
    src={img}
    alt={`Imagem ${index + 1}`}
    fill
    sizes="128px"
    className="object-cover"
  />
</div>
      ))}
    </div>
    
  )}

  
  {!isMobile && listaImagens.length > 1 && (
    <div className="flex gap-2 mt-3 overflow-x-auto">
      {listaImagens.map((img, index) => (
       <div
  key={index}
  className={`relative h-20 w-28 rounded-lg overflow-hidden cursor-pointer ${
    index === indexAtual ? "ring-2 ring-blue-500" : ""
  }`}
  onClick={() => selecionarImagem(index)}
>
  <Image
    src={img}
    alt={`Imagem ${index + 1}`}
    fill
    sizes="112px"
    className="object-cover"
  />
</div>
      ))}
    </div>
  )}

   
{modalImagemAberto && (
  <div
    className="fixed inset-0 z-[999] bg-black/95 flex items-center justify-center"
    onClick={() => setModalImagemAberto(false)}
    onTouchMove={(e) => e.preventDefault()}
  >
    {/* BOTÃO FECHAR */}
    <button
      onClick={() => setModalImagemAberto(false)}
      className="absolute top-5 right-5 text-white bg-black/50 rounded-full p-2"
    >
      <X size={28} />
    </button>

   
    {!isMobile && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          imagemAnterior();
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-3 rounded-full"
      >
        <ChevronLeft className="text-white" size={30} />
      </button>
    )}

    
   <div
  className="relative w-[95vw] h-[90vh]"
  onClick={(e) => e.stopPropagation()}
>
  <Image
    src={listaImagens[indexAtual]}
    alt="Imagem ampliada"
    fill
    sizes="95vw"
    className="object-contain"
    onTouchStart={handleTouchStart}
    onTouchEnd={handleTouchEnd}
  />
</div>

    
    {!isMobile && listaImagens.length > 1 && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          proximaImagem();
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-3 rounded-full"
      >
        <ChevronRight className="text-white" size={30} />
      </button>
    )}
  </div>
)}
</>
 );
}
export default memo(ImageGallery);