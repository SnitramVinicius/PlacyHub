"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "./navbar";
import Navbar2 from "./navbar2";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    "/favoritos",
    "/locatario/pagamentos",
    "/locatario/preferencias",
    "/locatario/reservas",
    "/locatario/seguranca",
    "/anfitriao/espacos",
    "/app/suporte-locador",
    "/locatario/avaliacoes",
    "/anfitriao"
  ];

  // 👇 NOVO: esconder navbar no mobile na página de espaço
  const hideOnMobilePaths = ["/espaco"];

  if (!pathname) {
    return <Navbar />;
  }

  // 🔥 PRIORIDADE: esconder no mobile
  if (
    hideOnMobilePaths.some((path) => pathname.startsWith(path)) &&
    isMobile
  ) {
    return null;
  }

  if (noNavbarPaths.some((path) => pathname.startsWith(path))) {
    return null;
  }

  if (navbar2Paths.some((path) => pathname.startsWith(path))) {
    return <Navbar2 />;
  }

  return <Navbar />;
}