"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";

type Tema = "claro" | "escuro";

interface TemaContextType {
  tema: Tema;
  setTema: (tema: Tema) => void;
}

const TemaContext = createContext<TemaContextType | undefined>(undefined);

export function TemaProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [tema, setTemaState] = useState<Tema>("claro");
  const [isHydrated, setIsHydrated] = useState(false);

  // Aplicar tema no HTML (sem salvar no localStorage)
  const aplicarTema = (novoTema: Tema) => {
    const root = document.documentElement;
    if (novoTema === "escuro") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  // Salvar tema no banco de dados
  const salvarTemaNoBanco = async (novoTema: Tema) => {
    if (!user?.id) return;
    
    try {
      await supabase
        .from("users")
        .update({ tema: novoTema })
        .eq("id", user.id);
      console.log("✅ Tema salvo no banco para usuário", user.id);
    } catch (error) {
      console.error("❌ Erro ao salvar tema no banco:", error);
    }
  };

  // Função para mudar tema
  const setTema = async (novoTema: Tema) => {
    console.log("🔄 Mudando tema para:", novoTema);
    setTemaState(novoTema);
    aplicarTema(novoTema);
    await salvarTemaNoBanco(novoTema);
  };

  // Carregar tema quando o usuário estiver disponível
  useEffect(() => {
    const carregarTema = async () => {
      // Carregar do localStorage primeiro (mais rápido)
      const temaSalvo = localStorage.getItem("tema") as Tema | null;
      if (temaSalvo) {
        setTemaState(temaSalvo);
        aplicarTema(temaSalvo);
      }
      
      // Se tiver usuário, carregar do banco (sobrescreve)
      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from("users")
            .select("tema")
            .eq("id", user.id)
            .single();
          
          if (!error && data?.tema && (data.tema === "claro" || data.tema === "escuro")) {
            console.log("📱 Tema carregado do banco:", data.tema);
            setTemaState(data.tema);
            aplicarTema(data.tema);
          }
        } catch (error) {
          console.error("Erro ao carregar tema do banco:", error);
        }
      }
      
      setIsHydrated(true);
    };

    carregarTema();
  }, [user?.id]);

  // Garantir que o tema seja aplicado mesmo antes da hidratação
  if (!isHydrated) {
    // Aplica o tema do localStorage imediatamente
    if (typeof window !== 'undefined') {
      const temaSalvo = localStorage.getItem("tema") as Tema | null;
      if (temaSalvo) {
        aplicarTema(temaSalvo);
      }
    }
  }

  return (
    <TemaContext.Provider value={{ tema, setTema }}>
      {children}
    </TemaContext.Provider>
  );
}

export function useTema() {
  const context = useContext(TemaContext);
  if (!context) {
    // Retorna um valor padrão durante o SSR
    if (typeof window === 'undefined') {
      return { tema: "claro" as Tema, setTema: () => {} };
    }
    throw new Error("useTema deve ser usado dentro de TemaProvider");
  }
  return context;
}