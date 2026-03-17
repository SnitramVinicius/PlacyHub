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

// type Auditoria = {
//   tipo: string;
//   itens: {
//     id: string;
//     nome: string;
//     quantidade: number;
//     estadoPre?: string;
//     estadoPos?: string;
//   }[];
//   observacoesGerais: string;
//   finalizada: boolean;
//   data: string;
// };

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

  auditoriaPre?: Auditoria; // 👈 AGORA É OPCIONAL
  auditoriaPos?: Auditoria; // 👈 JÁ DEIXA PRONTO
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
      tipo: "pre",
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
    status: "finalizada",
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
  const [reservaDetalhe, setReservaDetalhe] = useState<any>(null);
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

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [vistoriaAberta, setVistoriaAberta] = useState(false);

  const [checklistVistoria, setChecklistVistoria] = useState({
  limpeza: true,
  moveis: true,
  estrutura: true,
  equipamentos: true,
});

const [houveAvaria, setHouveAvaria] = useState(false);
const [observacoesVistoria, setObservacoesVistoria] = useState("");

 const reservasFiltradas = reservas.filter(
  (r) =>
    (statusFiltro === "Todas" || r.status === statusFiltro) &&
    (espacoFiltro === "Todos" || r.espaco === espacoFiltro)
);

useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownAberto(null);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

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

  const botaoEstilo =
    "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition";
  const btnVerDetalhes = "bg-slate-100 hover:bg-slate-200 text-slate-800";
  const btnAvaliar = "bg-yellow-100 hover:bg-yellow-200 text-yellow-700";
  const btnReportar = "bg-red-100 hover:bg-red-200 text-red-600";

  
  return (
    <>
   <div className="p-6 bg-zinc-50 dark:bg-gray-900 min-h-screen transition-colors">
      <div className="mb-6">
       <h1 className="text-2xl font-bold mb-1 text-gray-900 dark:text-gray-100">Histórico de Reservas</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Reservas finalizadas ou canceladas dos seus espaços
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          className="p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
          value={statusFiltro}
          onChange={(e) => setStatusFiltro(e.target.value)}
        >
          <option>Todas</option>
          <option>Finalizada</option>
          <option>Cancelada</option>
        </select>

        <select
          className="p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
          value={espacoFiltro}
          onChange={(e) => setEspacoFiltro(e.target.value)}
        >
          <option>Todos</option>
          <option>Espaço Premium Monte Castelo</option>
          <option>Espaço Sunset Garden</option>
        </select>

        <select
          className="p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
          value={periodoFiltro}
          onChange={(e) => setPeriodoFiltro(e.target.value)}
        >
          <option>Últimos 30 dias</option>
          <option>Últimos 3 meses</option>
          <option>Personalizado</option>
        </select>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reservasFiltradas.map((reserva) => (
          <div
            key={reserva.id}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-md transition"
          >
            <img
              src={reserva.imagem}
              alt={reserva.espaco}
              className="w-full h-40 object-cover"
            />

            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{reserva.espaco}</h2>

              <p className="text-sm text-gray-500 flex items-center gap-1">
                <CalendarDays size={14} /> {reserva.data}
              </p>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <User size={14} /> {reserva.cliente}
              </p>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <MapPin size={14} /> {reserva.local}
              </p>

              <p className="mt-2 text-gray-700">
                Valor:{" "}
                <span className="font-semibold text-sky-600">
                  R$ {reserva.valor.toFixed(2)}
                </span>
              </p>

              <p
  className={`text-sm font-medium mt-1 ${
    statusColors[reserva.status as keyof typeof statusColors] || statusColors.Outro
  }`}
>
  {reserva.status}
</p>


<div className="relative mt-4">
  <button
    onClick={() =>
      setDropdownAberto(
        dropdownAberto === reserva.id ? null : reserva.id
      )
    }
    className="flex items-center gap-2 px-3 py-2 rounded-xl 
               bg-slate-100 hover:bg-slate-200 text-slate-700 
               text-sm font-semibold transition"
  >
    <MoreVertical size={16} />
    Ações
  </button>

  {dropdownAberto === reserva.id && (
    <div
     ref={dropdownRef}
      className="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-20 overflow-hidden
           animate-in fade-in zoom-in-95 duration-150"
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

      <div className="border-t" />

      {/* Reportar problema */}
      <button
        onClick={() => {
          abrirReportar(reserva);
          setDropdownAberto(null);
        }}
        className="w-full flex items-center gap-2 px-4 py-3 
                   text-sm text-red-600 hover:bg-red-50 transition"
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

      {reservaSelecionada && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-md animate-fade-in relative">
      <button
        onClick={() => setReservaSelecionada(null)}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
      >
        <X size={20} />
      </button>

      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        Detalhes da Reserva
      </h3>

      <div className="space-y-2 text-gray-700 text-sm dark:text-gray-100">
        <p><b>Cliente:</b> {reservaSelecionada.cliente}</p>
        <p><b>Período:</b> {new Date(reservaSelecionada.dataInicio).toLocaleDateString()} → {new Date(reservaSelecionada.dataFim).toLocaleDateString()}</p>
        <p><b>Valor:</b> R$ {reservaSelecionada.valor.toFixed(2)}</p>
        <p><b>Método de Pagamento:</b> {reservaSelecionada.metodoPagamento}</p>
        <p><b>Telefone:</b> {reservaSelecionada.telefone}</p>
        <p><b>E-mail:</b> {reservaSelecionada.email}</p>
        <p><b>Observações:</b> {reservaSelecionada.observacoes || "Nenhuma observação."}</p>
      </div>

    </div>
  </div>
)}
{/* MODAL REPORTAR */}
{reportarAberto && reservaSelecionada && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700">
      
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Reportar problema
        </h2>

        <button
          onClick={() => setReportarAberto(false)}
          className="text-gray-400 hover:text-gray-600 transition"
          aria-label="Fechar modal"
        >
          ✕
        </button>
      </div>

      <select className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-md mb-3 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
        <option>Problema com cliente</option>
        <option>Danos ao espaço</option>
        <option>Outro</option>
      </select>

   <textarea
className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
  rows={4}
  placeholder="Descreva o problema (mínimo 10 caracteres)"
  value={descricaoProblema}
  onChange={(e) => setDescricaoProblema(e.target.value)}
/>


      {/* Ações */}
      <div className="flex justify-end gap-2 mt-4">


       <button
  disabled={descricaoProblema.trim().length < 10}
  onClick={() => {
    if (descricaoProblema.trim().length < 10) {
      toast.error("Descrição muito curta", {
        description: "Digite pelo menos 10 caracteres.",
      });
      return;
    }

    // 🔁 Aqui futuramente entra o POST para o backend
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
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-sky-500 hover:bg-sky-600 text-white"
    }
  `}
>
  Enviar para suporte
</button>


      </div>

      {/* Mensagem sutil */}
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
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
      // Atualiza reserva como avaliada
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
{/* MODAL DE VISTORIA (PRÉ / PÓS) */}
{vistoriaAberta && reservaSelecionada && (
  <AuditoriaModal
    tipo={tipoAuditoria}
    reserva={reservaSelecionada}
    auditoriaPre={reservaSelecionada.auditoriaPre}
    hoje={new Date()}
    onClose={() => {  // <-- ERA 'onClick', DEVE SER 'onClose'
      setVistoriaAberta(false);
      setReservaSelecionada(null);
    }}
    onSalvar={(auditoria: Auditoria) => {
      setReservas((prev) =>
        prev.map((r) => {
          if (r.id !== reservaSelecionada.id) {
            return r;
          }

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

    </div>

    </>
  );

}
