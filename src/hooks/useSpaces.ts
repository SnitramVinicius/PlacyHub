import { useQuery } from "@tanstack/react-query";
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

  espaco_categorias(
    pacotes:espaco_pacotes(
      precos:espaco_precos_pacote(
        valor
      )
    )
  )
`;

function mapSpaces(data:any[] = []) {

  return data.map((item:any)=>{

    let precoMinimoBuffet = null;


    if(item.espaco_categorias){

      for(const categoria of item.espaco_categorias){

        for(const pacote of categoria.pacotes || []){

          for(const preco of pacote.precos || []){


            if(
              preco.valor &&
              (
                precoMinimoBuffet === null ||
                preco.valor < precoMinimoBuffet
              )
            ){

              precoMinimoBuffet = preco.valor;

            }

          }

        }

      }

    }


    return {

      id:item.id,

      nome:item.nome_espaco,

      preco:(item.preco || 0) / 100,


      precoMinimoBuffet,


      avaliacao:item.avaliacao || 5,


      popularidade:item.popularidade || 0,


      cidade:item.cidade || "",


      duracao:item.duracao || 4,


      imagem:
        item.imagens?.[0] ||
        item.imagem ||
        "https://placehold.co/400x300",


      buffet:
        precoMinimoBuffet !== null ||
        item.buffet === true,


      tipo:item.tipo_espaco,

    };

  });

}


async function fetchSpaces(){

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
.order("avaliacao",{ascending:false})
.limit(10),

supabase
.from("spaces")
.select(selectFields)
.order("popularidade",{ascending:false})
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


return {

 indicados: mapSpaces(indicadosQuery.data ?? []),

 destaque: mapSpaces(destaqueQuery.data ?? []),

 fimDeSemana: mapSpaces(fimSemanaQuery.data ?? []),

 proximos: mapSpaces(proximosQuery.data ?? []),

 recomendados: mapSpaces(recomendadosQuery.data ?? []),

};

}



export function useSpaces(){

return useQuery({

 queryKey:["spaces-home"],

 queryFn:fetchSpaces,

 staleTime:1000 * 60 * 5,

});

}