"use client";

/* =======================
   TELA DE HISTÓRICO DE RESERVAS
   HISTÓRICO DE TODOS OS ESPAÇOS DO ANFITRIÃO
   ======================= */

import { useState, useEffect, useRef } from "react";
import {
  Star,
  AlertCircle,
  MessageCircle,
  CalendarDays,
  User,
  MapPin,
  X,
  MoreVertical,
  ClipboardCheck,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import {
  calcularValorBase,
  calcularTaxaAnfitriao,
  calcularLiquidoAnfitriao
} from "@/config/taxa";

// Componentes
import AvaliacaoModal from "@/components/AvaliacaoModal";
import AuditoriaModal from "@/components/AuditoriaModal";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";

// Tipos e Utils
import type { Auditoria } from "@/components/AuditoriaModal";
import type { Reserva } from "@/types/reserva";
interface ReservaComAuditoria extends Reserva {
  auditoriaPre?: Auditoria;
  auditoriaPos?: Auditoria;
  dataInicio: string;
  dataFim: string;

  valorBruto?: number;
  taxaPlacyHub?: number;
}
import { formatarHorario, formatarTelefone, filtrarPorPeriodo } from "@/utils/reservas";

// Função para formatar data YYYY-MM-DD sem fuso horário
function formatarDataSemFuso(dataStr: string) {
  if (!dataStr) return "";
  const [ano, mes, dia] = dataStr.split("-");
  return `${dia}/${mes}/${ano}`;
}

// Verifica se pode fazer vistoria (pré = antes do evento, pós = depois do evento)
function podeFazerVistoria(dataEvento: string, tipo: "pre" | "pos"): boolean {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const [ano, mes, dia] = dataEvento.split("-");
  const dataEventoObj = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
  dataEventoObj.setHours(0, 0, 0, 0);

  if (tipo === "pre") {
    return dataEventoObj >= hoje;
  } else {
    return hoje > dataEventoObj;
  }
}

// Retorna o status da vistoria
function getStatusVistoria(dataEvento: string, tipo: "pre" | "pos", realizada: boolean): {
  podeFazer: boolean;
  texto: string;
  cor: string;
} {
  const pode = podeFazerVistoria(dataEvento, tipo);

  if (realizada) {
    return { podeFazer: false, texto: "✓ Realizada", cor: "text-green-600" };
  }

  if (pode) {
    return { podeFazer: true, texto: tipo === "pre" ? "Fazer pré-vistoria" : "Fazer pós-vistoria", cor: "text-yellow-600" };
  }

  return {
    podeFazer: false,
    texto: tipo === "pre" ? "Prazo encerrado" : "Aguardando evento",
    cor: "text-gray-400"
  };
}

// Verifica se pode avaliar o cliente (só depois do evento)
function podeAvaliar(dataEvento: string, jaAvaliou: boolean): boolean {
  if (jaAvaliou) return false;
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const [ano, mes, dia] = dataEvento.split("-");
  const dataEventoObj = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
  dataEventoObj.setHours(0, 0, 0, 0);

  return hoje > dataEventoObj; // Só pode avaliar se a data já passou
}

const statusColors = {
  Finalizada: "text-green-600 bg-green-50 dark:bg-green-900/20",
  Cancelada: "text-red-600 bg-red-50 dark:bg-red-900/20",
  Pendente: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20",
  Outro: "text-gray-500 bg-gray-50 dark:bg-gray-700",
};

export default function HistoricoReservas() {
  const { user } = useAuth();

  // Estados
  const [reservas, setReservas] = useState<ReservaComAuditoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [tipoAuditoria, setTipoAuditoria] = useState<"pre" | "pos">("pre");
  const [descricaoProblema, setDescricaoProblema] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("Todas");
  const [espacoFiltro, setEspacoFiltro] = useState("Todos");
  const [periodoFiltro, setPeriodoFiltro] = useState("Últimos 30 dias");
  const [espacosUnicos, setEspacosUnicos] = useState<string[]>([]);

  // Estados dos modais
  const [avaliacaoAberta, setAvaliacaoAberta] = useState(false);
  const [detalhesAbertos, setDetalhesAbertos] = useState(false);
  const [reportarAberto, setReportarAberto] = useState(false);
  const [dropdownAberto, setDropdownAberto] = useState<number | null>(null);
  const [reservaSelecionada, setReservaSelecionada] = useState<any>(null);
  const [vistoriaAberta, setVistoriaAberta] = useState(false);

  // Refs para dropdown
  const dropdownRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const buttonRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  // ==================== BUSCAR RESERVAS DO SUPABASE ====================
  // ==================== BUSCAR RESERVAS DO SUPABASE ====================


  const buscarReservas = async () => {
    if (!user?.id) return;

    setLoading(true);

    try {
        // Primeiro, buscar os IDs dos espaços do anfitrião
      const { data: espacosDoAnfitriao, error: espacosError } = await supabase
        .from("spaces")
        .select("id")
        .eq("user_id", user.id);

      if (espacosError) {
        console.error("Erro ao buscar espaços do anfitrião:", espacosError);
        throw espacosError;
      }

      if (!espacosDoAnfitriao || espacosDoAnfitriao.length === 0) {
        setReservas([]);
        setLoading(false);
        return;
      }

      const espacosIds = espacosDoAnfitriao.map(espaco => espaco.id);
      // Buscar reservas relacionadas a esses espaços
      const { data: reservasData, error: reservasError } = await supabase
        .from("reservas")
        .select("*")
        .in("espaco_id", espacosIds)
        .in("status", ["confirmada", "finalizada", "cancelada", "pendente", "reagendamento_proposto"])
        .order("created_at", { ascending: false });

      if (reservasError) {
        console.error("Erro ao buscar reservas:", reservasError);
        throw reservasError;
      }

      if (!reservasData || reservasData.length === 0) {
        setReservas([]);
        setLoading(false);
        return;
      }
      // Agora buscar os dados complementares (espaços e clientes)
      const reservasCompletas = await Promise.all(
        reservasData.map(async (reserva) => {
          // Buscar dados do espaço
          const { data: espacoData } = await supabase
            .from("spaces")
            .select("id, nome_espaco, imagens, cidade, bairro, temPlanos")
            .eq("id", reserva.espaco_id)
            .single();

          // Buscar dados do cliente
          const { data: clienteData } = await supabase
            .from("users")
            .select("id, name, telefone")
            .eq("id", reserva.user_id)
            .single();

          // ✅ ADICIONE ESTE BLOCO AQUI (logo após a busca do cliente)
          const { data: vistorias } = await supabase
            .from("vistorias")
            .select("tipo, dados")
            .eq("reserva_id", reserva.id);

          const auditoriaPre = vistorias?.find(v => v.tipo === "pre")?.dados;
          const auditoriaPos = vistorias?.find(v => v.tipo === "pos")?.dados;
          const isBuffet = espacoData?.temPlanos === true;

          // TRATAMENTO DA IMAGEM
          // TRATAMENTO DA IMAGEM - CORRIGIDO
          let imagemUrl = "/placeholder-space.jpg";
          if (espacoData?.imagens) {
            // Caso 1: Já é um array
            if (Array.isArray(espacoData.imagens) && espacoData.imagens.length > 0) {
              imagemUrl = espacoData.imagens[0];
            }
            // Caso 2: É uma string que começa com http (URL direta)
            else if (typeof espacoData.imagens === 'string' && espacoData.imagens.startsWith('http')) {
              imagemUrl = espacoData.imagens;
            }
            // Caso 3: É uma string JSON (como o seu caso)
            else if (typeof espacoData.imagens === 'string') {
              try {
                const parsed = JSON.parse(espacoData.imagens);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  imagemUrl = parsed[0];
                } else if (typeof parsed === 'string' && parsed.startsWith('http')) {
                  imagemUrl = parsed;
                }
              } catch (e) {
              }
            }
          }
     const valorBruto = reserva.valor_total || 0;

const valorBase = calcularValorBase(valorBruto);

const taxaPlacyHub = calcularTaxaAnfitriao(valorBase);

const liquidoAnfitriao = calcularLiquidoAnfitriao(valorBruto);

return {
            id: reserva.id,
            espaco_id: espacoData?.id,
            cliente_id: clienteData?.id,

  valor: liquidoAnfitriao,
valorBruto: valorBruto,
taxaPlacyHub: taxaPlacyHub,
            espaco: espacoData?.nome_espaco || "Espaço não encontrado",
            data: formatarDataSemFuso(reserva.data_inicio),
            horario: formatarHorario(reserva.data_inicio, reserva.data_fim, isBuffet),
            cliente: clienteData?.name || "Cliente não identificado",
            local: `${espacoData?.cidade || ""} - ${espacoData?.bairro || ""}`,
            status: reserva.status === "cancelada" ? "Cancelada" :
              (reserva.status === "finalizada" || (reserva.status === "confirmada" && new Date(reserva.data_inicio) < new Date())) ? "Finalizada" :
                reserva.status === "confirmada" ? "Confirmada" :
                  reserva.status === "reagendamento_proposto" ? "Aguardando resposta" : "Pendente",
            imagem: imagemUrl,
            telefone: clienteData?.telefone || "(00) 00000-0000",
            avaliada: reserva.avaliada_anfitriao || false,
            dataInicio: reserva.data_inicio,
            dataFim: reserva.data_fim,
            isBuffet: isBuffet,
            auditoriaPre: auditoriaPre,
            auditoriaPos: auditoriaPos,
          };
        })
      );
      setReservas(reservasCompletas);

      // Extrair espaços únicos para o filtro
      const espacos = [...new Set(reservasCompletas.map(r => r.espaco))];
      setEspacosUnicos(espacos);

    } catch (error) {
      console.error("Erro detalhado ao buscar reservas:", error);
      toast.error("Erro ao carregar histórico de reservas");
    } finally {
      setLoading(false);
    }
  };

  // Carregar reservas ao montar o componente
  useEffect(() => {
    buscarReservas();
  }, [user?.id]);

  // ==================== FILTROS ====================
  const reservasFiltradas = reservas.filter((r) => {
    const statusMatch = statusFiltro === "Todas" || r.status === statusFiltro;
    const espacoMatch = espacoFiltro === "Todos" || r.espaco === espacoFiltro;
    const periodoMatch = filtrarPorPeriodo([r], periodoFiltro).length > 0;
    return statusMatch && espacoMatch && periodoMatch;
  });

  // ==================== FUNÇÕES DOS MODAIS ====================
  function handleAvaliar(reserva: any) {
    setReservaSelecionada(reserva);
    setAvaliacaoAberta(true);
  }

  function abrirDetalhes(reserva: any) {
    setReservaSelecionada(reserva);
    setDetalhesAbertos(true);
  }

  function abrirReportar(reserva: any) {
    setReservaSelecionada(reserva);
    setReportarAberto(true);
  }

  function abrirVistoria(reserva: any, tipo: "pre" | "pos") {
    setTipoAuditoria(tipo);
    setReservaSelecionada(reserva);
    setVistoriaAberta(true);
  }

  // ==================== CLICK OUTSIDE DO DROPDOWN ====================
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownAberto !== null) {
        const dropdownRef = dropdownRefs.current.get(dropdownAberto);
        const buttonRef = buttonRefs.current.get(dropdownAberto);

        if (
          dropdownRef &&
          !dropdownRef.contains(event.target as Node) &&
          buttonRef &&
          !buttonRef.contains(event.target as Node)
        ) {
          setDropdownAberto(null);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownAberto]);


  // ==================== RENDER ====================
  return (
    <>
      <div className="p-4 md:p-6 bg-zinc-50 dark:bg-gray-900 min-h-screen transition-colors">
        <div className="max-w-7xl mx-auto">
          {/* Cabeçalho */}
          <div className="mb-6">
            <h1 className="text-xl md:text-2xl font-bold mb-1 text-gray-900 dark:text-gray-100">
              Histórico de Reservas
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Reservas finalizadas ou canceladas dos seus espaços
            </p>
          </div>

          {/* Filtros */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
            <select
              className="w-full sm:w-auto p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
              value={statusFiltro}
              onChange={(e) => setStatusFiltro(e.target.value)}
            >
              <option>Todas</option>
<option>Confirmada</option>
<option>Finalizada</option>
<option>Cancelada</option>
<option>Pendente</option>
<option>Aguardando resposta</option>
            </select>

            <select
              className="w-full sm:w-auto p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
              value={espacoFiltro}
              onChange={(e) => setEspacoFiltro(e.target.value)}
            >
              <option>Todos</option>
              {espacosUnicos.map((espaco) => (
                <option key={espaco}>{espaco}</option>
              ))}
            </select>

            <select
              className="w-full sm:w-auto p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
              value={periodoFiltro}
              onChange={(e) => setPeriodoFiltro(e.target.value)}
            >
              <option>Últimos 30 dias</option>
              <option>Últimos 3 meses</option>
              <option>Últimos 6 meses</option>
              <option>Todos</option>
            </select>

            {/* Botão de recarregar */}
            <button
              onClick={buscarReservas}
              className="px-4 py-2 bg-sky-500 text-white rounded-md text-sm hover:bg-sky-600 transition"
            >
              Atualizar
            </button>
          </div>

          {/* Lista de Reservas */}
          {loading ? (
            <LoadingSpinner />
          ) : reservasFiltradas.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {reservasFiltradas.map((reserva) => (
                <div
                  key={reserva.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-md transition overflow-visible flex flex-col"
                >
                  {/* Imagem */}
                  <div className="relative h-40 sm:h-48">
                    <img
                      src={reserva.imagem}
                      alt={reserva.espaco}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-space.jpg";
                      }}
                    />
                    <div className="absolute top-2 right-2 sm:hidden">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[reserva.status as keyof typeof statusColors] || statusColors.Outro
                          }`}
                      >
                        {reserva.status}
                      </span>
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 flex-1">
                        {reserva.espaco}
                      </h2>
                      <span
                        className={`hidden sm:inline-block text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${statusColors[reserva.status as keyof typeof statusColors] || statusColors.Outro
                          }`}
                      >
                        {reserva.status}
                      </span>
                    </div>

                    {/* Informações */}
                    <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <p className="flex items-center gap-2">
                        <CalendarDays size={14} className="flex-shrink-0" />
                        <span className="truncate">{reserva.data}</span>
                      </p>
                      {reserva.isBuffet && reserva.horario && (
                        <p className="flex items-center gap-2">
                          <Clock size={14} className="flex-shrink-0" />
                          <span className="truncate">{reserva.horario}</span>
                        </p>
                      )}
                      <p className="flex items-center gap-2">
                        <User size={14} className="flex-shrink-0" />
                        <span className="truncate">{reserva.cliente}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin size={14} className="flex-shrink-0" />
                        <span className="truncate">{reserva.local}</span>
                      </p>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Repasse:
                        <span className="font-semibold text-green-600 ml-1">
                          R$ {reserva.valor.toFixed(2)}
                        </span>
                      </p>

                    </div>
                    {/* Indicador de vistoria */}
                    {reserva.auditoriaPre && (
                      <div className="mb-2 flex items-center gap-2 text-xs text-green-600">
                        <ClipboardCheck size={12} />
                        <span>Vistoria pré-realizada</span>
                      </div>
                    )}

                    {/* Dropdown de ações */}
                    <div className="relative mt-auto">
                      <button
                        ref={(el) => {
                          if (el) {
                            buttonRefs.current.set(reserva.id, el);
                          } else {
                            buttonRefs.current.delete(reserva.id);
                          }
                        }}
                        onClick={() => {
  if (dropdownAberto === reserva.id) {
    setDropdownAberto(null);
  } else {
    setDropdownAberto(reserva.id);
  }
}}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl 
      bg-slate-100 hover:bg-slate-200 text-slate-700 
      dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200
      text-sm font-semibold transition"
                      >
                        <MoreVertical size={16} />
                        Ações
                      </button>

                      {dropdownAberto === reserva.id && (
                        <div
                          ref={(el) => {
                            if (el) {
                              dropdownRefs.current.set(reserva.id, el);
                            } else {
                              dropdownRefs.current.delete(reserva.id);
                            }
                          }}
                          className="absolute z-50 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden
      animate-in fade-in zoom-in-95 duration-150"
                          style={{
                            bottom: '100%',
                            marginBottom: '8px',
                            left: '0',
                            maxHeight: '300px',
                            overflowY: 'auto'
                          }}
                          id={`dropdown-${reserva.id}`}
                        >
                          {/* Ver detalhes */}
                          <button
                            onClick={() => {
                              abrirDetalhes(reserva);
                              setDropdownAberto(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-left"
                          >
                            <MessageCircle size={16} />
                            Ver detalhes
                          </button>

                          {/* Avaliar cliente */}
                          {(() => {
                            const pode = podeAvaliar(reserva.dataInicio, reserva.avaliada);
                            return (
                              <button
                                onClick={() => {
                                  if (pode) {
                                    handleAvaliar(reserva);
                                    setDropdownAberto(null);
                                  } else if (reserva.avaliada) {
                                    toast.info("Você já avaliou este cliente");
                                  } else {
                                    toast.info("Avaliação só estará disponível após a data do evento");
                                  }
                                }}
                                disabled={!pode}
                                className={`w-full flex items-center gap-2 px-4 py-3 text-sm transition text-left
              ${reserva.avaliada
                                    ? "text-gray-500 cursor-not-allowed"
                                    : pode
                                      ? "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                      : "text-gray-400 cursor-not-allowed"
                                  }`}
                              >
                                <Star size={16} />
                                {reserva.avaliada ? " Cliente já avaliado" : pode ? "Avaliar cliente" : " Avaliação disponível após o evento"}
                              </button>
                            );
                          })()}

                          {/* Vistoria */}
                          {(() => {
                            const hoje = new Date();
                            hoje.setHours(0, 0, 0, 0);
                            const [ano, mes, dia] = reserva.dataInicio.split("-");
                            const dataEvento = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
                            dataEvento.setHours(0, 0, 0, 0);

                            const eventoJaPassou = hoje > dataEvento;
                            const tipoVistoria = eventoJaPassou ? "pos" : "pre";
                            const jaRealizada = eventoJaPassou ? !!reserva.auditoriaPos : !!reserva.auditoriaPre;
                            const status = getStatusVistoria(reserva.dataInicio, tipoVistoria, jaRealizada);

                            let textoBotao = "";
                            let corClasse = "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700";

                            if (jaRealizada) {
                              textoBotao = ` Ver ${tipoVistoria === "pre" ? "Pré" : "Pós"}-Vistoria`;
                            } else if (status.podeFazer) {
                              textoBotao = ` ${status.texto}`;
                            } else {
                              textoBotao = ` ${status.texto}`;
                              corClasse = "text-gray-400 cursor-not-allowed";
                            }

                            return (
                              <button
                                onClick={() => {
                                  if (status.podeFazer || jaRealizada) {
                                    abrirVistoria(reserva, tipoVistoria);
                                    setDropdownAberto(null);
                                  } else {
                                    toast.error(status.texto);
                                  }
                                }}
                                disabled={!status.podeFazer && !jaRealizada}
                                className={`w-full flex items-center gap-2 px-4 py-3 text-sm transition text-left ${corClasse}`}
                              >
                                <ClipboardCheck size={16} />
                                {textoBotao}
                              </button>
                            );
                          })()}

                          <div className="border-t dark:border-gray-700" />

                          {/* Reportar problema */}
                          <button
                            onClick={() => {
                              abrirReportar(reserva);
                              setDropdownAberto(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition text-left"
                          >
                            <AlertCircle size={16} />
                            Reportar problema
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              ))}
            </div>
          )}
        </div>
      </div>

      {/* ==================== MODAIS ==================== */}

      {/* MODAL DETALHES */}
      {reservaSelecionada && detalhesAbertos && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-5 md:p-6 w-full max-w-md animate-fade-in relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setReservaSelecionada(null);
                setDetalhesAbertos(false);
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
              Detalhes da Reserva
            </h3>

            <div className="space-y-3 text-gray-700 dark:text-gray-300 text-sm">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {reservaSelecionada.espaco}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {reservaSelecionada.cliente}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <p><b>Data:</b> {reservaSelecionada.data}</p>
                {reservaSelecionada.isBuffet && reservaSelecionada.horario && (
                  <p><b>Horário:</b> {reservaSelecionada.horario}</p>
                )}
                <p><b>Local:</b> {reservaSelecionada.local}</p>
                <p>
                  <b>Valor da reserva:</b> 
R$ {reservaSelecionada.valorBruto?.toFixed(2)}
                </p>
                <p>
                  <b>Taxa PlacyHub: </b> -R$ {reservaSelecionada.taxaPlacyHub?.toFixed(2)}
                </p>
                <p>
                  <b>Repasse: </b>
                  R$ {reservaSelecionada.valor.toFixed(2)}

                </p>



                <p><b>Telefone:</b> {formatarTelefone(reservaSelecionada.telefone)}</p>
                <p><b>Status:</b> {reservaSelecionada.status}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setReservaSelecionada(null);
                  setDetalhesAbertos(false);
                }}
                className="w-full sm:w-auto bg-sky-600 text-white px-6 py-3 sm:py-2 rounded-xl font-medium hover:bg-sky-700 transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL REPORTAR */}
      {reportarAberto && reservaSelecionada && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 md:p-6 w-full max-w-md border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle size={24} className="text-red-500" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Reportar problema
                </h2>
              </div>
              <button
                onClick={() => {
                  setReportarAberto(false);
                  setDescricaoProblema("");
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg mb-4">
              <p className="text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">
                {reservaSelecionada.espaco}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {reservaSelecionada.cliente} • {reservaSelecionada.data}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipo de problema *
                </label>
                <select
                  id="tipoProblema"
                  className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                  <option value="Problema com cliente">Problema com cliente</option>
                  <option value="Danos ao espaço">Danos ao espaço</option>
                  <option value="Problema com pagamento">Problema com pagamento</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descrição do problema *
                </label>
                <textarea
                  className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  rows={4}
                  placeholder="Descreva o problema em detalhes (mínimo 10 caracteres)..."
                  value={descricaoProblema}
                  onChange={(e) => setDescricaoProblema(e.target.value)}
                />
                <p className={`text-xs mt-1 ${descricaoProblema.length >= 10 ? 'text-green-500' : 'text-gray-400'}`}>
                  {descricaoProblema.length}/10 caracteres mínimos
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setReportarAberto(false);
                  setDescricaoProblema("");
                }}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600
            text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Cancelar
              </button>
              <button
                disabled={descricaoProblema.trim().length < 10}
                onClick={async () => {
                  if (descricaoProblema.trim().length < 10) {
                    toast.error("Descrição muito curta", {
                      description: "Digite pelo menos 10 caracteres.",
                    });
                    return;
                  }

                  const tipoSelect = document.getElementById("tipoProblema") as HTMLSelectElement;
                  const tipo = tipoSelect?.value || "Outro";

                  try {
                    // 🔥 SALVANDO NA TABELA reportes
                    const { error } = await supabase
                      .from("reportes")
                      .insert({
                        reserva_id: reservaSelecionada.id,
                        user_id: user?.id,
                        tipo: tipo,
                        descricao: descricaoProblema.trim(),
                        status: "pendente",
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                      });

                    if (error) {
                      console.error("Erro ao salvar report:", error);
                      toast.error("Erro ao enviar problema");
                      return;
                    }

                    toast.success("Problema enviado ao suporte", {
                      description: "Nossa equipe analisará sua solicitação",
                    });

                    setReportarAberto(false);
                    setDescricaoProblema("");
                  } catch (error) {
                    console.error("Erro:", error);
                    toast.error("Erro ao enviar problema");
                  }
                }}
                className={`flex-1 py-3 rounded-xl font-semibold transition
            ${descricaoProblema.trim().length < 10
                    ? "bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
                    : "bg-sky-500 hover:bg-sky-600 text-white"
                  }
          `}
              >
                Enviar para suporte
              </button>
            </div>

            <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-4">
              Nossa equipe analisará sua solicitação.
            </p>
          </div>
        </div>
      )}

      {/* MODAL AVALIAÇÃO */}
      {reservaSelecionada && (
        <AvaliacaoModal
          isOpen={avaliacaoAberta}
          nomeEspaco={reservaSelecionada.espaco}
          onClose={() => {
            setAvaliacaoAberta(false);
            setReservaSelecionada(null);
          }}
          onSubmit={async (nota: number, comentario?: string) => {
            try {
              console.log("📝 Dados a serem enviados:", {
                reserva_id: reservaSelecionada.id,
                user_id: user?.id,  // ← anfitrião vai no user_id
                espaco_id: reservaSelecionada.espaco_id,
                nota: nota,
                comentario: comentario || null,
                tipo: "anfitriao_para_cliente",
                anfitriao_id: user?.id,
                cliente_id: reservaSelecionada.cliente_id,
              });

              // Salvar avaliação - colocando anfitrião no user_id
              const { data, error } = await supabase
                .from("avaliacoes")
                .insert({
                  reserva_id: reservaSelecionada.id,
                  user_id: user?.id,  // ← CAMPO OBRIGATÓRIO - coloca o anfitrião aqui
                  espaco_id: reservaSelecionada.espaco_id,
                  nota: nota,
                  comentario: comentario || null,
                  tipo: "anfitriao_para_cliente",
                  anfitriao_id: user?.id,
                  cliente_id: reservaSelecionada.cliente_id,
                  created_at: new Date().toISOString()
                })
                .select();

              if (error) {
                console.error("❌ Erro:", error);
                toast.error(`Erro: ${error.message}`);
                return;
              }
              // Marcar reserva como avaliada
              const { error: updateError } = await supabase
                .from("reservas")
                .update({ avaliada_anfitriao: true })
                .eq("id", reservaSelecionada.id);

              if (updateError) {
                console.error("❌ Erro ao atualizar reserva:", updateError);
              }

              // Atualizar estado local
              setReservas(prev =>
                prev.map(r =>
                  r.id === reservaSelecionada.id ? { ...r, avaliada: true } : r
                )
              );

              toast.success("Avaliação enviada com sucesso!");
              setAvaliacaoAberta(false);
              setReservaSelecionada(null);
            } catch (error) {
              console.error("❌ Erro no catch:", error);
              toast.error("Erro ao enviar avaliação");
            }
          }}
        />
      )}
      {/* MODAL DE VISTORIA */}
      {vistoriaAberta && reservaSelecionada && (
        <AuditoriaModal
          tipo={tipoAuditoria}
          reserva={reservaSelecionada}
          auditoriaPre={reservaSelecionada.auditoriaPre}
          auditoriaPos={reservaSelecionada.auditoriaPos}
          hoje={new Date()}
          onClose={() => {
            setVistoriaAberta(false);
            setReservaSelecionada(null);
          }}
          onSalvar={async (auditoria: Auditoria) => {
            try {
              // Verificar se já existe vistoria para esta reserva e tipo
              const { data: existing } = await supabase
                .from("vistorias")
                .select("id")
                .eq("reserva_id", reservaSelecionada.id)
                .eq("tipo", tipoAuditoria)
                .maybeSingle();

              let error;

              if (existing) {
                // Atualizar existente
                const { error: updateError } = await supabase
                  .from("vistorias")
                  .update({
                    dados: auditoria,
                    updated_at: new Date().toISOString()
                  })
                  .eq("id", existing.id);
                error = updateError;
              } else {
                // Criar nova
                const { error: insertError } = await supabase
                  .from("vistorias")
                  .insert({
                    reserva_id: reservaSelecionada.id,
                    espaco_id: reservaSelecionada.espaco_id,
                    tipo: tipoAuditoria,
                    dados: auditoria,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  });
                error = insertError;
              }

              if (error) throw error;

              // Atualizar estado local
              setReservas((prev) =>
                prev.map((r) => {
                  if (r.id !== reservaSelecionada.id) return r;
                  return tipoAuditoria === "pre"
                    ? { ...r, auditoriaPre: auditoria }
                    : { ...r, auditoriaPos: auditoria };
                })
              );

              toast.success(`Vistoria ${tipoAuditoria === "pre" ? "pré" : "pós"}-evento salva com sucesso!`);
              setVistoriaAberta(false);
              setReservaSelecionada(null);

              // Recarregar reservas
              buscarReservas();

            } catch (error) {
              console.error("❌ Erro ao salvar vistoria:", error);
              toast.error("Erro ao salvar vistoria");
            }
          }}
        />
      )}
    </>
  );
}