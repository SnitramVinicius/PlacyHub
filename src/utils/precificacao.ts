// utils/precificacao.ts

// Função auxiliar para converter centavos para reais
function converterParaReais(valorEmCentavos: number): number {
  return valorEmCentavos / 100;
}

export function obterValorParaData(data: Date, espaco: any): number {
  const dataString = data.toISOString().split("T")[0];
  const diaSemana = data.getDay(); // 0 = domingo

  const grupos = espaco.gruposDias || [];
  const datasEspecificas = espaco.datasEspecificas || [];

  // 1️⃣ Verifica se existe DATA ESPECÍFICA para esse dia
  const dataEspecial = datasEspecificas.find(
    (d: any) => d.data === dataString
  );

  if (dataEspecial) {
    // 🔥 CONVERTE centavos para reais
    return converterParaReais(dataEspecial.valor);
  }

  // 2️⃣ Se não tiver data específica, verifica GRUPO RECORRENTE
  const grupoEncontrado = grupos.find((grupo: any) =>
    grupo.diasSemana.includes(diaSemana)
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