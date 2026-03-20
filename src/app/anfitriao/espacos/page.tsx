"use client";

/* ======================= TELA DE "MEUS ESPAÇOS"
 TODOS OS ESPAÇOS DO ANFITRIAO
 ======================= */

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit3, PauseCircle, CalendarDays, Trash2, MapPin, Users, Package } from "lucide-react";

interface Espaco {
  id: string;
  nome_espaco: string;
  tipo_espaco: string;
  descricao: string;
  capacidade: number;
  area: number;
  tipo_cobranca: string;
  tipo_reserva: "automatica" | "manual";
  valor?: number | null;
  temPlanos?: boolean;
  modoBuffet?: boolean;
  buffet?: {
    ativo: boolean;
    nivel: string;
    descricao: string;
    precoBase: number;
  } | null;
  categoriasFesta?: {
    id: string;
    nome: string;
    pacotes: {
      id: string;
      nome: string;
      descricao: string;
      infoAdicional?: string;
      itens: { titulo: string; descricao: string }[];
      precos: { convidados?: number; valor?: number }[];
    }[];
  }[];
  endereco: string;
  fotos: string[];
  servicos?: { nome: string; preco: string }[];
  regras?: string[];
  facilidades?: string[];
  disponivel: boolean;
  criadoEm?: string;
}

export default function Espacos() {
  const router = useRouter();
  const [espacos, setEspacos] = useState<Espaco[]>([]);

  useEffect(() => {
    const salvos = JSON.parse(localStorage.getItem("espacos") || "[]");
    setEspacos(salvos);
  }, []);

  const excluirEspaco = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este espaço?")) {
      const novosEspacos = espacos.filter((e) => e.id !== id);
      setEspacos(novosEspacos);
      localStorage.setItem("espacos", JSON.stringify(novosEspacos));
    }
  };

  const alternarDisponibilidade = (id: string) => {
    const atualizados = espacos.map((e) =>
      e.id === id ? { ...e, disponivel: !e.disponivel } : e
    );
    setEspacos(atualizados);
    localStorage.setItem("espacos", JSON.stringify(atualizados));
  };

  const formatarPreco = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
          Meus Espaços
        </h1>
        <Link
          href="/anfitriao/espacos/novo"
          className="flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-3 sm:py-2 rounded-xl font-semibold transition shadow-sm hover:shadow-md w-full sm:w-auto"
        >
          <Plus size={18} />
          <span>Cadastrar Novo Espaço</span>
        </Link>
      </div>

      {/* Lista de espaços */}
      {espacos.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            🏠 Você ainda não cadastrou nenhum espaço.
          </p>
          <Link
            href="/anfitriao/espacos/novo"
            className="inline-block mt-4 text-sky-500 hover:text-sky-600 font-medium"
          >
            Começar agora →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {espacos.map((espaco) => {
            const imagemCapa =
              espaco.fotos && espaco.fotos.length > 0
                ? `/espacos/${espaco.fotos[0]}`
                : "/img/placeholder-espaco.jpg";

            return (
              <div
                key={espaco.id}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col"
              >
                {/* Imagem com overlay de status */}
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <img
                    src={imagemCapa}
                    alt={espaco.nome_espaco}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Badges sobrepostos na imagem */}
                  <div className="absolute top-2 right-2 flex flex-col gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium shadow-lg ${
                        espaco.disponivel
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {espaco.disponivel ? "Disponível" : "Indisponível"}
                    </span>
                    
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium shadow-lg ${
                        espaco.tipo_reserva === "automatica"
                          ? "bg-sky-500 text-white"
                          : "bg-amber-500 text-white"
                      }`}
                    >
                      {espaco.tipo_reserva === "automatica"
                        ? "Auto"
                        : "Manual"}
                    </span>
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="p-4 flex-1 flex flex-col">
                  {/* Título e tipo */}
                  <div className="mb-3">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-tight mb-1 line-clamp-2">
                      {espaco.nome_espaco}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {espaco.tipo_espaco}
                    </p>
                  </div>

                  {/* Informações principais */}
                  <div className="space-y-2 mb-3 text-sm">
                    {/* Localização */}
                    <div className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                      <MapPin size={16} className="flex-shrink-0 mt-0.5 text-gray-400" />
                      <span className="line-clamp-2">{espaco.endereco}</span>
                    </div>

                    {/* Capacidade */}
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <Users size={16} className="flex-shrink-0 text-gray-400" />
                      <span>Até {espaco.capacidade} pessoas</span>
                    </div>

                    {/* Preço */}
                    <div className="mt-2">
                      {!espaco.temPlanos && espaco.valor ? (
                        <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                          {formatarPreco(espaco.valor)}
                          <span className="ml-1 text-xs font-normal text-gray-500">
                            / {espaco.tipo_cobranca}
                          </span>
                        </p>
                      ) : (
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 inline-block px-3 py-1 rounded-full">
                          Preço sob consulta
                        </p>
                      )}
                    </div>

                    {/* Buffet */}
                    {espaco.buffet?.ativo && (
                      <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                        <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
                          Buffet {espaco.buffet.nivel}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                          a partir de {formatarPreco(espaco.buffet.precoBase)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Categorias de festa */}
                  {espaco.temPlanos && espaco.categoriasFesta && espaco.categoriasFesta.length > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center gap-1 mb-2">
                        <Package size={14} className="text-gray-400" />
                        <span className="text-xs font-medium text-gray-500">Festas atendidas:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {espaco.categoriasFesta.slice(0, 3).map((c) => (
                          <span
                            key={c.id}
                            className="bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 text-xs px-2 py-1 rounded-full"
                          >
                            {c.nome}
                          </span>
                        ))}
                        {espaco.categoriasFesta.length > 3 && (
                          <span className="text-xs text-gray-400">
                            +{espaco.categoriasFesta.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Contadores de serviços/regras/facilidades */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {espaco.servicos && espaco.servicos.length > 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300">
                        {espaco.servicos.length} serviços
                      </span>
                    )}
                    {espaco.regras && espaco.regras.length > 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300">
                        {espaco.regras.length} regras
                      </span>
                    )}
                    {espaco.facilidades && espaco.facilidades.length > 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300">
                        {espaco.facilidades.length} facilidades
                      </span>
                    )}
                  </div>

                  {/* Descrição */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic line-clamp-2 mb-4">
                    "{espaco.descricao}"
                  </p>

                  {/* Ações */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-auto pt-3 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => router.push(`/anfitriao/espacos/${espaco.id}/editar`)}
                      className="flex items-center justify-center gap-1 p-2 text-xs text-sky-600 hover:text-sky-700 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit3 size={14} />
                      <span className="hidden sm:inline">Editar</span>
                    </button>

                    <button
                      onClick={() => router.push(`/anfitriao/espacos/${espaco.id}/reservas`)}
                      className="flex items-center justify-center gap-1 p-2 text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                      title="Reservas"
                    >
                      <CalendarDays size={14} />
                      <span className="hidden sm:inline">Reservas</span>
                    </button>

                    <button
                      onClick={() => alternarDisponibilidade(espaco.id)}
                      className={`flex items-center justify-center gap-1 p-2 text-xs rounded-lg transition-colors ${
                        espaco.disponivel
                          ? "text-gray-600 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                          : "text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                      }`}
                      title={espaco.disponivel ? "Pausar" : "Ativar"}
                    >
                      <PauseCircle size={14} />
                      <span className="hidden sm:inline">
                        {espaco.disponivel ? "Pausar" : "Ativar"}
                      </span>
                    </button>

                    <button
                      onClick={() => excluirEspaco(espaco.id)}
                      className="flex items-center justify-center gap-1 p-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={14} />
                      <span className="hidden sm:inline">Excluir</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}