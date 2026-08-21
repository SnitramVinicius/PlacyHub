"use client";

import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useUnreadNotifications } from "@/hooks/useUnreadNotifications";

export default function SinoNavbar() {
  const { user } = useAuth();
  const router = useRouter();
  const naoLidas = useUnreadNotifications(user?.id);

  return (
    <button
      onClick={() => router.push("/locatario/notificacoes")}
      className="relative p-1.5 md:p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
      aria-label="Notificações"
    >
      <div className="relative">
        <Bell size={20} className="text-gray-600 dark:text-gray-400" />
        {naoLidas > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
            {naoLidas}
          </span>
        )}
      </div>
    </button>
  );
}
