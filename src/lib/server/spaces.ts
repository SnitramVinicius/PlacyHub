import { supabase } from "@/lib/supabase";


const selectFields = `
  id,
  nome_espaco,
  preco,
  cidade,
  avaliacao,
  popularidade,
  duracao,
  imagens,
  imagem,
  buffet,
  tipo_espaco,
  espaco_buffet (
    preco_base
  )
`;

function mapSpaces(data:any[] = []) {

  return data.map(item => ({
    id: item.id,

    nome: item.nome_espaco,

    preco: (item.preco || 0) / 100,

   precoMinimoBuffet:
  item.espaco_buffet?.[0]?.preco_base || null,

    avaliacao: item.avaliacao || 5,

    popularidade: item.popularidade || 0,

    cidade: item.cidade || "",

    duracao: item.duracao || 4,

    imagem:
      item.imagens?.[0] ||
      item.imagem ||
      "https://placehold.co/400x300/3b82f6/white?text=Espaço",

   buffet: item.buffet === true || item.espaco_buffet?.length > 0,

    tipo: item.tipo_espaco,

  }));

}



export async function getSpacesHome() {


  const [
    indicadosQuery,
    destaqueQuery,
    fimSemanaQuery,
    proximosQuery,
    recomendadosQuery,
  ] = await Promise.all([


    supabase
      .from("spaces")
      .select(selectFields)
      .order("avaliacao", { ascending:false })
      .limit(10),


    supabase
      .from("spaces")
      .select(selectFields)
      .order("popularidade", { ascending:false })
      .limit(10),


    supabase
      .from("spaces")
      .select(selectFields)
      .lte("preco",60000)
      .limit(10),


    supabase
      .from("spaces")
      .select(selectFields)
      .ilike("cidade","%Campo Grande%")
      .limit(10),


    supabase
      .from("spaces")
      .select(selectFields)
      .order("avaliacao",{ascending:false})
      .order("popularidade",{ascending:false})
      .limit(10),


  ]);

console.log("INDICADOS:", indicadosQuery);
console.log("DESTAQUE:", destaqueQuery);
console.log("FDS:", fimSemanaQuery);
console.log("PROXIMOS:", proximosQuery);
console.log("RECOMENDADOS:", recomendadosQuery);


  return {

    indicados: mapSpaces(indicadosQuery.data ?? []),

    destaque: mapSpaces(destaqueQuery.data ?? []),

    fimDeSemana: mapSpaces(fimSemanaQuery.data ?? []),

    proximos: mapSpaces(proximosQuery.data ?? []),

    recomendados: mapSpaces(recomendadosQuery.data ?? []),

  };


}