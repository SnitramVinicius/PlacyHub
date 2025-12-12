"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Idioma = "pt-BR" | "en-US" | "es-ES";

interface IdiomaContextType {
  idioma: Idioma;
  setIdioma: (idioma: Idioma) => void;
}

const IdiomaContext = createContext<IdiomaContextType | undefined>(undefined);

export function IdiomaProvider({ children }: { children: ReactNode }) {
  const [idioma, setIdioma] = useState<Idioma>("pt-BR");

  return (
    <IdiomaContext.Provider value={{ idioma, setIdioma }}>
      {children}
    </IdiomaContext.Provider>
  );
}

export function useIdioma() {
  const context = useContext(IdiomaContext);
  if (!context) throw new Error("useIdioma deve ser usado dentro de IdiomaProvider");
  return context;
}
