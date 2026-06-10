"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import AvaliacaoModal from "@/components/AvaliacaoModal";
import { toast } from "sonner";

interface Avaliacao {
  id: string;
  tipo: "feito" | "recebido" | "pendente";
  comentario?: string;
  nota?: number;
  espaco_nome?: string;
  espaco_id?: string;
  reserva_id?: string;
  cliente_id?: string;
  cliente_nome?: string;
  data_inicio?: string;
  created_at?: string;
}

export default function AvaliacoesAnfitriaoPage() {
  const { user } = useAuth();
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [avaliacaoSelecionada, setAvaliacaoSelecionada] = useState<Avaliacao | null>(null);

  useEffect(() => {
    async function carregarAvaliacoes() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        // 1. Buscar os espaços do anfitrião
        const { data: espacos, error: errorEspacos } = await supabase
          .from("spaces")
          .select("id, nome_espaco")
          .eq("user_id", user.id);

        if (errorEspacos) {
          console.error("Erro ao buscar espaços:", errorEspacos);
          setLoading(false);
          return;
        }

        if (!espacos || espacos.length === 0) {
          setAvaliacoes([]);
          setLoading(false);
          return;
        }

        const espacosIds = espacos.map(e => e.id);

// 2. Buscar reservas FINALIZADAS desses espaços (para pendentes)
const hoje = new Date().toISOString().split("T")[0];
const { data: reservasFinalizadas, error: errorFinalizadas } = await supabase
  .from("reservas")
  .select("id, espaco_id, data_inicio, user_id")
  .in("espaco_id", espacosIds)
  .eq("status", "finalizada")
  .lt("data_inicio", hoje);

if (errorFinalizadas) {
  console.error("Erro ao buscar reservas:", errorFinalizadas);
  setLoading(false);
  return;
}

// Renomear user_id para cliente_id depois que os dados chegam
const reservasComClienteId = (reservasFinalizadas || []).map(r => ({
  ...r,
  cliente_id: r.user_id
}));

        // 3. Buscar avaliações FEITAS pelo anfitrião (sobre clientes)
        const { data: avaliacoesFeitas, error: errorFeitas } = await supabase
          .from("avaliacoes")
          .select("id, nota, comentario, created_at, reserva_id, cliente_id, espaco_id")
          .eq("anfitriao_id", user.id)
          .eq("tipo", "anfitriao_para_cliente");

        if (errorFeitas) {
          console.error("Erro ao buscar avaliações feitas:", errorFeitas);
        }

       // 4. Buscar avaliações RECEBIDAS pelo anfitrião (clientes avaliando espaços)
const { data: avaliacoesRecebidas, error: errorRecebidas } = await supabase
  .from("avaliacoes")
  .select("id, nota, comentario, created_at, reserva_id, user_id, espaco_id")
  .in("espaco_id", espacosIds)
  .eq("tipo", "cliente_para_espaco")

        if (errorRecebidas) {
          console.error("Erro ao buscar avaliações recebidas:", errorRecebidas);
        }

        // 5. Criar Set de reservas já avaliadas pelo anfitrião
        const reservasComAvaliacao = new Set();
        if (avaliacoesFeitas) {
          avaliacoesFeitas.forEach((av: any) => {
            if (av.reserva_id) reservasComAvaliacao.add(av.reserva_id);
          });
        }

       // 6. Montar lista de PENDENTES (reservas que o anfitrião ainda não avaliou)
const pendentes: Avaliacao[] = (reservasFinalizadas || [])
  .filter((r: any) => !reservasComAvaliacao.has(r.id))
  .map((r: any) => {
    const espaco = espacos.find(e => e.id === r.espaco_id);
    return {
      id: r.id,
      tipo: "pendente",
      espaco_nome: espaco?.nome_espaco || "Espaço",
      espaco_id: r.espaco_id,
      reserva_id: r.id,
      cliente_id: r.user_id,  // ← MUDOU: user_id em vez de cliente_id
      data_inicio: r.data_inicio,
    };
  });

        // 7. Montar lista de AVALIAÇÕES FEITAS pelo anfitrião
        const feitas: Avaliacao[] = await Promise.all(
          (avaliacoesFeitas || []).map(async (av: any) => {
            const espaco = espacos.find(e => e.id === av.espaco_id);
            
            let clienteNome = "Cliente";
            if (av.cliente_id) {
              const { data: cliente } = await supabase
                .from("users")
                .select("name")
                .eq("id", av.cliente_id)
                .single();
              if (cliente) clienteNome = cliente.name;
            }
            
            return {
              id: av.id,
              tipo: "feito",
              nota: av.nota,
              comentario: av.comentario,
              espaco_nome: espaco?.nome_espaco || "Espaço",
              cliente_nome: clienteNome,
              created_at: av.created_at,
            };
          })
        );

       // 8. Montar lista de AVALIAÇÕES RECEBIDAS (clientes avaliando)
const recebidas: Avaliacao[] = await Promise.all(
  (avaliacoesRecebidas || []).map(async (av: any) => {
    const espaco = espacos.find(e => e.id === av.espaco_id);
    
    let clienteNome = "Cliente";
    if (av.user_id) {  // ← MUDOU: user_id em vez de cliente_id
      const { data: cliente } = await supabase
        .from("users")
        .select("name")
        .eq("id", av.user_id)
        .single();
      if (cliente) clienteNome = cliente.name;
    }
    
    return {
      id: av.id,
      tipo: "recebido",
      nota: av.nota,
      comentario: av.comentario,
      espaco_nome: espaco?.nome_espaco || "Espaço",
      cliente_nome: clienteNome,
      created_at: av.created_at,
    };
  })
);

        setAvaliacoes([...feitas, ...recebidas, ...pendentes]);
      } catch (err) {
        console.error("Erro:", err);
        toast.error("Erro ao carregar avaliações");
      } finally {
        setLoading(false);
      }
    }

    carregarAvaliacoes();
  }, [user]);

  // Enviar avaliação (anfitrião avaliando cliente)
  async function enviarAvaliacao(nota: number, comentario?: string) {
    if (!avaliacaoSelecionada || !user?.id) return;

    try {
      const { error } = await supabase
        .from("avaliacoes")
        .insert({
          reserva_id: avaliacaoSelecionada.reserva_id,
          user_id: user.id,
          anfitriao_id: user.id,
          cliente_id: avaliacaoSelecionada.cliente_id,
          espaco_id: avaliacaoSelecionada.espaco_id,
          nota: nota,
          comentario: comentario || null,
          tipo: "anfitriao_para_cliente",
          created_at: new Date().toISOString(),
        });

      if (error) {
        console.error("Erro ao salvar avaliação:", error);
        toast.error("Erro ao enviar avaliação");
        return;
      }

      setAvaliacoes(prev =>
        prev.map(av =>
          av.id === avaliacaoSelecionada.id
            ? { ...av, tipo: "feito", nota, comentario }
            : av
        )
      );

      toast.success("Avaliação enviada", {
        description: "Obrigado por avaliar o cliente!",
      });
    } catch (err) {
      console.error("Erro:", err);
      toast.error("Erro ao enviar avaliação");
    } finally {
      setModalAberto(false);
      setAvaliacaoSelecionada(null);
    }
  }

  // Adicione esta função (depois de enviarAvaliacao)
async function pularAvaliacao(reservaId: string) {
  const { error } = await supabase
    .from("reservas")
    .update({ avaliacao_pulada: true })
    .eq("id", reservaId);

  if (error) {
    console.error("Erro ao pular avaliação:", error);
    toast.error("Erro ao pular avaliação");
    return;
  }

  setAvaliacoes(prev => prev.filter(av => av.id !== reservaId));
  toast.success("Avaliação pulada!");
}

// Adicione esta função (depois de pularAvaliacao)
async function excluirAvaliacao(avaliacaoId: string) {
  if (!confirm("Tem certeza que deseja excluir esta avaliação?")) return;

  const { error } = await supabase
    .from("avaliacoes")
    .delete()
    .eq("id", avaliacaoId);

  if (error) {
    console.error("Erro ao excluir avaliação:", error);
    toast.error("Erro ao excluir avaliação");
    return;
  }

  setAvaliacoes(prev => prev.filter(av => av.id !== avaliacaoId));
  toast.success("Avaliação excluída!");
}

  function abrirModal(av: Avaliacao) {
    setAvaliacaoSelecionada(av);
    setModalAberto(true);
  }

  const feitos = avaliacoes.filter(a => a.tipo === "feito");
  const recebidos = avaliacoes.filter(a => a.tipo === "recebido");
  const pendentes = avaliacoes.filter(a => a.tipo === "pendente");

  const formatarData = (dataStr?: string) => {
    if (!dataStr) return "";
    const data = new Date(dataStr);
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Carregando avaliações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <h1 className="text-xl md:text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Avaliações
      </h1>

      {/* Seção 1: Avaliações a serem feitas (PENDENTES) */}
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
        Nenhuma avaliação pendente no momento.
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
              {p.espaco_nome}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>{formatarData(p.data_inicio)}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => abrirModal(p)}
              className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 sm:py-2 rounded-xl font-medium transition flex items-center justify-center gap-2"
            >
              <Star size={18} />
              <span>Avaliar cliente</span>
            </button>
            <button
              onClick={() => pularAvaliacao(p.id)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-3 sm:py-2 rounded-xl font-medium transition"
            >
              Pular
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</section>

      {/* Seção 2: Comentários que você escreveu (FEITOS) */}
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
        Você ainda não escreveu nenhum comentário sobre clientes.
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
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {f.espaco_nome}
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Cliente: {f.cliente_nome}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {formatarData(f.created_at)}
              </span>
              <button
                onClick={() => excluirAvaliacao(f.id)}
                className="text-red-500 hover:text-red-700 text-sm transition"
                title="Excluir avaliação"
              >
                🗑️
              </button>
            </div>
          </div>
          
          <div className="mb-2">
            {renderEstrelas(f.nota || 0)}
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

      {/* Seção 3: Comentários sobre você (RECEBIDOS) */}
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
              Você ainda não recebeu comentários de clientes.
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
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {r.espaco_nome}
                    </h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Cliente: {r.cliente_nome}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {formatarData(r.created_at)}
                  </span>
                </div>
                
                <div className="mb-2">
                  {renderEstrelas(r.nota || 0)}
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
          nomeEspaco={avaliacaoSelecionada.espaco_nome || ""}
          onClose={() => setModalAberto(false)}
          onSubmit={enviarAvaliacao}
        />
      )}
    </div>
  );
}