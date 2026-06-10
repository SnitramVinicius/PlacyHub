"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export function useFavoritos() {
  const { user } = useAuth();
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar favoritos do Supabase quando usuário mudar
  useEffect(() => {
    async function carregarFavoritos() {
      setLoading(true);
      
      if (!user?.id) {
        setFavoritos([]);
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from("favoritos")
        .select("espaco_id")
        .eq("user_id", user.id);
      
      if (error) {
        console.error("Erro ao carregar favoritos:", error);
        setFavoritos([]);
      } else {
        setFavoritos(data.map((item) => item.espaco_id));
      }
      
      setLoading(false);
    }
    
    carregarFavoritos();
  }, [user?.id]);

  // Adicionar favorito
const addFavorito = async (espacoId: string) => {
  console.log("🔍 user:", user);
  console.log("🔍 user?.id:", user?.id);
  console.log("🔍 espacoId:", espacoId);
  
  if (!user?.id) {
    console.log("❌ Usuário não logado");
    return;
  }
  
  const { data, error } = await supabase
    .from("favoritos")
    .insert({ user_id: user.id, espaco_id: espacoId })
    .select();
  
  console.log("📦 Resposta completa:", { data, error });
  
  if (error) {
    console.error("❌ Erro completo:", JSON.stringify(error, null, 2));
  } else {
    console.log("✅ Favorito adicionado:", data);
    setFavoritos([...favoritos, espacoId]);
  }
};

  // Remover favorito
  const removeFavorito = async (espacoId: string) => {
    if (!user?.id) return;
    
    const { error } = await supabase
      .from("favoritos")
      .delete()
      .eq("user_id", user.id)
      .eq("espaco_id", espacoId);
    
    if (error) {
      console.error("Erro ao remover favorito:", error);
    } else {
      setFavoritos(favoritos.filter((id) => id !== espacoId));
    }
  };

  // Verificar se é favorito
  const isFavorito = (id: string) => favoritos.includes(id);

  // Alternar favorito
  const toggleFavorito = async (espacoId: string) => {
    if (isFavorito(espacoId)) {
      await removeFavorito(espacoId);
    } else {
      await addFavorito(espacoId);
    }
  };

  // Limpar todos
  const clearAll = async () => {
    if (!user?.id) return;
    
    const { error } = await supabase
      .from("favoritos")
      .delete()
      .eq("user_id", user.id);
    
    if (error) {
      console.error("Erro ao limpar favoritos:", error);
    } else {
      setFavoritos([]);
    }
  };

  return {
    favoritos,
    loading,
    isFavorito,
    addFavorito,
    removeFavorito,
    toggleFavorito,
    clearAll,
  };
}