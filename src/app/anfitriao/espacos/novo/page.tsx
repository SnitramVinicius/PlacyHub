"use client";
import { useRouter } from "next/navigation";
import EspacoForm, { EspacoFormData } from "@/components/EspacoForm";
import { supabase } from "@/lib/supabase";

export default function NovoEspaco() {
  const router = useRouter();

  const handleSubmit = async (dados: EspacoFormData, fotosNovas: File[]) => {
    const urls: string[] = [];

    // 1. Upload das fotos
    for (const foto of fotosNovas) {
      const extensao = foto.name.split('.').pop();
      const nomeBase = `${crypto.randomUUID()}.${extensao}`;

      const { error: uploadError } = await supabase.storage
        .from("spaces")
        .upload(nomeBase, foto, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("Erro detalhado do Supabase:", uploadError);
        alert(`Erro ao enviar imagem: ${uploadError.message}`);
        return;
      }

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const urlCompleta = `${supabaseUrl}/storage/v1/object/public/spaces/${nomeBase}`;
      urls.push(urlCompleta);
    }

    // 2. Inserir o espaço e obter o ID
    const { data: espacoData, error: insertError } = await supabase
      .from("spaces")
      .insert([
        {
          nome_espaco: dados.nome_espaco,
          tipo_espaco: dados.tipo_espaco,
          capacidade: dados.capacidade,
          area: dados.area,
          estado: dados.estado,
          cidade: dados.cidade,
          bairro: dados.bairro,
          endereco: dados.endereco,
          descricao: dados.descricao,
          preco: (dados.valor || 0) * 100,
          temPlanos: dados.temPlanos,  
          imagens: urls.filter(url => url && url.startsWith('http')),
        },
      ])
      .select(); // 🔥 ESSENCIAL

    if (insertError) {
      console.error(insertError);
      alert("Erro ao salvar o espaço no banco de dados");
      return;
    }

    const espacoId = espacoData[0].id;

    // 3. Inserir regras
    if (dados.regras && dados.regras.length > 0) {
      const regrasInsert = dados.regras.map((texto, idx) => ({
        espaco_id: espacoId,
        texto: texto,
        ordem: idx,
      }));
      const { error: regrasError } = await supabase
        .from("espaco_regras")
        .insert(regrasInsert);
      if (regrasError) console.error("Erro ao inserir regras:", regrasError);
    }

    // 4. Inserir facilidades
    if (dados.facilidades && dados.facilidades.length > 0) {
      const facilidadesInsert = dados.facilidades.map((texto, idx) => ({
        espaco_id: espacoId,
        texto: texto,
        ordem: idx,
      }));
      const { error: facilidadesError } = await supabase
        .from("espaco_facilidades")
        .insert(facilidadesInsert);
      if (facilidadesError) console.error("Erro ao inserir facilidades:", facilidadesError);
    }

    // 5. Inserir serviços
    if (dados.servicos && dados.servicos.length > 0) {
  const servicosInsert = dados.servicos.map((servico, idx) => ({
    espaco_id: espacoId,
    nome: servico.nome,
    preco: servico.preco,
    ordem: idx,
  }));
  const { error: servicosError } = await supabase
    .from("espaco_servicos")
    .insert(servicosInsert);
  if (servicosError) console.error("Erro ao inserir serviços:", servicosError);
}

// 6. Inserir buffet (se existir e modoBuffet = true)
if (dados.modoBuffet && dados.buffet) {
  const buffetInsert = {
    espaco_id: espacoId,
    nivel: dados.buffet.nivel,
    descricao: dados.buffet.descricao,
    preco_base: dados.buffet.precoBase, // sem multiplicar)
  };
  const { error: buffetError } = await supabase
    .from("espaco_buffet")
    .insert(buffetInsert);
  if (buffetError) console.error("Erro ao inserir buffet:", buffetError);
}

// 7. Inserir categorias, pacotes, itens e preços (se temPlanos)
if (dados.temPlanos && dados.categoriasFesta && dados.categoriasFesta.length > 0) {
  for (const categoria of dados.categoriasFesta) {
    // Inserir categoria
    const { data: catData, error: catError } = await supabase
      .from("espaco_categorias")
      .insert({
        espaco_id: espacoId,
        nome: categoria.nome,
        ordem: 0, // você pode usar um índice se quiser ordernar
      })
      .select()
      .single();
    if (catError) {
      console.error("Erro ao inserir categoria:", catError);
      continue;
    }
    const categoriaId = catData.id;

    // Inserir pacotes desta categoria
    for (let pIdx = 0; pIdx < categoria.pacotes.length; pIdx++) {
      const pacote = categoria.pacotes[pIdx];
      const { data: pacData, error: pacError } = await supabase
        .from("espaco_pacotes")
        .insert({
          categoria_id: categoriaId,
          nome: pacote.nome,
          descricao: pacote.descricao,
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
        const { error: itemError } = await supabase
          .from("espaco_itens_pacote")
          .insert({
            pacote_id: pacoteId,
            titulo: item.titulo,
            descricao: item.descricao,
            ordem: iIdx,
          });
        if (itemError) console.error("Erro ao inserir item:", itemError);
      }

      // Inserir preços do pacote
      for (let prIdx = 0; prIdx < pacote.precos.length; prIdx++) {
        const preco = pacote.precos[prIdx];
        // preco.valor já está em reais (número)
        const valorNumerico = preco.valor !== undefined && preco.valor !== null ? preco.valor : 0;
        const { error: precoError } = await supabase
          .from("espaco_precos_pacote")
          .insert({
            pacote_id: pacoteId,
            convidados: preco.convidados || 0,
            valor: valorNumerico,
            ordem: prIdx,
          });
        if (precoError) console.error("Erro ao inserir preço:", precoError);
      }
    }
  }
}

    alert("Espaço cadastrado com sucesso!");
    router.push("/anfitriao/espacos");
  };

  return (
    <EspacoForm
      modo="criar"
      dadosIniciais={null}
      onSubmit={handleSubmit}
    />
  );
}