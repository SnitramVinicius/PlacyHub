"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EspacoForm, { EspacoFormData } from "@/components/EspacoForm";
import { supabase } from "@/lib/supabase";
import { obterPendenciasPerfil } from "@/lib/validarPerfilCompleto";
import { toast } from "sonner";

export default function NovoEspaco() {
  const router = useRouter();
  const [verificandoPerfil, setVerificandoPerfil] = useState(true);

  const validarPerfil = async (userId: string, redirecionar = true) => {
    const { data: perfil, error } = await supabase
      .from("users")
      .select("name, email, telefone, cpf, cep, rua, numero, bairro, cidade, estado, data_nascimento")
      .eq("id", userId)
      .single();

    if (error || !perfil) {
      toast.error("Não foi possível validar seus dados pessoais.");
      return false;
    }

    const pendencias = obterPendenciasPerfil(perfil);
    if (pendencias.length > 0) {
      toast.error(`Complete seu perfil antes de cadastrar um espaço: ${pendencias.join(", ")}.`);
      if (redirecionar) router.replace("/locatario/perfil");
      return false;
    }

    return true;
  };

  useEffect(() => {
    let ativo = true;

    async function verificarAcesso() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        toast.error("Faça login para cadastrar um espaço.");
        router.replace("/login");
        return;
      }

      const perfilCompleto = await validarPerfil(user.id);
      if (ativo && perfilCompleto) setVerificandoPerfil(false);
    }

    verificarAcesso();
    return () => {
      ativo = false;
    };
  }, []);

const handleSubmit = async (dados: EspacoFormData, fotosNovas: File[]) => {

 // 🔥 PEGAR USUÁRIO LOGADO PELO SUPABASE AUTH
const {
  data: { user },
  error: authError
} = await supabase.auth.getUser();


if (authError || !user) {
  alert("Usuário não autenticado. Faça login novamente.");
  return;
}
if (!(await validarPerfil(user.id))) return;
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
          user_id: user.id,
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
          grupos_dias_semana: (dados.gruposDiasSemana || []).map((grupo) => ({
            ...grupo,
            valor: Math.round((grupo.valor || 0) * 100),
          })),
          taxa_limpeza_valor: Math.round((dados.taxaLimpezaValor || 0) * 100),
          taxa_limpeza_opcional: dados.taxaLimpezaOpcional,
          temPlanos: dados.temPlanos,  
          imagens: urls.filter(url => url && url.startsWith('http')),
        },
      ])
      .select(); // 🔥 ESSENCIAL

    if (insertError) {
      console.error("Erro ao inserir espaço:", JSON.stringify(insertError, null, 2));
      const colunaNaoEncontrada = insertError.code === "PGRST204" || /column|schema cache/i.test(insertError.message || "");
      toast.error(
        colunaNaoEncontrada
          ? "O banco ainda não recebeu a atualização de preços por dia e taxa de limpeza. Aplique a migração 20260825 no Supabase."
          : `Erro ao salvar o espaço: ${insertError.message || "erro desconhecido"}`
      );
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

    toast.success("Espaço cadastrado com sucesso!");
    router.replace("/anfitriao/espacos");
    router.refresh();
  };

  if (verificandoPerfil) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="h-10 w-10 mx-auto mb-3 rounded-full border-4 border-sky-500 border-t-transparent animate-spin" />
          <p className="text-sm text-gray-600 dark:text-gray-300">Verificando seus dados pessoais...</p>
        </div>
      </div>
    );
  }

  return (
    <EspacoForm
      modo="criar"
      dadosIniciais={null}
      onSubmit={handleSubmit}
    />
  );
}
