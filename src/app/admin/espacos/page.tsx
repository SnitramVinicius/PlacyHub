"use client";

// TEMP-ADMIN-EDICAO-ESPACOS-20260901
// Remoção documentada em docs/ALTERACAO_TEMPORARIA_EDICAO_ADMIN_ESPACOS.md.

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Building2, MapPin, Pencil, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Espaco = { id: string; nome_espaco: string; cidade: string | null; estado: string | null; bairro: string | null; descricao: string | null; anfitriao_nome: string | null; anfitriao_email: string | null };

export default function EspacosAdminPage() {
  const [espacos, setEspacos] = useState<Espaco[]>([]);
  const [pesquisa, setPesquisa] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  async function carregar() {
    setCarregando(true); setErro("");
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("Sua sessão expirou. Faça login novamente.");
      const resposta = await fetch("/api/admin/espacos", { headers: { Authorization: `Bearer ${token}` } });
      const resultado = await resposta.json();
      if (!resposta.ok) throw new Error(resultado.message || "Erro ao carregar espaços.");
      setEspacos(resultado.espacos || []);
    } catch (e) { setErro(e instanceof Error ? e.message : "Erro ao carregar espaços."); }
    finally { setCarregando(false); }
  }

  useEffect(() => { carregar(); }, []);
  const filtrados = useMemo(() => {
    const termo = pesquisa.trim().toLocaleLowerCase("pt-BR");
    return termo ? espacos.filter((e) => [e.nome_espaco, e.cidade, e.estado, e.bairro, e.anfitriao_nome, e.anfitriao_email].filter(Boolean).some((v) => v!.toLocaleLowerCase("pt-BR").includes(termo))) : espacos;
  }, [espacos, pesquisa]);

  return <div className="mx-auto max-w-6xl p-6">
    <h1 className="text-3xl font-bold text-gray-900">Espaços</h1>
    <p className="mt-1 text-sm text-gray-500">Correção administrativa temporária dos dados cadastrados pelos anfitriões.</p>
    <div className="relative my-6"><Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" /><input value={pesquisa} onChange={(e) => setPesquisa(e.target.value)} placeholder="Buscar por espaço, cidade ou anfitrião..." className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none focus:border-sky-500" /></div>
    {carregando && <p className="py-12 text-center text-gray-500">Carregando espaços...</p>}
    {!carregando && erro && <div className="rounded-xl bg-red-50 p-5 text-center text-red-700"><p>{erro}</p><button onClick={carregar} className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-white">Tentar novamente</button></div>}
    {!carregando && !erro && !filtrados.length && <p className="py-12 text-center text-gray-500">Nenhum espaço encontrado.</p>}
    <div className="grid gap-4">{filtrados.map((e) => <article key={e.id} className="flex flex-col gap-4 rounded-2xl border bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0"><div className="flex items-center gap-2"><Building2 className="h-5 w-5 text-sky-600" /><h2 className="truncate text-lg font-semibold">{e.nome_espaco}</h2></div><p className="mt-2 flex items-center gap-1 text-sm text-gray-500"><MapPin className="h-4 w-4" />{[e.bairro, e.cidade, e.estado].filter(Boolean).join(", ") || "Localização não informada"}</p><p className="mt-1 text-sm text-gray-500">Anfitrião: {e.anfitriao_nome || "Não identificado"}{e.anfitriao_email ? ` • ${e.anfitriao_email}` : ""}</p>{e.descricao && <p className="mt-2 line-clamp-2 text-sm text-gray-600">{e.descricao}</p>}</div>
      <Link href={`/admin/espacos/${e.id}/editar`} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 font-medium text-white hover:bg-sky-700"><Pencil className="h-4 w-4" />Editar</Link>
    </article>)}</div>
  </div>;
}
