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

    let isMounted = true;

    async function buscarNaoLidas() {
      try {
        const { count, error } = await supabase
          .from("notificacoes")
          .select("*", { count: "exact", head: true })
          .eq("usuario_id", user!.id)
          .eq("lida", false);

        if (!error && count !== null && isMounted) {
          setNaoLidas(count);
        }
      } catch (err) {
        console.error("Erro ao buscar notificações:", err);
      }
    }

    // Buscar inicial
    buscarNaoLidas();

    // Buscar a cada 30 segundos (polling simples e estável)
    const interval = setInterval(() => {
      buscarNaoLidas();
    }, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
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