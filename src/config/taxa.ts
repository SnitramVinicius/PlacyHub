export const TAXAS = {
  locatario: 0.05,
  anfitriao: 0.05,
};


export function calcularValorBase(valorPago:number){

  return valorPago / (1 + TAXAS.locatario);

}


export function calcularTaxaAnfitriao(valorBase:number){

  return valorBase * TAXAS.anfitriao;

}


export function calcularLiquidoAnfitriao(valorPago:number){

  const base = calcularValorBase(valorPago);

  const taxa = calcularTaxaAnfitriao(base);

  return base - taxa;

}