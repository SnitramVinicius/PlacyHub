import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { calcularValorPeriodo } from "@/utils/precificacao";
import { TAXAS, arredondarMoeda } from "@/config/taxa";
import { limitePermitido } from "@/lib/server/rateLimit";

const DATA_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function POST(request: Request) {
  try {
    const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (!token) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

    const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !authData.user) return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
    if (!(await limitePermitido(`reserva:${authData.user.id}`, 600, 10))) {
      return NextResponse.json({ error: "Muitas tentativas. Aguarde alguns minutos." }, { status: 429 });
    }

    const body = await request.json();
    const espacoId = typeof body.espacoId === "string" ? body.espacoId : "";
    const dataInicio = typeof body.dataInicio === "string" ? body.dataInicio : "";
    const dataFim = typeof body.dataFim === "string" ? body.dataFim : dataInicio;
    const qtdPessoas = Number(body.qtdPessoas);
    const limpezaSolicitada = body.limpezaSelecionada === true;
    const precoPacoteId = typeof body.precoPacoteId === "string" ? body.precoPacoteId : null;

    if (!espacoId || !DATA_RE.test(dataInicio) || !DATA_RE.test(dataFim)) {
      return NextResponse.json({ error: "Dados da reserva inválidos." }, { status: 400 });
    }

    const inicio = new Date(`${dataInicio}T12:00:00`);
    const fim = new Date(`${dataFim}T12:00:00`);
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    const dias = Math.floor((fim.getTime() - inicio.getTime()) / 86400000) + 1;
    if (Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime()) || inicio < hoje || dias < 1 || dias > 31) {
      return NextResponse.json({ error: "Período da reserva inválido." }, { status: 422 });
    }

    const { data: espaco, error: espacoError } = await supabaseAdmin
      .from("spaces")
      .select("*")
      .eq("id", espacoId)
      .single();
    if (espacoError) {
      console.error("Erro ao consultar espaço para reserva:", espacoError);
      return NextResponse.json({ error: "Não foi possível consultar o espaço." }, { status: 500 });
    }
    if (!espaco || espaco.disponivel === false) {
      return NextResponse.json({ error: "Espaço indisponível." }, { status: 404 });
    }
    if (espaco.user_id === authData.user.id) {
      return NextResponse.json({ error: "O anfitrião não pode reservar o próprio espaço." }, { status: 422 });
    }

    let valorLocacao = 0;
    let pacoteNome: string | null = null;
    let convidadosPacote: number | null = null;

    if (espaco.temPlanos) {
      if (!precoPacoteId) return NextResponse.json({ error: "Selecione um pacote." }, { status: 422 });
      const { data: faixa, error: faixaError } = await supabaseAdmin
        .from("espaco_precos_pacote")
        .select("id, convidados, valor, pacote:espaco_pacotes!inner(nome, categoria:espaco_categorias!inner(espaco_id))")
        .eq("id", precoPacoteId)
        .single();
      const pacote = Array.isArray(faixa?.pacote) ? faixa?.pacote[0] : faixa?.pacote;
      const categoria = Array.isArray(pacote?.categoria) ? pacote?.categoria[0] : pacote?.categoria;
      if (faixaError || !faixa || categoria?.espaco_id !== espacoId) {
        return NextResponse.json({ error: "Pacote inválido para este espaço." }, { status: 422 });
      }
      valorLocacao = Number(faixa.valor) / 100;
      pacoteNome = pacote?.nome || null;
      convidadosPacote = Number(faixa.convidados);
      if (!Number.isInteger(qtdPessoas) || qtdPessoas !== convidadosPacote) {
        return NextResponse.json({ error: "Quantidade de convidados inválida para o pacote." }, { status: 422 });
      }
    } else {
      if (!Number.isInteger(qtdPessoas) || qtdPessoas < 1 || qtdPessoas > Number(espaco.capacidade || 0)) {
        return NextResponse.json({ error: "Quantidade de pessoas inválida." }, { status: 422 });
      }
      valorLocacao = calcularValorPeriodo(inicio, fim, espaco);
    }

    const taxaLimpezaDisponivel = espaco.temPlanos ? 0 : Number(espaco.taxa_limpeza_valor || 0) / 100;
    const limpezaSelecionada = espaco.taxa_limpeza_opcional === false ? taxaLimpezaDisponivel > 0 : limpezaSolicitada && taxaLimpezaDisponivel > 0;
    const taxaLimpeza = limpezaSelecionada ? taxaLimpezaDisponivel : 0;
    const valorBase = arredondarMoeda(valorLocacao + taxaLimpeza);
    const taxaCliente = arredondarMoeda(valorBase * TAXAS.locatario);
    const comissao = arredondarMoeda(valorBase * TAXAS.anfitriao);
    const total = arredondarMoeda(valorBase + taxaCliente);
    if (!Number.isFinite(total) || total <= 0) return NextResponse.json({ error: "Preço do espaço inválido." }, { status: 422 });

    const limite = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    const { data: existente } = await supabaseAdmin.from("reservas").select("*")
      .eq("espaco_id", espacoId).eq("user_id", authData.user.id)
      .eq("data_inicio", dataInicio).eq("data_fim", dataFim).eq("status", "pendente")
      .gte("created_at", limite).order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (existente) return NextResponse.json({ reserva: existente, reutilizada: true });

    const { data: reserva, error: insertError } = await supabaseAdmin.from("reservas").insert({
      espaco_id: espacoId, user_id: authData.user.id, data_inicio: dataInicio, data_fim: dataFim,
      status: "pendente", qtd_pessoas: qtdPessoas, valor_base: valorBase, taxa_limpeza: arredondarMoeda(taxaLimpeza),
      limpeza_selecionada: limpezaSelecionada, taxa_placyhub: taxaCliente, comissao_placyhub: comissao,
      repasse_anfitriao: arredondarMoeda(valorBase - comissao), valor_total: total,
      pacote_nome: pacoteNome, convidados_pacote: convidadosPacote,
    }).select().single();

    if (insertError) {
      if (insertError.code === "23P01" || insertError.code === "23505") {
        return NextResponse.json({ error: "A data acabou de ser reservada por outra pessoa." }, { status: 409 });
      }
      throw insertError;
    }
    return NextResponse.json({ reserva }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar reserva:", error);
    return NextResponse.json({ error: "Não foi possível criar a reserva." }, { status: 500 });
  }
}
