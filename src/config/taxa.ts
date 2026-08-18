export const TAXAS = {
  locatario: 0.05,
  anfitriao: 0.05,
};

export function arredondarMoeda(valor: number) {
  return Math.round((valor + Number.EPSILON) * 100) / 100;
}

export function calcularValorBase(valorPago:number){

  return arredondarMoeda(valorPago / (1 + TAXAS.locatario));

}


export function calcularTaxaAnfitriao(valorBase:number){

  return arredondarMoeda(valorBase * TAXAS.anfitriao);

}


export function calcularLiquidoAnfitriao(valorPago:number){

  const base = calcularValorBase(valorPago);

  const taxa = calcularTaxaAnfitriao(base);

  return arredondarMoeda(base - taxa);

}
