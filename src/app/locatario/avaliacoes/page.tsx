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
      { id: "1", tipo: "feito", comentario: "Espaço incrível! Muito bem cuidado e localização perfeita.", nota: 5, espaco: "Chácara Recanto do Lago", data: "2025-12-10" },
      { id: "2", tipo: "recebido", comentario: "Ótimo hóspede! Comunicativo e respeitou todas as regras.", nota: 5, espaco: "Espaço Premium Monte Castelo", data: "2025-12-05" },
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

  const renderEstrelas = (nota: number = 0) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${
              star <= nota
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300 dark:text-gray-600"
            } transition-colors`}
          />
        ))}
      </div>
    );
  };

  const formatarData = (dataStr?: string) => {
    if (!dataStr) return "";
    const data = new Date(dataStr);
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <h1 className="text-xl md:text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Avaliações
      </h1>

      {/* Avaliações pendentes */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-yellow-400 rounded-full"></div>
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200">
            Avaliações a serem feitas
          </h2>
          {pendentes.length > 0 && (
            <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-medium px-2 py-1 rounded-full">
              {pendentes.length} pendente{pendentes.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {pendentes.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              ✨ Nenhuma avaliação pendente no momento. Parece que é hora de planejar sua próxima aventura!
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {pendentes.map(p => (
              <div
                key={p.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base mb-1">
                    {p.espaco}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>📅 {formatarData(p.data)}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => abrirModal(p)}
                  className="w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 sm:py-2 rounded-xl font-medium transition flex items-center justify-center gap-2"
                >
                  <Star size={18} />
                  <span>Avaliar agora</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Comentários feitos por você */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-sky-400 rounded-full"></div>
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200">
            Comentários que você escreveu
          </h2>
          {feitos.length > 0 && (
            <span className="bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 text-xs font-medium px-2 py-1 rounded-full">
              {feitos.length} {feitos.length === 1 ? 'comentário' : 'comentários'}
            </span>
          )}
        </div>

        {feitos.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              📝 Você ainda não escreveu nenhum comentário. Sua opinião é muito importante!
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {feitos.map(f => (
              <div
                key={f.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {f.espaco}
                  </h3>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {formatarData(f.data)}
                  </span>
                </div>
                
                <div className="mb-2">
                  {renderEstrelas(f.nota)}
                </div>
                
                {f.comentario && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    "{f.comentario}"
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Comentários sobre você */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-green-400 rounded-full"></div>
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200">
            Comentários sobre você
          </h2>
          {recebidos.length > 0 && (
            <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium px-2 py-1 rounded-full">
              {recebidos.length} {recebidos.length === 1 ? 'comentário' : 'comentários'}
            </span>
          )}
        </div>

        {recebidos.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              👋 Você ainda não recebeu comentários. Seja um ótimo locatário ou anfitrião!
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {recebidos.map(r => (
              <div
                key={r.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {r.espaco}
                  </h3>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {formatarData(r.data)}
                  </span>
                </div>
                
                <div className="mb-2">
                  {renderEstrelas(r.nota)}
                </div>
                
                {r.comentario && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    "{r.comentario}"
                  </p>
                )}
              </div>
            ))}
          </div>
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