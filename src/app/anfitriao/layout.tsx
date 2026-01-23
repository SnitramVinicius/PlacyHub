"use client";

/* ======================= MENU LATERAL PAINEL DO ANFITRIAO ======================= */

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Building2,
  CalendarDays,
  CalendarCheck,
  Wallet,
  User,
} from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/context/AuthContext";

const links = [
  { name: "Painel", href: "/anfitriao", icon: Home },
  { name: "Espaços", href: "/anfitriao/espacos", icon: Building2 },
  { name: "Reservas", href: "/anfitriao/reservas", icon:  CalendarDays },
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
  const { user, loading, isAnfitriao } = useAuth();

  /* ===================== PROTEÇÃO CENTRAL ===================== */
useEffect(() => {
  if (loading) return; // ⛔ espera carregar do localStorage

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
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Carregando painel do anfitrião...
      </div>
    );
  }

  if (!user || !isAnfitriao) return null;

  /* ===================== LAYOUT ===================== */
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-md p-4 flex flex-col justify-between">
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
                      ? "bg-sky-100 text-sky-700 font-semibold"
                      : "text-gray-600 hover:bg-sky-50 hover:text-sky-700"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <button
          onClick={() => router.push("/")}
          className="text-sm text-gray-500 hover:text-sky-600 transition mt-8"
        >
          ← Voltar ao site
        </button>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
