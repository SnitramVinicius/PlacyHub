"use client";

/* ======================= TELA DE "MEUS ESPAÇOS"
 TODOS OS ESPAÇOS DO ANFITRIAO
 ======================= */

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit3, PauseCircle, CalendarDays } from "lucide-react";

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Meus Espaços</h1>
        <Link
          href="/anfitriao/espacos/novo"
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-xl font-semibold transition"
        >
          + Cadastrar Novo Espaço
        </Link>
      </div>

      {espacos.length === 0 ? (
        <p className="text-gray-600 italic">
          Você ainda não cadastrou nenhum espaço.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {espacos.map((espaco) => {
         const imagemCapa =
  espaco.fotos && espaco.fotos.length > 0
    ? `/espacos/${espaco.fotos[0]}`
    : "/img/placeholder-espaco.jpg";

            return (
              <div
                key={espaco.id}
                className="border border-gray-200 dark:border-gray-700 
           bg-white dark:bg-gray-800
           p-4 rounded-lg shadow-md hover:shadow-xl transition duration-300"
              >
                <img
                  src={imagemCapa}
                  alt={espaco.nome_espaco}
                  className="w-full h-40 object-cover mb-4 rounded-lg"
                />

                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-tight">
  {espaco.nome_espaco}
</h2>

<p className="text-xs text-gray-500 dark:text-gray-400">
  {espaco.tipo_espaco}
</p>

                <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-300">
  {/* Localização */}
  <div className="flex items-start gap-2">
    <p className="leading-snug">
      <span className="text-gray-500">Localização:</span>{" "}
      {espaco.endereco}
    </p>
  </div>

  {/* Capacidade */}
<div className="flex flex-wrap gap-2">
 <span className="text-gray-500">Capacidade:</span>{" "}
  Até {espaco.capacidade} pessoas
</div>

{/* PREÇO PRINCIPAL */}
{!espaco.temPlanos && espaco.valor && (
 <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-1">
    {Number(espaco.valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })}
    <span className="ml-1 text-xs font-normal text-gray-500">
      / {espaco.tipo_cobranca}
    </span>
  </p>
)}

{espaco.temPlanos && (
  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
    Preço sob consulta
  </p>
)}


  {/* Buffet */}
{espaco.buffet?.ativo && (
  <div className="mt-2 space-y-1 text-sm text-gray-600">
    <p>
      <span className="text-gray-500">Buffet:</span>{" "}
      {espaco.buffet.nivel.toLowerCase()} · a partir de{" "}
      {espaco.buffet.precoBase.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}
    </p>

    {espaco.buffet.descricao && (
      <p className="text-sm text-gray-500 dark:text-gray-400 italic line-clamp-2">
        {espaco.buffet.descricao}
      </p>
    )}
  </div>
)}
</div>


{espaco.temPlanos &&
  espaco.categoriasFesta &&
  espaco.categoriasFesta.length > 0 && (
    <div className="mt-3">
      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
        Festas atendidas:
      </p>

      <div className="flex flex-wrap gap-2 mb-1">
        {espaco.categoriasFesta.map((c) => (
          <span
            key={c.id}
            className="bg-sky-100 text-sky-700 text-xs font-medium px-2 py-1 rounded-full"
          >
            {c.nome} ({c.pacotes.length})
          </span>
        ))}
      </div>
    </div>
)}
 <div className="flex gap-2 mt-3 text-xs font-semibold">
  <span
    className={`px-2 py-1 rounded-full ${
      espaco.disponivel
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700"
    }`}
  >
    {espaco.disponivel ? "Disponível" : "Indisponível"}
  </span>

  <span
    className={`px-2 py-1 rounded-full ${
      espaco.tipo_reserva === "automatica"
        ? "bg-sky-100 text-sky-700"
        : "bg-amber-100 text-amber-700"
    }`}
  >
    {espaco.tipo_reserva === "automatica"
      ? "Confirmação automática"
      : "Confirmação manual"}
  </span>
</div>
            
<div className="mt-3 flex flex-wrap gap-2">
  {espaco.servicos && espaco.servicos.length > 0 && (
    <span className="inline-flex items-center rounded-full 
           border border-gray-200 dark:border-gray-700
           bg-gray-50 dark:bg-gray-700
           px-3 py-1 text-xs text-gray-600 dark:text-gray-300">
      {espaco.servicos.length} serviços
    </span>
  )}

  {espaco.regras && espaco.regras.length > 0 && (
    <span className="inline-flex items-center rounded-full 
           border border-gray-200 dark:border-gray-700
           bg-gray-50 dark:bg-gray-700
           px-3 py-1 text-xs text-gray-600 dark:text-gray-300">
      {espaco.regras.length} regras
    </span>
  )}

  {espaco.facilidades && espaco.facilidades.length > 0 && (
    <span className="inline-flex items-center rounded-full 
           border border-gray-200 dark:border-gray-700
           bg-gray-50 dark:bg-gray-700
           px-3 py-1 text-xs text-gray-600 dark:text-gray-300">
      {espaco.facilidades.length} facilidades
    </span>
  )}
</div>


                <p className="mt-3 text-gray-700 dark:text-gray-300 text-sm italic line-clamp-2">
                  {espaco.descricao}
                </p>

                <div className="flex items-center justify-between mt-4 border-t border-gray-200 dark:border-gray-700 pt-3">
                  <button
                    onClick={() =>
                      router.push(`/anfitriao/espacos/${espaco.id}/editar`)
                    }
                    className="flex items-center gap-1 text-sm text-sky-600 hover:text-sky-700 font-medium"
                  >
                    <Edit3 size={16} /> Editar
                  </button>

                  <button
                    onClick={() =>
                      router.push(`/anfitriao/espacos/${espaco.id}/reservas`)
                    }
                    className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700 font-medium"
                  >
                    <CalendarDays size={16} /> Reservas
                  </button>

                  <button
                    onClick={() => alternarDisponibilidade(espaco.id)}
                    className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium"
                  >
                    <PauseCircle size={16} />{" "}
                    {espaco.disponivel ? "Pausar" : "Ativar"}
                  </button>

                  <button
                    onClick={() => excluirEspaco(espaco.id)}
                    className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    🗑️ Excluir
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
