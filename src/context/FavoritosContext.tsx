"use client";

import { createContext, useContext, ReactNode } from "react";
import { useFavoritos as useFavoritosHook } from "@/hooks/useFavoritos";

interface FavoritosContextType {
  favoritos: string[];
  loading: boolean;
  toggleFavorito: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
}

const FavoritosContext = createContext<FavoritosContextType>({} as FavoritosContextType);

export function FavoritosProvider({ children }: { children: ReactNode }) {
  const favoritosData = useFavoritosHook();
  
  return (
    <FavoritosContext.Provider value={favoritosData}>
      {children}
    </FavoritosContext.Provider>
  );
}

export function useFavoritos() {
  return useContext(FavoritosContext);
}