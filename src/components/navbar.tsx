"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, Search } from "lucide-react";
import DatePicker, { registerLocale } from "react-datepicker";
import pt from "date-fns/locale/pt";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

registerLocale("pt-BR", pt);

type ActivePanel = "city" | "date" | null;

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";

  const [isOpen, setIsOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [cityQuery, setCityQuery] = useState("");
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [cities, setCities] = useState<{ nome: string; uf: string }[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [showBenefitsModal, setShowBenefitsModal] = useState(false);

  const { user, logout } = useAuth();

  const minSelectableDate = new Date();
  const searchRef = useRef<HTMLDivElement>(null);

  const categories = [
    { name: "Aniversário", href: "/aniversario" },
    { name: "Casamento", href: "/casamento" },
    { name: "Confraternização", href: "/confraternizacao" },
    { name: "Espaço ao ar livre", href: "/espacoarlivre" },
  ];

  const navRef = useRef<HTMLElement>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const updateIndicator = (categoryName: string | null) => {
    if (!navRef.current || !categoryName) {
      setIndicatorStyle({ left: 0, width: 0 });
      return;
    }
    const btn = buttonRefs.current[categoryName];
    if (btn) {
      const navRect = navRef.current.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      setIndicatorStyle({
        left: btnRect.left - navRect.left,
        width: btnRect.width,
      });
    }
  };

  useEffect(() => {
    updateIndicator(hoveredCategory);
  }, [hoveredCategory]);

  useEffect(() => {
    const currentCategory = categories.find((c) => c.href === pathname);
    if (currentCategory) {
      setTimeout(() => updateIndicator(currentCategory.name), 100);
    }
  }, [pathname]);

  const normalize = (str: string) =>
    str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim();

  useEffect(() => {
    async function loadCities() {
      try {
        const response = await fetch(
          "https://servicodados.ibge.gov.br/api/v1/localidades/municipios"
        );
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

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setActivePanel(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchRef]);

  return (
    <div className={`transition-opacity duration-700 ease-out ${loaded ? "opacity-100" : "opacity-0"}`}>
      {/* TOPO */}
      <header className="flex justify-center mt-5">
        <div className="flex justify-between w-full max-w-screen-xl px-12">
          <div className="w-32 h-10 shrink-0"></div>
          <div className="flex-1 flex justify-center text-sm"></div>
          <div className="w-56 h-10 shrink-0"></div>
        </div>
      </header>

      {/* BARRA DE BUSCA */}
      <nav className="flex items-center relative px-12 justify-between mt-4 z-50">
        <img src="/placyhub.png" alt="Logo" className="w-30 h-9" />

        <div className="flex justify-center flex-1 relative" ref={searchRef}>
          <div
            className={`flex items-center rounded-full bg-white shadow-md border transition-all duration-300 ease-out h-16 max-w-[650px] w-full ${
              activePanel !== null ? "shadow-xl" : ""
            }`}
          >
            {/* CAMPO CIDADE */}
            <div
              className={`flex flex-col flex-1 px-6 py-2 cursor-pointer rounded-full h-full justify-center relative ${
                activePanel === "city" ? "bg-[#e5e5e5] rounded-full" : "hover:bg-[#f7f7f7]"
              }`}
              onClick={() => setActivePanel("city")}
            >
              <label className="text-xs font-bold text-gray-800">Onde</label>
              <input
                type="text"
                placeholder="Cidade do evento"
                value={cityQuery}
                onChange={(e) => setCityQuery(e.target.value)}
                onFocus={() => setActivePanel("city")}
                className="w-full bg-transparent text-sm text-gray-700 focus:outline-none placeholder:text-gray-500 mt-0.5"
              />
            </div>

            {/* Divisor */}
            <div className="w-px h-8 bg-gray-300"></div>

            {/* CAMPO DATA */}
            <div
              className={`flex flex-col flex-1 px-6 py-2 cursor-pointer rounded-full h-full justify-center relative ${
                activePanel === "date" ? "bg-[#e5e5e5] rounded-full" : "hover:bg-[#f7f7f7]"
              }`}
              onClick={() => setActivePanel("date")}
            >
              <label className="text-xs font-bold text-gray-800">Quando</label>
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date) => {
                  setSelectedDate(date);
                  setActivePanel(null);
                }}
                onFocus={() => setActivePanel("date")}
                placeholderText="Adicionar datas"
                className="text-gray-600 text-sm w-full rounded-full focus:outline-none bg-transparent mt-0.5"
                dateFormat="dd/MM/yyyy"
                locale="pt-BR"
                minDate={minSelectableDate}
                showPopperArrow={false}
                calendarClassName="airbnb-calendar"
              />
            </div>

            {/* Botão de busca */}
            <button className="bg-sky-500 hover:bg-sky-600 text-white rounded-full flex items-center justify-center shrink-0 h-12 w-12 mr-2">
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* Menu direito */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBenefitsModal(true)}
            className="text-sm pr-1 hover:text-gray-600 transition-colors"
          >
            Tem um espaço para alugar?
          </button>

          {user && (
            <button
              onClick={() => router.push("/locatario/perfil")}
              className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold hover:shadow-md transition-shadow"
              title={user.name}
            >
              {user.name[0].toUpperCase()}
            </button>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 border rounded-full hover:shadow-md transition-shadow flex items-center gap-2"
          >
            <Menu size={18} />
          </button>
        </div>

        {isOpen && (
          <div className="absolute top-16 right-0 flex flex-col bg-white shadow-lg rounded-xl overflow-hidden p-2 z-50 border border-gray-100 min-w-[200px]">
            {user ? (
              <div>
                <Link href="/favoritos" className="px-4 py-2 hover:bg-gray-100 rounded-lg text-sm font-medium">
                  Favoritos
                </Link>
                <Link href="/locatario/perfil" className="px-4 py-2 hover:bg-gray-100 rounded-lg text-sm font-medium">
                  Perfil
                </Link>
                <div className="my-1 border-t border-gray-100"></div>
                <Link href="#" className="px-4 py-2 hover:bg-gray-100 rounded-lg text-sm">
                  Histórico de locação
                </Link>
                <Link href="#" className="px-4 py-2 hover:bg-gray-100 rounded-lg text-sm">
                  Localizações de espaços
                </Link>
                <Link href="#" className="px-4 py-2 hover:bg-gray-100 rounded-lg text-sm">
                  Configuração de conta
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="text-left px-4 py-2 hover:bg-gray-100 rounded-lg text-sm"
                >
                  Sair da conta
                </button>
              </div>
            ) : (
              <Link href="/login" className="px-4 py-2 hover:bg-gray-100 rounded-lg text-sm">
                Entrar ou Cadastrar
              </Link>
            )}
          </div>
        )}
      </nav>

      {isHomePage && (
        <section className="py-20">
          <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-bold text-2xl mb-4">Encontre o lugar perfeito para sua festa</h1>

            <nav ref={navRef} className="relative flex gap-8 text-md text-gray-700 pb-2">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  ref={(el) => (buttonRefs.current[cat.name] = el)}
                  className="cursor-pointer px-2 py-1 text-gray-700 hover:text-gray-900 transition-colors duration-300 ease-in-out"
                  onMouseEnter={() => setHoveredCategory(cat.name)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <Link href={cat.href}>{cat.name}</Link>
                </button>
              ))}

              <div
                className="absolute bottom-0 h-1 bg-[#02aeee] rounded-full transition-all duration-300 ease-in-out"
                style={{
                  left: indicatorStyle.left,
                  width: indicatorStyle.width,
                  opacity: hoveredCategory || categories.find((c) => c.href === pathname) ? 1 : 0,
                }}
              ></div>
            </nav>

            <div className="w-full h-px bg-gray-200 mt-0"></div>
          </div>
        </section>
      )}

      {/* MODAL COM ANIMAÇÃO FADE */}
      {showBenefitsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full relative">
            <button
              onClick={() => setShowBenefitsModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition text-xl"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Ganhe dinheiro alugando seu espaço 
            </h2>

            <p className="text-gray-600 mb-4">
              Transforme seu salão, sítio ou área de festas em uma fonte de renda extra dentro do PlacyHub, a plataforma moderna de locação de espaços.
            </p>

            <ul className="space-y-3 text-gray-700">
              <li>✔ Visibilidade para milhares de pessoas buscando locais.</li>
              <li>✔ Controle total de agenda, preços e regras.</li>
              <li>✔ Painel exclusivo para anfitriões.</li>
              <li>✔ Suporte para dúvidas e gestão do espaço.</li>
            </ul>

            <button
              onClick={() => setShowBenefitsModal(false)}
              className="mt-6 block w-full text-center bg-[#02b0f0] text-white py-2 rounded-xl hover:bg-[#0292cb] transition font-medium"
            >
              Quero Cadastrar Meu Espaço
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
