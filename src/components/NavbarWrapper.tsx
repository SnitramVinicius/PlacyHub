// src/components/NavbarWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";
import Navbar2 from "./navbar2";

export default function NavbarWrapper() {
  const pathname = usePathname();

  // Rotas que devem mostrar a Navbar2
  const navbar2Paths = [
    "/login",
    "/cadastro/locatario",
    "/anfitriao/cadastro",
    "/anfitriao/espacos/novo",
    "/esqueci-senha",
  ];

  // Rotas que não devem mostrar nenhuma navbar
  const noNavbarPaths = [
    "/locatario/perfil",
    "/locatario/favoritos",
    "/locatario/pagamentos",
    "/locatario/preferencias",
    "/locatario/reservas",
    "/locatario/seguranca",
    "/anfitriao/espacos",
    "/app/suporte-locador",
  ];

  if (noNavbarPaths.some((path) => pathname.startsWith(path))) {
    return null; // nenhuma navbar
  }

  if (navbar2Paths.some((path) => pathname.startsWith(path))) {
    return <Navbar2 />;
  }

  // padrão
  return <Navbar />;
}
