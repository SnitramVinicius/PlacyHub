"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export default function SinoNotificacoes() {
  const { user } = useAuth();
  const [naoLidas, setNaoLidas] = useState(0);

  useEffect(() => {
  const userId = user?.id;

  if (!userId) return;

  async function buscarNaoLidas() {
    const { count, error } = await supabase
      .from("notificacoes")
      .select("*", { count: "exact", head: true })
      .eq("usuario_id", userId)
      .eq("lida", false);

    if (!error && count !== null) {
      setNaoLidas(count);
    }
  }

  buscarNaoLidas();

  const canal = supabase
    .channel("notificacoes-channel")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notificacoes",
        filter: `usuario_id=eq.${userId}`,
      },
      () => {
        buscarNaoLidas();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(canal);
  };
}, [user?.id]);

  return (
    <Link
      href="/locatario/notificacoes"
      className="relative flex flex-col items-center text-xs text-gray-600 dark:text-gray-400"
    >
      <div className="relative">
        <Bell size={20} />
        {naoLidas > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {naoLidas > 9 ? "9+" : naoLidas}
          </span>
        )}
      </div>
      <span>Notificações</span>
    </Link>
  );
}