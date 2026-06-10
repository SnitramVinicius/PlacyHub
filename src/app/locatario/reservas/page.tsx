"use client";

import { useState, useEffect } from "react";
import { CalendarDays, Clock, MapPin, Star, XCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import AvaliacaoModal from "@/components/AvaliacaoModal";
import { toast } from "sonner";

interface Reserva {
  id: string;
  espaco_id: string;
  espaco_nome: string;
  espaco_imagem: string;
  data_inicio: string;
  data_fim: string;
  local: string;
  valor_total: number;
  status: "confirmada" | "pendente" | "cancelada" | "finalizada" | "reagendamento_proposto";
  qtd_pessoas: number;
  created_at: string;
  avaliada?: boolean;
  remarcacao_solicitada?: boolean;
  remarcacao_nova_data?: string;
  remarcacao_status?: string;
  avaliacao_pulada?: boolean;
}

export default function ReservasPage() {
  const { user } = useAuth();
  const [reportarAberto, setReportarAberto] = useState(false);
  const [reservaSelecionadaReport, setReservaSelecionadaReport] = useState<Reserva | null>(null);
  const [descricaoProblema, setDescricaoProblema] = useState("");
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [avaliacaoAberta, setAvaliacaoAberta] = useState(false);
  const [reservaSelecionada, setReservaSelecionada] = useState<Reserva | null>(null);
  const [cancelamentoAberto, setCancelamentoAberto] = useState(false);
const [reservaParaCancelar, setReservaParaCancelar] = useState<Reserva | null>(null);
const [motivoCancelamento, setMotivoCancelamento] = useState("");
const [tipoProblema, setTipoProblema] = useState("Problema com o espaço");
const [enviandoReporte, setEnviandoReporte] = useState(false);
// Estados para remarcação
const [remarcacaoAberto, setRemarcacaoAberto] = useState(false);
const [reservaParaRemarcar, setReservaParaRemarcar] = useState<Reserva | null>(null);
const [novaData, setNovaData] = useState("");
const [remarcando, setRemarcando] = useState(false);
const [verPropostaAberto, setVerPropostaAberto] = useState(false);
const [propostaSelecionada, setPropostaSelecionada] = useState<Reserva | null>(null);
const [dadosProposta, setDadosProposta] = useState<{ novaData: string; mensagem: string; reporteId: string } | null>(null);

  // Buscar reservas do Supabase
  useEffect(() => {
    async function carregarReservas() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        // Buscar reservas do usuário logado
        // Buscar reservas do usuário logado
const { data: reservasData, error: reservasError } = await supabase
  .from("reservas")
  .select(`
    id,
    espaco_id,
    data_inicio,
    data_fim,
    status,
    qtd_pessoas,
    valor_total,
    created_at,
    remarcacao_solicitada,
    remarcacao_nova_data,
    remarcacao_status,
    remarcacao_solicitada_em
  `)
  .eq("user_id", user.id)
  .order("created_at", { ascending: false });

        if (reservasError) {
          console.error("Erro ao buscar reservas:", reservasError);
          setReservas([]);
          setLoading(false);
          return;
        }

        if (!reservasData || reservasData.length === 0) {
          setReservas([]);
          setLoading(false);
          return;
        }

// Dentro da função carregarReservas, após buscar as reservas
// Buscar avaliações já feitas pelo usuário
const { data: avaliacoesFeitas } = await supabase
  .from("avaliacoes")
  .select("reserva_id")
  .eq("user_id", user.id);

// Criar um Set com os IDs das reservas já avaliadas
const reservasAvaliadas = new Set();
if (avaliacoesFeitas) {
  avaliacoesFeitas.forEach((av: any) => {
    reservasAvaliadas.add(av.reserva_id);
  });
}

        // Buscar dados dos espaços
        const espacoIds = reservasData.map((r) => r.espaco_id);
        const { data: espacosData, error: espacosError } = await supabase
          .from("spaces")
          .select("id, nome_espaco, cidade, bairro, imagens")
          .in("id", espacoIds);

        if (espacosError) {
          console.error("Erro ao buscar espaços:", espacosError);
          setReservas([]);
          setLoading(false);
          return;
        }

        // Criar mapa de espaços
        const espacoMap = new Map();
        espacosData?.forEach((espaco) => {
          espacoMap.set(espaco.id, espaco);
        });

        // Converter para o formato da interface
        const hoje = new Date();
        const reservasConvertidas: Reserva[] = reservasData.map((reserva) => {
          const espaco = espacoMap.get(reserva.espaco_id);
          const dataEvento = new Date(reserva.data_inicio);
            const jaAvaliada = reservasAvaliadas.has(reserva.id);
          
          // Determinar status (se já passou da data, pode ser finalizada)
          let statusFinal = reserva.status;
          if (reserva.status === "confirmada" && dataEvento < hoje) {
            statusFinal = "finalizada";
          }

         return {
  id: reserva.id,
  espaco_id: reserva.espaco_id,
  espaco_nome: espaco?.nome_espaco || "Espaço não encontrado",
  espaco_imagem: espaco?.imagens?.[0] || "/placeholder.jpg",
  data_inicio: reserva.data_inicio,
  data_fim: reserva.data_fim,
  local: `${espaco?.cidade || ""}, ${espaco?.bairro || ""}`,
  valor_total: reserva.valor_total,
  status: statusFinal as any,
  qtd_pessoas: reserva.qtd_pessoas,
  created_at: reserva.created_at,
  remarcacao_solicitada: reserva.remarcacao_solicitada || false,
  remarcacao_nova_data: reserva.remarcacao_nova_data,
  remarcacao_status: reserva.remarcacao_status || "",
  avaliada: jaAvaliada,
};
        });

        setReservas(reservasConvertidas);
      } catch (err) {
        console.error("Erro:", err);
        setReservas([]);
      } finally {
        setLoading(false);
      }
    }

    carregarReservas();
  }, [user]);

 // Abrir modal de cancelamento
function abrirModalCancelamento(reserva: Reserva) {
  setReservaParaCancelar(reserva);
  setMotivoCancelamento("");
  setCancelamentoAberto(true);
}

// Confirmar cancelamento
async function confirmarCancelamento() {
  if (!reservaParaCancelar) return;

  if (motivoCancelamento.trim().length < 10) {
    toast.error("Por favor, descreva o motivo do cancelamento (mínimo 10 caracteres)");
    return;
  }

  try {
    // Buscar dados da reserva para pegar o anfitrião
    const { data: reserva, error: reservaError } = await supabase
      .from("reservas")
      .select("user_id, espaco_id")
      .eq("id", reservaParaCancelar.id)
      .single();

    if (reservaError) {
      console.error("Erro ao buscar reserva:", reservaError);
    }

    // Buscar o anfitrião (dono do espaço)
    const { data: espaco, error: espacoError } = await supabase
      .from("spaces")
      .select("user_id, nome_espaco")
      .eq("id", reservaParaCancelar.espaco_id)
      .single();

    // Atualizar status da reserva para cancelada
    const { error } = await supabase
      .from("reservas")
      .update({ 
        status: "cancelada",
        motivo_cancelamento: motivoCancelamento.trim(),
        cancelado_em: new Date().toISOString()
      })
      .eq("id", reservaParaCancelar.id);

    if (error) {
      console.error("Erro ao cancelar reserva:", error);
      toast.error("Erro ao cancelar reserva");
      return;
    }

    // 🔥 NOTIFICAR O ANFITRIÃO SOBRE O CANCELAMENTO 🔥
    if (espaco && !espacoError) {
      const { error: notifError } = await supabase.from("notificacoes").insert({
        usuario_id: espaco.user_id,  // ID do anfitrião
        tipo: "reserva",
        titulo: "❌ Reserva cancelada pelo cliente",
        mensagem: `O cliente cancelou a reserva do espaço "${espaco.nome_espaco}" para o dia ${formatarData(reservaParaCancelar.data_inicio)}. Motivo: ${motivoCancelamento.trim()}`,
        link: `/anfitriao/reservas`,
        lida: false,
        created_at: new Date().toISOString(),
      });
      
      if (notifError) {
        console.error("Erro ao enviar notificação:", notifError);
      } else {
        console.log("✅ Notificação enviada para o anfitrião (cancelamento)");
      }
    }

    // Atualizar lista local
    setReservas((prev) =>
      prev.map((r) =>
        r.id === reservaParaCancelar.id 
          ? { ...r, status: "cancelada" } 
          : r
      )
    );

    toast.success("Reserva cancelada com sucesso! O anfitrião foi notificado.");
    setCancelamentoAberto(false);
    setReservaParaCancelar(null);
    setMotivoCancelamento("");

  } catch (err) {
    console.error("Erro:", err);
    toast.error("Erro ao cancelar reserva");
  }
}

// Função para abrir modal de avaliação
function handleAvaliar(reserva: Reserva) {
  setReservaSelecionada(reserva);
  setAvaliacaoAberta(true);
}

// Função para enviar avaliação
async function enviarAvaliacao(nota: number, comentario?: string) {
  if (!reservaSelecionada || !user?.id) return;

    console.log("📝 Dados para enviar:", {
    reserva_id: reservaSelecionada.id,
    user_id: user.id,
    espaco_id: reservaSelecionada.espaco_id,
    nota: nota,
    comentario: comentario,
  });

  try {
    // 1. Salvar avaliação no banco
    const { error: insertError } = await supabase
      .from("avaliacoes")
      .insert({
        reserva_id: reservaSelecionada.id,
        user_id: user.id,
        espaco_id: reservaSelecionada.espaco_id,
        nota: nota,
        comentario: comentario || null,
        created_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error("Erro ao salvar avaliação:", insertError);
      toast.error("Erro ao enviar avaliação");
      return;
    }

    // 2. Atualizar lista local (opcional, para feedback visual)
    setReservas(prev =>
      prev.map(r =>
        r.id === reservaSelecionada.id ? { ...r, avaliada: true } : r
      )
    );

    toast.success("Avaliação enviada", {
      description: "Obrigado por compartilhar sua experiência",
    });
  } catch (err) {
    console.error("Erro:", err);
    toast.error("Erro ao enviar avaliação");
  } finally {
    setAvaliacaoAberta(false);
    setReservaSelecionada(null);
  }
}

function abrirReportar(reserva: Reserva) {
  setReservaSelecionadaReport(reserva);
  setDescricaoProblema("");
  setTipoProblema("Problema com o espaço");
  setReportarAberto(true);
}

// Função para enviar o reporte
async function enviarReporte() {
  if (!reservaSelecionadaReport) return;

  if (descricaoProblema.trim().length < 10) {
    toast.error("Descreva o problema com pelo menos 10 caracteres");
    return;
  }

  setEnviandoReporte(true);

  try {
    const { error } = await supabase
      .from("reportes")
      .insert({
        reserva_id: reservaSelecionadaReport.id,
        user_id: user?.id,
        tipo: tipoProblema,
        descricao: descricaoProblema.trim(),
        status: "pendente",
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error("Erro ao enviar reporte:", error);
      toast.error("Erro ao enviar reporte. Tente novamente.");
      return;
    }

    toast.success("Reporte enviado com sucesso!", {
      description: "Nossa equipe analisará sua solicitação em até 48h",
    });

    setReportarAberto(false);
    setReservaSelecionadaReport(null);
    setDescricaoProblema("");
  } catch (err) {
    console.error("Erro:", err);
    toast.error("Erro ao enviar reporte");
  } finally {
    setEnviandoReporte(false);
  }
}

function abrirModalRemarcacao(reserva: Reserva) {
  setReservaParaRemarcar(reserva);
  setNovaData("");
  setRemarcacaoAberto(true);
}

async function solicitarRemarcacao() {
  if (!reservaParaRemarcar) return;
  
  if (!novaData) {
    toast.error("Selecione uma nova data");
    return;
  }
  
  const podeRemarcar = verificarRemarcacao(reservaParaRemarcar.data_inicio);
  
  if (!podeRemarcar.pode) {
    toast.error(podeRemarcar.msg);
    return;
  }
  
  setRemarcando(true);
  
  try {
    // Salvar solicitação de remarcação
    const { error } = await supabase
      .from("reservas")
      .update({
        remarcacao_solicitada: true,
        remarcacao_nova_data: novaData,
        remarcacao_status: "pendente",
        remarcacao_solicitada_em: new Date().toISOString(),
      })
      .eq("id", reservaParaRemarcar.id);
    
    if (error) {
      console.error("Erro ao solicitar remarcação:", error);
      toast.error("Erro ao solicitar remarcação");
      return;
    }
    
    // 🔥 ADICIONAR NOTIFICAÇÃO PARA O ANFITRIÃO 🔥
    try {
      // Buscar o anfitrião do espaço
      const { data: espaco, error: espacoError } = await supabase
        .from("spaces")
        .select("user_id, nome_espaco")
        .eq("id", reservaParaRemarcar.espaco_id)
        .single();
      
      if (!espacoError && espaco) {
        await supabase.from("notificacoes").insert({
          usuario_id: espaco.user_id,
          tipo: "reserva",
          titulo: "📅 Solicitação de remarcação pendente",
          mensagem: `O cliente solicitou a remarcação da reserva do espaço "${espaco.nome_espaco}" do dia ${formatarData(reservaParaRemarcar.data_inicio)} para ${formatarData(novaData)}.`,
          link: `/anfitriao/reservas/${reservaParaRemarcar.id}`,
          created_at: new Date().toISOString(),
        });
        console.log("✅ Notificação enviada para o anfitrião");
      }
    } catch (notifError) {
      console.error("Erro ao criar notificação:", notifError);
      // Não interrompe o fluxo principal
    }
    
    // Atualizar lista local
    setReservas((prev) =>
      prev.map((r) =>
        r.id === reservaParaRemarcar.id 
          ? { 
              ...r, 
              remarcacao_solicitada: true,
              remarcacao_nova_data: novaData,
              remarcacao_status: "pendente",
            } 
          : r
      )
    );
    
    toast.success("Solicitação de remarcação enviada! O anfitrião irá analisar.");
    
    setRemarcacaoAberto(false);
    setReservaParaRemarcar(null);
    setNovaData("");
    
  } catch (err) {
    console.error("Erro:", err);
    toast.error("Erro ao solicitar remarcação");
  } finally {
    setRemarcando(false);
  }
}

// Função para abrir modal e buscar proposta
const abrirModalVerProposta = async (reserva: Reserva) => {
  setPropostaSelecionada(reserva);
  
  try {
    const { data, error } = await supabase
      .from("reportes")
      .select("id, descricao, created_at")
      .eq("reserva_id", reserva.id)
      .eq("tipo", "Proposta de reagendamento")
      .eq("status", "pendente")
      .order("created_at", { ascending: false })
      .limit(1);
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      const reporte = data[0];
      
      // 🔥 CORREÇÃO: Extrair data de forma mais robusta
      let novaDataExtraida = "";
      const dataMatch = reporte.descricao.match(/Nova data sugerida: (.*?)(\n|$)/);
      
      if (dataMatch) {
        novaDataExtraida = dataMatch[1].trim();
      }
      
      const mensagemMatch = reporte.descricao.match(/Mensagem: ([\s\S]*?)$/);
      
      setDadosProposta({
        novaData: novaDataExtraida,
        mensagem: mensagemMatch ? mensagemMatch[1].trim() : "Sem mensagem adicional",
        reporteId: reporte.id
      });
    }
    
    setVerPropostaAberto(true);
  } catch (error) {
    console.error("Erro ao buscar proposta:", error);
    toast.error("Erro ao carregar proposta");
  }
};
// Função para aceitar proposta
const aceitarProposta = async (reservaId: string, novaData: string, reporteId: string) => {
  console.log("🔍 Dados recebidos:", { reservaId, novaData, reporteId });
  
  try {
    // Buscar dados da reserva e do espaço separadamente
    const { data: reserva, error: reservaError } = await supabase
      .from("reservas")
      .select("user_id, espaco_id")
      .eq("id", reservaId)
      .single();

    if (reservaError) {
      console.error("Erro ao buscar reserva:", reservaError);
      toast.error("Erro ao buscar dados da reserva");
      return;
    }

    console.log("📋 Reserva encontrada:", reserva);

    // Converter a data para o formato correto YYYY-MM-DD
    let dataFormatada = novaData;
    
    // Se a data está no formato "30/06/2026"
    if (novaData.includes("/")) {
      const partes = novaData.split("/");
      if (partes.length === 3) {
        dataFormatada = `${partes[2]}-${partes[1]}-${partes[0]}`;
      }
    }
    
    // Se a data está em texto "30 de junho de 2026"
    const matchExtenso = novaData.match(/(\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})/i);
    if (matchExtenso) {
      const dia = matchExtenso[1].padStart(2, '0');
      const mesNome = matchExtenso[2].toLowerCase();
      const meses: { [key: string]: string } = {
        "janeiro": "01", "fevereiro": "02", "março": "03", "abril": "04",
        "maio": "05", "junho": "06", "julho": "07", "agosto": "08",
        "setembro": "09", "outubro": "10", "novembro": "11", "dezembro": "12"
      };
      const mes = meses[mesNome] || "01";
      const ano = matchExtenso[3];
      dataFormatada = `${ano}-${mes}-${dia}`;
    }

    console.log("📅 Data formatada para o banco:", dataFormatada);

    // Atualizar a reserva
    const { error: updateError } = await supabase
      .from("reservas")
      .update({
        data_inicio: dataFormatada,
        data_fim: dataFormatada,
        status: "confirmada",
        remarcacao_status: "aprovada",
        remarcacao_solicitada: false,
        remarcacao_nova_data: null,
      })
      .eq("id", reservaId);
    
    if (updateError) {
      console.error("Erro ao atualizar reserva:", updateError);
      console.error("Detalhes do erro:", JSON.stringify(updateError, null, 2));
      toast.error(`Erro: ${updateError.message || "Erro ao atualizar reserva"}`);
      return;
    }
    
    console.log("✅ Reserva atualizada com sucesso!");
    
    // Atualizar o reporte
    const { error: reporteError } = await supabase
      .from("reportes")
      .update({ status: "aceito" })
      .eq("id", reporteId);

    if (reporteError) {
      console.error("Erro ao atualizar reporte:", reporteError);
    }
    
    // Buscar o anfitrião
    const { data: espaco, error: espacoError } = await supabase
      .from("spaces")
      .select("user_id, nome_espaco")
      .eq("id", reserva.espaco_id)
      .single();

    if (espacoError) {
      console.error("Erro ao buscar espaço:", espacoError);
    }
    
    // 🔥 NOTIFICAR O ANFITRIÃO
    if (espaco) {
      await supabase.from("notificacoes").insert({
        usuario_id: espaco.user_id,
        tipo: "reserva",
        titulo: "✅ Cliente aceitou a proposta!",
        mensagem: `O cliente aceitou sua proposta de reagendamento. Nova data: ${formatarData(novaData)}`,
        link: `/anfitriao/reservas`,
        lida: false,
        created_at: new Date().toISOString(),
      });
      console.log("✅ Notificação enviada para o anfitrião");
    }
    
    toast.success("Proposta aceita! Data atualizada com sucesso.");
    setVerPropostaAberto(false);
    window.location.reload();
    
  } catch (error) {
    console.error("Erro ao aceitar proposta:", error);
    toast.error("Erro ao aceitar proposta");
  }
};

// Função para recusar proposta
const recusarProposta = async (reservaId: string, reporteId: string) => {
  try {
    // Buscar dados da reserva para pegar o user_id do anfitrião e o nome do espaço
    const { data: reserva, error: fetchError } = await supabase
      .from("reservas")
      .select(`
        user_id,
        espaco_id,
        spaces (user_id, nome_espaco)
      `)
      .eq("id", reservaId)
      .single();

    if (fetchError) {
      console.error("Erro ao buscar reserva:", fetchError);
    }

    const { error: updateError } = await supabase
      .from("reservas")
      .update({
        status: "confirmada",
        remarcacao_solicitada: false,
        remarcacao_nova_data: null,
        remarcacao_status: "recusada",
      })
      .eq("id", reservaId);
    
    if (updateError) throw updateError;
    
    await supabase
      .from("reportes")
      .update({ status: "recusado" })
      .eq("id", reporteId);

    // 🔥 NOTIFICAR O ANFITRIÃO QUE A PROPOSTA FOI RECUSADA 🔥
    if (reserva) {
      // Buscar o anfitrião (user_id do espaço)
      const { data: espaco } = await supabase
        .from("spaces")
        .select("user_id, nome_espaco")
        .eq("id", reserva.espaco_id)
        .single();

      if (espaco) {
        await supabase.from("notificacoes").insert({
          usuario_id: espaco.user_id,  // ID do anfitrião
          tipo: "reserva",
          titulo: "❌ Proposta de reagendamento recusada",
          mensagem: `O cliente recusou sua proposta de reagendamento para o espaço "${espaco.nome_espaco}". A data original permanece confirmada.`,
          link: `/anfitriao/reservas`,  // ou a rota correta do anfitrião
          lida: false,
          created_at: new Date().toISOString(),
        });
        console.log("✅ Notificação enviada para o anfitrião (proposta recusada)");
      }
    }
    
    toast.success("Proposta recusada. Data original mantida.");
    setVerPropostaAberto(false);
    window.location.reload();
    
  } catch (error) {
    console.error("Erro ao recusar proposta:", error);
    toast.error("Erro ao recusar proposta");
  }
};

  const getStatusColor = (status: string) => {
    switch(status) {
      case "confirmada": return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30";
      case "pendente": return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30";
      case "cancelada": return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30";
      case "finalizada": return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700";
      default: return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700";
    }
  };

  const getStatusTexto = (status: string) => {
  switch(status) {
    case "confirmada": return "Confirmada";
    case "pendente": return "Pendente";
    case "cancelada": return "Cancelada";
    case "finalizada": return "Finalizada";
    case "reagendamento_proposto": return "Proposta de reagendamento";  // 🔥 ADICIONAR
    default: return status;
  }
};

const formatarData = (data: string) => {
  if (!data) return "Data não informada";
  
  try {
    // Se a data já está no formato brasileiro "30/06/2026"
    if (data.includes("/")) {
      const partes = data.split("/");
      if (partes.length === 3) {
        return `${partes[0].padStart(2, '0')}/${partes[1].padStart(2, '0')}/${partes[2]}`;
      }
    }
    
    // Se for uma string ISO "2026-06-30" ou "2026-06-30T00:00:00Z"
    if (data.match(/^\d{4}-\d{2}-\d{2}/)) {
      const [ano, mes, dia] = data.split("T")[0].split("-");
      return `${dia}/${mes}/${ano}`;
    }
    
    // Se for um texto como "30 de junho de 2026" - extrair apenas a data
    const matchExtenso = data.match(/(\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})/i);
    if (matchExtenso) {
      const dia = matchExtenso[1].padStart(2, '0');
      const mesNome = matchExtenso[2].toLowerCase();
      const meses: { [key: string]: string } = {
        "janeiro": "01", "fevereiro": "02", "março": "03", "abril": "04",
        "maio": "05", "junho": "06", "julho": "07", "agosto": "08",
        "setembro": "09", "outubro": "10", "novembro": "11", "dezembro": "12"
      };
      const mes = meses[mesNome] || "01";
      const ano = matchExtenso[3];
      return `${dia}/${mes}/${ano}`;
    }
    
    // Última tentativa: criar objeto Date
    const dataObj = new Date(data);
    if (!isNaN(dataObj.getTime())) {
      const dia = dataObj.getDate().toString().padStart(2, '0');
      const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0');
      const ano = dataObj.getFullYear();
      return `${dia}/${mes}/${ano}`;
    }
    
    return data;
  } catch (error) {
    console.error("Erro ao formatar data:", data, error);
    return data;
  }
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Carregando reservas...</p>
        </div>
      </div>
    );
  }

const verificarCancelamento = (dataEvento: string, dataCriacao: string) => {
  const hoje = new Date();
  const evento = new Date(dataEvento);
  const criacao = new Date(dataCriacao);
  
  // Resetar horas para comparar apenas as datas
  hoje.setHours(0, 0, 0, 0);
  evento.setHours(0, 0, 0, 0);
  criacao.setHours(0, 0, 0, 0);
  
  // Calcular dias para o evento
  const diasParaEvento = Math.ceil((evento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calcular horas desde a criação (em dias)
  const horasDesdeCriacao = (hoje.getTime() - criacao.getTime()) / (1000 * 60 * 60);
  const diasDesdeCriacao = horasDesdeCriacao / 24;
  
  // 🔥 REGRA 1 (PRIORIDADE MÁXIMA): Cancelamento em até 48h após a reserva (100%)
  if (diasDesdeCriacao <= 2) {
    return { 
      pode: true, 
      reembolso: 100, 
      msg: "✅ Cancelamento dentro de 48h após a reserva - reembolso integral de 100%" 
    };
  }
  
  // 🔥 REGRA 2: Cancelamento com 7 a 2 dias antes do evento (50%)
  if (diasParaEvento >= 2 && diasParaEvento <= 7) {
    return { 
      pode: true, 
      reembolso: 50, 
      msg: "⚠️ Cancelamento permitido - reembolso de 50%" 
    };
  }
  
  // 🔥 REGRA 3: Cancelamento com menos de 2 dias (0% - mas pode cancelar)
  if (diasParaEvento >= 0 && diasParaEvento < 2) {
    return { 
      pode: true,   // ← PERMITE cancelar, mas sem reembolso
      reembolso: 0, 
      msg: "❌ Cancelamento permitido, mas NÃO HAVERÁ REEMBOLSO (faltam menos de 2 dias)" 
    };
  }
  
  // REGRA 4: Evento já passou
  if (diasParaEvento < 0) {
    return { 
      pode: false, 
      reembolso: 0, 
      msg: "❌ Evento já ocorreu - não é possível cancelar" 
    };
  }
  
  // REGRA 5: Outros casos (mais de 7 dias E passou das 48h)
  return { 
    pode: true, 
    reembolso: 50, 
    msg: "⚠️ Cancelamento permitido - reembolso de 50%" 
  };
};

const verificarRemarcacao = (dataEvento: string) => {
  const hoje = new Date();
  const evento = new Date(dataEvento);
  
  hoje.setHours(0, 0, 0, 0);
  evento.setHours(0, 0, 0, 0);
  
  const diasParaEvento = Math.ceil((evento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
  
  // Só permite solicitar remarcação se o evento ainda não aconteceu
  if (diasParaEvento >= 0) {
    return { pode: true, msg: "✅ Solicitar remarcação" };
  }
  
  return { pode: false, msg: "❌ Evento já ocorreu" };
};

  return (
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Minhas Reservas</h1>

      {reservas.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Você ainda não fez nenhuma reserva.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {reservas.map((reserva) => (
            <div
              key={reserva.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-md transition overflow-hidden flex flex-col"
            >
              {/* Imagem */}
              <div className="relative h-40 sm:h-48">
                <img
                  src={reserva.espaco_imagem}
                  alt={reserva.espaco_nome}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 sm:hidden">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(reserva.status)}`}>
                    {getStatusTexto(reserva.status)}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col">
                {/* Título e status desktop */}
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-base md:text-lg font-semibold text-gray-800 dark:text-gray-100 line-clamp-2">
                    {reserva.espaco_nome}
                  </h2>
                  <span className={`hidden sm:inline-block text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${getStatusColor(reserva.status)}`}>
                    {getStatusTexto(reserva.status)}
                  </span>
                </div>

                {/* Informações */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-500 dark:text-gray-400 gap-2">
                    <CalendarDays size={16} className="flex-shrink-0" />
                    <span className="truncate">
                      {formatarData(reserva.data_inicio)}
                      {reserva.data_fim && reserva.data_fim !== reserva.data_inicio && 
                        ` até ${formatarData(reserva.data_fim)}`}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-500 dark:text-gray-400 gap-2">
                    <MapPin size={16} className="flex-shrink-0" />
                    <span className="truncate">{reserva.local}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-500 dark:text-gray-400 gap-2">
                    <span className="font-medium">👥</span>
                    <span>{reserva.qtd_pessoas} pessoas</span>
                  </div>
                </div>

                {/* Valor */}
                <div className="mt-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Valor:{" "}
                    <span className="font-semibold text-sky-600 dark:text-sky-400">
                      R$ {reserva.valor_total.toFixed(2)}
                    </span>
                  </p>
                </div>
{/* Ações */}
<div className="flex flex-col sm:flex-row gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
  
{/* 🔥 Botão Ver proposta (quando anfitrião propôs reagendamento) */}
  {reserva.status === "reagendamento_proposto" && (
    <button
      onClick={() => abrirModalVerProposta(reserva)}
      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold 
        bg-yellow-100 hover:bg-yellow-200 text-yellow-700 
        dark:bg-yellow-900/30 dark:hover:bg-yellow-900/50 dark:text-yellow-400"
    >
      <CalendarDays size={16} />
      Ver proposta
    </button>
  )}
  
{/* 🔥 Botão Remarcar (só para reservas confirmadas e sem solicitação pendente) */}
{reserva.status === "confirmada" && !reserva.remarcacao_solicitada && (() => {
  const regraRemarcacao = verificarRemarcacao(reserva.data_inicio);
  
  return (
    <button
      onClick={() => abrirModalRemarcacao(reserva)}
      disabled={!regraRemarcacao.pode}
      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 sm:py-2 rounded-xl text-sm font-semibold transition
        ${regraRemarcacao.pode 
          ? "bg-blue-100 hover:bg-blue-200 text-blue-600 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-400"
          : "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
        }`}
    >
      <CalendarDays size={16} />
      <span>Remarcar</span>
    </button>
  );
})()}

{/* Mostrar status da solicitação de remarcação */}
{reserva.remarcacao_solicitada && reserva.remarcacao_status === "pendente" && (
  <div className="flex-1 text-center text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-2 rounded-xl">
     Solicitação de remarcação pendente
  </div>
)}

  {/* Botão Cancelar com regras */}
  {reserva.status !== "cancelada" && reserva.status !== "finalizada" && (() => {
    const regra = verificarCancelamento(reserva.data_inicio, reserva.created_at);
    
    return (
      <button
        onClick={() => abrirModalCancelamento(reserva)}
        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 sm:py-2 rounded-xl text-sm font-semibold transition
          ${regra.pode 
            ? "bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400"
            : "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
          }`}
        disabled={!regra.pode}
      >
        <XCircle size={16} />
        <span>Cancelar</span>
      </button>
    );
  })()}

  {/* Botão Avaliar */}
  {reserva.status === "finalizada" && !reserva.avaliada && (
    <button
      onClick={() => handleAvaliar(reserva)}
      className="flex-1 flex items-center justify-center gap-2 
        bg-yellow-100 hover:bg-yellow-200 text-yellow-700 
        dark:bg-yellow-900/30 dark:hover:bg-yellow-900/50 dark:text-yellow-400
        px-3 py-2.5 sm:py-2 rounded-xl text-sm font-semibold transition"
    >
      <Star size={16} />
      <span>Avaliar</span>
    </button>
  )}

  {/* Botão Reportar */}
  <button
    onClick={() => abrirReportar(reserva)}
    className="flex-1 flex items-center justify-center gap-2 
      bg-red-100 hover:bg-red-200 text-red-600 
      dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400
      px-3 py-2.5 sm:py-2 rounded-xl text-sm font-semibold transition"
  >
    <AlertCircle size={16} />
    <span>Reportar</span>
  </button>
</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Avaliação */}
     <AvaliacaoModal
  isOpen={avaliacaoAberta}
  nomeEspaco={reservaSelecionada?.espaco_nome || ""}
  onClose={() => {
    setAvaliacaoAberta(false);
    setReservaSelecionada(null);
  }}
  onSubmit={enviarAvaliacao}  // 🔥 Usa a nova função
/>

   {/* Modal de Reportar Problema */}
{reportarAberto && reservaSelecionadaReport && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 md:p-6 w-full max-w-md text-gray-900 dark:text-gray-100 max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Reportar problema</h2>
        <button
          onClick={() => setReportarAberto(false)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
        >
          ✕
        </button>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl mb-4">
        <p className="text-sm font-medium mb-1">{reservaSelecionadaReport.espaco_nome}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {formatarData(reservaSelecionadaReport.data_inicio)} • {reservaSelecionadaReport.qtd_pessoas} pessoas
        </p>
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium mb-1 block">Tipo do problema</label>
        <select 
          value={tipoProblema}
          onChange={(e) => setTipoProblema(e.target.value)}
          className="w-full p-3 rounded-xl border text-sm bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-sky-500 outline-none"
        >
          <option>Problema com o espaço</option>
          <option>Problema com pagamento</option>
          <option>Problema com o anfitrião</option>
          <option>Outro</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium mb-1 block">Descrição do problema</label>
        <textarea
          className="w-full p-3 rounded-xl border resize-none bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-sky-500 outline-none"
          rows={4}
          placeholder="Descreva o problema detalhadamente (mínimo 10 caracteres)"
          value={descricaoProblema}
          onChange={(e) => setDescricaoProblema(e.target.value)}
        />
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          {descricaoProblema.length}/10 caracteres mínimos
        </p>
      </div>

      <button
        onClick={enviarReporte}
        disabled={descricaoProblema.trim().length < 10 || enviandoReporte}
        className={`w-full py-3 rounded-xl font-semibold transition ${
          descricaoProblema.trim().length < 10 || enviandoReporte
            ? "bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
            : "bg-sky-500 hover:bg-sky-600 text-white"
        }`}
      >
        {enviandoReporte ? "Enviando..." : "Enviar para suporte"}
      </button>

      <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-3">
        Nossa equipe analisará sua solicitação e entrará em contato
      </p>
    </div>
  </div>
)}
      {/* Modal de Cancelamento */}
{cancelamentoAberto && reservaParaCancelar && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 md:p-6 w-full max-w-md text-gray-900 dark:text-gray-100 max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Cancelar Reserva</h2>
        <button
          onClick={() => setCancelamentoAberto(false)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
        >
          ✕
        </button>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl mb-4">
  <p className="text-sm font-medium mb-1">{reservaParaCancelar.espaco_nome}</p>
  <p className="text-xs text-gray-500 dark:text-gray-400">
    {formatarData(reservaParaCancelar.data_inicio)} • {reservaParaCancelar.qtd_pessoas} pessoas
  </p>
  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
    Valor: R$ {reservaParaCancelar.valor_total.toFixed(2)}
  </p>
  {(() => {
    const regra = verificarCancelamento(reservaParaCancelar.data_inicio, reservaParaCancelar.created_at);
    if (regra.reembolso === 100) {
      return <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-semibold"> Reembolso integral de 100%</p>;
    } else if (regra.reembolso === 50) {
      return <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 font-semibold"> Reembolso de 50% do valor</p>;
    } else if (regra.reembolso === 0) {
      return <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-semibold"> Este cancelamento NÃO TERÁ REEMBOLSO</p>;
    }
    return null;
  })()}
</div>

      <div className="mb-4">
        <label className="text-sm font-medium mb-1 block">Motivo do cancelamento</label>
        <textarea
          className="w-full p-3 rounded-xl border resize-none bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-sky-500 outline-none"
          rows={4}
          placeholder="Descreva o motivo do cancelamento (mínimo 10 caracteres)"
          value={motivoCancelamento}
          onChange={(e) => setMotivoCancelamento(e.target.value)}
        />
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          {motivoCancelamento.length}/10 caracteres mínimos
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setCancelamentoAberto(false)}
          className="flex-1 py-3 rounded-xl font-semibold transition bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400"
        >
          Voltar
        </button>
        <button
          onClick={confirmarCancelamento}
          disabled={motivoCancelamento.trim().length < 10}
          className={`flex-1 py-3 rounded-xl font-semibold transition ${
            motivoCancelamento.trim().length < 10
              ? "bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600 text-white"
          }`}
        >
          Confirmar Cancelamento
        </button>
      </div>
    </div>
  </div>
)}
{/* Modal de Remarcação */}
{remarcacaoAberto && reservaParaRemarcar && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 md:p-6 w-full max-w-md text-gray-900 dark:text-gray-100 max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Solicitar Remarcação</h2>
        <button
          onClick={() => setRemarcacaoAberto(false)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
        >
          ✕
        </button>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl mb-4">
        <p className="text-sm font-medium mb-1">{reservaParaRemarcar.espaco_nome}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Data atual: {formatarData(reservaParaRemarcar.data_inicio)}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Valor: R$ {reservaParaRemarcar.valor_total.toFixed(2)}
        </p>
        <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <p className="text-xs text-yellow-800 dark:text-yellow-300">
            ⚠️ A solicitação será enviada ao anfitrião para aprovação. 
            Você será notificado quando for aprovada ou recusada.
          </p>
        </div>
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium mb-1 block">Nova data desejada</label>
        <input
          type="date"
          value={novaData}
          onChange={(e) => setNovaData(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          className="w-full p-3 rounded-xl border bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-sky-500 outline-none"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setRemarcacaoAberto(false)}
          className="flex-1 py-3 rounded-xl font-semibold transition bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400"
        >
          Cancelar
        </button>
        <button
          onClick={solicitarRemarcacao}
          disabled={!novaData || remarcando}
          className={`flex-1 py-3 rounded-xl font-semibold transition ${
            !novaData || remarcando
              ? "bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {remarcando ? "Enviando..." : "Solicitar Remarcação"}
        </button>
      </div>
    </div>
  </div>
)}

{/* 🔥 MODAL VER PROPOSTA - ADICIONAR AQUI 🔥 */}
{verPropostaAberto && propostaSelecionada && dadosProposta && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Proposta de Reagendamento
        </h2>
        <button
          onClick={() => setVerPropostaAberto(false)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            📅 <strong>Nova data sugerida pelo anfitrião:</strong><br />
            {formatarData(dadosProposta.novaData)}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            💬 <strong>Mensagem do anfitrião:</strong><br />
            {dadosProposta.mensagem}
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={() => aceitarProposta(propostaSelecionada.id, dadosProposta.novaData, dadosProposta.reporteId)}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition"
          >
            Aceitar
          </button>
          <button
            onClick={() => recusarProposta(propostaSelecionada.id, dadosProposta.reporteId)}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition"
          >
            Recusar
          </button>
        </div>
      </div>
    </div>
  </div>
)}


    </div>
  );
}