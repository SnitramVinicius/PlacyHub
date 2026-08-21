"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const NOTIFICATIONS_CHANGED_EVENT = "placyhub:notifications-changed";

export function refreshUnreadNotifications() {
  window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED_EVENT));
}

export function useUnreadNotifications(userId?: string) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) {
      setUnreadCount(0);
      return;
    }

    let active = true;

    const fetchUnreadCount = async () => {
      const { count, error } = await supabase
        .from("notificacoes")
        .select("id", { count: "exact", head: true })
        .eq("usuario_id", userId)
        .eq("lida", false);

      if (error) {
        console.error("Erro ao buscar notificações não lidas:", error);
        return;
      }

      if (active) setUnreadCount(count ?? 0);
    };

    void fetchUnreadCount();

    const channel = supabase
      .channel(`unread-notifications-${userId}-${Math.random()}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notificacoes",
          filter: `usuario_id=eq.${userId}`,
        },
        fetchUnreadCount
      )
      .subscribe();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") void fetchUnreadCount();
    };

    window.addEventListener("focus", fetchUnreadCount);
    window.addEventListener(NOTIFICATIONS_CHANGED_EVENT, fetchUnreadCount);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    const interval = window.setInterval(fetchUnreadCount, 30_000);

    return () => {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener("focus", fetchUnreadCount);
      window.removeEventListener(NOTIFICATIONS_CHANGED_EVENT, fetchUnreadCount);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      void supabase.removeChannel(channel);
    };
  }, [userId]);

  return unreadCount;
}
