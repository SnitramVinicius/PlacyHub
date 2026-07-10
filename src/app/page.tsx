export const dynamic = "force-dynamic";
import { getSpacesHome } from "@/lib/server/spaces";
import HomeClient from "@/components/HomeClient";


export default async function Home() {

  const sections = await getSpacesHome();


  return (
    <HomeClient 
      sections={sections}
    />
  );

}

// interface Espaco {
//   id: string;
//   nome: string;
//   preco: number;
//   precoMinimoBuffet?: number | null;
//   avaliacao: number;
//   popularidade: number;
//   cidade?: string;
//   duracao?: number | string;
//   imagem?: string;
//   buffet?: boolean;
//   tipo?: string;
// }

// interface HomeClientProps {

//   sections: {
//     indicados: Espaco[];
//     destaque: Espaco[];
//     fimDeSemana: Espaco[];
//     proximos: Espaco[];
//     recomendados: Espaco[];
//   };

// import { useRef, useCallback } from "react";
// import Link from "next/link";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { useAuth } from "@/context/AuthContext";
// import { useFavoritos } from "@/context/FavoritosContext";
// import { toast } from "sonner";
// import CardEspacoHome from "@/components/CardEspacoHome";
// import Footer from "@/components/footer";
// import { useSpaces } from "@/hooks/useSpaces";

// export default function Home() {
//   const { user } = useAuth();
//   const isLogged = !!user;

// const {
//   data: sections = {
//     indicados: [],
//     destaque: [],
//     fimDeSemana: [],
//     proximos: [],
//     recomendados: [],
//   },
//   isLoading: loading,
// } = useSpaces();

//   const { favoritos, toggleFavorito } = useFavoritos();
//   const scrollRefs = useRef<Record<string, HTMLElement | null>>({});

//   const scrollByAmount = (key: string, amount: number) => {
//     const el = scrollRefs.current[key];
//     if (!el) return;
//     el.scrollBy({ left: amount, behavior: "smooth" });
//   };

//   const scrollLeft = (key: string) =>
//     scrollByAmount(key, -(scrollRefs.current[key]?.clientWidth ?? 0) * 0.8);

//   const scrollRight = (key: string) =>
//     scrollByAmount(key, (scrollRefs.current[key]?.clientWidth ?? 0) * 0.8);

//  const handleFavoritoClick = useCallback((espacoId: string) => {

//   if (!isLogged) {
//     toast.error("Você precisa estar logado para adicionar aos favoritos!");
//     return;
//   }

//   toggleFavorito(espacoId);

//   if (favoritos.includes(espacoId)) {
//     toast.success("Espaço removido dos favoritos!");
//   } else {
//     toast.success("Espaço adicionado aos favoritos!");
//   }

// }, [
//   isLogged,
//   toggleFavorito,
//   favoritos
// ]);

//   const renderSection = (
//     titulo: string,
//     lista: any[],
//     key: string,
//     subtitulo?: string 
//   ) => {
//     if (lista.length === 0) return null;

//     return (
//       <div key={key} className="mb-6 md:mb-8">
//         <div className="flex flex-col px-4 sm:px-6 md:px-10 mt-6 md:mt-10">
//           <h1 className="font-bold text-xl sm:text-2xl text-gray-900 dark:text-gray-100">
//             {titulo}
//           </h1>
//           {subtitulo && (
//             <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm -mt-1 mb-2 md:mb-3">
//               {subtitulo}
//             </p>
//           )}
//         </div>

//         <div className="flex justify-between items-center px-4 sm:px-6 md:px-10 mb-2 md:mb-3">
//           <div />
//           <div className="flex gap-2 md:gap-3">
//             <button
//               onClick={() => scrollLeft(key)}
//               className="p-1.5 md:p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition shadow-md"
//               aria-label="Rolar para esquerda"
//             >
//               <ChevronLeft size={18} className="md:w-5 md:h-5" />
//             </button>
//             <button
//               onClick={() => scrollRight(key)}
//               className="p-1.5 md:p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition shadow-md"
//               aria-label="Rolar para direita"
//             >
//               <ChevronRight size={18} className="md:w-5 md:h-5" />
//             </button>
//           </div>
//         </div>

//         <section
//           ref={(el) => {
//             scrollRefs.current[key] = el;
//           }}
//           className="flex gap-3 sm:gap-4 md:gap-6 overflow-x-auto scrollbar-hide px-4 sm:px-6 md:px-10 py-2 md:py-4 scroll-smooth"
//         >
//           {lista.map((espaco)=>(
//   <CardEspacoHome
//     key={espaco.id}
//     espaco={espaco}
//     favorito={favoritos.includes(espaco.id)}
//     onFavoritoClick={handleFavoritoClick}
//   />
// ))}
//         </section>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
//           <p className="text-gray-500">Carregando espaços...</p>
//         </div>
//       </div>
//     );
//   }

// const totalEspacos =
//   sections.indicados.length +
//   sections.destaque.length +
//   sections.fimDeSemana.length +
//   sections.proximos.length +
//   sections.recomendados.length;

// if (totalEspacos === 0) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-500 mb-4">Nenhum espaço encontrado.</p>
//           <Link
//             href="/anfitriao/espacos/novo"
//             className="text-sky-500 hover:text-sky-600"
//           >
//             Cadastre seu primeiro espaço
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   if (!favoritos) return null;

//   return (
//     <div className="min-h-screen">
      

//       {!isLogged && (
//         <div>
//           {renderSection(
//             "Explore espaços populares no Brasil",
//            sections.indicados,
//             "visit-indicados",
//             "Os espaços mais reservados e avaliados pelos visitantes"
//           )}

//           {renderSection(
//             "Em alta no momento",
//           sections.destaque,
//             "visit-destaque",
//             "Os espaços mais procurados nesta semana"
//           )}

//           {renderSection(
//             "Disponíveis para este fim de semana",
//            sections.fimDeSemana,
//             "visit-fds",
//             "As melhores opções para eventos rápidos"
//           )}
//         </div>
//       )}

//       {isLogged && (
//         <div>
//           {renderSection(
//             "Perto de você",
//            sections.proximos,
//             "log-proximos",
//             "Opções próximas à sua região"
//           )}

//           {renderSection(
//             "Sugestões para você",
//            sections.recomendados,
//             "log-recomendados",
//             "Recomendados com base no seu perfil"
//           )}
//         </div>
//       )}
// <Footer />
//     </div>
//   );
// }