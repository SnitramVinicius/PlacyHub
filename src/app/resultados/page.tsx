"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, TouchEvent } from "react";
import Link from "next/link";
import { Heart, Filter, X } from "lucide-react";
import { toast } from "sonner";
import { ESPACOS as espacosSimulados, Espaco } from "@/data/espacos";
import { useAuth } from "@/context/AuthContext";
import { useFavoritos } from "@/context/FavoritosContext";

// Componente do Drawer arrastável
function DrawerFiltros({ 
  isOpen, 
  onClose, 
  tipo, 
  setTipo, 
  precoFaixa, 
  setPrecoFaixa, 
  limparFiltros,
  tiposEspacos,
  faixasPreco
}: any) {
  const [drawerHeight, setDrawerHeight] = useState(60);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setDrawerHeight(60);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleTouchStart = (e: TouchEvent) => {
    setStartY(e.touches[0].clientY);
    setCurrentY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    const deltaY = startY - e.touches[0].clientY;
    const newHeight = drawerHeight + (deltaY / window.innerHeight) * 100;
    
    if (newHeight >= 30 && newHeight <= 90) {
      setDrawerHeight(newHeight);
      setCurrentY(e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    if (drawerHeight < 40) {
      onClose();
      setDrawerHeight(60);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 transition-opacity" onClick={onClose}>
      <div
        ref={drawerRef}
        style={{ height: `${drawerHeight}%` }}
        className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-2xl shadow-xl transition-height duration-200 ease-out flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className="w-full px-4 pt-2 pb-1 cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto"></div>
          <div className="flex justify-between items-center mt-2 px-2">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">Filtros</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-gray-500 dark:text-gray-400"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-5">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo de espaço
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setTipo("")}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    tipo === "" 
                      ? "bg-sky-500 text-white" 
                      : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
                  }`}
                >
                  Todos
                </button>
                {tiposEspacos.map((t: string) => (
                  <button
                    key={t}
                    onClick={() => setTipo(t)}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      tipo === t 
                        ? "bg-sky-500 text-white" 
                        : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Faixa de preço
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => setPrecoFaixa("")}
                  className={`w-full px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                    precoFaixa === "" 
                      ? "bg-sky-500 text-white" 
                      : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
                  }`}
                >
                  Todas as faixas
                </button>
                {faixasPreco.map((f: any) => (
                  <button
                    key={f.valor}
                    onClick={() => setPrecoFaixa(f.valor)}
                    className={`w-full px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                      precoFaixa === f.valor 
                        ? "bg-sky-500 text-white" 
                        : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
              <button
                onClick={() => {
                  limparFiltros();
                }}
                className="flex-1 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-medium text-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                Limpar todos
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-sky-500 text-white py-3 rounded-lg font-medium text-sm hover:bg-sky-600 transition-colors"
              >
                Ver resultados
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente interno que usa useSearchParams
function ResultadosContent() {
  const searchParams = useSearchParams();
  const cidadeParam = searchParams.get("cidade")?.replace("%2C", ",") ?? "Campo Grande, MS";
  const startDate = searchParams.get("start");
  const endDate = searchParams.get("end");

  const [ordenacao, setOrdenacao] = useState("popularidade");
  const [tipo, setTipo] = useState("");
  const [precoFaixa, setPrecoFaixa] = useState("");
  const [filtroAberto, setFiltroAberto] = useState(false);
  const [loading, setLoading] = useState(true);
  const [resultados, setResultados] = useState<Espaco[]>([]);

  // Usar o contexto de autenticação e favoritos
  const { user } = useAuth();
  const { favoritos, toggleFavorito } = useFavoritos();
  const isLogged = !!user;

  const handleFavoritoClick = (e: React.MouseEvent, espacoId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isLogged) {
      toast.error("Você precisa estar logado para adicionar aos favoritos!");
      return;
    }
    
    toggleFavorito(espacoId);
    
    if (favoritos.includes(espacoId)) {
      toast.success("Espaço removido dos favoritos!");
    } else {
      toast.success("Espaço adicionado aos favoritos!");
    }
  };

  useEffect(() => {
    setLoading(true);

    const t = setTimeout(() => {
      let filtrados = espacosSimulados.filter(
        (espaco) => espaco.cidade.toLowerCase() === cidadeParam.toLowerCase()
      );

      if (tipo !== "") filtrados = filtrados.filter((e) => e.tipo === tipo);

      if (precoFaixa !== "") {
        if (precoFaixa === "1000+") {
          filtrados = filtrados.filter((e) => e.preco > 1000);
        } else {
          filtrados = filtrados.filter((e) => e.preco <= Number(precoFaixa));
        }
      }

      if (ordenacao === "preco") {
        filtrados.sort((a, b) => a.preco - b.preco);
      } else if (ordenacao === "nota") {
        filtrados.sort((a, b) => b.avaliacao - a.avaliacao);
      } else {
        filtrados.sort((a, b) => b.avaliacao - a.avaliacao);
      }

      setResultados(filtrados);
      setLoading(false);
    }, 400);

    return () => clearTimeout(t);
  }, [cidadeParam, ordenacao, tipo, precoFaixa]);

  const limparFiltros = () => {
    setTipo("");
    setPrecoFaixa("");
  };

  const dataTexto = startDate
    ? endDate
      ? `${startDate} até ${endDate}`
      : startDate
    : "Nenhuma data selecionada";

  const tiposEspacos = ["Chácara", "Salão", "Casa de festas", "Sítio", "Outro"];
  const faixasPreco = [
    { valor: "100", label: "Até R$ 100" },
    { valor: "150", label: "Até R$ 150" },
    { valor: "200", label: "Até R$ 200" },
    { valor: "300", label: "Até R$ 300" },
    { valor: "400", label: "Até R$ 400" },
    { valor: "500", label: "Até R$ 500" },
    { valor: "750", label: "Até R$ 750" },
    { valor: "1000", label: "Até R$ 1000" },
    { valor: "1000+", label: "Acima de R$ 1000" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-4 pb-8 sm:pt-6 sm:pb-10">
        {/* Cabeçalho */}
        <div className="mb-4 sm:mb-6 max-w-7xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Resultados da busca
          </h1>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p>
              <span className="font-medium">Cidade:</span> {cidadeParam}
            </p>
            <p>
              <span className="font-medium">Data:</span> {dataTexto}
            </p>
          </div>
        </div>

        {/* Barra de ferramentas - Mobile */}
        <div className="lg:hidden mb-4 max-w-7xl mx-auto">
          <button
            onClick={() => setFiltroAberto(true)}
            className="w-full flex items-center justify-between bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-3 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtrar</span>
              {(tipo || precoFaixa) && (
                <span className="bg-sky-500 text-white text-xs px-2 py-0.5 rounded-full">
                  Ativo
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {resultados.length} resultados
            </span>
          </button>
        </div>

        {/* Drawer de Filtros Arrastável */}
        <DrawerFiltros
          isOpen={filtroAberto}
          onClose={() => setFiltroAberto(false)}
          tipo={tipo}
          setTipo={setTipo}
          precoFaixa={precoFaixa}
          setPrecoFaixa={setPrecoFaixa}
          limparFiltros={limparFiltros}
          tiposEspacos={tiposEspacos}
          faixasPreco={faixasPreco}
        />

        {/* Layout Desktop: Sidebar + Conteúdo */}
        <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
          {/* Sidebar de Filtros - Desktop */}
          <div className="hidden lg:block lg:w-72 flex-shrink-0">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-5 sticky top-6">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-semibold text-gray-900 dark:text-white">Filtros</h3>
                {(tipo || precoFaixa) && (
                  <button
                    onClick={limparFiltros}
                    className="text-xs text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium"
                  >
                    Limpar todos
                  </button>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipo de espaço
                </label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                  <option value="">Todos os tipos</option>
                  {tiposEspacos.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Faixa de preço
                </label>
                <select
                  value={precoFaixa}
                  onChange={(e) => setPrecoFaixa(e.target.value)}
                  className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                  <option value="">Todas as faixas</option>
                  {faixasPreco.map((f) => (
                    <option key={f.valor} value={f.valor}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="flex-1">
            {/* Ordenação e contagem - Desktop */}
            {!loading && (
              <div className="hidden lg:flex justify-between items-center mb-5">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">{resultados.length}</span>{" "}
                  espaços encontrados
                </p>
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-700 dark:text-gray-300">Ordenar por:</label>
                  <select
                    value={ordenacao}
                    onChange={(e) => setOrdenacao(e.target.value)}
                    className="border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="popularidade">Mais populares</option>
                    <option value="preco">Menor preço</option>
                    <option value="nota">Melhor avaliação</option>
                  </select>
                </div>
              </div>
            )}

            {/* Ordenação e contagem - Mobile */}
            {!loading && (
              <div className="lg:hidden flex justify-between items-center mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">{resultados.length}</span>{" "}
                  resultados
                </p>
                <select
                  value={ordenacao}
                  onChange={(e) => setOrdenacao(e.target.value)}
                  className="border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="popularidade">Popularidade</option>
                  <option value="preco">Menor preço</option>
                  <option value="nota">Melhor avaliação</option>
                </select>
              </div>
            )}

            {/* Grid de Resultados */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-gray-200 dark:bg-slate-700 animate-pulse rounded-xl h-[280px]"></div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                  {resultados.map((espaco) => (
                    <Link key={espaco.id} href={`/espaco/${espaco.id}`}>
                      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 dark:border-slate-700 h-full">
                        <div className="relative">
                          <img
                            src={espaco.imagem}
                            alt={espaco.nome}
                            className="w-full h-48 object-cover"
                          />
                          <button
                            onClick={(e) => handleFavoritoClick(e, espaco.id)}
                            className="absolute top-3 right-3"
                          >
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-md
                                ${favoritos.includes(espaco.id) 
                                  ? "bg-red-500" 
                                  : "bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700"}`}
                            >
                              <Heart
                                size={18}
                                className={favoritos.includes(espaco.id) ? "text-white" : "text-red-500"}
                                fill={favoritos.includes(espaco.id) ? "white" : "transparent"}
                              />
                            </div>
                          </button>
                        </div>

                        <div className="p-4">
                          <div className="flex justify-between items-start gap-2 mb-1">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                                {espaco.nome}
                              </h3>
                              <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-0.5 truncate">
                                {espaco.bairro}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-lg flex-shrink-0">
                              <span className="text-yellow-500 text-xs">★</span>
                              <span className="text-green-700 dark:text-green-400 text-xs font-medium">
                                {espaco.avaliacao.toFixed(1)}
                              </span>
                            </div>
                          </div>

                          <div className="mt-2 flex items-baseline gap-1">
                            <span className="text-base font-semibold text-gray-900 dark:text-white">
                              R$ {espaco.preco}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">• 5 horas</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {resultados.length === 0 && (
                  <div className="text-center py-12 sm:py-20">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full mb-4">
                      <Filter size={24} className="text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Nenhum espaço encontrado
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                      Não encontramos espaços para <strong>{cidadeParam}</strong> com os filtros selecionados.
                    </p>
                    {(tipo || precoFaixa) && (
                      <button
                        onClick={limparFiltros}
                        className="mt-4 text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium text-sm"
                      >
                        Limpar filtros
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente principal com Suspense
export default function ResultadosBusca() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-slate-900">
          <div className="text-gray-500 dark:text-gray-400 animate-pulse">Carregando resultados...</div>
        </div>
      }
    >
      <ResultadosContent />
    </Suspense>
  );
}