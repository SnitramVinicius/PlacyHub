"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Home,
  CalendarDays,
  User,
  LogOut,
  Star as StarIcon,
  LayoutDashboard,
  Bell,
  ShieldCheck,
} from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/context/AuthContext";
import SinoNotificacoesDesktop from "@/components/SinoNotificacoesDesktop";

const links = [
  { name: "Início", href: "/", icon: Home },
  { name: "Meu Perfil", href: "/locatario/perfil", icon: User }, 
  { name: "Minhas Reservas", href: "/locatario/reservas", icon: CalendarDays },
  { name: "Notificações", href: "/locatario/notificacoes", icon: Bell},
  { name: "Avaliações", href: "/locatario/avaliacoes", icon: StarIcon },
];

export default function UsuarioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
const { logout, user, loading } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  // Effect para responsividade
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Proteção das rotas do locatário
useEffect(() => {
  if (loading) return;

  if (!user) {
    router.replace(`/login?redirect=${pathname}`);
  }
}, [loading, user, router]);

if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-gray-500 dark:text-gray-400">
        Carregando...
      </div>
    </div>
  );
}

if (!user) {
  return null;
}
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Sidebar - Desktop */}
      {!isMobile && (
        <aside className="w-64 bg-white dark:bg-gray-800 border-r shadow-md p-4 flex flex-col justify-between fixed h-screen">
          <div>
            <img src="/placyhub.png" alt="Logo" className="w-30 h-9 mb-6" />

            <nav className="space-y-1">
              {links.map((link) => {
                if (link.name === "Notificações") {
                  return <SinoNotificacoesDesktop key={link.name} />;
                }
                
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={clsx(
                      "flex items-center gap-3 px-4 py-2 rounded-xl transition-all",
                      isActive
                        ? "bg-sky-100 dark:bg-sky-700 text-sky-700 dark:text-white font-semibold"
                        : "text-gray-600 dark:text-gray-200 hover:bg-sky-50 dark:hover:bg-sky-600 hover:text-sky-700 dark:hover:text-white"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {link.name}
                  </Link>
                );
              })}
            </nav>

          {/* 🔁 Alternar para Anfitrião */}
{user?.roles?.includes("ANFITRIAO") && (
  <div className="mt-6 border-t pt-4">
    <Link
      href="/anfitriao"
      className="flex items-center gap-3 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-700 text-emerald-700 dark:text-white hover:bg-emerald-100 dark:hover:bg-emerald-600 transition font-semibold"
    >
      <LayoutDashboard className="w-5 h-5" />
      Área do Anfitrião
    </Link>
  </div>
)}


{/* 🛡️ Área Administrativa */}
{user?.roles?.includes("ADMIN") && (
  <div className="mt-4">
    <Link
      href="/admin"
      className="
        flex items-center gap-3
        px-4 py-2
        rounded-xl
        bg-red-50
        text-red-700
        hover:bg-red-100
        transition
        font-semibold
      "
    >
      <ShieldCheck className="w-5 h-5" />
      Painel Admin
    </Link>
  </div>
)}
            
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition"
          >
            <LogOut size={20} />
            Sair
          </button>
        </aside>
      )}

      {/* Conteúdo principal - sem padding inferior para mobile */}
      <main className={clsx(
        "flex-1 transition-all",
        isMobile ? "pt-4 px-4" : "ml-64 p-8"
      )}>
        {children}
      </main>

      {/* Menu inferior mobile REMOVIDO - agora usa MobileTopBar global */}
    </div>
  );
}