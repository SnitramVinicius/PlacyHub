"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import EspacoForm, { EspacoFormData } from "@/components/EspacoForm";
import { supabase } from "@/lib/supabase";

export default function EditarEspaco() {
  const params = useParams();
  const id = params.id as string;

  const [dados, setDados] = useState<EspacoFormData | null>(null);

  useEffect(() => {
    const buscarEspaco = async () => {
      // 1. Buscar dados do espaço
      
      const { data, error } = await supabase
        .from("spaces")
        .select("*")
        .eq("id", id)
        .single();

        console.log("📸 FOTOS VINDAS DO BANCO:", data.imagens);

      if (error) {
        console.error("Erro ao buscar espaço:", error);
        return;
      }

      // 2. Buscar regras
      const { data: regrasData } = await supabase
        .from("espaco_regras")
        .select("texto")
        .eq("espaco_id", id)
        .order("ordem", { ascending: true });

      // 3. Buscar facilidades
      const { data: facilidadesData } = await supabase
        .from("espaco_facilidades")
        .select("texto")
        .eq("espaco_id", id)
        .order("ordem", { ascending: true });

        //4. Buscar buffet
const { data: buffetData } = await supabase
  .from("espaco_buffet")
  .select("nivel, descricao, preco_base")
  .eq("espaco_id", id)
  .single(); // só um registro por espaço

//4. Buscar serviços
const { data: servicosData } = await supabase
  .from("espaco_servicos")
  .select("id, nome, preco")
  .eq("espaco_id", id)
  .order("ordem", { ascending: true });

const { data: categoriasData } = await supabase
  .from("espaco_categorias")
  .select(`
    id,
    nome,
    ordem,
    pacotes:espaco_pacotes (
      id,
      nome,
      descricao,
      info_adicional,
      ordem,
      duracao,        // ← ADICIONE ESTA LINHA!
      itens:espaco_itens_pacote (
        id,
        titulo,
        descricao,
        ordem
      ),
      precos:espaco_precos_pacote (
        id,
        convidados,
        valor,
        ordem
      )
    )
  `)
  .eq("espaco_id", id)
  .order("ordem", { ascending: true });

// Transformar para o formato esperado por EspacoFormData
let categoriasFesta: any[] = [];
if (categoriasData) {
categoriasFesta = categoriasData.map((cat: any) => ({
  id: cat.id,
  nome: cat.nome,
  pacotes: (cat.pacotes || []).map((pact: any) => ({
    id: pact.id,
    nome: pact.nome,
    descricao: pact.descricao,
    duracao: pact.duracao || "",  // ← ADICIONE ESTA LINHA!
    infoAdicional: pact.info_adicional || "",
    itens: (pact.itens || []).map((item: any) => ({
      titulo: item.titulo,
      descricao: item.descricao,
    })),
    precos: (pact.precos || []).map((preco: any) => ({
      convidados: preco.convidados,
      valor: preco.valor,
    })),
  })),
}));
}

     if (data) {
 let fotosArray: string[] = [];

// Verificar se data.imagens existe
if (data.imagens) {
  // Caso 1: Já é um array
  if (Array.isArray(data.imagens)) {
    fotosArray = data.imagens;
  } 
  // Caso 2: É uma string JSON
  else if (typeof data.imagens === 'string') {
    try {
      const parsed = JSON.parse(data.imagens);
      fotosArray = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      // Se não for JSON válido, pode ser uma URL única
      if (data.imagens.startsWith('http')) {
        fotosArray = [data.imagens];
      } else {
        fotosArray = [];
      }
    }
  }
}

// Filtrar URLs inválidas
fotosArray = fotosArray.filter(url => {
  return url && 
         typeof url === 'string' && 
         url.startsWith('http') && 
         !url.includes('"') && 
         !url.includes('[') && 
         !url.includes('\\') &&
         url.length > 10;
});

console.log("📸 FOTOS TRATADAS:", fotosArray);

if (data) {
  setDados({
    ...data,
    valor: data.preco ? data.preco / 100 : null,
    fotos: fotosArray,  // ← USANDO O ARRAY TRATADO
    regras: regrasData ? regrasData.map(r => r.texto) : [],
    facilidades: facilidadesData ? facilidadesData.map(f => f.texto) : [],
    servicos: servicosData ? servicosData.map(s => ({ id: s.id, nome: s.nome, preco: s.preco })) : [],
    tipo_reserva: data.tipo_reserva || "",
    buffet: buffetData ? {
      ativo: true,
      nivel: buffetData.nivel,
      descricao: buffetData.descricao,
      precoBase: buffetData.preco_base,
    } : null,
    modoBuffet: !!buffetData,
    temPlanos: categoriasFesta.length > 0,
    categoriasFesta: categoriasFesta,
    gruposDiasSemana: data.gruposDiasSemana || [],
    datasEspeciais: data.datasEspeciais || [],
  });
}
  setDados({
    ...data,
    valor: data.preco ? data.preco / 100 : null,
    fotos: fotosArray,  // ← USANDO O ARRAY TRATADO
    regras: regrasData ? regrasData.map(r => r.texto) : [],
    facilidades: facilidadesData ? facilidadesData.map(f => f.texto) : [],
    servicos: servicosData ? servicosData.map(s => ({ id: s.id, nome: s.nome, preco: s.preco })) : [],
    tipo_reserva: data.tipo_reserva || "",
    buffet: buffetData ? {
      ativo: true,
      nivel: buffetData.nivel,
      descricao: buffetData.descricao,
      precoBase: buffetData.preco_base,
    } : null,
    modoBuffet: !!buffetData,
    temPlanos: categoriasFesta.length > 0,
    categoriasFesta: categoriasFesta,
    gruposDiasSemana: data.gruposDiasSemana || [],
    datasEspeciais: data.datasEspeciais || [],
  });
}
    };

    if (id) {
      buscarEspaco();
    }
  }, [id]);

  const handleSubmit = async (dadosAtualizados: EspacoFormData, fotosNovas: File[]) => {

// Buscar as fotos que já estão no banco para não perdê-las
const { data: espacoAtual } = await supabase
  .from("spaces")
  .select("imagens")
  .eq("id", id)
  .single();

// TRATAR CORRETAMENTE AS FOTOS EXISTENTES
let fotosExistentesNoBanco: string[] = [];
if (espacoAtual?.imagens) {
  if (Array.isArray(espacoAtual.imagens)) {
    fotosExistentesNoBanco = espacoAtual.imagens;
  } else if (typeof espacoAtual.imagens === 'string') {
    try {
      const parsed = JSON.parse(espacoAtual.imagens);
      fotosExistentesNoBanco = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      fotosExistentesNoBanco = espacoAtual.imagens.startsWith('http') ? [espacoAtual.imagens] : [];
    }
  }
}

// Filtrar URLs inválidas
fotosExistentesNoBanco = fotosExistentesNoBanco.filter(url => 
  url && typeof url === 'string' && url.startsWith('http') && !url.includes('"') && !url.includes('\\')
);

console.log("📸 Fotos já no banco (tratadas):", fotosExistentesNoBanco);
console.log("📸 Fotos já no banco:", fotosExistentesNoBanco);
console.log("📸 Fotos que vieram do formulário:", dadosAtualizados.fotos);

    // 0. Fazer upload das novas fotos e obter URLs
const novasUrls: string[] = [];
for (const foto of fotosNovas) {
  const extensao = foto.name.split('.').pop();
  const nomeBase = `${crypto.randomUUID()}.${extensao}`;
  const { error: uploadError } = await supabase.storage
    .from("spaces")
    .upload(nomeBase, foto);
  if (uploadError) {
    console.error(uploadError);
    alert(`Erro ao enviar imagem: ${uploadError.message}`);
    return;
  }
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const urlCompleta = `${supabaseUrl}/storage/v1/object/public/spaces/${nomeBase}`;
  novasUrls.push(urlCompleta);
}

// Combinar URLs existentes com as novas
// Usar as fotos do banco (não as do formulário) para não perder nenhuma
const todasUrls = [...(fotosExistentesNoBanco || []), ...(novasUrls || [])];
console.log("📸 Todas URLs (array):", todasUrls);
    // 1. Atualizar a tabela principal spaces
    const { error: updateError } = await supabase
      .from("spaces")
      .update({
        nome_espaco: dadosAtualizados.nome_espaco,
        tipo_espaco: dadosAtualizados.tipo_espaco,
        tipo_reserva: dadosAtualizados.tipo_reserva,
        capacidade: dadosAtualizados.capacidade,
        area: dadosAtualizados.area,
        estado: dadosAtualizados.estado,
        cidade: dadosAtualizados.cidade,
        bairro: dadosAtualizados.bairro,
        endereco: dadosAtualizados.endereco,
        descricao: dadosAtualizados.descricao,
        preco: (dadosAtualizados.valor ?? 0) * 100,
        temPlanos: dadosAtualizados.temPlanos,
        imagens: todasUrls,
        // Se quiser guardar outros campos simples no futuro, adicione aqui
      })
      .eq("id", id);

    if (updateError) {
      console.error("Erro ao atualizar espaço:", updateError);
      alert("Erro ao atualizar espaço");
      return;
    }

    // 2. Atualizar buffet (deleta e insere)
await supabase.from("espaco_buffet").delete().eq("espaco_id", id);
if (dadosAtualizados.modoBuffet && dadosAtualizados.buffet) {
  const buffetInsert = {
    espaco_id: id,
    nivel: dadosAtualizados.buffet.nivel,
    descricao: dadosAtualizados.buffet.descricao,
    preco_base: dadosAtualizados.buffet.precoBase,
  };
  const { error: buffetError } = await supabase
    .from("espaco_buffet")
    .insert(buffetInsert);
  if (buffetError) console.error("Erro ao inserir buffet:", buffetError);
}

// 2. Atualizar regras: deletar as antigas e inserir as novas
await supabase.from("espaco_regras").delete().eq("espaco_id", id);
if (dadosAtualizados.regras && dadosAtualizados.regras.length > 0) {
  const regrasInsert = dadosAtualizados.regras.map((texto, idx) => ({
    espaco_id: id,
    texto,
    ordem: idx,
  }));
  const { error: regrasError } = await supabase
    .from("espaco_regras")
    .insert(regrasInsert);
  if (regrasError) {
    console.error("Erro detalhado regras:", JSON.stringify(regrasError, null, 2));
    if (regrasError.message) alert(`Erro regras: ${regrasError.message}`);
  }
}

// 3. Atualizar facilidades: deletar as antigas e inserir as novas
await supabase.from("espaco_facilidades").delete().eq("espaco_id", id);
if (dadosAtualizados.facilidades && dadosAtualizados.facilidades.length > 0) {
  const facilidadesInsert = dadosAtualizados.facilidades.map((texto, idx) => ({
    espaco_id: id,
    texto,
    ordem: idx,
  }));
  const { error: facilidadesError } = await supabase
    .from("espaco_facilidades")
    .insert(facilidadesInsert);
  if (facilidadesError) {
    console.error("Erro detalhado facilidades:", JSON.stringify(facilidadesError, null, 2));
    if (facilidadesError.message) alert(`Erro facilidades: ${facilidadesError.message}`);
  }
}

// 4. Atualizar serviços
await supabase.from("espaco_servicos").delete().eq("espaco_id", id);
if (dadosAtualizados.servicos && dadosAtualizados.servicos.length > 0) {
  const servicosInsert = dadosAtualizados.servicos.map((servico, idx) => ({
    espaco_id: id,
    nome: servico.nome,
    preco: servico.preco,
    ordem: idx,
  }));
  const { error: servicosError } = await supabase
    .from("espaco_servicos")
    .insert(servicosInsert);
  if (servicosError) {
    console.error("Erro detalhado serviços:", JSON.stringify(servicosError, null, 2));
    if (servicosError.message) alert(`Erro serviços: ${servicosError.message}`);
  }
}

// 5. Atualizar pacotes de festa (deleta tudo e recria)
await supabase.from("espaco_categorias").delete().eq("espaco_id", id);

if (dadosAtualizados.temPlanos && dadosAtualizados.categoriasFesta && dadosAtualizados.categoriasFesta.length > 0) {
  for (const categoria of dadosAtualizados.categoriasFesta) {
    // Inserir categoria
    const { data: catData, error: catError } = await supabase
      .from("espaco_categorias")
      .insert({
        espaco_id: id,
        nome: categoria.nome,
        ordem: 0,
      })
      .select()
      .single();
    if (catError) {
      console.error("Erro ao inserir categoria:", catError);
      continue;
    }
    const categoriaId = catData.id;

    // Inserir pacotes da categoria
    for (let pIdx = 0; pIdx < categoria.pacotes.length; pIdx++) {
      const pacote = categoria.pacotes[pIdx];
      const { data: pacData, error: pacError } = await supabase
        .from("espaco_pacotes")
        .insert({
          categoria_id: categoriaId,
          nome: pacote.nome,
          descricao: pacote.descricao,
          duracao: pacote.duracao || "",
          info_adicional: pacote.infoAdicional || null,
          ordem: pIdx,
        })
        .select()
        .single();
      if (pacError) {
        console.error("Erro ao inserir pacote:", pacError);
        continue;
      }
      const pacoteId = pacData.id;

      // Inserir itens do pacote
      for (let iIdx = 0; iIdx < pacote.itens.length; iIdx++) {
        const item = pacote.itens[iIdx];
        await supabase.from("espaco_itens_pacote").insert({
          pacote_id: pacoteId,
          titulo: item.titulo || "",
          descricao: item.descricao || "",
          ordem: iIdx,
        });
      }

      // Inserir preços do pacote
      for (let prIdx = 0; prIdx < pacote.precos.length; prIdx++) {
        const preco = pacote.precos[prIdx];
        await supabase.from("espaco_precos_pacote").insert({
          pacote_id: pacoteId,
          convidados: preco.convidados || 0,
          valor: preco.valor || 0,
          ordem: prIdx,
        });
      }
    }
  }
}


    alert("Espaço atualizado com sucesso!");
  };

  if (!dados) return <p>Carregando...</p>;

  return (
    <EspacoForm
      modo="editar"
      dadosIniciais={dados}
      onSubmit={handleSubmit}
    />
  );
}