"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Heart, CalendarDays, User, LogOut, Star as StarIcon } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/context/AuthContext";

const links = [
  { name: "Início", href: "/", icon: Home },
  { name: "Meu Perfil", href: "/locatario/perfil", icon: User },
  { name: "Minhas Reservas", href: "/locatario/reservas", icon: CalendarDays },
  { name: "Avaliações", href: "/locatario/avaliacoes", icon: StarIcon },
];

export default function UsuarioLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r shadow-md p-4 flex flex-col justify-between">
        <div>
          <img src="/placyhub.png" alt="Logo" className="w-30 h-9 mb-5" />

          <nav className="space-y-1">
            {links.map((link) => {
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
        </div>

        <div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition text-left text-sm text-red-600 dark:text-red-400 font-medium"
          >
            <LogOut className="w-5 h-5" />
            Sair da conta
          </button>
        </div>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
