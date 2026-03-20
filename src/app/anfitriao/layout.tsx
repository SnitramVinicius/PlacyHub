"use client";

/* ======================= MENU LATERAL PAINEL DO ANFITRIAO ======================= */

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Building2,
  CalendarDays,
  CalendarCheck,
  Wallet,
  User,
  LogOut,
} from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/context/AuthContext";

const links = [
  { name: "Painel", href: "/anfitriao", icon: Home },
  { name: "Espaços", href: "/anfitriao/espacos", icon: Building2 },
  { name: "Reservas", href: "/anfitriao/reservas", icon: CalendarDays },
  { name: "Histórico de Reservas", href: "/anfitriao/historico", icon: CalendarCheck },
  { name: "Financeiro", href: "/anfitriao/financeiro", icon: Wallet },
  { name: "Perfil", href: "/locatario/perfil", icon: User },
];

export default function AnfitriaoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, isAnfitriao, logout } = useAuth();
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

  /* ===================== PROTEÇÃO CENTRAL ===================== */
  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!isAnfitriao) {
      router.replace("/");
    }
  }, [loading, user, isAnfitriao, router]);

  /* ===================== LOADING STATE ===================== */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900">
        Carregando painel do anfitrião...
      </div>
    );
  }

  if (!user || !isAnfitriao) return null;

  /* ===================== LAYOUT ===================== */
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Sidebar - Desktop */}
      {!isMobile && (
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-md p-4 flex flex-col justify-between fixed h-screen">
          <div>
            <img src="/placyhub.png" alt="Logo" className="w-30 h-9 mb-5" />

            <nav className="space-y-1">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname.startsWith(link.href);

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
          </div>

        </aside>
      )}

      {/* Conteúdo principal - com padding ajustado para mobile */}
      <main className={clsx(
        "flex-1 transition-all text-gray-900 dark:text-gray-100",
        isMobile ? "pb-20 px-4" : "ml-64 p-8"
      )}>
        {children}
      </main>

      {/* Menu inferior - Mobile (único menu em mobile) */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-around z-40">
          <Link
            href="/anfitriao"
            className="flex flex-col items-center text-xs text-gray-600 dark:text-gray-400"
          >
            <Home size={20} />
            <span>Painel</span>
          </Link>

          <Link
            href="/anfitriao/espacos"
            className="flex flex-col items-center text-xs text-gray-600 dark:text-gray-400"
          >
            <Building2 size={20} />
            <span>Espaços</span>
          </Link>

          <Link
            href="/anfitriao/reservas"
            className="flex flex-col items-center text-xs text-gray-600 dark:text-gray-400"
          >
            <CalendarDays size={20} />
            <span>Reservas</span>
          </Link>

          <Link
            href="/anfitriao/historico"
            className="flex flex-col items-center text-xs text-gray-600 dark:text-gray-400"
          >
            <CalendarCheck size={20} />
            <span>Histórico</span>
          </Link>

          <Link
            href="/anfitriao/financeiro"
            className="flex flex-col items-center text-xs text-gray-600 dark:text-gray-400"
          >
            <Wallet size={20} />
            <span>Financeiro</span>
          </Link>

          <Link
            href="/locatario/perfil"
            className="flex flex-col items-center text-xs text-gray-600 dark:text-gray-400"
          >
            <User size={20} />
            <span>Perfil</span>
          </Link>
        </div>
      )}
    </div>
  );
}