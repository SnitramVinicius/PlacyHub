"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, Search } from "lucide-react";
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

  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [cityQuery, setCityQuery] = useState("");
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [cities, setCities] = useState<{ nome: string; uf: string }[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [showBenefitsModal, setShowBenefitsModal] = useState(false);
  const [shrink, setShrink] = useState(false);

  const minSelectableDate = new Date();
  const searchRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [startDate, endDate] = dateRange;

  const normalize = (str: string) =>
    str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim();

  useEffect(() => setMounted(true), []);

  // Carregar cidades
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

  const filteredCities =
    cityQuery.trim() === "" || loadingCities
      ? []
      : cities
          .filter((c) => normalize(`${c.nome}, ${c.uf}`).includes(normalize(cityQuery)))
          .slice(0, 15);

  // Clique fora do search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setActivePanel(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ⭐ FECHAR MENU AO CLICAR FORA ⭐
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

  // ⭐ FECHAR MENU AO ROLAR A TELA ⭐
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

  // ⭐ FECHAR CITY/DATE AO ROLAR A TELA ⭐
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

  // Animação shrink
  useEffect(() => {
    const handleScroll = () => setShrink(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return null;

  const formattedDate = startDate
    ? endDate
      ? `${startDate.toLocaleDateString("pt-BR")} - ${endDate.toLocaleDateString("pt-BR")}`
      : startDate.toLocaleDateString("pt-BR")
    : "Selecione a data";

  return (
    <>
      {/* NAVBAR */}
      <div
        className={`fixed top-0 left-0 w-full z-50 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-12
          transition-all duration-[480ms] ease-[cubic-bezier(0.16,1,0.3,1)] backdrop-blur-xl
          ${shrink ? "h-24 py-4 shadow-md" : "h-40 py-10 shadow-sm"}`}
      >
        {/* LOGO */}
        <button aria-label="Ir para home" onClick={() => router.push("/")} className="flex items-center">
          <img src="/placyhub.png" alt="PlacyHub" className="h-10 w-auto select-none" />
        </button>

        {/* SEARCH */}
        <div className="flex justify-center flex-1 relative" ref={searchRef}>
          <div
            className={`flex items-center rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md transition-all duration-[420ms] ease-[cubic-bezier(.22,.61,.36,1)]
              ${shrink ? "h-12 max-w-[520px]" : "h-16 max-w-[650px]"} w-full ${activePanel !== null ? "shadow-xl" : ""}`}
          >
            {/* CAMPO CIDADE */}
            <div
              className={`flex flex-col flex-1 px-6 py-2 cursor-pointer rounded-full h-full justify-center relative
                ${activePanel === "city"
  ? "bg-gray-200 dark:bg-gray-700"
  : "hover:bg-gray-100 dark:hover:bg-gray-700"} transition-all duration-300`}
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
                ${activePanel === "date"
  ? "bg-gray-200 dark:bg-gray-700"
  : "hover:bg-gray-100 dark:hover:bg-gray-700"} transition-all duration-300`}
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
              <Search size={18} />
            </button>
          </div>
        </div>

        {/* MENU DIREITO */}
        <div className="flex items-center gap-3">
{!isAnfitriao && (
  <button
    onClick={() => setShowBenefitsModal(true)}
    className="text-sm pr-1 hover:text-gray-600 transition-colors"
  >
    Tem um espaço para alugar?
  </button>
)}

          {user ? (
            <>
              <button
                onClick={() => router.push("/locatario/perfil")}
                className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold hover:shadow-md transition-shadow"
              >
                {user.name[0].toUpperCase()}
              </button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 border rounded-full hover:shadow-md transition-shadow flex items-center gap-2"
              >
                <Menu size={18} />
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-full text-sm font-medium transition-colors"
            >
              Entrar ou Cadastrar
            </Link>
          )}
        </div>
      </div>

      {/* Espaço para empurrar conteúdo */}
      <div className={shrink ? "h-[88px]" : "h-[140px]"} />

      {/* MENU DROPDOWN USUÁRIO */}
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute top-20 right-4 flex flex-col bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden p-2 z-50 border-gray-200dark:border-gray-700 min-w-[220px] animate-fadeIn"
        >
          {user ? (
            <>
              <Link
                href="/favoritos"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2
hover:bg-gray-100 dark:hover:bg-gray-700
text-gray-800 dark:text-gray-100
rounded-lg text-sm font-medium flex items-center gap-2"
              >
                Favoritos
              </Link>

              

              <Link
                href="/locatario/reservas"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2
hover:bg-gray-100 dark:hover:bg-gray-700
text-gray-800 dark:text-gray-100
rounded-lg text-sm font-medium flex items-center gap-2"
              >
                Minhas Reservas
              </Link>

{isAnfitriao && <div className="my-1 border-t border-gray-200 dark:border-gray-700" />}
              {isAnfitriao && (
  <Link
    href="./anfitriao"
    onClick={() => setIsOpen(false)}
    className="px-4 py-2
hover:bg-gray-100 dark:hover:bg-gray-700
text-gray-800 dark:text-gray-100
rounded-lg text-sm font-medium flex items-center gap-2"
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
                className="text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm flex items-center gap-2"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 max-w-lg w-full relative animate-fadeIn">
            <button
              onClick={() => setShowBenefitsModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition text-xl"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Ganhe dinheiro alugando seu espaço
            </h2>

            <p className="text-gray-600 mb-4">
              Transforme seu salão, sítio ou área de festas em uma fonte de renda dentro do PlacyHub.
            </p>

            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li>✔ Visibilidade para milhares de pessoas.</li>
              <li>✔ Controle total de agenda, preços e regras.</li>
              <li>✔ Painel exclusivo para anfitriões.</li>
              <li>✔ Suporte completo.</li>
            </ul>

 <button
  onClick={() => {
    setShowBenefitsModal(false);

    if (!user) {
      // Redireciona para login com o parâmetro de redirect para voltar após login
      router.push("/login?redirect=/virar-anfitriao");
    } else {
      // Se já estiver logado, vai diretamente para a página
      router.push("/virar-anfitriao");
    }
  }}
  className="mt-6 block w-full text-center bg-[#02b0f0] text-white py-2 rounded-xl hover:bg-[#0292cb] transition font-medium"
>
  Quero cadastrar meu espaço
</button>
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
