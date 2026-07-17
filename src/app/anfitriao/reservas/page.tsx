"use client";

/* ======================= CALENDARIO AGENDA DO ANFITRIAO
CALENDARIO PARA ANFITRIAO ACOMPANHAR SEUS AGENDAMENTOS DE ESPAÇOS
 ======================= */

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  LockKeyhole,
  Unlock,
  Eye,
  X,
  Ban,
  ListChecks,
  CalendarDays,
    CheckCircle,   // 🔥 ADICIONAR
  XCircle  
} from "lucide-react";

import AuditoriaModal from "@/components/AuditoriaModal";
import type { Auditoria } from "@/components/AuditoriaModal";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

// ==================== UTILITÁRIOS DE DATA (SEM FUSO HORÁRIO) ====================
// Formata uma data YYYY-MM-DD para exibição local
function formatarDataLocal(dataStr: string) {
  if (!dataStr) return "";
  const [ano, mes, dia] = dataStr.split("-");
  return new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia)).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// Converte Date para string YYYY-MM-DD sem fuso horário
function dateToLocalString(date: Date): string {
  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const dia = String(date.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

// Obtém a data de hoje no formato YYYY-MM-DD sem fuso
function hojeLocalString(): string {
  const hoje = new Date();
  return dateToLocalString(hoje);
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
    texto: tipo === "pre" ? "Prazo encerrado para vistoria" : "Aguardando evento", 
    cor: "text-gray-400" 
  };
}

/* =======================
   TIPOS
======================= */
interface Reserva {
  id: string;
  espacoId: string | "ALL";
  espacoNome: string;
  nomeCliente?: string;
  telefone?: string;
  convidados?: number;
  valor?: number;
  pagamentoStatus?: "pago" | "pendente";
  horario?: string;
  dataInicio: string;
  dataFim: string;
  status:
  | "confirmada"
  | "bloqueada"
  | "finalizada"
  | "reagendamento_proposto"
  | "cancelada";

cancelado_em?: string;
  auditoriaPre?: Auditoria;
  auditoriaPos?: Auditoria;
  remarcacao_solicitada?: boolean;
  remarcacao_nova_data?: string;
  remarcacao_status?: string;
}

export default function ReservasAnfitriao() {

  const { user } = useAuth();
  const [tipoAuditoria, setTipoAuditoria] = useState<"pre" | "pos">("pre");
  const [auditoriaAberta, setAuditoriaAberta] = useState(false);
  const [reservaAuditoria, setReservaAuditoria] = useState<Reserva | null>(null);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [mesAtual, setMesAtual] = useState(new Date());
  const [reservasDia, setReservasDia] = useState<Reserva[] | null>(null);
  const [reservaDetalhe, setReservaDetalhe] = useState<Reserva | null>(null);
  const [reservaParaDesbloquear, setReservaParaDesbloquear] = useState<Reserva | null>(null);
  const [cancelamentoAberto, setCancelamentoAberto] = useState(false);
  const [motivoCancelamento, setMotivoCancelamento] = useState("");
  const [reservaParaCancelar, setReservaParaCancelar] = useState<Reserva | null>(null);
  const [reagendamentoAberto, setReagendamentoAberto] = useState(false);
const [reservaParaReagendar, setReservaParaReagendar] = useState<Reserva | null>(null);
  const [novaDataReagendamento, setNovaDataReagendamento] = useState("");
const [mensagemReagendamento, setMensagemReagendamento] = useState("");
  const [diaBloqueio, setDiaBloqueio] = useState<string | null>(null);
  const [periodoBloqueio, setPeriodoBloqueio] = useState({
    inicio: "",
    fim: "",
  });

  const [verPropostaAberta, setVerPropostaAberta] = useState(false);
const [dadosProposta, setDadosProposta] = useState<{ novaData: string; mensagem: string; reporteId: string } | null>(null);

  
const algumModalAberto =
  auditoriaAberta ||
  !!reservaDetalhe ||
  !!reservasDia ||
  !!diaBloqueio ||
  !!reservaParaDesbloquear ||
  cancelamentoAberto ||
  reagendamentoAberto ||
  verPropostaAberta;

  useEffect(() => {
    if (algumModalAberto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [algumModalAberto]);

  /* =======================
     DATA DE HOJE
  ======================= */
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

const [espacos, setEspacos] = useState<{ id: string; nome: string; temPlanos?: boolean }[]>([]);

// ==================== BUSCAR ESPAÇOS DO ANFITRIÃO ====================
const buscarEspacos = async () => {
  if (!user?.id) return;

  try {
    const { data, error } = await supabase
      .from("spaces")
      .select("id, nome_espaco, temPlanos")
      .eq("user_id", user.id);

    if (error) throw error;

    if (data) {
      setEspacos(data.map(e => ({ id: e.id, nome: e.nome_espaco, temPlanos: e.temPlanos })));
    }
  } catch (error) {
    console.error("Erro ao buscar espaços:", error);
    toast.error("Erro ao carregar espaços");
  }
};

function formatarData(data: string) {
  if (!data) return "";
  // Se a data já veio como YYYY-MM-DD, usa diretamente
  if (data.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [ano, mes, dia] = data.split("-");
    return new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia)).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }
 
  // Fallback para outros formatos
  return new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

const aprovarRemarcacaoCliente = async (reservaId: string, novaData: string) => {
  try {
    const { data: reserva, error: fetchError } = await supabase
      .from("reservas")
      .select("user_id, espaco_id, data_inicio")
      .eq("id", reservaId)
      .single();

    if (fetchError) throw fetchError;

    const { error: updateError } = await supabase
      .from("reservas")
      .update({
        data_inicio: novaData,
        data_fim: novaData,
        remarcacao_status: "aprovada",
        remarcacao_solicitada: false,
      })
      .eq("id", reservaId);

    if (updateError) throw updateError;

    await supabase.from("notificacoes").insert({
      usuario_id: reserva.user_id,
      tipo: "reserva",
      titulo: "✅ Remarcação aprovada!",
      mensagem: `Sua solicitação de remarcação foi aprovada! A nova data do evento é ${formatarDataLocal(novaData)}.`,
      link: `/locatario/reservas/${reservaId}`,
      created_at: new Date().toISOString(),
    });

    // Atualizar estado local
    setReservas(prev =>
      prev.map(r =>
        r.id === reservaId
          ? {
              ...r,
              dataInicio: novaData,
              dataFim: novaData,
              status: "confirmada",
              remarcacao_status: "aprovada",
              remarcacao_solicitada: false,
              remarcacao_nova_data: undefined,
            }
          : r
      )
    );

    toast.success("Remarcação aprovada! Data atualizada com sucesso.");
    
    // 🔥 FECHAR O MODAL
    setReservaDetalhe(null);
    
    // Recarregar reservas
    await buscarReservasReais();

  } catch (error) {
    console.error("Erro ao aprovar remarcação:", error);
    toast.error("Erro ao aprovar remarcação");
  }
};

const recusarRemarcacaoCliente = async (reservaId: string) => {
  try {
    const { data: reserva, error: fetchError } = await supabase
      .from("reservas")
      .select("user_id, data_inicio")
      .eq("id", reservaId)
      .single();

    if (fetchError) throw fetchError;

    const { error: updateError } = await supabase
      .from("reservas")
      .update({
        remarcacao_status: "recusada",
        remarcacao_solicitada: false,
        remarcacao_nova_data: null,
      })
      .eq("id", reservaId);

    if (updateError) throw updateError;

    await supabase.from("notificacoes").insert({
      usuario_id: reserva.user_id,
      tipo: "reserva",
      titulo: "❌ Remarcação recusada",
      mensagem: `Sua solicitação de remarcação foi recusada. A data original (${formatarDataLocal(reserva.data_inicio)}) permanece confirmada.`,
      link: `/locatario/reservas/${reservaId}`,
      created_at: new Date().toISOString(),
    });

    setReservas(prev =>
      prev.map(r =>
        r.id === reservaId
          ? {
              ...r,
              remarcacao_status: "recusada",
              remarcacao_solicitada: false,
              remarcacao_nova_data: undefined,
            }
          : r
      )
    );

    toast.success("Remarcação recusada");
    
    // 🔥 FECHAR O MODAL
    setReservaDetalhe(null);
    
    await buscarReservasReais();

  } catch (error) {
    console.error("Erro ao recusar remarcação:", error);
    toast.error("Erro ao recusar remarcação");
  }
};

  /* =======================
     MOCK
  ======================= */
  // ==================== BUSCAR RESERVAS REAIS DO SUPABASE ====================
const buscarReservasReais = async () => {
  if (!user?.id || espacos.length === 0) return;

  try {
    const espacosIds = espacos.map(e => e.id);
    console.log("🔍 Buscando reservas para espaços:", espacosIds);

    // Buscar reservas confirmadas, pendentes e finalizadas
    const { data: reservasData, error: reservasError } = await supabase
  .from("reservas")
  .select(`
    id,
    data_inicio,
    data_fim,
    status,
    qtd_pessoas,
    valor_total,
    user_id,
    pagamento_status,
    espaco_id,
    cancelado_em,
    remarcacao_solicitada,
    remarcacao_nova_data,
    remarcacao_status
  `)
  .in("espaco_id", espacosIds)
  .in("status", [
    "confirmada",
    "pendente",
    "finalizada",
    "reagendamento_proposto",
    "cancelada"
  ])
  .order("data_inicio", { ascending: true });

    if (reservasError) throw reservasError;
const { data: bloqueiosData, error: bloqueiosError } = await supabase
  .from("bloqueios")
  .select(`
    id,
    espaco_id,
    data_inicio,
    data_fim
  `)
  .in("espaco_id", [...espacosIds, "ALL"])
  .eq("user_id", user?.id);

if (bloqueiosError) throw bloqueiosError;
console.log("🔒 Bloqueios encontrados:", bloqueiosData);
  if (!reservasData || reservasData.length === 0) {
  const bloqueiosFormatados: Reserva[] = [];

bloqueiosData?.forEach((bloqueio) => {

  // 🔥 Bloqueio geral
  if (bloqueio.espaco_id === "ALL") {

    espacos.forEach((espaco) => {
      bloqueiosFormatados.push({
        id: bloqueio.id + espaco.id,
        espacoId: espaco.id,
        espacoNome: espaco.nome,
        dataInicio: bloqueio.data_inicio,
        dataFim: bloqueio.data_fim,
        status: "bloqueada",
      });
    });

  } else {

    bloqueiosFormatados.push({
      id: bloqueio.id,
      espacoId: bloqueio.espaco_id,
      espacoNome:
        espacos.find((e) => e.id === bloqueio.espaco_id)?.nome || "Espaço",
      dataInicio: bloqueio.data_inicio,
      dataFim: bloqueio.data_fim,
      status: "bloqueada",
    });

  }

});

  setReservas(bloqueiosFormatados);
  return;
}

    console.log("✅ Reservas encontradas:", reservasData);

    // Buscar dados dos clientes
    const userIds = [...new Set(reservasData.map(r => r.user_id))];
const { data: clientes } = await supabase
  .from("users")
  .select("id, name, telefone")
  .in("id", userIds);

    const clientesMap = new Map();
    clientes?.forEach(c => clientesMap.set(c.id, c));
    console.log("👤 Mapa de clientes:", Array.from(clientesMap.entries()));
const reservasFormatadas: Reserva[] = await Promise.all(
  reservasData.map(async (reserva) => {
    const espaco = espacos.find(e => e.id === reserva.espaco_id);
    const cliente = clientesMap.get(reserva.user_id);
    const isBuffet = espaco?.temPlanos === true;
    
    // Buscar vistorias desta reserva
    const { data: vistorias } = await supabase
      .from("vistorias")
      .select("tipo, dados")
      .eq("reserva_id", reserva.id);

    const auditoriaPre = vistorias?.find(v => v.tipo === "pre")?.dados;
    const auditoriaPos = vistorias?.find(v => v.tipo === "pos")?.dados;

return {
  id: reserva.id,
  espacoId: reserva.espaco_id,
  espacoNome: espaco?.nome || "Espaço",
  nomeCliente: cliente?.name || "Cliente não encontrado",
  telefone: cliente?.telefone || "Telefone não informado",
  convidados: reserva.qtd_pessoas,
  valor: reserva.valor_total,
  pagamentoStatus: reserva.pagamento_status === "approved" ? "pago" : "pendente",
  horario: isBuffet ? "Formato buffet" : "",
  dataInicio: reserva.data_inicio,
  dataFim: reserva.data_fim,
  status: reserva.status,
  cancelado_em: reserva.cancelado_em,
  auditoriaPre,
  auditoriaPos,
  remarcacao_solicitada: reserva.remarcacao_solicitada || false,
  remarcacao_nova_data: reserva.remarcacao_nova_data,
  remarcacao_status: reserva.remarcacao_status,
};
  })
);
console.log("🚧 FORMATANDO BLOQUEIOS:", bloqueiosData);
const bloqueiosFormatados: Reserva[] =
  bloqueiosData?.map((bloqueio) => ({
    id: bloqueio.id,
    espacoId: bloqueio.espaco_id,
    espacoNome:
      bloqueio.espaco_id === "ALL"
        ? "Todos os espaços"
        : espacos.find((e) => e.id === bloqueio.espaco_id)?.nome || "Espaço",
    dataInicio: bloqueio.data_inicio,
    dataFim: bloqueio.data_fim,
    status: "bloqueada",
  })) || [];

  console.log("📅 RESERVAS FINAIS DO CALENDÁRIO:", [
  ...reservasFormatadas,
  ...bloqueiosFormatados
]);
console.log("✅ Reservas formatadas:", reservasFormatadas);

setReservas([
  ...reservasFormatadas,
  ...bloqueiosFormatados
]);

} catch (error) {
  console.error("Erro ao buscar reservas:", error);
  toast.error("Erro ao carregar reservas");
}
};

const ano = mesAtual.getFullYear();
const mes = mesAtual.getMonth();
const totalDias = new Date(ano, mes + 1, 0).getDate();

const dias = Array.from({ length: totalDias }, (_, i) => {
  const data = new Date(ano, mes, i + 1);
  return data;
});

  /* =======================
     BLOQUEIO
  ======================= */
// ==================== SALVAR BLOQUEIO NO SUPABASE ====================
const confirmarBloqueio = async (espacoId: string) => {
  if (!periodoBloqueio.inicio || !periodoBloqueio.fim) return;

  try {
    const { error } = await supabase
      .from("bloqueios")
      .insert({
        espaco_id: espacoId,
        data_inicio: periodoBloqueio.inicio,
        data_fim: periodoBloqueio.fim,
        user_id: user?.id,
        created_at: new Date().toISOString()
      });

    if (error) throw error;

    buscarReservasReais();

    toast.success("Período bloqueado com sucesso!");
    setDiaBloqueio(null);
    setPeriodoBloqueio({ inicio: "", fim: "" });

  } catch (error) {
    console.error("Erro ao bloquear:", error);
    toast.error("Erro ao bloquear período");
  }
};

// ==================== REMOVER BLOQUEIO ====================
const desbloquearDia = async (id: string) => {
  try {
    const { error } = await supabase
      .from("bloqueios")
      .delete()
      .eq("id", id);

    if (error) throw error;

    setReservas((prev) => prev.filter((r) => r.id !== id));
    toast.success("Bloqueio removido!");
  } catch (error) {
    console.error("Erro ao desbloquear:", error);
    toast.error("Erro ao remover bloqueio");
  }
};

// ==================== SOLICITAR CANCELAMENTO ====================
const solicitarCancelamento = async () => {
  if (!reservaParaCancelar || motivoCancelamento.trim().length < 10) return;

  try {
    const agora = new Date().toISOString();

    const { error } = await supabase
      .from("reservas")
      .update({
        status: "cancelada",
        cancelado_em: agora
      })
      .eq("id", reservaParaCancelar.id);

    if (error) throw error;

    setReservas((prev) =>
      prev.map((r) =>
        r.id === reservaParaCancelar.id
          ? {
              ...r,
              status: "cancelada",
              cancelado_em: agora
            }
          : r
      )
    );

    toast.success("Reserva cancelada com sucesso!");

    setCancelamentoAberto(false);
    setMotivoCancelamento("");
    setReservaParaCancelar(null);

    buscarReservasReais();

  } catch (error) {
    console.error("Erro ao cancelar reserva:", error);
    toast.error("Erro ao cancelar reserva");
  }
};

// ==================== PROPOR REAGENDAMENTO ====================
const enviarPropostaReagendamento = async () => {
  if (!novaDataReagendamento) {
    toast.error("Selecione uma nova data");
    return;
  }

  if (!reservaParaReagendar) return;

  try {
    const dataStr = novaDataReagendamento;

    // Verificar conflito
    const { data: conflitos } = await supabase
      .from("reservas")
      .select("id")
      .eq("espaco_id", reservaParaReagendar.espacoId)
      .eq("data_inicio", dataStr)
      .in("status", ["confirmada", "pendente"]);

    if (conflitos && conflitos.length > 0) {
      toast.error("Esta data já está ocupada. Escolha outra data.");
      return;
    }

    // Salvar proposta na tabela reportes
    const { error: reportError } = await supabase
      .from("reportes")
      .insert({
        reserva_id: reservaParaReagendar.id,
        user_id: user?.id,
        tipo: "Proposta de reagendamento",
        descricao: `Nova data sugerida: ${formatarDataLocal(novaDataReagendamento)}\n\nMensagem: ${mensagemReagendamento || "Sem mensagem adicional"}`,
        status: "pendente",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (reportError) throw reportError;

    // Atualizar status da reserva
    const { error: updateError } = await supabase
      .from("reservas")
      .update({
        status: "reagendamento_proposto",
        remarcacao_solicitada: true,
        remarcacao_nova_data: dataStr
      })
      .eq("id", reservaParaReagendar.id);

    if (updateError) throw updateError;

    // 🔥 NOTIFICAR O CLIENTE 🔥
    const { data: reserva } = await supabase
      .from("reservas")
      .select("user_id")
      .eq("id", reservaParaReagendar.id)
      .single();

    if (reserva) {
      await supabase.from("notificacoes").insert({
        usuario_id: reserva.user_id,
        tipo: "reserva",
        titulo: "📅 Proposta de reagendamento",
        mensagem: `O anfitrião sugeriu uma nova data para sua reserva: ${formatarDataLocal(dataStr)}. Acesse para aceitar ou recusar.`,
        link: `/locatario/reservas/${reservaParaReagendar.id}`,
        created_at: new Date().toISOString(),
      });
      console.log("✅ Notificação enviada para o cliente");
    }

    // Atualizar estado local
    setReservas((prev) =>
      prev.map((r) =>
        r.id === reservaParaReagendar.id
          ? { 
              ...r, 
              status: "reagendamento_proposto",
              remarcacao_solicitada: true,
              remarcacao_nova_data: dataStr
            }
          : r
      )
    );

    toast.success("Proposta de reagendamento enviada! O cliente será notificado.");
    
    setReagendamentoAberto(false);
    setNovaDataReagendamento("");
    setMensagemReagendamento("");
    setReservaParaReagendar(null);
    setReservaDetalhe(null); // Fechar modal
    buscarReservasReais();

  } catch (error) {
    console.error("Erro ao enviar proposta:", error);
    toast.error("Erro ao enviar proposta de reagendamento");
  }
};

// ==================== BUSCAR PROPOSTA DE REAGENDAMENTO ====================
const buscarPropostaReagendamento = async (reservaId: string) => {
  try {
    const { data, error } = await supabase
      .from("reportes")
      .select("id, descricao, created_at")
      .eq("reserva_id", reservaId)
      .eq("tipo", "Proposta de reagendamento")
      .eq("status", "pendente")
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) throw error;

    if (data && data.length > 0) {
      const reporte = data[0];
      const dataMatch = reporte.descricao.match(/Nova data sugerida: (.*?)(\n|$)/);
      const mensagemMatch = reporte.descricao.match(/Mensagem: ([\s\S]*?)$/);
      
      setDadosProposta({
        novaData: dataMatch ? dataMatch[1] : "",
        mensagem: mensagemMatch ? mensagemMatch[1] : "Sem mensagem adicional",
        reporteId: reporte.id
      });
    }
  } catch (error) {
    console.error("Erro ao buscar proposta:", error);
  }
};

// ==================== CANCELAR PROPOSTA ====================
const cancelarPropostaReagendamento = async (reporteId: string, reservaId: string) => {
  try {
    const { error: reportError } = await supabase
      .from("reportes")
      .update({ status: "cancelado" })
      .eq("id", reporteId);

    if (reportError) throw reportError;

    const { error: reservaError } = await supabase
      .from("reservas")
      .update({ 
        status: "confirmada",
        remarcacao_solicitada: false,
        remarcacao_nova_data: null
      })
      .eq("id", reservaId);

    if (reservaError) throw reservaError;

    setReservas((prev) =>
      prev.map((r) =>
        r.id === reservaId ? { ...r, status: "confirmada" } : r
      )
    );

    toast.success("Proposta cancelada com sucesso!");
    setVerPropostaAberta(false);
    setDadosProposta(null);
    buscarReservasReais();
  } catch (error) {
    console.error("Erro ao cancelar proposta:", error);
    toast.error("Erro ao cancelar proposta");
  }
};

// ==================== EDITAR PROPOSTA ====================
const editarPropostaReagendamento = async (reservaId: string, novaData: string, mensagem: string) => {
  if (!novaData) {
    toast.error("Selecione uma nova data");
    return;
  }

  try {
    if (dadosProposta?.reporteId) {
      await supabase
        .from("reportes")
        .update({ status: "cancelado" })
        .eq("id", dadosProposta.reporteId);
    }

    const { error: reportError } = await supabase
      .from("reportes")
      .insert({
        reserva_id: reservaId,
        user_id: user?.id,
        tipo: "Proposta de reagendamento",
       descricao: `Nova data sugerida: ${formatarDataLocal(novaData)}\n\nMensagem: ${mensagem || "Sem mensagem adicional"}`,
        status: "pendente",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (reportError) throw reportError;

    await supabase
      .from("reservas")
      .update({ remarcacao_nova_data: novaData })
      .eq("id", reservaId);

    toast.success("Proposta atualizada com sucesso!");
    setVerPropostaAberta(false);
    setDadosProposta(null);
    buscarReservasReais();
  } catch (error) {
    console.error("Erro ao editar proposta:", error);
    toast.error("Erro ao editar proposta");
  }
};

// Processar fotos da auditoria e fazer upload - usando bucket "vistorias"
const processarFotosAuditoria = async (auditoria: Auditoria, tipo: string, reservaId: string) => {
  const novosItens = [];
  
  for (const item of auditoria.itens) {
    const fotosPre = item.fotosPre || [];
    const fotosPos = item.fotosPos || [];
    
    // Processar fotos da pré-vistoria
    const novasFotosPre = [];
    for (const foto of fotosPre) {
      if (foto.startsWith('blob:')) {
        try {
          const response = await fetch(foto);
          const blob = await response.blob();
          const file = new File([blob], `vistoria_${reservaId}_${tipo}_${item.id}_${Date.now()}.jpg`, { type: 'image/jpeg' });
          
          console.log("📤 Upload para bucket 'vistorias':", file.name);

            // 🔥 COLOQUE AQUI OS NOVOS LOGS 🔥
          console.log("🔐 Verificando bucket:", 'vistorias');
          console.log("📁 Nome do arquivo:", file.name);
          console.log("📦 Tamanho:", file.size);
          
          const { error } = await supabase.storage
            .from("vistorias")  // ← MUDOU PARA "vistorias"
            .upload(file.name, file, {
              cacheControl: '3600',
              upsert: true
            });
            
          if (error) {
            console.error("❌ Erro no upload:", error);
            throw error;
          }
          
          const { data: { publicUrl } } = supabase.storage
            .from("vistorias")
            .getPublicUrl(file.name);
            
          console.log("✅ Upload concluído:", publicUrl);
          novasFotosPre.push(publicUrl);
        } catch (err) {
          console.error("❌ Erro ao processar foto:", err);
          novasFotosPre.push(foto);
        }
      } else {
        novasFotosPre.push(foto);
      }
    }
    
    // Processar fotos da pós-vistoria (mesma lógica)
    const novasFotosPos = [];
    for (const foto of fotosPos) {
      if (foto.startsWith('blob:')) {
        try {
          const response = await fetch(foto);
          const blob = await response.blob();
          const file = new File([blob], `vistoria_${reservaId}_${tipo}_${item.id}_${Date.now()}.jpg`, { type: 'image/jpeg' });
          
          const { error } = await supabase.storage
            .from("vistorias")
            .upload(file.name, file, {
              cacheControl: '3600',
              upsert: true
            });
            
          if (error) throw error;
          
          const { data: { publicUrl } } = supabase.storage
            .from("vistorias")
            .getPublicUrl(file.name);
            
          novasFotosPos.push(publicUrl);
        } catch (err) {
          console.error("Erro ao processar foto:", err);
          novasFotosPos.push(foto);
        }
      } else {
        novasFotosPos.push(foto);
      }
    }
    
    novosItens.push({
      ...item,
      fotosPre: novasFotosPre,
      fotosPos: novasFotosPos
    });
  }
  
  return {
    ...auditoria,
    itens: novosItens
  };
};

// Adicione após o último estado, antes do return
useEffect(() => {
  buscarEspacos();
}, [user?.id]);

useEffect(() => {
  if (espacos.length > 0) {
    buscarReservasReais();
  }
}, [espacos, mesAtual]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-gray-900 p-4 md:p-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-4 md:space-y-6">
        {/* HEADER */}
<header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
  <h2 className="text-xl md:text-2xl font-medium tracking-tight text-gray-900 dark:text-gray-100">
    Calendário de Reservas
  </h2>

  <button
    onClick={buscarReservasReais}
    className="text-sm px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-zinc-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 transition w-full sm:w-auto"
  >
    Atualizar
  </button>
</header>

        {/* CONTROLE DE MÊS */}
        <div className="flex items-center justify-center sm:justify-start gap-4">
          <button
            onClick={() => setMesAtual(new Date(ano, mes - 1, 1))}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
          >
            <ChevronLeft size={20} />
          </button>

          <span className="font-medium capitalize text-sm md:text-base">
            {mesAtual.toLocaleDateString("pt-BR", {
              month: "long",
              year: "numeric",
            })}
          </span>

          <button
            onClick={() => setMesAtual(new Date(ano, mes + 1, 1))}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* LISTA DE DIAS */}
        <div className="space-y-3">
         {dias.map((dia) => {
  const dataStr = dateToLocalString(dia);

            const dataDia = new Date(dia);
            dataDia.setHours(0, 0, 0, 0);
            const isPassado = dataDia < hoje;

           const reservasDoDia = reservas.filter((r) => {
  const dentroPeriodo =
    r.dataInicio <= dataStr && r.dataFim >= dataStr;

  return dentroPeriodo;
});

            const bloqueado = reservasDoDia.find(
              (r) => r.status === "bloqueada"
            );

 const temReagendamentoPendente = reservasDoDia.some(
    (r) => r.status === "reagendamento_proposto"
  );

            return (
              <div key={dataStr} className="grid grid-cols-[64px_1fr] gap-4">
                {/* DATA */}
                <div className="flex flex-col items-center justify-center rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm py-2">
                  <span className="text-lg font-semibold">{dia.getDate()}</span>
                  <span className="text-xs uppercase text-zinc-500 dark:text-gray-400">
                    {dia.toLocaleDateString("pt-BR", { weekday: "short" })}
                  </span>
                </div>

                {/* CARD */}
                <div
                  className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-5 py-4 flex justify-between items-center shadow-sm
                    ${isPassado ? "opacity-60 cursor-not-allowed" : ""}
                  `}
                >
                <div className="text-sm text-zinc-400">
  {/* Mostra reservas mesmo em dias passados */}
  {reservasDoDia.length > 0 && !bloqueado && (
    <div>
      <strong className={isPassado ? "text-gray-500" : ""}>
        {reservasDoDia.length} reserva
        {reservasDoDia.length > 1 && "s"}
      </strong>
      {/* ✅ ADICIONE O INDICADOR AQUI */}
      {temReagendamentoPendente && (
        <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
           Reagendamento pendente
        </span>
      )}
    </div>
  )}

  {reservasDoDia.length === 0 && !bloqueado && (
    <span>
      {isPassado ? "Data encerrada" : "Disponível"}
    </span>
  )}

  {bloqueado && (
    <div className="flex items-center gap-2 text-red-600 font-medium">
      <Ban size={14} />
      {bloqueado.espacoId === "ALL"
        ? "Bloqueio geral"
        : bloqueado.espacoNome}
    </div>
  )}
</div>

                 <div className="flex gap-2">
  {/* Botão Ver - disponível mesmo em dias passados se houver reserva */}
  {!bloqueado && reservasDoDia.length > 0 && (
    <button
      onClick={() =>
        reservasDoDia.length === 1
          ? setReservaDetalhe(reservasDoDia[0])
          : setReservasDia(reservasDoDia)
      }
      className="text-xs border rounded px-3 py-1 hover:bg-zinc-100"
    >
      <Eye size={14} className="inline mr-1" />
      Ver
    </button>
  )}

  {/* Botão Bloquear - apenas para dias futuros sem reserva */}
  {!isPassado && reservasDoDia.length === 0 && !bloqueado && (
    <button
      onClick={() => {
        setDiaBloqueio(dataStr);
        setPeriodoBloqueio({
          inicio: dataStr,
          fim: dataStr,
        });
      }}
      className="text-xs px-3 py-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-zinc-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
    >
      <Lock size={14} className="inline mr-1" />
      Bloquear
    </button>
  )}

  {/* Botão Desbloquear - apenas para dias futuros */}
  {!isPassado && bloqueado && (
    <button
      onClick={() => setReservaParaDesbloquear(bloqueado)}
      className="text-xs px-3 py-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-zinc-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
    >
      <Unlock size={14} className="inline mr-1" />
      Desbloquear
    </button>
  )}
</div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL DE BLOQUEIO - Responsivo */}
      {diaBloqueio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-base font-semibold">Bloquear período</h3>
              <button
                onClick={() => setDiaBloqueio(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-4 md:px-6 py-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="date"
                  min={hojeLocalString()}
                  value={periodoBloqueio.inicio}
                  onChange={(e) =>
                    setPeriodoBloqueio((p) => ({
                      ...p,
                      inicio: e.target.value,
                    }))
                  }
                  className="rounded-lg border border-gray-200 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />

                <input
                  type="date"
                  min={periodoBloqueio.inicio}
                  value={periodoBloqueio.fim}
                  onChange={(e) =>
                    setPeriodoBloqueio((p) => ({
                      ...p,
                      fim: e.target.value,
                    }))
                  }
                  className="rounded-lg border border-gray-200 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <button
                onClick={() => confirmarBloqueio("ALL")}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 py-3 flex items-center justify-center gap-2 hover:bg-zinc-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm"
              >
                <LockKeyhole size={16} />
                Bloquear todos os espaços
              </button>

              {espacos.map((e) => (
                <button
                  key={e.id}
                  onClick={() => confirmarBloqueio(e.id)}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 py-3 flex items-center justify-center gap-2 hover:bg-zinc-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm"
                >
                  <Lock size={16} />
                  {e.nome}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL LISTA DO DIA - Responsivo */}
      {reservasDia && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-50 dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            {/* Header */}
            <div className="px-4 md:px-6 py-4 border-b bg-white dark:bg-gray-800 border-zinc-200 dark:border-gray-700">
              <h3 className="text-base font-semibold tracking-tight text-zinc-800 dark:text-gray-100">
                Reservas do dia
              </h3>
              <p className="text-xs text-zinc-500 dark:text-gray-400">
                {reservasDia.length} reservas encontradas
              </p>
            </div>

            {/* Conteúdo */}
            <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
              {reservasDia.map((reserva) => (
                <div
                  key={reserva.id}
                  className="flex items-center justify-between rounded-xl bg-white dark:bg-gray-800 px-4 py-3 hover:shadow-sm transition"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-800 dark:text-gray-100 truncate">
                      {reserva.espacoNome}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-gray-400 truncate">
                      {reserva.nomeCliente}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setReservasDia(null);
                      setReservaDetalhe(reserva);
                    }}
                    className="text-xs font-medium text-zinc-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition ml-2 flex-shrink-0"
                  >
                    Ver
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 md:px-6 py-3 border-t bg-white dark:bg-gray-800 border-zinc-200 dark:border-gray-700">
              <button
                onClick={() => setReservasDia(null)}
                className="w-full text-sm text-zinc-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETALHES - Responsivo */}
      {reservaDetalhe && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-50 dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            {/* Header */}
            <div className="px-4 md:px-6 py-4 border-b bg-white dark:bg-gray-800 space-y-1">
              <h3 className="text-lg font-semibold tracking-tight truncate">
                {reservaDetalhe.espacoNome}
              </h3>
              <p className="text-xs text-zinc-500">
  {reservaDetalhe.status === "reagendamento_proposto" 
    ? "Aguardando resposta do cliente" 
    : reservaDetalhe.status === "cancelada"
      ? "Cancelada"
      : "Reserva confirmada"}
</p>
            </div>

            {/* Conteúdo */}
            <div className="p-4 md:p-6 space-y-4 text-sm text-zinc-700 dark:text-gray-300 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-zinc-400 dark:text-gray-500">Cliente</p>
                  <p className="font-medium break-words">{reservaDetalhe.nomeCliente}</p>
                </div>

                <div>
                  <p className="text-xs text-zinc-400 dark:text-gray-500">Telefone</p>
                  <p>{reservaDetalhe.telefone}</p>
                </div>

                <div>
                  <p className="text-xs text-zinc-400 dark:text-gray-500">Convidados</p>
                  <p>{reservaDetalhe.convidados}</p>
                </div>

                {/* <div>
                  <p className="text-xs text-zinc-400 dark:text-gray-500">Data do evento</p>
                  <p className="font-medium text-sm">
                    {formatarData(reservaDetalhe.dataInicio)}
                  </p>
                </div> */}

                {reservaDetalhe.horario && (
  <div>
    <p className="text-xs text-zinc-400 dark:text-gray-500">Horário</p>
    <p>{reservaDetalhe.horario}</p>
  </div>
)}

                <div>
                  <p className="text-xs text-zinc-400 dark:text-gray-500">Valor</p>
                  <p className="font-medium">R$ {reservaDetalhe.valor}</p>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-xs text-zinc-400 dark:text-gray-500">Pagamento</p>
                  <span
                    className={`inline-block text-xs px-2 py-1 rounded-full mt-1 ${reservaDetalhe.pagamentoStatus === "pago"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    {reservaDetalhe.pagamentoStatus}
                  </span>
                </div>
              </div>
            </div>

{/* 🔥 SOLICITAÇÃO DE REMARCAÇÃO DO CLIENTE - PENDENTE */}
{reservaDetalhe.remarcacao_solicitada && reservaDetalhe.remarcacao_status === "pendente" && (
  <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
    <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
      📅 Cliente solicitou remarcação!
    </p>
    <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-3">
      Cliente deseja alterar a data de <strong>{formatarDataLocal(reservaDetalhe.dataInicio)}</strong> para <strong>{formatarDataLocal(reservaDetalhe.remarcacao_nova_data || "")}</strong>
    </p>
    <div className="flex gap-3">
      <button
        onClick={() => aprovarRemarcacaoCliente(reservaDetalhe.id, reservaDetalhe.remarcacao_nova_data!)}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition"
      >
        <CheckCircle size={16} />
        Aprovar
      </button>
      <button
        onClick={() => recusarRemarcacaoCliente(reservaDetalhe.id)}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition"
      >
        <XCircle size={16} />
        Recusar
      </button>
    </div>
  </div>
)}


            {/* Ações */}
            <div className="px-4 md:px-6 pb-6 space-y-2">
              <a
                href={`https://wa.me/55${reservaDetalhe.telefone?.replace(/\D/g, "")}`}
                target="_blank"
                className="block w-full text-center rounded-xl border py-2 text-sm 
                  text-zinc-700 dark:text-gray-200
                  hover:bg-zinc-100 dark:hover:bg-gray-700
                  hover:text-black dark:hover:text-white
                  transition"
              >
                💬 Chamar no WhatsApp
              </a>


              {/* Propor reagendamento - só aparece se reserva for futura */}
{reservaDetalhe.status !== "reagendamento_proposto" && 
 reservaDetalhe.status === "confirmada" && 
 new Date(reservaDetalhe.dataInicio) > new Date() && (
  <button
    onClick={() => {
      setReservaParaReagendar(reservaDetalhe);
      setReagendamentoAberto(true);
      setReservaDetalhe(null);
    }}
    className="w-full flex items-center justify-center gap-2 rounded-xl border py-2 text-sm 
      text-zinc-700 dark:text-gray-200
      hover:bg-zinc-100 dark:hover:bg-gray-700
      hover:text-black dark:hover:text-white
      transition"
  >
    <CalendarDays size={16} />
    Propor reagendamento
  </button>
)}
{/* Ver proposta de reagendamento */}
{reservaDetalhe.status === "reagendamento_proposto" && (
  <button
    onClick={async () => {
      setReservaParaReagendar(reservaDetalhe);
      await buscarPropostaReagendamento(reservaDetalhe.id);
      setVerPropostaAberta(true);
      setReservaDetalhe(null);
    }}
    className="w-full flex items-center justify-center gap-2 rounded-xl border border-yellow-500 bg-yellow-50 py-2 text-sm 
      text-yellow-700 hover:bg-yellow-100 transition"
  >
    <CalendarDays size={16} />
    Ver proposta de reagendamento
  </button>
)}


{/* Vistoria Pré-Locação - com validação de prazo */}
{(reservaDetalhe.status === "confirmada" || 
  reservaDetalhe.status === "finalizada" || 
  reservaDetalhe.status === "reagendamento_proposto") && (
  (() => {
    const statusPre = getStatusVistoria(reservaDetalhe.dataInicio, "pre", !!reservaDetalhe.auditoriaPre);
    const podeFazerPre = statusPre.podeFazer;
    
    return (
      <button
        onClick={() => {
          if (podeFazerPre || reservaDetalhe.auditoriaPre) {
            setTipoAuditoria("pre");
            setReservaAuditoria(reservaDetalhe);
            setAuditoriaAberta(true);
          } else {
            toast.error(statusPre.texto);
          }
        }}
        disabled={!podeFazerPre && !reservaDetalhe.auditoriaPre}
        className={`w-full text-sm py-2 rounded-xl font-semibold transition flex items-center justify-center gap-2
          ${reservaDetalhe.auditoriaPre 
            ? "bg-green-100 text-green-700 hover:bg-green-200" 
            : podeFazerPre 
              ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" 
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
      >
        <ListChecks size={14} />
        {reservaDetalhe.auditoriaPre 
          ? "✓ Ver Pré-Vistoria" 
          : podeFazerPre 
            ? " Fazer Pré-Vistoria" 
            : ` ${statusPre.texto}`}
      </button>
    );
  })()
)}


              <button
                onClick={() => {
                  setReservaParaCancelar(reservaDetalhe);
                  setCancelamentoAberto(true);
                  setReservaDetalhe(null);
                }}
                className="w-full text-xs text-zinc-500 hover:text-red-600 transition"
              >
                Solicitar cancelamento
              </button>

              <button
                onClick={() => setReservaDetalhe(null)}
                className="w-full text-sm text-zinc-500 hover:text-black dark:hover:text-white transition pt-2"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DESBLOQUEIO - Responsivo */}
      {reservaParaDesbloquear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 shadow-xl overflow-hidden">
            <div className="px-4 md:px-6 py-4 border-b flex justify-between items-center">
              <h3 className="font-semibold">Remover bloqueio</h3>
              <button
                onClick={() => setReservaParaDesbloquear(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-4 md:px-6 py-5 space-y-4">
              <p className="text-sm">
                Deseja remover o bloqueio de{" "}
                <strong>
                  {reservaParaDesbloquear.espacoId === "ALL"
                    ? "todos os espaços"
                    : reservaParaDesbloquear.espacoNome}
                </strong>
                ?
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setReservaParaDesbloquear(null)}
                  className="flex-1 rounded-xl border py-2 text-sm"
                >
                  Cancelar
                </button>

                <button
                  onClick={() => {
                    desbloquearDia(reservaParaDesbloquear.id);
                    setReservaParaDesbloquear(null);
                  }}
                  className="flex-1 rounded-xl bg-red-600 text-white py-2 text-sm"
                >
                  Desbloquear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SOLICITAÇÃO DE CANCELAMENTO - Responsivo */}
      {cancelamentoAberto && reservaParaCancelar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* HEADER */}
            <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-base font-semibold">Solicitar cancelamento</h3>
              <button
                onClick={() => {
                  setCancelamentoAberto(false);
                  setMotivoCancelamento("");
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* BODY */}
            <div className="px-4 md:px-6 py-5 space-y-4 text-sm text-zinc-700 dark:text-gray-300">
              <div className="rounded-lg bg-zinc-50 dark:bg-gray-700 px-4 py-3">
                <p className="text-xs text-zinc-400 dark:text-gray-500">Reserva</p>
                <p className="font-medium truncate">{reservaParaCancelar.espacoNome}</p>
                <p className="text-xs text-zinc-500 truncate">{reservaParaCancelar.nomeCliente}</p>
              </div>

              <div>
                <label className="text-xs text-zinc-500">Motivo do cancelamento</label>
                <textarea
                  value={motivoCancelamento}
                  onChange={(e) => setMotivoCancelamento(e.target.value)}
                  rows={4}
                  placeholder="Descreva o motivo do cancelamento"
                  className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
                />
                <p className="text-[11px] text-zinc-400 dark:text-gray-500 mt-1">
                  Mínimo de 10 caracteres úteis
                </p>
              </div>

              <button
  onClick={solicitarCancelamento}
  disabled={motivoCancelamento.trim().length < 10}
  className={`w-full rounded-xl py-3 font-semibold transition text-sm
    ${motivoCancelamento.trim().length < 10
      ? "bg-zinc-200 text-zinc-400 dark:text-gray-500 cursor-not-allowed"
      : "bg-sky-500 text-white hover:bg-sky-600"
    }`}
>
  Enviar solicitação
</button>
            </div>
          </div>
        </div>
      )}

            {/* MODAL REAGENDAMENTO */}
      {reagendamentoAberto && reservaParaReagendar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-base font-semibold">Propor novo horário</h3>
              <button
                onClick={() => setReagendamentoAberto(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-4 md:px-6 py-5 space-y-4">
              <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3 text-sm text-blue-800 dark:text-blue-300">
                 Sugira uma nova data para o cliente. Ele poderá aceitar ou recusar a proposta.
              </div>

              <div className="rounded-lg bg-zinc-50 dark:bg-gray-700 p-3">
                <p className="text-xs text-zinc-400 dark:text-gray-500">Reserva atual</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{reservaParaReagendar.espacoNome}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatarData(reservaParaReagendar.dataInicio)}
                </p>
              </div>

              <div>
                <label className="text-xs text-zinc-500 dark:text-gray-400">Nova data (sugestão) *</label>
                <input
                  type="date"
                  min={hojeLocalString()}
                  value={novaDataReagendamento}
                  onChange={(e) => setNovaDataReagendamento(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-600 px-3 py-2 text-sm 
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <p className="text-[11px] text-zinc-400 dark:text-gray-500 mt-1">
                  Escolha uma data que você tem disponibilidade
                </p>
              </div>

              <div>
                <label className="text-xs text-zinc-500 dark:text-gray-400">Mensagem para o cliente (opcional)</label>
                <textarea
                  rows={3}
                  value={mensagemReagendamento}
                  onChange={(e) => setMensagemReagendamento(e.target.value)}
                  placeholder="Explique o motivo do reagendamento e peça desculpas pelo inconveniente..."
                  className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-600 px-3 py-2 text-sm 
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setReagendamentoAberto(false)}
                  className="flex-1 rounded-xl border border-gray-200 dark:border-gray-600 py-2 text-sm
                    text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={enviarPropostaReagendamento}
                  disabled={!novaDataReagendamento}
                  className={`flex-1 rounded-xl py-2 text-sm font-semibold transition
                    ${novaDataReagendamento
                      ? "bg-sky-500 text-white hover:bg-sky-600"
                      : "bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
                    }`}
                >
                  Enviar proposta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

{/* MODAL VER PROPOSTA */}
{verPropostaAberta && dadosProposta && reservaParaReagendar && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
    <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-base font-semibold">Proposta de Reagendamento</h3>
        <button
          onClick={() => {
            setVerPropostaAberta(false);
            setDadosProposta(null);
            setNovaDataReagendamento("");
            setMensagemReagendamento("");
          }}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
        >
          <X size={18} />
        </button>
      </div>

      <div className="px-4 md:px-6 py-5 space-y-4">
        <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            📅 <strong>Nova data sugerida:</strong><br />
            {dadosProposta.novaData}
          </p>
        </div>

        <div className="rounded-lg bg-zinc-50 dark:bg-gray-700 p-4">
          <p className="text-sm text-zinc-700 dark:text-gray-300">
            💬 <strong>Mensagem do cliente:</strong><br />
            {dadosProposta.mensagem}
          </p>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <label className="text-xs text-zinc-500 dark:text-gray-400">Editar nova data (opcional)</label>
          <input
            type="date"
            min={hojeLocalString()}
            value={novaDataReagendamento}
            onChange={(e) => setNovaDataReagendamento(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-600 px-3 py-2 text-sm 
              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div>
          <label className="text-xs text-zinc-500 dark:text-gray-400">Nova mensagem (opcional)</label>
          <textarea
            rows={3}
            value={mensagemReagendamento}
            onChange={(e) => setMensagemReagendamento(e.target.value)}
            placeholder="Escreva uma nova mensagem..."
            className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-600 px-3 py-2 text-sm 
              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
          />
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              if (novaDataReagendamento) {
                editarPropostaReagendamento(
                  reservaParaReagendar.id,
                  novaDataReagendamento,
                  mensagemReagendamento
                );
              } else {
                toast.error("Selecione uma nova data para editar");
              }
            }}
            disabled={!novaDataReagendamento}
            className={`w-full rounded-xl py-2 text-sm font-semibold transition
              ${novaDataReagendamento
                ? "bg-sky-500 text-white hover:bg-sky-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
             Editar proposta
          </button>

          <button
            onClick={() => cancelarPropostaReagendamento(dadosProposta.reporteId, reservaParaReagendar.id)}
            className="w-full rounded-xl border border-red-500 py-2 text-sm text-red-600 hover:bg-red-50 transition"
          >
             Cancelar proposta
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      {/* MODAL DE AUDITORIA */}
{auditoriaAberta && reservaAuditoria && (
  <AuditoriaModal
    reserva={reservaAuditoria}
    hoje={new Date()}
    tipo={tipoAuditoria}
    auditoriaPre={reservaAuditoria.auditoriaPre}
    onClose={() => {
      setAuditoriaAberta(false);
      setReservaAuditoria(null);
    }}
    onSalvar={async (auditoria: Auditoria) => {
      try {
        // Buscar o espaco_id correto da reserva
        let espacoIdCorreto = reservaAuditoria.espacoId;
        
        // 🔥 SE FOR "ALL" OU INVÁLIDO, BUSCAR O ESPAÇO CORRETO NO BANCO
        if (espacoIdCorreto === "ALL" || !espacoIdCorreto || espacoIdCorreto === "ALL") {
          console.log("⚠️ espacoId é 'ALL', buscando espaço real no banco...");
          
          const { data: reservaCompleta, error: buscaError } = await supabase
            .from("reservas")
            .select("espaco_id")
            .eq("id", reservaAuditoria.id)
            .single();
          
          if (buscaError) {
            console.error("❌ Erro ao buscar reserva:", buscaError);
            toast.error("Erro ao buscar dados da reserva");
            return;
          }
          
          if (reservaCompleta) {
            espacoIdCorreto = reservaCompleta.espaco_id;
            console.log("✅ Espaço corrigido para:", espacoIdCorreto);
          }
        }
        
        console.log("🔍 Verificando IDs:", {
          reserva_id: reservaAuditoria.id,
          espacoIdCorreto: espacoIdCorreto,
          tipo: tipoAuditoria
        });
        
        // 🔥 VALIDAÇÃO: Verificar se o espaco_id é válido (UUID)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!espacoIdCorreto || !uuidRegex.test(espacoIdCorreto)) {
          console.error("❌ ESPAÇO ID INVÁLIDO:", espacoIdCorreto);
          toast.error("ID do espaço inválido. Não é possível salvar a vistoria.");
          return;
        }
        
        // Processar fotos e fazer upload
        const auditoriaComFotos = await processarFotosAuditoria(auditoria, tipoAuditoria, reservaAuditoria.id);
        
        // Verificar se já existe vistoria para esta reserva e tipo
        const { data: vistoriaExistente, error: buscaVistoriaError } = await supabase
          .from("vistorias")
          .select("id")
          .eq("reserva_id", reservaAuditoria.id)
          .eq("tipo", tipoAuditoria)
          .maybeSingle();
        
        if (buscaVistoriaError) {
          console.error("❌ Erro ao buscar vistoria existente:", buscaVistoriaError);
        }
        
        let error;
        
        if (vistoriaExistente) {
          // UPDATE - já existe, atualiza
          console.log("📝 Atualizando vistoria existente:", vistoriaExistente.id);
          const { error: updateError } = await supabase
            .from("vistorias")
            .update({
              dados: auditoriaComFotos,
              updated_at: new Date().toISOString()
            })
            .eq("id", vistoriaExistente.id);
          error = updateError;
          
          if (updateError) {
            console.error("❌ Erro no UPDATE:", updateError);
          }
        } else {
          // INSERT - não existe, cria nova
          console.log("➕ Criando nova vistoria");
          
          const dadosInsert = {
            reserva_id: reservaAuditoria.id,
            espaco_id: espacoIdCorreto,
            tipo: tipoAuditoria,
            dados: auditoriaComFotos,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          console.log("📦 Dados para inserir:", dadosInsert);
          
          const { error: insertError } = await supabase
            .from("vistorias")
            .insert(dadosInsert);
          
          if (insertError) {
            console.error("❌ Erro no INSERT:", insertError);
            console.error("❌ Mensagem:", insertError.message);
            console.error("❌ Código:", insertError.code);
          }
          
          error = insertError;
        }
        
        if (error) {
          console.error("❌ Erro ao salvar:", error);
          toast.error("Erro ao salvar vistoria: " + (error.message || "Tente novamente"));
          return;
        }
        
        // ATUALIZAR ESTADO LOCAL
        setReservas((prev) =>
          prev.map((r) => {
            if (r.id !== reservaAuditoria.id) return r;
            return tipoAuditoria === "pre"
              ? { ...r, auditoriaPre: auditoriaComFotos }
              : { ...r, auditoriaPos: auditoriaComFotos };
          })
        );
        
        // Recarregar reservas para garantir consistência
        await buscarReservasReais();
        
        toast.success(`Vistoria ${tipoAuditoria === "pre" ? "pré" : "pós"}-evento salva!`);
        setAuditoriaAberta(false);
        setReservaAuditoria(null);
      } catch (error) {
        console.error("❌ Erro ao salvar vistoria:", error);
        toast.error("Erro ao salvar vistoria");
      }
    }}
  />
)}
    </div>
  );
}