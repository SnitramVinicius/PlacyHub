"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  DollarSign,
  CalendarDays,
  Users,
  Building2,
  House,
  User,
} from "lucide-react";

const menus = [
  {
    nome: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    nome: "Financeiro",
    href: "/admin/financeiro",
    icon: DollarSign,
  },
  {
    nome: "Reservas",
    href: "/admin/reservas",
    icon: CalendarDays,
  },
  {
    nome: "Usuários",
    href: "/admin/usuarios",
    icon: Users,
  },
  {
    nome: "Espaços",
    href: "/admin/espacos",
    icon: Building2,
  },
  {  
  nome: "Suporte",
    href: "/admin/suporte",
    icon: CalendarDays,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg min-h-screen">

      <div className="p-6 border-b">

  <Link href="/" className="block">

    <h1 className="text-2xl font-bold text-sky-600">
      PlacyHub
    </h1>

    <p className="text-sm text-gray-500 hover:text-sky-600 transition">
      Administrativo
    </p>

  </Link>

</div>

      <nav className="mt-4">

        {menus.map((menu) => {

          const Icon = menu.icon;

          const ativo = pathname === menu.href;

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`flex items-center gap-3 px-6 py-4 transition ${
                ativo
                  ? "bg-sky-100 text-sky-700 font-semibold border-r-4 border-sky-600"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Icon size={20} />

              {menu.nome}
            </Link>
          );
        })}

      </nav>

<div className="border-t mt-4 pt-4">
  <p className="px-6 mb-2 text-xs uppercase text-gray-400">
    Navegação
  </p>

  <Link
    href="/"
    className="flex items-center gap-3 px-6 py-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
  >
    <House size={20} />
    Página Inicial
  </Link>

  <Link
    href="/locatario/perfil"
    className="flex items-center gap-3 px-6 py-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
  >
    <User size={20} />
    Meu Perfil
  </Link>
</div>

    </aside>
  );
}