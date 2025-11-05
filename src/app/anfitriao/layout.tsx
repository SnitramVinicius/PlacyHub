"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Home, Building2, CalendarDays, Wallet, User, BarChart3 } from "lucide-react";
import clsx from "clsx";

const links = [
  { name: "Painel", href: "/anfitriao", icon: Home },
  { name: "Dashboard", href:"/anfitriao/dashboard", icon: BarChart3 },
  { name: "Espaços", href: "/anfitriao/espacos", icon: Building2 },
  { name: "Reservas", href: "/anfitriao/reservas", icon: CalendarDays },
  { name: "Financeiro", href: "/anfitriao/financeiro", icon: Wallet },
  { name: "Perfil", href: "/anfitriao/perfil", icon: User },
];

export default function AnfitriaoLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // 🔹 Lista de rotas que NÃO devem mostrar a sidebar
  const rotasSemSidebar = ["/anfitriao/cadastro",
  "/anfitriao/espacos/novo"];

  const semSidebar = rotasSemSidebar.includes(pathname);

  if (semSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-md p-4 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-sky-600 mb-8">PlacyHub</h1>

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

      {/* Conteúdo principal */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
