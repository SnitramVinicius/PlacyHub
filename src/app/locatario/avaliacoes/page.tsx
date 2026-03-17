"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import AvaliacaoModal from "@/components/AvaliacaoModal";
import { toast } from "sonner";

interface Avaliacao {
  id: string;
  tipo: "feito" | "recebido" | "pendente";
  comentario?: string;
  nota?: number;
  espaco?: string;
  data?: string;
}

export default function AvaliacoesPage() {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [avaliacaoSelecionada, setAvaliacaoSelecionada] = useState<Avaliacao | null>(null);

  useEffect(() => {
    const dados: Avaliacao[] = [
      { id: "1", tipo: "feito", comentario: "Espaço incrível!", nota: 5, espaco: "Chácara Recanto do Lago", data: "2025-12-10" },
      { id: "2", tipo: "recebido", comentario: "Ótimo hóspede!", nota: 5, espaco: "Espaço Premium Monte Castelo", data: "2025-12-05" },
      { id: "3", tipo: "pendente", espaco: "Chácara Recanto do Lago", data: "2025-12-12" },
    ];
    setAvaliacoes(dados);
  }, []);

  const feitos = avaliacoes.filter(a => a.tipo === "feito");
  const recebidos = avaliacoes.filter(a => a.tipo === "recebido");
  const pendentes = avaliacoes.filter(a => a.tipo === "pendente");

  function abrirModal(av: Avaliacao) {
    setAvaliacaoSelecionada(av);
    setModalAberto(true);
  }

  function enviarAvaliacao(nota: number, comentario?: string) {
    if (!avaliacaoSelecionada) return;

    setAvaliacoes(prev =>
      prev.map(av =>
        av.id === avaliacaoSelecionada.id
          ? { ...av, tipo: "feito", nota, comentario }
          : av
      )
    );

    setModalAberto(false);
    setAvaliacaoSelecionada(null);
    toast.success("Avaliação enviada", { description: "Obrigado por compartilhar sua experiência" });
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Avaliações</h1>

      {/* Avaliações pendentes */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Avaliações a serem feitas</h2>
        {pendentes.length === 0 ? (
          <p className="text-gray-500">
            Sem comentários pendentes no momento. Parece que é hora de viajar de novo!
          </p>
        ) : (
          <ul className="space-y-2">
            {pendentes.map(p => (
              <li key={p.id} className="border p-4 rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-medium">{p.espaco}</p>
                  <p className="text-gray-500 text-sm">{p.data}</p>
                </div>
                <button
                  onClick={() => abrirModal(p)}
                  className="bg-sky-500 text-white px-4 py-2 rounded-xl hover:bg-sky-600 transition"
                >
                  Avaliar
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Comentários feitos por você */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Comentários anteriores escritos por você</h2>
        {feitos.length === 0 ? (
          <p className="text-gray-500">Você ainda não escreveu nenhum comentário.</p>
        ) : (
          <ul className="space-y-2">
            {feitos.map(f => (
              <li key={f.id} className="border p-4 rounded-xl">
                <p className="font-medium">{f.espaco}</p>
                <p className="text-gray-500 text-sm">{f.data}</p>
                <p className="mt-1">{f.comentario}</p>
                <div className="flex mt-1">
                  {Array.from({ length: f.nota || 0 }).map((_, i) => ( // 👈 CORREÇÃO AQUI
                    <Star key={i} className="w-4 h-4 text-yellow-400" />
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Comentários sobre você */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Comentários sobre você</h2>
        {recebidos.length === 0 ? (
          <p className="text-gray-500">Você ainda não recebeu comentários.</p>
        ) : (
          <ul className="space-y-2">
            {recebidos.map(r => (
              <li key={r.id} className="border p-4 rounded-xl">
                <p className="font-medium">{r.espaco}</p>
                <p className="text-gray-500 text-sm">{r.data}</p>
                <p className="mt-1">{r.comentario}</p>
                <div className="flex mt-1">
                  {Array.from({ length: r.nota || 0 }).map((_, i) => ( // 👈 CORREÇÃO AQUI
                    <Star key={i} className="w-4 h-4 text-yellow-400" />
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Modal de avaliação */}
      {avaliacaoSelecionada && (
        <AvaliacaoModal
          isOpen={modalAberto}
          nomeEspaco={avaliacaoSelecionada.espaco || ""}
          onClose={() => setModalAberto(false)}
          onSubmit={enviarAvaliacao}
        />
      )}
    </div>
  );
}