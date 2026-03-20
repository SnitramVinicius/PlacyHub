"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "./navbar";


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
    "/locatario/avaliacoes",
    "/anfitriao",
    "/login",
    "/esqueci-senha",
    "/cadastro/locatario"
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

 
  return <Navbar />;
}