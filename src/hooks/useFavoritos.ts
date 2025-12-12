// src/hooks/useFavoritos.ts

"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "placyhub_favoritos";

export function useFavoritos() {
  const [favoritos, setFavoritos] = useState<string[]>([]);

  // Carregar favoritos ao iniciar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setFavoritos(JSON.parse(raw));
      }
    } catch (err) {
      console.warn("Erro ao carregar favoritos:", err);
    }
  }, []);

  // Salvar sempre que mudar
  const salvar = (lista: string[]) => {
    setFavoritos(lista);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    } catch {}
  };

  const isFavorito = (id: string) => favoritos.includes(id);

  const addFavorito = (id: string) => {
    if (!isFavorito(id)) salvar([...favoritos, id]);
  };

  const removeFavorito = (id: string) => {
    salvar(favoritos.filter((f) => f !== id));
  };

  const toggleFavorito = (id: string) => {
    if (isFavorito(id)) {
      removeFavorito(id);
    } else {
      addFavorito(id);
    }
  };

  const clearAll = () => {
    salvar([]);
  };

  return {
    favoritos,
    isFavorito,
    addFavorito,
    removeFavorito,
    toggleFavorito,
    clearAll,
  };
}
