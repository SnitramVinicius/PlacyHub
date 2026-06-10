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
    "/locatario",
    "/login",
    "/esqueci-senha",
    "/cadastro/locatario",
    "/virar-anfitriao",
    "/footer/cadastre-seu-espaco",
    "/footer/como-funciona",
    "/footer/planos-e-comissoes",
    "/footer/central-ajuda",
    "/footer/faq",
    "/footer/redes-sociais",
    "/footer/sobre",
    "/footer/suporte-locador",
    "/footer/termos",
    "/footer/privacidade",
    "/footer/contato",
    "/footer/cancelamento",
    "/reset-password"

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