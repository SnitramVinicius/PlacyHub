"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Tema = "claro" | "escuro";

interface TemaContextType {
  tema: Tema;
  setTema: (tema: Tema) => void;
}

const TemaContext = createContext<TemaContextType | undefined>(undefined);

export function TemaProvider({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<Tema>("claro");

  // Aplica a classe no body
  useEffect(() => {
    const root = document.documentElement;
    if (tema === "claro") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
    }
  }, [tema]);

  return (
    <TemaContext.Provider value={{ tema, setTema }}>
      {children}
    </TemaContext.Provider>
  );
}

export function useTema() {
  const context = useContext(TemaContext);
  if (!context) throw new Error("useTema deve ser usado dentro de TemaProvider");
  return context;
}
