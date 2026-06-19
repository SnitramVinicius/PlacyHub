"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

// Tipos
interface Transacao {
  id: string;
  espaco: string;
  espaco_id: string;
  data: string;
  dataEvento: string;
  status: "Confirmado" | "Pendente" | "Cancelado";
  tipo: string;
  metodo: string;
  valorBruto: number;
  valorLiquido: number;
  taxa: number;
  dataLiberacao: string;
  observacao?: string;
  comprovante?: string;
}

interface DadosFinanceirosMes {
  totalRecebido: number;
  aReceber: number;
  taxas: number;
  estornos: number;
  saldoTransferido: number;
  retidoCancelamentos: number;
  transacoes: Transacao[];
}

export default function FinanceiroPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dadosPorMes, setDadosPorMes] = useState<Record<string, DadosFinanceirosMes>>({});
  const [mesSelecionado, setMesSelecionado] = useState("");
  const [mesesDisponiveis, setMesesDisponiveis] = useState<string[]>([]);

  // Taxa da plataforma (%)
  const TAXA_PLATAFORMA = 0.10; // 10%

  // ============================================
  // FUNÇÃO PARA CALCULAR REEMBOLSO BASEADO NA POLÍTICA
  // ============================================
function calcularReembolso(reserva: any): number {
  if (!reserva.cancelado_em) return 0;

  const dataCriacao = new Date(reserva.created_at);
  const dataCancelamento = new Date(reserva.cancelado_em);
  const dataEvento = new Date(reserva.data_inicio);

  const horasDesdeCriacao =
    (dataCancelamento.getTime() - dataCriacao.getTime()) / (1000 * 60 * 60);

  const diasAteEvento =
    (dataEvento.getTime() - dataCancelamento.getTime()) / (1000 * 60 * 60 * 24);

  if (horasDesdeCriacao <= 48) {
    return 1.0;
  }

  if (diasAteEvento > 7) {
    return 0.5;
  }

  return 0.0;
}

  // Função para obter descrição do reembolso
  function getDescricaoReembolso(percentual: number): string {
    if (percentual === 1.0) return "Reembolso 100% (cancelamento em até 48h)";
    if (percentual === 0.5) return "Reembolso 50% (cancelamento com +7 dias de antecedência)";
    return "Sem reembolso (cancelamento tardio)";
  }

  useEffect(() => {
    if (user?.id) {
      buscarDadosFinanceiros();
    }
  }, [user]);

async function buscarDadosFinanceiros() {
  if (!user?.id) return;

  setLoading(true);

  try {
    const { data: espacos, error: errorEspacos } = await supabase
      .from("spaces")
      .select("id, nome_espaco")
      .eq("user_id", user.id);

    if (errorEspacos) throw errorEspacos;

    if (!espacos || espacos.length === 0) {
      setDadosPorMes({});
      setLoading(false);
      return;
    }

    const espacosIds = espacos.map(e => e.id);
    const espacosMap = new Map(espacos.map(e => [e.id, e.nome_espaco]));

    const { data: reservas, error: errorReservas } = await supabase
      .from("reservas")
      .select("*")
      .in("espaco_id", espacosIds)
      .order("created_at", { ascending: false });

    if (errorReservas) throw errorReservas;

    if (!reservas || reservas.length === 0) {
      setDadosPorMes({});
      setLoading(false);
      return;
    }

    const dados: Record<string, DadosFinanceirosMes> = {};

    for (const reserva of reservas) {
      // Criar chave no formato "maio 2026" (sem acentos e minúsculo)
      const dataReserva = new Date(reserva.created_at);
      const mesNome = dataReserva.toLocaleString("pt-BR", { month: "long" }).toLowerCase();
      const mesSemAcento = mesNome
        .replace(/ç/g, "c")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const ano = dataReserva.getFullYear();
      const mesKey = `${mesSemAcento} ${ano}`;

      if (!dados[mesKey]) {
        dados[mesKey] = {
          totalRecebido: 0,
          aReceber: 0,
          taxas: 0,
          estornos: 0,
          saldoTransferido: 0,
          retidoCancelamentos: 0,
          transacoes: [],
        };
      }

const valorPagoCliente = reserva.valor_total || 0;

// Remove os 2% pagos pelo locatário
const valorReserva = valorPagoCliente / 1.02;

// Taxa de 10% do anfitrião
const taxa = valorReserva * TAXA_PLATAFORMA;

// Valor líquido do anfitrião
const valorLiquido = valorReserva - taxa;

      let statusTransacao: "Confirmado" | "Pendente" | "Cancelado" = "Pendente";

      if (reserva.status === "cancelada") {
        statusTransacao = "Cancelado";
      } else if (reserva.pagamento_status === "approved") {
        statusTransacao = "Confirmado";
      }

      // Cancelamento com reembolso
      if (reserva.status === "cancelada" && reserva.pagamento_status === "approved") {
        const percentualReembolso = calcularReembolso(reserva);
        const valorReembolsado = valorReserva * percentualReembolso;
const valorRetido = valorReserva - valorReembolsado;
        const descricao = getDescricaoReembolso(percentualReembolso);
        
        dados[mesKey].estornos += valorReembolsado;
        dados[mesKey].retidoCancelamentos += valorRetido;
        
        dados[mesKey].transacoes.push({
          id: reserva.id,
          espaco: espacosMap.get(reserva.espaco_id) || "Espaço",
          espaco_id: reserva.espaco_id,
          data: new Date(reserva.created_at).toLocaleDateString("pt-BR"),
          dataEvento: new Date(reserva.data_inicio).toLocaleDateString("pt-BR"),
          status: "Cancelado",
          tipo: "Estorno",
          metodo: "Reembolso",
          valorBruto: valorReserva,
          valorLiquido: -valorReembolsado,
          taxa: taxa,
          dataLiberacao: "-",
          observacao: descricao,
        });
        continue;
      }

      // Reservas NÃO canceladas
      if (reserva.pagamento_status === "approved") {
        dados[mesKey].totalRecebido += valorReserva;
        dados[mesKey].taxas += taxa;
      }

      if (reserva.pagamento_status !== "approved" && reserva.status !== "cancelada") {
        dados[mesKey].aReceber += valorReserva;
      }

      const dataEvento = new Date(reserva.data_inicio);
      const dataLiberacao = new Date(dataEvento);
      dataLiberacao.setDate(dataEvento.getDate() + 3);

      dados[mesKey].transacoes.push({
        id: reserva.id,
        espaco: espacosMap.get(reserva.espaco_id) || "Espaço",
        espaco_id: reserva.espaco_id,
        data: new Date(reserva.created_at).toLocaleDateString("pt-BR"),
        dataEvento: new Date(reserva.data_inicio).toLocaleDateString("pt-BR"),
        status: statusTransacao,
        tipo: "Reserva",
        metodo: reserva.pagamento_status === "approved" ? "Cartão/Pix" : "Aguardando",
       valorBruto: valorReserva,
        valorLiquido: reserva.pagamento_status === "approved" ? valorLiquido : 0,
        taxa: reserva.pagamento_status === "approved" ? taxa : 0,
        dataLiberacao: reserva.pagamento_status === "approved" ? dataLiberacao.toLocaleDateString("pt-BR") : "-",
      });
    }

    // Calcular saldo transferido
    for (const mesKey in dados) {
      const transacoesLiberadas = dados[mesKey].transacoes.filter((t) => {
        if (t.status !== "Confirmado") return false;
        if (t.dataLiberacao === "-") return false;
        const [dia, mes, ano] = t.dataLiberacao.split("/");
        const dataLiberacao = new Date(`${ano}-${mes}-${dia}`);
        return dataLiberacao <= new Date();
      });
      dados[mesKey].saldoTransferido = transacoesLiberadas.reduce(
        (acc, t) => acc + t.valorLiquido,
        0
      );
    }

    setDadosPorMes(dados);

    // Ordenar meses cronologicamente
    const ordemMeses = [
      "janeiro", "fevereiro", "marco", "abril", "maio", "junho",
      "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
    ];

    const meses = Object.keys(dados).sort((a, b) => {
      const [mesA, anoA] = a.split(" ");
      const [mesB, anoB] = b.split(" ");
      
      if (anoA !== anoB) {
        return Number(anoA) - Number(anoB);
      }
      return ordemMeses.indexOf(mesA) - ordemMeses.indexOf(mesB);
    });

    setMesesDisponiveis(meses);

    if (meses.length > 0 && !mesSelecionado) {
      setMesSelecionado(meses[0]);
    }

  } catch (error) {
    console.error("Erro ao buscar dados financeiros:", error);
    toast.error("Erro ao carregar dados financeiros");
  } finally {
    setLoading(false);
  }
}

const mesAtual = dadosPorMes[mesSelecionado] || {
  totalRecebido: 0,
  aReceber: 0,
  taxas: 0,
  estornos: 0,
  saldoTransferido: 0,
  retidoCancelamentos: 0,
  transacoes: [],
};

const saldoDisponivel =
  mesAtual.totalRecebido 
  - mesAtual.taxas 
  - mesAtual.estornos 
  - mesAtual.saldoTransferido;

  const ultimos6Meses = mesesDisponiveis.slice(-6);
  const valores = ultimos6Meses.map(m => dadosPorMes[m]?.totalRecebido || 0);
  const maxValor = Math.max(...valores, 1);

  const formatarNomeMes = (mesKey: string) => {
    const [mes, ano] = mesKey.split(" ");
    const mesesMap: Record<string, string> = {
      "janeiro": "Janeiro", "fevereiro": "Fevereiro", "marco": "Março",
      "abril": "Abril", "maio": "Maio", "junho": "Junho",
      "julho": "Julho", "agosto": "Agosto", "setembro": "Setembro",
      "outubro": "Outubro", "novembro": "Novembro", "dezembro": "Dezembro"
    };
    const mesFormatado = mesesMap[mes] || mes.charAt(0).toUpperCase() + mes.slice(1);
    return `${mesFormatado} ${ano}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Carregando dados financeiros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
        
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          💰 Painel Financeiro do Anfitrião
        </h1>

        {/* Gráfico */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
            📈 Resumo de Ganhos Mensais
          </h2>

          {ultimos6Meses.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Nenhum dado financeiro disponível</p>
          ) : (
            <div className="max-h-[280px] sm:max-h-[400px] overflow-y-auto pr-2">
              <div className="space-y-3">
                {ultimos6Meses.map((mesKey) => {
                  const valor = dadosPorMes[mesKey]?.totalRecebido || 0;
                  const largura = (valor / maxValor) * 100;
                  const larguraMin = Math.max(largura, 8);
                  const nomeMesCompleto = mesKey.split(" ")[0];
                  const ano = mesKey.split(" ")[1];
                  const mesesMap: Record<string, string> = {
                    "janeiro": "Jan", "fevereiro": "Fev", "marco": "Mar",
                    "abril": "Abr", "maio": "Mai", "junho": "Jun",
                    "julho": "Jul", "agosto": "Ago", "setembro": "Set",
                    "outubro": "Out", "novembro": "Nov", "dezembro": "Dez"
                  };
                  const mesAbrev = mesesMap[nomeMesCompleto] || nomeMesCompleto;

                  return (
                    <div key={mesKey} className="flex items-center gap-3">
                      <div className="w-16 text-sm font-medium text-gray-600 dark:text-gray-400">
                        {mesAbrev} {ano}
                      </div>

                      <div className="flex-1">
                        <div className="relative group">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-8 overflow-hidden">
                            <div
                              className="bg-sky-500 h-full rounded-full flex items-center justify-end px-2 transition-all duration-500 hover:bg-sky-600"
                              style={{ width: `${larguraMin}%` }}
                            >
                              {larguraMin > 15 && (
                                <span className="text-xs text-white font-medium">
                                  R$ {valor.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="absolute bottom-full left-0 mb-1 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                            R$ {valor.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div className="w-24 text-right">
                        <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                          R$ {valor.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Seletor de Mês */}
        {mesesDisponiveis.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 mb-4">
            <label className="text-sm text-gray-600 block mb-1">📅 Mês</label>
            <select
              className="w-full bg-transparent text-gray-900 dark:text-gray-100 font-medium focus:outline-none"
              value={mesSelecionado}
              onChange={(e) => setMesSelecionado(e.target.value)}
            >
              {mesesDisponiveis.map((mesKey) => (
                <option key={mesKey} value={mesKey}>
                  {formatarNomeMes(mesKey)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Cards com explicação */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          
          {/* Card: Total de Vendas */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border-l-4 border-green-500">
            <p className="text-xs text-gray-500 uppercase tracking-flex">💰 Total de Vendas</p>
            <p className="text-2xl font-bold text-green-600 mt-1">R$ {mesAtual.totalRecebido.toFixed(2)}</p>
            <p className="text-xs text-gray-400 mt-1">Soma de todas as reservas confirmadas</p>
          </div>

          {/* Card: Taxas da Plataforma */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border-l-4 border-red-500">
            <p className="text-xs text-gray-500 uppercase tracking-flex">🏢 Taxa da PlacyHub</p>
            <p className="text-2xl font-bold text-red-600 mt-1">- R$ {mesAtual.taxas.toFixed(2)}</p>
            <p className="text-xs text-gray-400 mt-1">{TAXA_PLATAFORMA * 100}% sobre o valor das reservas</p>
          </div>

          {/* Card: Cancelamentos */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border-l-4 border-orange-500">
            <p className="text-xs text-gray-500 uppercase tracking-flex">⚠️ Cancelamentos</p>
            <p className="text-2xl font-bold text-orange-600 mt-1">- R$ {mesAtual.retidoCancelamentos.toFixed(2)}</p>
            <p className="text-xs text-gray-400 mt-1">Valor retido por cancelamentos (sem reembolso)</p>
          </div>

          {/* Card: Já Recebido */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border-l-4 border-sky-500">
            <p className="text-xs text-gray-500 uppercase tracking-flex">✅ Já Recebido</p>
            <p className="text-2xl font-bold text-sky-600 mt-1">R$ {mesAtual.saldoTransferido.toFixed(2)}</p>
            <p className="text-xs text-gray-400 mt-1">Valores já transferidos para sua conta</p>
          </div>

          {/* Card: A Receber */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border-l-4 border-yellow-500">
            <p className="text-xs text-gray-500 uppercase tracking-flex">⏳ A Receber</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">R$ {mesAtual.aReceber.toFixed(2)}</p>
            <p className="text-xs text-gray-400 mt-1">Reservas confirmadas que ainda serão liberadas</p>
          </div>

          {/* Card: Estornos (se houver) */}
          {mesAtual.estornos > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border-l-4 border-red-400">
              <p className="text-xs text-gray-500 uppercase tracking-flex">↩️ Estornos</p>
              <p className="text-2xl font-bold text-red-500 mt-1">- R$ {mesAtual.estornos.toFixed(2)}</p>
              <p className="text-xs text-gray-400 mt-1">Reembolsos feitos para clientes</p>
            </div>
          )}
        </div>

        {/* Legenda explicativa */}
        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 mb-6 border border-blue-200 dark:border-blue-800">
          <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">📌 Entenda os valores:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-blue-700 dark:text-blue-400">
            <div>💰 <strong>Total de Vendas:</strong> Soma de todas as reservas pagas</div>
            <div>🏢 <strong>Taxa:</strong> Comissão da PlacyHub ({TAXA_PLATAFORMA * 100}%)</div>
            <div>⚠️ <strong>Cancelamentos:</strong> Valor retido quando cliente cancelou sem direito a reembolso</div>
            <div>✅ <strong>Já Recebido:</strong> Valores já transferidos para sua conta</div>
            <div>⏳ <strong>A Receber:</strong> Reservas confirmadas que ainda serão liberadas</div>
            <div>💰 <strong>Saldo Disponível:</strong> Valor que pode ser sacado agora</div>
          </div>
        </div>

        {/* Saldo - Destaque principal */}
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl p-6 mb-8 shadow-lg">
          <div className="text-center">
            <p className="text-white/80 text-sm uppercase tracking-wide mb-1">💰 Saldo Disponível para Saque</p>
            <p className="text-4xl md:text-5xl font-bold text-white">R$ {saldoDisponivel.toFixed(2)}</p>
            <div className="flex justify-center gap-6 mt-4 text-xs text-white/70">
              <div className="text-center">
                <p className="font-semibold text-white">R$ {mesAtual.totalRecebido.toFixed(2)}</p>
                <p>Vendas</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-white">- R$ {mesAtual.taxas.toFixed(2)}</p>
                <p>Taxas</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-white">- R$ {mesAtual.saldoTransferido.toFixed(2)}</p>
                <p>Já recebido</p>
              </div>
            </div>
          </div>
        </div>

        {/* Transações */}
        <div className="mb-20">
          <h3 className="text-base font-semibold text-gray-800 mb-3">
            📋 Transações - {mesSelecionado ? formatarNomeMes(mesSelecionado) : ""}
          </h3>

          {mesAtual.transacoes.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
              <p className="text-gray-500">Nenhuma transação encontrada para este período.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {mesAtual.transacoes.map((transacao) => (
                <div key={transacao.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
                  <div className="flex justify-between mb-3 flex-wrap gap-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">{transacao.espaco}</h4>
                      <p className="text-xs text-gray-500">
                        Reserva: {transacao.data} | Evento: {transacao.dataEvento}
                      </p>
                      {transacao.observacao && (
                        <p className="text-xs text-orange-500 mt-1">{transacao.observacao}</p>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      transacao.status === "Confirmado" ? "bg-green-100 text-green-700" :
                      transacao.status === "Pendente" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {transacao.status === "Confirmado" ? "✅ Confirmado" : 
                       transacao.status === "Pendente" ? "⏳ Pendente" : "❌ Cancelado"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Tipo</p>
                      <p className="font-medium">{transacao.tipo === "Reserva" ? "🏷️ Reserva" : "↩️ Estorno"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Método</p>
                      <p className="font-medium">{transacao.metodo}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Valor Bruto</p>
                      <p className="font-medium">R$ {transacao.valorBruto.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Taxa ({TAXA_PLATAFORMA * 100}%)</p>
                      <p className="font-medium text-red-500">- R$ {transacao.taxa.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Valor Líquido</p>
                      <p className={`font-medium ${transacao.valorLiquido >= 0 ? "text-green-600" : "text-red-600"}`}>
                        R$ {Math.abs(transacao.valorLiquido).toFixed(2)}
                        {transacao.valorLiquido < 0 && " (reembolso)"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Liberação</p>
                      <p className="font-medium">{transacao.dataLiberacao !== "-" ? `📅 ${transacao.dataLiberacao}` : "⏳ Aguardando"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botão atualizar */}
        <div className="fixed bottom-4 right-4">
          <button
            onClick={buscarDadosFinanceiros}
            className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-full shadow-lg transition flex items-center gap-2"
          >
            🔄 Atualizar
          </button>
        </div>

      </div>
    </div>
  );
}