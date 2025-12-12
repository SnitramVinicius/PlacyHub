"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface FavoritosContextType {
  favoritos: string[];
  toggleFavorito: (id: string) => void;
}

const FavoritosContext = createContext<FavoritosContextType>({
  favoritos: [],
  toggleFavorito: () => {},
});

export function FavoritosProvider({ children }: { children: React.ReactNode }) {
  const [favoritos, setFavoritos] = useState<string[]>([]);

  // Carregar favoritos do localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("placyhub_favoritos");
      if (raw) setFavoritos(JSON.parse(raw));
    } catch {}
  }, []);

  // Salvar no localStorage sempre que mudar
  const toggleFavorito = (id: string) => {
    setFavoritos((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id];

      try {
        localStorage.setItem("placyhub_favoritos", JSON.stringify(updated));
      } catch {}

      return updated;
    });
  };

  return (
    <FavoritosContext.Provider value={{ favoritos, toggleFavorito }}>
      {children}
    </FavoritosContext.Provider>
  );
}

export function useFavoritos() {
  return useContext(FavoritosContext);
}
