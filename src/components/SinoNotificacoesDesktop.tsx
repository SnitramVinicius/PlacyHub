"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import clsx from "clsx";

export default function SinoNotificacoesDesktop() {
  const { user } = useAuth();
  const [naoLidas, setNaoLidas] = useState(0);
  const pathname = usePathname();
  const isActive = pathname === "/locatario/notificacoes";

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
      () => buscarNaoLidas()
    )
    .subscribe();

  return () => {
    supabase.removeChannel(canal);
  };
}, [user]);

  return (
    <Link
      href="/locatario/notificacoes"
      className={clsx(
        "flex items-center gap-3 px-4 py-2 rounded-xl transition-all",
        isActive
          ? "bg-sky-100 dark:bg-sky-700 text-sky-700 dark:text-white font-semibold"
          : "text-gray-600 dark:text-gray-200 hover:bg-sky-50 dark:hover:bg-sky-600 hover:text-sky-700 dark:hover:text-white"
      )}
    >
      <div className="relative">
        <Bell className="w-5 h-5" />
        {naoLidas > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {naoLidas > 9 ? "9+" : naoLidas}
          </span>
        )}
      </div>
      Notificações
    </Link>
  );
}