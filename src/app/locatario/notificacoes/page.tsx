"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, Check, Trash2, Calendar, Heart, MessageCircle, Star, AlertCircle, ChevronLeft, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
// import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { refreshUnreadNotifications } from "@/hooks/useUnreadNotifications";

interface Notification {
  id: string;
  tipo: "reserva" | "favorito" | "mensagem" | "avaliacao" | "sistema" | "pagamento" | "cancelamento" | "alteracao";
  titulo: string;
  mensagem: string;
  lida: boolean;
  link?: string;
  dados_extra?: any;
  created_at: string;
}

export default function NotificacoesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth(); // 🔥 PEGAR O loading DO AUTH
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  // 🔥 CORRIGIDO: Aguardar o auth carregar antes de qualquer ação
  useEffect(() => {
    // Se ainda está carregando o auth, não faz nada
    if (authLoading) {
      return;
    }
    
    // Se não tem usuário após o carregamento, redireciona
    if (!user) {
      router.push("/login");
      return;
    }
    
    // Se tem usuário, carrega as notificações
    fetchNotifications();
  }, [user, authLoading, router]);

 const fetchNotifications = async () => {
  try {
    setLoading(true);
    const { data, error } = await supabase
      .from("notificacoes")
      .select("*")
      .eq("usuario_id", user?.id)  // ← ADICIONE ESTA LINHA
      .order("created_at", { ascending: false });

    if (error) throw error;
    setNotifications((data as Notification[]) || []);
  } catch (error) {
    console.error(error);
    toast.error("Erro ao carregar notificações");
  } finally {
    setLoading(false);
  }
};
  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notificacoes")
        .update({ lida: true })
        .eq("id", notificationId);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, lida: true } : n))
      );
      refreshUnreadNotifications();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao marcar notificação");
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from("notificacoes")
        .update({ lida: true })
        .eq("usuario_id", user!.id)
        .eq("lida", false);

      if (error) throw error;

      setNotifications((prev) => prev.map((n) => ({ ...n, lida: true })));
      refreshUnreadNotifications();
      toast.success("Todas as notificações foram marcadas");
    } catch (error) {
      console.error(error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notificacoes")
        .delete()
        .eq("id", notificationId);

      if (error) throw error;

      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      refreshUnreadNotifications();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao remover notificação");
    }
  };

  const getNotificationIcon = (tipo: Notification["tipo"]) => {
    switch (tipo) {
      case "reserva":
        return <Calendar size={20} className="text-blue-500" />;
      case "favorito":
        return <Heart size={20} className="text-red-500" />;
      case "mensagem":
        return <MessageCircle size={20} className="text-green-500" />;
      case "avaliacao":
        return <Star size={20} className="text-yellow-500" />;
      case "pagamento":
        return <AlertCircle size={20} className="text-purple-500" />;
      default:
        return <Bell size={20} className="text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Agora mesmo";
    if (diffMins < 60) return `${diffMins} min atrás`;
    if (diffHours < 24) return `${diffHours} h atrás`;
    if (diffDays === 1) return "Ontem";
    if (diffDays < 7) return `${diffDays} dias atrás`;
    return date.toLocaleDateString("pt-BR");
  };

  const filteredNotifications = notifications.filter((notif) =>
    filter === "all" ? true : !notif.lida
  );

  const unreadCount = notifications.filter((n) => !n.lida).length;

  // 🔥 Tela de loading enquanto verifica autenticação
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
          </div>
        </div>
      </div>
    );
  }

  // Se não tem usuário, não renderiza (já vai redirecionar)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <ChevronLeft size={24} className="text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Notificações
                </h1>
                {unreadCount > 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {unreadCount} notificação{unreadCount !== 1 ? "ões" : ""} não lida{unreadCount !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Check size={16} />
                  <span className="hidden sm:inline">Marcar todas</span>
                </button>
              )}
              {/* <Link
  href="/locatario/preferencias"
  className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
>
  <Settings size={20} />
</Link> */}
            </div>
          </div>

          {/* Filtros */}
          <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                filter === "all"
                  ? "text-sky-600 dark:text-sky-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              Todas
              {filter === "all" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500"></div>
              )}
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                filter === "unread"
                  ? "text-sky-600 dark:text-sky-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              Não lidas
              {unreadCount > 0 && (
                <span className="ml-2 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                  {unreadCount}
                </span>
              )}
              {filter === "unread" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500"></div>
              )}
            </button>
          </div>
        </div>

        {/* Lista de Notificações */}
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Bell size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhuma notificação
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {filter === "unread" 
                ? "Você não tem notificações não lidas" 
                : "Você ainda não tem notificações"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white dark:bg-gray-800 rounded-xl p-4 transition-all hover:shadow-md ${
                  !notification.lida ? "border-l-4 border-l-sky-500" : "border border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      {getNotificationIcon(notification.tipo)}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {notification.titulo}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {notification.mensagem}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                          {formatDate(notification.created_at)}
                        </p>
                      </div>
                      
                      <div className="flex gap-1">
                        {!notification.lida && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1.5 text-gray-400 hover:text-sky-500 transition-colors"
                            title="Marcar como lida"
                          >
                            <Check size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                          title="Remover"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* {notification.link && (
                      <Link
                        href={notification.link}
                        onClick={() => {
                          if (!notification.lida) markAsRead(notification.id);
                        }}
                        className="inline-block mt-3 text-xs font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 transition-colors"
                      >
                        Ver detalhes →
                      </Link>
                    )} */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {notifications.length > 0 && (
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <p className="text-sm text-blue-800 dark:text-blue-300 text-center">
              Dica: Você pode configurar quais notificações deseja receber nas configurações.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
