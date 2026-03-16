"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Tema = "claro" | "escuro";

interface TemaContextType {
  tema: Tema;
  setTema: (tema: Tema) => void;
}

const TemaContext = createContext<TemaContextType | undefined>(undefined);

export function TemaProvider({ children }: { children: ReactNode }) {
  const [tema, setTemaState] = useState<Tema>("claro");

  // carregar tema salvo quando o site abrir
  useEffect(() => {
    const temaSalvo = localStorage.getItem("tema") as Tema | null;

    if (temaSalvo) {
      setTemaState(temaSalvo);
    }
  }, []);

  // aplicar tema no html e salvar
  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove("dark");

    if (tema === "escuro") {
      root.classList.add("dark");
    }

    localStorage.setItem("tema", tema);
  }, [tema]);

  const setTema = (novoTema: Tema) => {
    setTemaState(novoTema);
  };

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