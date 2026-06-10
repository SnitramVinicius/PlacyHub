import { supabase } from "@/lib/supabase"

export async function criarEspaco(dados: any) {
  const { data, error } = await supabase.from("spaces").insert([
    {
      nome_espaco: dados.nome_espaco,
      tipo_espaco: dados.tipo_espaco,
      tipo_reserva: dados.tipo_reserva,
      capacidade: dados.capacidade,
      area: dados.area,
      endereco: dados.endereco,
      descricao: dados.descricao,
      preco: dados.valor,
      imagens: dados.fotos,
    },
  ])

  return { data, error }
}