"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, Search, ArrowLeft, Heart, Calendar, User, LayoutDashboard, X, Home } from "lucide-react";
import DatePicker, { registerLocale } from "react-datepicker";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

registerLocale("pt-BR", ptBR);

type ActivePanel = "city" | "date" | null;

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAnfitriao } = useAuth();

  // ============================================
  // TODOS OS HOOKS DEVEM VIR PRIMEIRO
  // ============================================
  
  // Estados
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [cityQuery, setCityQuery] = useState("");
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [cities, setCities] = useState<{ nome: string; uf: string }[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [showBenefitsModal, setShowBenefitsModal] = useState(false);
  const [shrink, setShrink] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Refs
  const minSelectableDate = new Date();
  const searchRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [startDate, endDate] = dateRange;

  // Funções utilitárias (não são Hooks, podem ficar aqui)
  const normalize = (str: string) =>
    str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim();

  // ============================================
  // TODOS OS useEffect DEVEM VIR AQUI
  // ============================================

  // Effect para mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Effect para carregar cidades
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
      } finally {
        setLoadingCities(false);
      }
    }
    loadCities();
  }, []);

  // Effect para clique fora do search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setActivePanel(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Effect para fechar menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Effect para fechar menu ao rolar
  useEffect(() => {
    function handleScroll() {
      if (isOpen) setIsOpen(false);
    }

    if (isOpen) {
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen]);

  // Effect para fechar painéis ao rolar
  useEffect(() => {
    function handleScrollClosePanels() {
      if (activePanel !== null) {
        setActivePanel(null);
      }
    }

    window.addEventListener("scroll", handleScrollClosePanels);

    return () => {
      window.removeEventListener("scroll", handleScrollClosePanels);
    };
  }, [activePanel]);

  // Effect para animação shrink
  useEffect(() => {
    const handleScroll = () => setShrink(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ EFFECT PARA RESPONSIVIDADE - AGORA ANTES DO RETORNO CONDICIONAL
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Função simplificada para o botão Explorar - apenas volta para home
  const handleExploreClick = () => {
    router.push("/");
  };

  // Função para fechar o modal de busca
  const closeMobileSearch = () => {
    setShowMobileSearch(false);
    setActivePanel(null);
  };

  // Verifica se está no painel do anfitrião
  const isPainelAnfitriao = pathname === "/anfitriao" || pathname?.startsWith("/anfitriao/");

  // ============================================
  // AGORA SIM, PODEMOS TER RETORNOS CONDICIONAIS
  // ============================================
  
  if (!mounted) return null;

  // Variáveis derivadas (podem ficar depois dos retornos condicionais)
  const filteredCities =
    cityQuery.trim() === "" || loadingCities
      ? []
      : cities
          .filter((c) => normalize(`${c.nome}, ${c.uf}`).includes(normalize(cityQuery)))
          .slice(0, 15);

  const formattedDate = startDate
    ? endDate
      ? `${startDate.toLocaleDateString("pt-BR")} - ${endDate.toLocaleDateString("pt-BR")}`
      : startDate.toLocaleDateString("pt-BR")
    : "Selecione as datas";

  const isFavoritosPage = pathname === "/favoritos";

  return (
    <>
      {/* NAVBAR - SÓ APARECE EM DESKTOP OU QUANDO NÃO É FAVORITOS EM MOBILE */}
      {(!isMobile || (isMobile && !isFavoritosPage)) && (
        <div
          className={`fixed top-0 left-0 w-full z-50 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 md:px-12
            transition-all duration-[480ms] ease-[cubic-bezier(0.16,1,0.3,1)] backdrop-blur-xl
            ${shrink ? "h-20 py-3 shadow-md" : "h-24 md:h-40 py-3 md:py-10 shadow-sm"}`}
        >
          {/* LOGO - Sempre visível em desktop, mesmo em favoritos */}
          {!isMobile && (
            <button 
              aria-label="Ir para home" 
              onClick={() => router.push("/")} 
              className="flex items-center shrink-0"
            >
              <img src="/placyhub.png" alt="PlacyHub" className="h-8 md:h-10 w-auto select-none" />
            </button>
          )}

          {/* SEARCH - Só aparece em desktop quando NÃO é favoritos */}
          <div className="flex justify-center flex-1 relative px-2 md:px-4" ref={searchRef}>
            {/* MOBILE - Botão de busca simplificado (NUNCA aparece em favoritos) */}
            {isMobile && !showMobileSearch && !isFavoritosPage && (
              <button
                onClick={() => setShowMobileSearch(true)}
                className="w-full flex items-center justify-center gap-2 bg-gray-100 rounded-full px-4 py-2.5 shadow-sm border border-gray-200"
              >
                <Search size={18} className="text-gray-500" />
                <span className="text-sm text-gray-500">Onde e quando?</span>
              </button>
            )}

            {/* MOBILE - Tela de busca expandida (COM BOTÃO DE FECHAR) */}
            {isMobile && showMobileSearch && (
              <div className="fixed inset-0 bg-white z-[999] h-screen w-screen overflow-y-auto">
                {/* Header com botão de fechar */}
                <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
                  <div className="flex items-center justify-between p-4">
                    <h2 className="text-lg font-semibold">Buscar espaços</h2>
                    <button
                      onClick={closeMobileSearch}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      aria-label="Fechar busca"
                    >
                      <X size={24} className="text-gray-600" />
                    </button>
                  </div>
                </div>
                
                {/* Conteúdo da busca mobile */}
                <div className="p-4 space-y-4 max-w-md mx-auto w-full">
                  {/* Campo Cidade */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Onde?</label>
                    <input
                      type="text"
                      placeholder="Digite uma cidade"
                      value={cityQuery}
                      onChange={(e) => setCityQuery(e.target.value)}
                      className="w-full p-3 bg-gray-100 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      autoFocus
                    />
                    {cityQuery && filteredCities.length > 0 && (
                      <div className="bg-white border rounded-xl shadow-lg max-h-48 overflow-y-auto">
                        {filteredCities.map((c) => (
                          <div
                            key={`${c.nome}-${c.uf}`}
                            onClick={() => {
                              setCityQuery(`${c.nome}, ${c.uf}`);
                            }}
                            className="px-4 py-3 cursor-pointer hover:bg-gray-100 text-sm border-b last:border-b-0"
                          >
                            {c.nome}, {c.uf}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Campo Data */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Quando?</label>
                   <div className="bg-gray-100 p-3 rounded-xl border border-gray-200">
  <p className="text-sm text-gray-600 mb-2">{formattedDate}</p>

  <div className="flex justify-center w-full overflow-hidden">
    <div className="scale-[0.90] sm:scale-100 origin-top">
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
                  </div>

                  {/* Botão Buscar */}
                  <button
                    onClick={() => {
                      if (!cityQuery) {
                        toast.warning("Selecione uma cidade");
                        return;
                      }

                      const start = startDate ? startDate.toISOString().split("T")[0] : "";
                      const end = endDate ? endDate.toISOString().split("T")[0] : "";

                      setShowMobileSearch(false);
                      router.push(`/resultados?cidade=${encodeURIComponent(cityQuery)}&start=${start}&end=${end}`);
                    }}
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white py-4 rounded-xl font-medium transition-colors"
                  >
                    Buscar espaços
                  </button>
                </div>
              </div>
            )}

            {/* DESKTOP - Só aparece quando NÃO é favoritos */}
            {!isMobile && !isFavoritosPage && (
              <div
                className={`flex items-center rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md transition-all duration-[420ms] ease-[cubic-bezier(.22,.61,.36,1)]
                  ${shrink ? "h-12 max-w-[520px]" : "h-16 max-w-[650px]"} w-full ${activePanel !== null ? "shadow-xl" : ""}`}
              >
                {/* CAMPO CIDADE */}
                <div
                  className={`flex flex-col flex-1 px-6 py-2 cursor-pointer rounded-full h-full justify-center relative
                    ${activePanel === "city" ? "bg-gray-200 dark:bg-gray-700" : "hover:bg-gray-100 dark:hover:bg-gray-700"} transition-all duration-300`}
                  onClick={() => setActivePanel("city")}
                >
                  <label className="text-xs font-bold text-gray-800 dark:text-gray-100">Onde</label>
                  <div className="flex items-center justify-between mt-0.5">
                    <input
                      type="text"
                      placeholder="Cidade do evento"
                      value={cityQuery}
                      onChange={(e) => setCityQuery(e.target.value)}
                      onFocus={() => setActivePanel("city")}
                      className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-300 focus:outline-none placeholder:text-gray-400"
                    />
                    {cityQuery && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCityQuery("");
                        }}
                        className="text-gray-400 hover:text-gray-600 ml-2 transition"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  {activePanel === "city" && filteredCities.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto z-50 animate-fadeIn">
                      {filteredCities.map((c) => (
                        <div
                          key={`${c.nome}-${c.uf}`}
                          onClick={() => {
                            setCityQuery(`${c.nome}, ${c.uf}`);
                            setActivePanel(null);
                          }}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-sm transition"
                        >
                          {c.nome}, {c.uf}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* DIVISOR */}
                <div className="w-px h-8 bg-gray-300"></div>

                {/* CAMPO DATA */}
                <div
                  className={`flex flex-col flex-1 px-6 py-2 cursor-pointer rounded-full h-full justify-center relative
                    ${activePanel === "date" ? "bg-gray-200 dark:bg-gray-700" : "hover:bg-gray-100 dark:hover:bg-gray-700"} transition-all duration-300`}
                  onClick={() => setActivePanel("date")}
                >
                  <label className="text-xs font-bold text-gray-800 dark:text-gray-100">Quando</label>
                  <span className={`text-xs ${startDate ? "text-gray-800 dark:text-gray-100" : "text-gray-400"}`}>
                    {formattedDate}
                  </span>

                  {activePanel === "date" && (
                    <div className="absolute top-full left-0 mt-1 z-50 rounded-lg overflow-hidden animate-fadeIn">
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
                  )}
                </div>

                {/* BOTÃO BUSCAR */}
                <button
                  onClick={() => {
                    if (!cityQuery) {
                      toast.warning("Selecione uma cidade para continuar");
                      return;
                    }
                    const start = startDate ? startDate.toISOString().split("T")[0] : "";
                    const end = endDate ? endDate.toISOString().split("T")[0] : "";
                    setActivePanel(null);
                    router.push(`/resultados?cidade=${encodeURIComponent(cityQuery)}&start=${start}&end=${end}`);
                  }}
                  className={`bg-sky-500 hover:bg-sky-600 text-white rounded-full flex items-center justify-center shrink-0
                    transition-all duration-[420ms] ease-[cubic-bezier(.22,.61,.36,1)]
                    ${shrink ? "h-10 w-10 mr-2" : "h-12 w-12 mr-3"}`}
                >
                  <Search size={shrink ? 16 : 18} />
                </button>
              </div>
            )}
          </div>

          {/* MENU DIREITO - Sempre visível em desktop, mesmo em favoritos */}
          {!isMobile && (
            <div className="flex items-center gap-2 md:gap-3 shrink-0">
              {!isAnfitriao && !isMobile && !isFavoritosPage && (
                <button
                  onClick={() => setShowBenefitsModal(true)}
                  className="text-sm pr-1 hover:text-gray-600 transition-colors whitespace-nowrap hidden md:block"
                >
                  Tem um espaço para alugar?
                </button>
              )}

              {user ? (
                <>
                  <button
                    onClick={() => router.push("/locatario/perfil")}
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold hover:shadow-md transition-shadow text-sm md:text-base
                      ${isPainelAnfitriao 
                        ? "bg-sky-500 text-white hover:bg-sky-600" 
                        : "bg-gray-300 text-white"
                      }`}
                  >
                    {user.name[0].toUpperCase()}
                  </button>

                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-1.5 md:p-2 border rounded-full hover:shadow-md transition-shadow flex items-center gap-2"
                  >
                    <Menu size={18} />
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="px-3 md:px-4 py-1.5 md:py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-full text-xs md:text-sm font-medium transition-colors whitespace-nowrap"
                >
                  Entrar
                </Link>
              )}
            </div>
          )}
        </div>
      )}

      {/* Espaço para empurrar conteúdo - Ajustado para mobile */}
      <div className={
        isMobile && isFavoritosPage 
          ? "h-0" 
          : shrink 
            ? "h-20" 
            : isMobile 
              ? "h-32" 
              : "h-40"
      } />

      {/* MENU DROPDOWN USUÁRIO */}
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute top-16 md:top-20 right-4 flex flex-col bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden p-2 z-50 border border-gray-200 min-w-[200px] md:min-w-[220px] animate-fadeIn"
        >
          {user ? (
            <>
              <Link
                href="/favoritos"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg text-sm font-medium"
              >
                Favoritos
              </Link>

              <Link
                href="/locatario/reservas"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg text-sm font-medium"
              >
                Minhas Reservas
              </Link>

              {isAnfitriao && <div className="my-1 border-t border-gray-200 dark:border-gray-700" />}
              
              {user && isAnfitriao && (
                <Link
                  href="./anfitriao"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg text-sm font-medium"
                >
                  Painel do Anfitrião
                </Link>
              )}

              <div className="my-1 border-t border-gray-200 dark:border-gray-700" />

              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm"
              >
                Sair da conta
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 hover:bg-gray-100 rounded-lg text-sm"
            >
              Entrar ou Cadastrar
            </Link>
          )}
        </div>
      )}

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

      {/* RODAPÉ MOBILE */}
{isMobile && !showMobileSearch && (
  <div className="fixed bottom-0 left-0 w-full h-16 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800 flex items-center justify-center z-50">
    <div className="flex items-center justify-around w-full px-2">
      <button
        onClick={handleExploreClick}
        className="flex flex-col items-center text-xs text-gray-600 dark:text-gray-400"
      >
        <Search size={20} />
        <span>Explorar</span>
      </button>

      {!user && (
        <button
          onClick={() => router.push("/login")}
          className="flex flex-col items-center text-xs text-sky-500 dark:text-sky-400 font-semibold"
        >
          <User size={20} />
          <span>Entrar</span>
        </button>
      )}

      {user && (
        <>
          {!isAnfitriao && (
            <button
              onClick={() => {
                if (!user) {
                  router.push("/login?redirect=/virar-anfitriao");
                } else {
                  router.push("/virar-anfitriao");
                }
              }}
              className="flex flex-col items-center text-xs text-gray-600 dark:text-gray-400"
            >
              <Home size={20} />
              <span>Anunciar</span>
            </button>
          )}
          <button
            onClick={() => router.push("/favoritos")}
            className="flex flex-col items-center text-xs text-gray-600 dark:text-gray-400"
          >
            <Heart size={20} />
            <span>Favoritos</span>
          </button>

          <button
            onClick={() => router.push("/locatario/reservas")}
            className="flex flex-col items-center text-xs text-gray-600 dark:text-gray-400"
          >
            <Calendar size={20} />
            <span>Reservas</span>
          </button>

          {isAnfitriao && (
            <button
              onClick={() => router.push("/anfitriao")}
              className="flex flex-col items-center text-xs text-gray-600 dark:text-gray-400"
            >
              <LayoutDashboard size={20} />
              <span>Anfitrião</span>
            </button>
          )}

          <button
            onClick={() => router.push("/locatario/perfil")}
            className={`flex flex-col items-center text-xs ${
              isPainelAnfitriao 
                ? "text-sky-500 dark:text-sky-400 font-semibold" 
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            <User size={20} />
            <span>Perfil</span>
          </button>
        </>
      )}
    </div>
  </div>
)}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.28s ease-out;
        }
      `}</style>
    </>
  );
}