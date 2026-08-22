"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, Inbox, Search, X, XCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

type StatusChamado = "pendente" | "em_atendimento" | "resolvido" | "fechado";
type Chamado = {
  id: string;
  reserva_id: string | null;
  user_id: string;
  tipo: string;
  descricao: string;
  status: StatusChamado;
  created_at: string;
  updated_at: string | null;
  resposta_admin: string | null;
  respondido_em: string | null;
  usuario: { name: string; email: string; telefone: string | null; roles: string[] } | null;
  reserva: { id: string; data_inicio: string; status: string; pagamento_status: string } | null;
};

const statusInfo: Record<StatusChamado, { label: string; classe: string }> = {
  pendente: { label: "Pendente", classe: "bg-amber-100 text-amber-700" },
  em_atendimento: { label: "Em atendimento", classe: "bg-sky-100 text-sky-700" },
  resolvido: { label: "Resolvido", classe: "bg-emerald-100 text-emerald-700" },
  fechado: { label: "Fechado", classe: "bg-gray-200 text-gray-700" },
};

export default function AdminSuportePage() {
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [filtro, setFiltro] = useState<"todos" | StatusChamado>("todos");
  const [selecionado, setSelecionado] = useState<Chamado | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [resposta, setResposta] = useState("");

  async function obterToken() {
    const { data } = await supabase.auth.getSession();
    if (!data.session?.access_token) throw new Error("Sua sessão expirou.");
    return data.session.access_token;
  }

  async function carregar(silencioso = false) {
    if (!silencioso) setLoading(true);
    try {
      const token = await obterToken();
      const response = await fetch("/api/admin/suporte", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Erro ao carregar chamados.");
      setChamados(result.chamados ?? []);
      setErro("");
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao carregar chamados.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
    const channel = supabase
      .channel("admin-suporte")
      .on("postgres_changes", { event: "*", schema: "public", table: "reportes" }, () => carregar(true))
      .subscribe();
    const interval = window.setInterval(() => carregar(true), 30_000);
    return () => {
      window.clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  const contagem = (status: StatusChamado) => chamados.filter((item) => item.status === status).length;
  const lista = useMemo(() => {
    const termo = pesquisa.trim().toLowerCase();
    return chamados.filter((item) => {
      const correspondeStatus = filtro === "todos" || item.status === filtro;
      const texto = `${item.tipo} ${item.descricao} ${item.usuario?.name ?? ""} ${item.usuario?.email ?? ""}`.toLowerCase();
      return correspondeStatus && (!termo || texto.includes(termo));
    });
  }, [chamados, filtro, pesquisa]);

  function abrirChamado(chamado: Chamado) {
    setSelecionado(chamado);
    setResposta(chamado.resposta_admin ?? "");
  }

  async function mudarStatus(status: StatusChamado) {
    if (!selecionado || selecionado.status === status) return;
    if (["resolvido", "fechado"].includes(status) && resposta.trim().length < 3) {
      toast.error("Escreva a resposta que será enviada ao usuário.");
      return;
    }
    setSalvando(true);
    try {
      const token = await obterToken();
      const response = await fetch("/api/admin/suporte", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ id: selecionado.id, status, resposta }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Erro ao atualizar chamado.");
      const atualizado = { ...selecionado, ...result.chamado };
      setChamados((atuais) => atuais.map((item) => (item.id === atualizado.id ? atualizado : item)));
      setSelecionado(atualizado);
      toast.success(`Chamado marcado como ${statusInfo[status].label.toLowerCase()}.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao atualizar chamado.");
    } finally {
      setSalvando(false);
    }
  }

  if (loading) return <div className="p-10 text-center">Carregando chamados...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-7">
        <h1 className="text-3xl font-bold">Central de Suporte</h1>
        <p className="text-gray-500 mt-1">Acompanhe e atualize os chamados enviados pelos usuários.</p>
      </div>

      {erro && <div className="mb-5 rounded-xl bg-red-50 text-red-700 p-4">{erro} <button onClick={() => carregar()} className="underline ml-2">Tentar novamente</button></div>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <Resumo titulo="Pendentes" valor={contagem("pendente")} icon={<Inbox size={20} />} classe="text-amber-600" />
        <Resumo titulo="Em atendimento" valor={contagem("em_atendimento")} icon={<Clock3 size={20} />} classe="text-sky-600" />
        <Resumo titulo="Resolvidos" valor={contagem("resolvido")} icon={<CheckCircle2 size={20} />} classe="text-emerald-600" />
        <Resumo titulo="Fechados" valor={contagem("fechado")} icon={<XCircle size={20} />} classe="text-gray-500" />
      </div>

      <div className="bg-white rounded-2xl shadow p-4 mb-5">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 text-gray-400" size={19} />
          <input value={pesquisa} onChange={(e) => setPesquisa(e.target.value)} placeholder="Buscar por usuário, e-mail, tipo ou descrição..." className="w-full border rounded-xl py-2.5 pl-10 pr-3" />
        </div>
        <div className="flex flex-wrap gap-2">
          {(["todos", "pendente", "em_atendimento", "resolvido", "fechado"] as const).map((status) => (
            <button key={status} onClick={() => setFiltro(status)} className={`px-3 py-2 rounded-xl text-sm ${filtro === status ? "bg-sky-500 text-white" : "bg-gray-100 text-gray-700"}`}>
              {status === "todos" ? `Todos (${chamados.length})` : `${statusInfo[status].label} (${contagem(status)})`}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {lista.map((chamado) => (
          <button key={chamado.id} onClick={() => abrirChamado(chamado)} className="w-full text-left bg-white rounded-2xl shadow hover:shadow-md transition p-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo[chamado.status]?.classe ?? statusInfo.pendente.classe}`}>{statusInfo[chamado.status]?.label ?? chamado.status}</span>
                  <span className="text-xs text-gray-400">#{chamado.id.slice(0, 8)}</span>
                </div>
                <h2 className="font-bold text-lg">{chamado.tipo || "Solicitação de suporte"}</h2>
                <p className="text-sm text-gray-500 mt-1">{chamado.usuario?.name || "Usuário"} · {chamado.usuario?.email || "E-mail indisponível"}</p>
                <p className="text-gray-600 mt-2 line-clamp-2 whitespace-pre-line">{chamado.descricao}</p>
              </div>
              <span className="text-sm text-gray-400 whitespace-nowrap">{new Date(chamado.created_at).toLocaleString("pt-BR")}</span>
            </div>
          </button>
        ))}
        {!lista.length && <div className="bg-white rounded-2xl p-10 text-center text-gray-500">Nenhum chamado encontrado.</div>}
      </div>

      {selecionado && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onMouseDown={(e) => e.target === e.currentTarget && setSelecionado(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between gap-4 mb-5">
              <div><span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo[selecionado.status]?.classe}`}>{statusInfo[selecionado.status]?.label}</span><h2 className="text-2xl font-bold mt-2">{selecionado.tipo}</h2></div>
              <button onClick={() => setSelecionado(null)} aria-label="Fechar janela"><X /></button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 text-sm mb-5">
              <Info titulo="Usuário" valor={selecionado.usuario?.name} />
              <Info titulo="E-mail" valor={selecionado.usuario?.email} />
              <Info titulo="Telefone" valor={selecionado.usuario?.telefone} />
              <Info titulo="Aberto em" valor={new Date(selecionado.created_at).toLocaleString("pt-BR")} />
              <Info titulo="Reserva" valor={selecionado.reserva_id ? `#${selecionado.reserva_id.slice(0, 8)}` : "Sem reserva"} />
              <Info titulo="Data da reserva" valor={selecionado.reserva?.data_inicio ? new Date(selecionado.reserva.data_inicio).toLocaleDateString("pt-BR") : null} />
            </div>
            <div className="bg-gray-50 rounded-xl p-4 mb-6"><p className="text-xs uppercase font-semibold text-gray-400 mb-2">Descrição</p><p className="whitespace-pre-wrap text-gray-700">{selecionado.descricao}</p></div>
            <div className="mb-6">
              <label htmlFor="resposta-chamado" className="block font-semibold mb-2">Resposta para o usuário</label>
              <textarea id="resposta-chamado" value={resposta} onChange={(e) => setResposta(e.target.value)} rows={5} placeholder="Explique o que foi analisado e como o problema foi resolvido..." className="w-full border rounded-xl p-3 resize-y" />
              <p className="text-xs text-gray-400 mt-1">Obrigatória ao resolver ou fechar. A resposta será enviada nas notificações do usuário.</p>
            </div>
            <p className="font-semibold mb-3">Alterar situação</p>
            <div className="flex flex-wrap gap-2">
              <Acao label="Atender" status="em_atendimento" atual={selecionado.status} disabled={salvando} onClick={mudarStatus} />
              <Acao label="Resolver" status="resolvido" atual={selecionado.status} disabled={salvando} onClick={mudarStatus} />
              <Acao label="Fechar" status="fechado" atual={selecionado.status} disabled={salvando} onClick={mudarStatus} />
              <Acao label="Reabrir" status="pendente" atual={selecionado.status} disabled={salvando} onClick={mudarStatus} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Resumo({ titulo, valor, icon, classe }: { titulo: string; valor: number; icon: React.ReactNode; classe: string }) {
  return <div className="bg-white rounded-2xl shadow p-4"><div className={`flex items-center gap-2 ${classe}`}>{icon}<span className="text-sm font-medium">{titulo}</span></div><p className="text-3xl font-bold mt-2">{valor}</p></div>;
}
function Info({ titulo, valor }: { titulo: string; valor?: string | null }) {
  return <div className="border rounded-xl p-3"><p className="text-xs text-gray-400">{titulo}</p><p className="font-medium break-words">{valor || "-"}</p></div>;
}
function Acao({ label, status, atual, disabled, onClick }: { label: string; status: StatusChamado; atual: StatusChamado; disabled: boolean; onClick: (status: StatusChamado) => void }) {
  return <button disabled={disabled || atual === status} onClick={() => onClick(status)} className="px-4 py-2 rounded-xl bg-sky-500 text-white disabled:bg-gray-200 disabled:text-gray-500">{label}</button>;
}
