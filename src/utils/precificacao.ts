// utils/precificacao.ts

// Função auxiliar para converter centavos para reais
function converterParaReais(valorEmCentavos: unknown): number {
  const valor = Number(valorEmCentavos ?? 0);
  return Number.isFinite(valor) ? valor / 100 : 0;
}

export interface GrupoPrecoDia {
  id: string;
  dias: number[];
  valor: number | null;
}

export function obterValorParaData(data: Date, espaco: any): number {
  const diaSemana = data.getDay(); // 0 = domingo

  const grupos: GrupoPrecoDia[] = espaco.grupos_dias_semana || espaco.gruposDiasSemana || [];
  const datasEspecificas = espaco.datas_especiais || espaco.datasEspeciais || [];

  // 1️⃣ Verifica se existe DATA ESPECÍFICA para esse dia
  const dataEspecial = datasEspecificas.find(
    (d: any) => d.data === `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`
  );

  if (dataEspecial) {
    // 🔥 CONVERTE centavos para reais
    return converterParaReais(dataEspecial.valor);
  }

  // 2️⃣ Se não tiver data específica, verifica GRUPO RECORRENTE
  const grupoEncontrado = grupos.find((grupo: any) =>
    (grupo.dias || []).includes(diaSemana)
  );

  if (grupoEncontrado) {
    // 🔥 CONVERTE centavos para reais
    return converterParaReais(grupoEncontrado.valor);
  }

  // 3️⃣ Se não tiver nada, usa preço padrão (convertendo centavos para reais)
  return converterParaReais(espaco.preco ?? 0);
}

export function calcularValorPeriodo(
  dataInicio: Date,
  dataFim: Date,
  espaco: any
): number {
  let total = 0;

  const dataAtual = new Date(dataInicio);

  while (dataAtual <= dataFim) {
    const valorDia = obterValorParaData(dataAtual, espaco);
    total += valorDia;

    // Avança 1 dia
    dataAtual.setDate(dataAtual.getDate() + 1);
  }

  return total;
}

export function obterNomeFaixaParaData(data: Date, espaco: any): string | null {
  const grupos: GrupoPrecoDia[] = espaco?.grupos_dias_semana || espaco?.gruposDiasSemana || [];
  const grupo = grupos.find((item) => (item.dias || []).includes(data.getDay()));
  if (!grupo) return null;
  const nomes = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
  return grupo.dias.map((dia) => nomes[dia]).join(", ");
}
