"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useUnreadNotifications } from "@/hooks/useUnreadNotifications";

export default function SinoNotificacoes() {
  const { user } = useAuth();
  const naoLidas = useUnreadNotifications(user?.id);

  return (
    <Link
      href="/locatario/notificacoes"
      className="relative flex flex-col items-center text-xs text-gray-600 dark:text-gray-400"
    >
      <div className="relative">
        <Bell size={20} />
        {naoLidas > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
            {naoLidas}
          </span>
        )}
      </div>
      <span>Notificações</span>
    </Link>
  );
}
