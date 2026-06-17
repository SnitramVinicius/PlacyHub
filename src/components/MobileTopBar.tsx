"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Heart, Calendar, User, LayoutDashboard, Search, Menu, X, Home, Star, LogOut, ArrowLeft, Store, History, TrendingUp } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import SinoNavbar from "./SinoNavbar";
import Link from "next/link";
import DatePicker, { registerLocale } from "react-datepicker";
import { ptBR } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("pt-BR", ptBR);

export default function MobileTopBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAnfitriao, logout } = useAuth();
  const [menuAberto, setMenuAberto] = useState(false);
  const [searchAberto, setSearchAberto] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [cityQuery, setCityQuery] = useState("");
  const [cities, setCities] = useState<{ nome: string; uf: string }[]>([]);
  const [filteredCities, setFilteredCities] = useState<{ nome: string; uf: string }[]>([]);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const minSelectableDate = new Date();
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  const normalize = (str: string) =>
    str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim();
const [showBenefitsModal, setShowBenefitsModal] = useState(false);

  useEffect(() => {
    async function loadCities() {
      try {
        const response = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/municipios");
        const data = await response.json();
        const mapped = data.map((c: any) => ({
          nome: c.nome,
          uf: c.microrregiao?.mesorregiao?.UF?.sigla || "",
        }));
        setCities(mapped);
      } catch (error) {
        console.error("Erro ao carregar cidades:", error);
      }
    }
    loadCities();
  }, []);

  useEffect(() => {
    if (cityQuery.trim() === "") {
      setFilteredCities([]);
      setShowCitySuggestions(false);
      return;
    }
    
    const filtered = cities
      .filter((c) => normalize(`${c.nome} ${c.uf}`).includes(normalize(cityQuery)))
      .slice(0, 10);
    
    setFilteredCities(filtered);
    setShowCitySuggestions(filtered.length > 0);
  }, [cityQuery, cities]);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 768);
    
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (menuAberto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuAberto]);

  if (!mounted) return null;

  const hideOnPages = ["/login", "/cadastro", "/esqueci-senha"];
  if (hideOnPages.includes(pathname)) return null;
  
  if (!isMobile) return null;

  // ============================================
  // LINKS DO MENU - COM DUAS OPÇÕES PARA ANFITRIÃO
  // ============================================
  
  // Links base (para todos)
const baseLinks = [
  { name: "Início", href: "/", icon: <Home size={18} />, id: "home" },
];

if (user) {
  baseLinks.unshift(
    { name: "Meu Perfil", href: "/locatario/perfil", icon: <User size={18} />, id: "meu-perfil" }
  );

  baseLinks.push(
    { name: "Favoritos", href: "/favoritos", icon: <Heart size={18} />, id: "favoritos" }
  );
}

  // Reservas (duas opções para anfitrião)
  const reservasLinks = [
    { name: " Reservas", href: "/locatario/reservas", icon: <Calendar size={18} />, id: "reservas-locatario" },
  ];

  // Avaliações (duas opções para anfitrião)
  const avaliacoesLinks = [
    { name: " Avaliações", href: "/locatario/avaliacoes", icon: <Star size={18} />, id: "avaliacoes-locatario" },
  ];

  // Links específicos para anfitrião (gestão)
  const anfitriaoLinks = [
    { name: " Painel do Anfitrião", href: "/anfitriao", icon: <LayoutDashboard size={18} />, id: "painel" },
    { name: " Meus Espaços", href: "/anfitriao/espacos", icon: <Store size={18} />, id: "meus-espacos" },
    { name: " Reservas (dos meus espaços)", href: "/anfitriao/reservas", icon: <Calendar size={18} />, id: "reservas-anfitriao" },
    { name: " Histórico de Reservas", href: "/anfitriao/historico", icon: <History size={18} />, id: "historico" },
    { name: " Avaliações (dos meus espaços)", href: "/anfitriao/avaliacoes", icon: <Star size={18} />, id: "avaliacoes-anfitriao" },
    { name: " Financeiro", href: "/anfitriao/financeiro", icon: <TrendingUp size={18} />, id: "financeiro" },
  ];

let menuLinks = [...baseLinks];

if (user) {
  menuLinks = [
    ...menuLinks,
    ...reservasLinks,
    ...avaliacoesLinks,
  ];
}

if (isAnfitriao) {
  menuLinks = [...menuLinks, ...anfitriaoLinks];
}

  const fecharMenu = () => {
    setMenuAberto(false);
  };

  const abrirBusca = () => {
    setSearchAberto(true);
  };

  const fecharBusca = () => {
    setSearchAberto(false);
    setCityQuery("");
    setShowCitySuggestions(false);
  };

  const selecionarCidade = (cidade: string) => {
    setCityQuery(cidade);
    setShowCitySuggestions(false);
  };

  const handleSearch = () => {
    if (!cityQuery) return;
    const start = startDate ? startDate.toISOString().split("T")[0] : "";
    const end = endDate ? endDate.toISOString().split("T")[0] : "";
    router.push(`/resultados?cidade=${encodeURIComponent(cityQuery)}&start=${start}&end=${end}`);
    fecharBusca();
  };

  const formattedDate = startDate
    ? endDate
      ? `${startDate.toLocaleDateString("pt-BR")} - ${endDate.toLocaleDateString("pt-BR")}`
      : startDate.toLocaleDateString("pt-BR")
    : "Selecionar datas";

  const menuTitle = isAnfitriao ? "Menu do Anfitrião" : "Menu";

  return (
    <>
      {/* Top Bar Fixa */}
      <div className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-50 px-4 py-3 flex items-center justify-between shadow-sm">
        {searchAberto ? (
          <button onClick={fecharBusca} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <ArrowLeft size={22} className="text-gray-600 dark:text-gray-400" />
          </button>
        ) : (
          <button onClick={() => router.push("/")} className="flex items-center">
            <img src="/placyhub.png" alt="PlacyHub" className="h-7 w-auto" />
          </button>
        )}

        <div className="flex items-center gap-2">
          {!searchAberto && (
            <button onClick={abrirBusca} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <Search size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
          )}
          {user && !searchAberto && <SinoNavbar />}
          {!searchAberto && (
            <button onClick={() => setMenuAberto(!menuAberto)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              {menuAberto ? <X size={22} /> : <Menu size={22} />}
            </button>
          )}
        </div>
      </div>

      {/* Modal de Busca */}
      {searchAberto && (
        <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50">
          <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-10">
            <div className="px-4 py-3">
              <div className="flex items-center gap-2">
                <button onClick={fecharBusca} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex-shrink-0">
                  <ArrowLeft size={22} className="text-gray-600 dark:text-gray-400" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Digite a cidade"
                    value={cityQuery}
                    onChange={(e) => setCityQuery(e.target.value)}
                    onFocus={() => cityQuery && setShowCitySuggestions(true)}
                    className="w-full px-4 py-3 rounded-full bg-gray-100 dark:bg-gray-800 border-none focus:outline-none text-gray-900 dark:text-gray-100 text-base"
                    autoFocus
                  />
                </div>
                <button onClick={handleSearch} className="px-5 py-3 bg-sky-500 text-white rounded-full text-sm font-medium flex-shrink-0">
                  Buscar
                </button>
              </div>
            </div>
          </div>

          {showCitySuggestions && filteredCities.length > 0 && (
            <div className="absolute left-0 right-0 mx-4 mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto z-20">
              {filteredCities.map((cidade, idx) => (
                <button
                  key={`${cidade.nome}-${cidade.uf}-${idx}`}
                  onClick={() => selecionarCidade(`${cidade.nome}, ${cidade.uf}`)}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                >
                  {cidade.nome}, {cidade.uf}
                </button>
              ))}
            </div>
          )}

          <div className="p-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quando?</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{formattedDate}</p>
             <div className="overflow-x-auto pb-2">
  <div className="w-full">
    <DatePicker
      selectsRange
      startDate={startDate}
      endDate={endDate}
      onChange={(update: [Date | null, Date | null]) => setDateRange(update)}
      inline
      minDate={minSelectableDate}
      locale="pt-BR"
    />
  </div>
</div>
            </div>
            <div className="text-center text-xs text-gray-400 mt-4">
              <p>Digite a cidade e selecione as datas</p>
            </div>
          </div>
        </div>
      )}

     {/* Menu Lateral - TELA CHEIA */}
<div
  className={`fixed inset-0 bg-white dark:bg-gray-900 z-50 transition-transform duration-300 ease-in-out ${
    menuAberto ? "translate-x-0" : "translate-x-full"
  }`}
>
  {/* Header do menu */}
  <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-10">
    <h2 className="font-semibold text-gray-900 dark:text-white text-lg">
      {menuTitle}
    </h2>
    <button onClick={fecharMenu} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
      <X size={24} className="text-gray-600 dark:text-gray-400" />
    </button>
  </div>

  {/* Conteúdo do menu com scroll - usando flex para empurrar o logout para baixo */}
  <div className="flex flex-col h-[calc(100vh-70px)] overflow-y-auto">
    <div className="flex-1 p-4">
      {/* Avatar do usuário */}
      {user ? (
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
              {user.fotoUrl ? (
                <img 
                  src={user.fotoUrl} 
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                user.name?.[0]?.toUpperCase() || "U"
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white text-base">
                {user.name?.split(" ")[0] || "Usuário"}
              </p>
              <p className="text-xs text-gray-500 truncate max-w-[200px]">{user.email}</p>
              {isAnfitriao && (
                <span className="inline-block mt-1 text-[10px] bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">
                  Anfitrião
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
          <Link href="/login" onClick={fecharMenu} className="block w-full text-center bg-sky-500 text-white py-3 rounded-lg text-sm font-medium">
            Entrar / Cadastrar
          </Link>
        </div>
      )}

      {/* Links do menu */}
      <nav className="space-y-1">
        {/* Seção Geral */}
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-2 mb-2 px-2">
          Geral
        </div>
        {baseLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.id}
              href={link.href}
              onClick={fecharMenu}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base transition-colors ${
                isActive
                  ? "bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 font-medium"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          );
        })}

       {user && reservasLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.id}
              href={link.href}
              onClick={fecharMenu}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base transition-colors ${
                isActive
                  ? "bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 font-medium"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          );
        })}

        {user && avaliacoesLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.id}
              href={link.href}
              onClick={fecharMenu}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base transition-colors ${
                isActive
                  ? "bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 font-medium"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          );
        })}

{!isAnfitriao && (
  <button
    onClick={() => setShowBenefitsModal(true)}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base transition-colors w-full text-left ${
      pathname === "/virar-anfitriao"
        ? "bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 font-medium"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
    }`}
  >
    <LayoutDashboard size={18} />
    <span>Anunciar</span>
  </button>
)}

        {/* Seção do Anfitrião */}
        {isAnfitriao && (
          <>
            <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-2 mb-2 px-2">
              Gestão do Anfitrião
            </div>
            {anfitriaoLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={fecharMenu}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base transition-colors ${
                    isActive
                      ? "bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 font-medium"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </>
        )}
      </nav>
    </div>



    {/* Botão Sair - SEMPRE NO FINAL */}
    {user && (
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900 sticky bottom-0">
        <button
          onClick={() => {
            logout();
            fecharMenu();
          }}
          className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg text-base text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut size={20} />
          <span>Sair da conta</span>
        </button>
      </div>
    )}
  </div>
</div>

{/* MODAL BENEFÍCIOS */}
{showBenefitsModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
    <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-6 md:p-8 max-w-lg w-full relative animate-fadeIn">
      <button
        onClick={() => setShowBenefitsModal(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition text-xl"
      >
        ×
      </button>

      <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        Ganhe dinheiro alugando seu espaço
      </h2>

      <p className="text-gray-600 mb-4 text-sm md:text-base">
        Transforme seu salão, sítio ou área de festas em uma fonte de renda dentro do PlacyHub.
      </p>

      <ul className="space-y-3 text-gray-700 dark:text-gray-300 text-sm md:text-base">
        <li>✔ Visibilidade para milhares de pessoas.</li>
        <li>✔ Controle total de agenda, preços e regras.</li>
        <li>✔ Painel exclusivo para anfitriões.</li>
        <li>✔ Suporte completo.</li>
      </ul>

      <button
        onClick={() => {
          setShowBenefitsModal(false);
          if (!user) {
            router.push("/login?redirect=/virar-anfitriao");
          } else {
            router.push("/virar-anfitriao");
          }
        }}
        className="mt-6 block w-full text-center bg-sky-500 text-white py-3 rounded-xl hover:bg-sky-600 transition font-medium"
      >
        Quero cadastrar meu espaço
      </button>
    </div>
  </div>
)}

      {menuAberto && (
        <div className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300" onClick={fecharMenu} />
      )}
      <div className="h-14" />
    </>
  );
}