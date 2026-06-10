"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export default function SinoNavbar() {
  const { user } = useAuth();
  const router = useRouter();
  const [naoLidas, setNaoLidas] = useState(0);

  useEffect(() => {
  if (!user?.id) return;

  async function buscarNaoLidas() {
    const { count, error } = await supabase
      .from("notificacoes")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("usuario_id", user?.id)
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
        filter: `usuario_id=eq.${user.id}`,
      },
      () => buscarNaoLidas()
    )
    .subscribe();

  return () => {
    supabase.removeChannel(canal);
  };
}, [user]);

  return (
    <button
      onClick={() => router.push("/locatario/notificacoes")}
      className="relative p-1.5 md:p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
      aria-label="Notificações"
    >
      <div className="relative">
        <Bell size={20} className="text-gray-600 dark:text-gray-400" />
        {naoLidas > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {naoLidas > 9 ? "9+" : naoLidas}
          </span>
        )}
      </div>
    </button>
  );
}