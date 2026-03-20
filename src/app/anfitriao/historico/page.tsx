"use client";

/* ======================= TELA DE HISTORICO DE RESERVAS
HISTORICO DE TODOS OS ESPAÇOS DO ANFITRIAO
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
} from "lucide-react";
import AvaliacaoModal from "@/components/AvaliacaoModal";
import { toast } from "sonner";
import AuditoriaModal from "@/components/AuditoriaModal";
import type { Auditoria } from "@/components/AuditoriaModal";

type Reserva = {
  id: number;
  espaco: string;
  data: string;
  horario: string;
  cliente: string;
  local: string;
  valor: number;
  status: string;
  imagem: string;
  telefone: string;
  avaliada: boolean;
  auditoriaPre?: Auditoria;
  auditoriaPos?: Auditoria;
};

// Mock de reservas
const reservasMock: Reserva[] = [
  {
    id: 1,
    espaco: "Espaço Premium Monte Castelo",
    data: "10/10/2025",
    horario: "18:00 às 23:00",
    cliente: "João Pereira",
    local: "Campo Grande - MS",
    valor: 500,
    status: "Finalizada",
    imagem: "/images/espaco1.jpg",
    telefone: "(67) 99999-0000",
    avaliada: false,
    auditoriaPre: {
      tipo: "pre" as const,
      itens: [
        {
          id: "1",
          nome: "Cadeiras",
          quantidade: 50,
          estadoPre: "ok" as const,
          estadoPos: undefined,
        },
      ],
      observacoesGerais: "",
      status: "aprovada" as const,
      data: new Date().toISOString(),
    },
  },
  {
    id: 2,
    espaco: "Espaço Sunset Garden",
    data: "02/11/2025",
    horario: "14:00 às 20:00",
    cliente: "Carlos Silva",
    local: "Campo Grande - MS",
    valor: 350,
    status: "Cancelada",
    imagem: "/images/espaco2.jpg",
    telefone: "(67) 98888-1111",
    avaliada: false,
  },
];

const statusColors = {
  Finalizada: "text-green-600",
  Cancelada: "text-red-600",
  Outro: "text-gray-500",
};

export default function HistoricoReservas() {
  const [tipoAuditoria, setTipoAuditoria] = useState<"pre" | "pos">("pre");
  const [descricaoProblema, setDescricaoProblema] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("Todas");
  const [espacoFiltro, setEspacoFiltro] = useState("Todos");
  const [periodoFiltro, setPeriodoFiltro] = useState("Últimos 30 dias");

  const [avaliacaoAberta, setAvaliacaoAberta] = useState(false);
  const [detalhesAbertos, setDetalhesAbertos] = useState(false);
  const [reportarAberto, setReportarAberto] = useState(false);

  const [dropdownAberto, setDropdownAberto] = useState<number | null>(null);
  const [reservaSelecionada, setReservaSelecionada] = useState<any>(null);
  const [reservas, setReservas] = useState<Reserva[]>(reservasMock);
  const [vistoriaAberta, setVistoriaAberta] = useState(false);

  // Usando um Map para armazenar refs de cada dropdown
  const dropdownRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const buttonRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  const reservasFiltradas = reservas.filter(
    (r) =>
      (statusFiltro === "Todas" || r.status === statusFiltro) &&
      (espacoFiltro === "Todos" || r.espaco === espacoFiltro)
  );

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

  function abrirVistoria(reserva: any) {
    if (!reserva.auditoriaPre) {
      alert("Esta reserva não possui vistoria pré.");
      return;
    }

    setReservaSelecionada(reserva);
    setVistoriaAberta(true);
  }

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

          {/* Filtros - Responsivo */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
            <select
              className="w-full sm:w-auto p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
              value={statusFiltro}
              onChange={(e) => setStatusFiltro(e.target.value)}
            >
              <option>Todas</option>
              <option>Finalizada</option>
              <option>Cancelada</option>
            </select>

            <select
              className="w-full sm:w-auto p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
              value={espacoFiltro}
              onChange={(e) => setEspacoFiltro(e.target.value)}
            >
              <option>Todos</option>
              <option>Espaço Premium Monte Castelo</option>
              <option>Espaço Sunset Garden</option>
            </select>

            <select
              className="w-full sm:w-auto p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
              value={periodoFiltro}
              onChange={(e) => setPeriodoFiltro(e.target.value)}
            >
              <option>Últimos 30 dias</option>
              <option>Últimos 3 meses</option>
              <option>Personalizado</option>
            </select>
          </div>

          {/* Cards - Grid Responsivo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {reservasFiltradas.map((reserva) => (
              <div
                key={reserva.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-md transition overflow-hidden flex flex-col"
              >
                {/* Imagem */}
                <div className="relative h-40 sm:h-48">
                  <img
                    src={reserva.imagem}
                    alt={reserva.espaco}
                    className="w-full h-full object-cover"
                  />
                  {/* Badge de status mobile */}
                  <div className="absolute top-2 right-2 sm:hidden">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        statusColors[reserva.status as keyof typeof statusColors] || statusColors.Outro
                      } bg-white dark:bg-gray-800 shadow`}
                    >
                      {reserva.status}
                    </span>
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="p-4 flex-1 flex flex-col">
                  {/* Título e status desktop */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 flex-1">
                      {reserva.espaco}
                    </h2>
                    <span
                      className={`hidden sm:inline-block text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${
                        statusColors[reserva.status as keyof typeof statusColors] || statusColors.Outro
                      } bg-gray-100 dark:bg-gray-700`}
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
                    <p className="flex items-center gap-2">
                      <User size={14} className="flex-shrink-0" />
                      <span className="truncate">{reserva.cliente}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin size={14} className="flex-shrink-0" />
                      <span className="truncate">{reserva.local}</span>
                    </p>
                  </div>

                  {/* Valor */}
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    Valor:{" "}
                    <span className="font-semibold text-sky-600">
                      R$ {reserva.valor.toFixed(2)}
                    </span>
                  </p>

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
                      onClick={() =>
                        setDropdownAberto(
                          dropdownAberto === reserva.id ? null : reserva.id
                        )
                      }
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
                          animate-in fade-in zoom-in-95 duration-150
                          bottom-full mb-2 left-1/2 -translate-x-1/2
                          sm:bottom-auto sm:top-full sm:mt-2 sm:left-0 sm:translate-x-0"
                        style={{
                          maxHeight: 'calc(100vh - 200px)',
                          overflowY: 'auto'
                        }}
                      >
                        {/* Ver detalhes */}
                        <button
                          onClick={() => {
                            abrirDetalhes(reserva);
                            setDropdownAberto(null);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-3 
                            text-sm hover:bg-zinc-50 dark:hover:bg-gray-700 transition"
                        >
                          <MessageCircle size={16} />
                          Ver detalhes
                        </button>

                        {/* Avaliar cliente */}
                        {reserva.status === "Finalizada" && !reserva.avaliada && (
                          <button
                            onClick={() => {
                              handleAvaliar(reserva);
                              setDropdownAberto(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-3 
                              text-sm hover:bg-zinc-50 dark:hover:bg-gray-700 transition"
                          >
                            <Star size={16} />
                            Avaliar cliente
                          </button>
                        )}

                         {/* Vistoria pós-evento */}
                        {reserva.status === "Finalizada" && (
                          <button
                            onClick={() => {
                              setTipoAuditoria("pos");
                              abrirVistoria(reserva);
                              setDropdownAberto(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-3 
                              text-sm hover:bg-zinc-50 dark:hover:bg-gray-700 transition"
                          >
                            <ClipboardCheck size={16} />
                            Vistoria pós-evento
                          </button>
                        )}

                        <div className="border-t dark:border-gray-700" />

                        {/* Reportar problema */}
                        <button
                          onClick={() => {
                            abrirReportar(reserva);
                            setDropdownAberto(null);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-3 
                            text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
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
        </div>
      </div>

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
                <p><b>Horário:</b> {reservaSelecionada.horario}</p>
                <p><b>Local:</b> {reservaSelecionada.local}</p>
                <p><b>Valor:</b> R$ {reservaSelecionada.valor.toFixed(2)}</p>
                <p><b>Telefone:</b> {reservaSelecionada.telefone}</p>
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
            {/* Cabeçalho */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Reportar problema
              </h2>
              <button
                onClick={() => setReportarAberto(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
                aria-label="Fechar modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Informação da reserva */}
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg mb-4">
              <p className="text-sm font-medium mb-1">{reservaSelecionada.espaco}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {reservaSelecionada.cliente} • {reservaSelecionada.data}
              </p>
            </div>

            <select className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl mb-3 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <option>Problema com cliente</option>
              <option>Danos ao espaço</option>
              <option>Outro</option>
            </select>

            <textarea
              className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
              rows={4}
              placeholder="Descreva o problema (mínimo 10 caracteres)"
              value={descricaoProblema}
              onChange={(e) => setDescricaoProblema(e.target.value)}
            />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {descricaoProblema.length}/10 caracteres mínimos
            </p>

            <button
              disabled={descricaoProblema.trim().length < 10}
              onClick={() => {
                if (descricaoProblema.trim().length < 10) {
                  toast.error("Descrição muito curta", {
                    description: "Digite pelo menos 10 caracteres.",
                  });
                  return;
                }

                console.log("Problema enviado:", descricaoProblema);
                setReportarAberto(false);
                setDescricaoProblema("");

                toast.success("Problema enviado ao suporte", {
                  description: "Nossa equipe analisará sua solicitação",
                });
              }}
              className={`w-full mt-4 py-3 rounded-xl font-semibold transition
                ${
                  descricaoProblema.trim().length < 10
                    ? "bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
                    : "bg-sky-500 hover:bg-sky-600 text-white"
                }
              `}
            >
              Enviar para suporte
            </button>

            <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-3">
              Nossa equipe analisará sua solicitação
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
          onSubmit={() => {
            if (reservaSelecionada) {
              setReservas(prev =>
                prev.map(r =>
                  r.id === reservaSelecionada.id ? { ...r, avaliada: true } : r
                )
              );
            }
            setAvaliacaoAberta(false);
            setReservaSelecionada(null);
            toast.success("Avaliação enviada");
          }}
        />
      )}

      {/* MODAL DE VISTORIA */}
      {vistoriaAberta && reservaSelecionada && (
        <AuditoriaModal
          tipo={tipoAuditoria}
          reserva={reservaSelecionada}
          auditoriaPre={reservaSelecionada.auditoriaPre}
          hoje={new Date()}
          onClose={() => {
            setVistoriaAberta(false);
            setReservaSelecionada(null);
          }}
          onSalvar={(auditoria: Auditoria) => {
            setReservas((prev) =>
              prev.map((r) => {
                if (r.id !== reservaSelecionada.id) return r;
                return tipoAuditoria === "pre"
                  ? { ...r, auditoriaPre: auditoria }
                  : { ...r, auditoriaPos: auditoria };
              })
            );
            setVistoriaAberta(false);
            setReservaSelecionada(null);
          }}
        />
      )}
    </>
  );
}