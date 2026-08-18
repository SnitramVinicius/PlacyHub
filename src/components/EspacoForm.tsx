"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createClient } from '@supabase/supabase-js';

/* =========================
   TIPOS (mantidos iguais)
========================= */

interface Preco {
  convidados?: number;
  valor?: number;
}

interface ItemPacote {
  titulo: string;
  descricao: string;
}

interface Pacote {
  id: string;
  nome: string;
  descricao: string;
   duracao?: string;
  infoAdicional?: string;
  itens: ItemPacote[];
  precos: Preco[];
}

interface CategoriaFesta {
  id: string;
  nome: string;
  pacotes: Pacote[];
}

interface Buffet {
  ativo: boolean;
  nivel: string;
  descricao: string;
  precoBase: number | null;
}

interface Servico {
  id: string;
  nome: string;
  preco: number | null;
}

export interface EspacoFormData {
  id?: string;
  nome_espaco: string;
  tipo_espaco: string;
  capacidade: number;
  area: number;
  estado: string;
  cidade: string;
  bairro: string;
  endereco: string;
  descricao: string;
  disponivel: string;
  modoBuffet: boolean;
  temPlanos: boolean;
  valor: number | null;
  gruposDiasSemana?: GrupoDiasSemana[];
  datasEspeciais?: {
    tipo: "recorrente" | "especifica";
    dia?: number;
    mes?: number;
    inicio?: string;
    fim?: string;
    valor: number;
  }[];
  buffet: Buffet | null;
  categoriasFesta: CategoriaFesta[];
  servicos: Servico[];
  regras: string[];
  facilidades: string[];
  fotos: string[];
}

interface GrupoDiasSemana {
  id: string;
  dias: number[];
  valor: number | null;
}

interface EspacoFormProps {
  modo: "criar" | "editar";
  dadosIniciais?: EspacoFormData | null;
  onSubmit: (dados: EspacoFormData, fotosNovas: File[]) => void;
}

/* =========================
   COMPONENTE
========================= */

export default function EspacoForm({
  modo,
  dadosIniciais,
  onSubmit,
}: EspacoFormProps) {
  /* =========================
     ESTADOS PRINCIPAIS
  ========================= */

  const [nomeEspaco, setNomeEspaco] = useState("");
  const [tipoEspaco, setTipoEspaco] = useState("");
  const [capacidade, setCapacidade] = useState<number | "">("");
  const [area, setArea] = useState<number | "">("");
  const [endereco, setEndereco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [disponivel, setDisponivel] = useState("true");
  const [mostrarServicos, setMostrarServicos] = useState(false);
  const [modoBuffet, setModoBuffet] = useState(false);
  const [temPlanos, setTemPlanos] = useState(false);
  const [valor, setValor] = useState<number | null>(null);

  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");

  const [estados, setEstados] = useState<any[]>([]);
  const [cidades, setCidades] = useState<any[]>([]);


  const [buffet, setBuffet] = useState<Buffet>({
    ativo: true,
    nivel: "simples",
    descricao: "",
    precoBase: null,
  });

  const formatarMoeda = (valor?: number | null) => {
    if (valor == null) return "";
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const [categoriasFesta, setCategoriasFesta] =
    useState<CategoriaFesta[]>([]);

  const [servicos, setServicos] = useState<Servico[]>([]);
  const [regras, setRegras] = useState<string[]>([]);
  const [facilidades, setFacilidades] = useState<string[]>([]);
  const [fotosExistentes, setFotosExistentes] = useState<string[]>([]);
  const [fotosNovas, setFotosNovas] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [usarGruposDias, setUsarGruposDias] = useState(false);
  const [gruposDiasSemana, setGruposDiasSemana] = useState<
    {
      id: string;
      dias: number[];
      valor: number | null;
    }[]
  >([]);

  const [datasEspeciais, setDatasEspeciais] = useState<
    {
      tipo: "recorrente" | "especifica";
      dia?: number;
      mes?: number;
      inicio?: string;
      fim?: string;
      valor: number;
    }[]
  >([]);

  const [usarDatasEspeciais, setUsarDatasEspeciais] = useState(false);

  const [buffetPrecoTexto, setBuffetPrecoTexto] = useState('');
  /* =========================
     CARREGAR DADOS (EDITAR)
  ========================= */

  useEffect(() => {
    if (!dadosIniciais) return;

  setNomeEspaco(dadosIniciais.nome_espaco || "");
  setTipoEspaco(dadosIniciais.tipo_espaco || "");  // 🔥 Garantir string
  setCapacidade(dadosIniciais.capacidade);
  setArea(dadosIniciais.area);
  setEstado(dadosIniciais.estado || "");  // 🔥 Garantir string
  setCidade(dadosIniciais.cidade || "");  // 🔥 Garantir string
  setBairro(dadosIniciais.bairro || "");
  setEndereco(dadosIniciais.endereco || "");
  setDescricao(dadosIniciais.descricao || "");
  setDisponivel(dadosIniciais.disponivel || "true");
  setModoBuffet(dadosIniciais.modoBuffet || false);
  setTemPlanos(dadosIniciais.temPlanos ?? false);
  setValor(dadosIniciais.valor);

    if (dadosIniciais.buffet) {
      setBuffet(dadosIniciais.buffet);
      setBuffetPrecoTexto(formatarMoedaReal(dadosIniciais.buffet.precoBase));
    }

    if (dadosIniciais.gruposDiasSemana?.length) {
      setUsarGruposDias(true);
      setGruposDiasSemana(dadosIniciais.gruposDiasSemana);
    } else {
      setUsarGruposDias(false);
      setGruposDiasSemana([]);
    }

    if (dadosIniciais.datasEspeciais?.length) {
      setUsarDatasEspeciais(true);
      setDatasEspeciais(dadosIniciais.datasEspeciais);
    } else {
      setUsarDatasEspeciais(false);
      setDatasEspeciais([]);
    }

    setCategoriasFesta(dadosIniciais.categoriasFesta || []);
    setServicos(dadosIniciais.servicos || []);
    setRegras(dadosIniciais.regras || []);
    setFacilidades(dadosIniciais.facilidades || []);
    setFotosExistentes(dadosIniciais.fotos || []);
  }, [dadosIniciais]);

  useEffect(() => {
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
      .then(res => res.json())
      .then(data => {
        const ordenado = data.sort((a: any, b: any) =>
          a.nome.localeCompare(b.nome)
        );
        setEstados(ordenado);
      });
  }, []);

  useEffect(() => {
    if (!estado) return;

    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`)
      .then(res => res.json())
      .then(data => setCidades(data));
  }, [estado]);
  /* =========================
     SUBMIT
  ========================= */

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;

    setFotosNovas((prev) => [...prev, ...Array.from(files)]);
  };

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();


    if (!nomeEspaco.trim()) {
      toast.error("Informe o nome do espaço");
      return;
    }
    if (!estado || !cidade || !bairro) {
      toast.error("Preencha estado, cidade e bairro");
      return;
    }

  // ========================= VALIDAÇÃO DO BUFFET =========================
  if (modoBuffet) {
    if (!buffet.nivel || buffet.nivel.trim() === "") {
      toast.error("Se o espaço funciona como buffet, informe o nível do serviço.");
      return;
    }
    if (!buffet.descricao || buffet.descricao.trim() === "") {
      toast.error("Se o espaço funciona como buffet, descreva o serviço oferecido.");
      return;
    }
    if (!buffet.precoBase || buffet.precoBase <= 0) {
      toast.error("Se o espaço funciona como buffet, informe o valor de referência (a partir de R$).");
      return;
    }

    // Se o espaço é buffet, obriga a usar pacotes de festa
if (modoBuffet && !temPlanos) {
  toast.error("Espaços que funcionam como buffet devem usar o modelo 'Pacotes de festa' para precificação.");
  return;
}
  }

  // ========================= VALIDAÇÃO DOS PACOTES (se temPlanos) =========================
  if (temPlanos) {
    if (!categoriasFesta || categoriasFesta.length === 0) {
      toast.error("Você marcou 'Pacotes de festa', mas não adicionou nenhum tipo de festa.");
      return;
    }
    for (const categoria of categoriasFesta) {
      if (!categoria.nome || categoria.nome.trim() === "") {
        toast.error("Todos os tipos de festa devem ter um nome.");
        return;
      }
      for (const pacote of categoria.pacotes) {
        if (!pacote.nome || pacote.nome.trim() === "") {
          toast.error("Todos os pacotes devem ter um nome.");
          return;
        }
          // 🔥 NOVA VALIDAÇÃO DE DURAÇÃO
  if (!pacote.duracao || pacote.duracao.trim() === "") {
    toast.error(`O pacote "${pacote.nome}" precisa ter uma duração definida`);
    return;
  }
        if (!pacote.descricao || pacote.descricao.trim() === "") {
          toast.error(`O pacote "${pacote.nome}" deve ter uma descrição.`);
          return;
        }
        if (!pacote.precos || pacote.precos.length === 0) {
          toast.error(`O pacote "${pacote.nome}" não possui faixa de preço definida.`);
          return;
        }
        for (const preco of pacote.precos) {
          if (!preco.convidados || preco.convidados <= 0) {
            toast.error(`No pacote "${pacote.nome}", a quantidade de convidados é obrigatória.`);
            return;
          }
          if (!preco.valor || preco.valor <= 0) {
            toast.error(`No pacote "${pacote.nome}", o valor para ${preco.convidados} convidados é obrigatório.`);
            return;
          }
        }
      }
    }
  }

console.log('🔍 VERIFICANDO DURAÇÕES ANTES DE ENVIAR:');

categoriasFesta.forEach((categoria, catIndex) => {
  console.log(`📌 Categoria: ${categoria.nome || 'Sem nome'}`);
  categoria.pacotes.forEach((pacote, pacIndex) => {
    console.log(`  📦 Pacote: ${pacote.nome}`);
    console.log(`     ⏰ DURAÇÃO NO ESTADO: "${pacote.duracao}"`);
    console.log(`     Tipo: ${typeof pacote.duracao}`);
    console.log(`     Comprimento: ${pacote.duracao?.length || 0} caracteres`);
  });
});
const categoriasFormatadas = categoriasFesta.map((categoria) => ({
  ...categoria,
  pacotes: categoria.pacotes.map((pacote) => ({
    ...pacote,
    // GARANTIR QUE A DURAÇÃO NÃO SEJA SOBRESCRITA
    duracao: pacote.duracao || "",  // Se for undefined, vira string vazia
    precos: pacote.precos.map((p) => ({
      ...p,
      valor: p.valor,
    })),
  })),
}));
    const dados: EspacoFormData = {
      id: dadosIniciais?.id,
      nome_espaco: nomeEspaco,
      tipo_espaco: tipoEspaco,
      capacidade: Number(capacidade),
      area: Number(area),
      estado,
      cidade,
      bairro,
      endereco,
      descricao,
      disponivel,
      modoBuffet,
      temPlanos,
      valor: temPlanos || valor === null ? null : valor, 
      gruposDiasSemana: usarGruposDias ? gruposDiasSemana : [],
      datasEspeciais: usarDatasEspeciais ? datasEspeciais : [],
      buffet: modoBuffet
        ? {
          ...buffet,
          precoBase: buffet.precoBase, // mantém o valor em reais
        }
        : null,
      categoriasFesta: temPlanos ? categoriasFormatadas : [],
      servicos,
      regras,
      facilidades,
      fotos: fotosExistentes,
    };

    onSubmit(dados, fotosNovas);
  };

  const adicionarServico = () => {
    setServicos((prev) => [
      ...prev,
      { id: Date.now().toString(), nome: "", preco: null },
    ]);
  };

  const atualizarServico = (
    id: string,
    campo: "nome" | "preco",
    valor: string | number | null
  ) => {
    setServicos((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, [campo]: valor } : s
      )
    );
  };

  const removerServico = (id: string) => {
    setServicos((prev) => prev.filter((s) => s.id !== id));
  };

  const adicionarRegra = () => {
    setRegras((prev) => [...prev, ""]);
  };

  const atualizarRegra = (index: number, valor: string) => {
    setRegras((prev) => prev.map((r, i) => (i === index ? valor : r)));
  };

  const removerRegra = (index: number) => {
    setRegras((prev) => prev.filter((_, i) => i !== index));
  };

  const adicionarFacilidade = () => {
    setFacilidades((prev) => [...prev, ""]);
  };

  const atualizarFacilidade = (index: number, valor: string) => {
    setFacilidades((prev) => prev.map((f, i) => (i === index ? valor : f)));
  };

  const removerFacilidade = (index: number) => {
    setFacilidades((prev) => prev.filter((_, i) => i !== index));
  };

  const adicionarDataEspecial = (tipo: "recorrente" | "especifica") => {
    setDatasEspeciais((prev) => [
      ...prev,
      tipo === "recorrente"
        ? { tipo, dia: 1, mes: 1, valor: 0 }
        : { tipo, inicio: "", fim: "", valor: 0 },
    ]);
  };

  const atualizarDataEspecial = (
    index: number,
    campo: string,
    valor: string | number
  ) => {
    setDatasEspeciais((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [campo]: valor } : item
      )
    );
  };

  const removerDataEspecial = (index: number) => {
    setDatasEspeciais((prev) => prev.filter((_, i) => i !== index));
  };

  const adicionarGrupoDias = () => {
    setGruposDiasSemana((prev) => [
      ...prev,
      { id: Date.now().toString(), dias: [], valor: null },
    ]);
  };

  const atualizarGrupoDias = (
    id: string,
    campo: "dias" | "valor",
    valor: any
  ) => {
    setGruposDiasSemana((prev) =>
      prev.map((g) => (g.id === id ? { ...g, [campo]: valor } : g))
    );
  };

  const removerGrupoDias = (id: string) => {
    setGruposDiasSemana((prev) => prev.filter((g) => g.id !== id));
  };

  // Converte número para string formatada (ex: 1500.5 -> "R$ 1.500,50")
  const formatarMoedaReal = (valor: number | null | undefined): string => {
    if (valor === null || valor === undefined) return '';
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  // Converte string formatada (ex: "R$ 1.500,50") para número (1500.5)
  const desformatarMoedaReal = (valorFormatado: string): number | null => {
    if (!valorFormatado) return null;
    // Remove tudo que não é dígito ou vírgula
    let numerico = valorFormatado.replace(/[^\d,]/g, '');
    // Troca vírgula por ponto
    numerico = numerico.replace(',', '.');
    const numero = parseFloat(numerico);
    return isNaN(numero) ? null : numero;
  };

  /* =========================
     JSX - VERSÃO MOBILE RESPONSIVA
  ========================= */

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-sm">
          <div className="p-4 sm:p-6 lg:p-10">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {modo === "criar" ? "Cadastrar novo espaço" : "Editar espaço"}
            </h1>

            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6 sm:mb-10">
              Preencha as informações abaixo para publicar seu espaço e começar a receber reservas.
            </p>

            <form className="space-y-6 sm:space-y-8" onSubmit={handleSubmit}>
              {/* ───── INFORMAÇÕES BÁSICAS ───── */}
              <section className="space-y-4 sm:space-y-6">
                <div className="space-y-1">
                  <h2 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100">
                    Informações básicas
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Dados principais que aparecerão no anúncio
                  </p>
                </div>

                <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-100">
                      Nome do espaço *
                    </label>
                    <input
                      type="text"
                      value={nomeEspaco}
                      onChange={(e) => setNomeEspaco(e.target.value)}
                      placeholder="Ex: Campo do Sorriso"
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900 outline-none transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-100">
                      Tipo do espaço *
                    </label>
                    <select
                      value={tipoEspaco}
                      onChange={(e) => setTipoEspaco(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-gray-900 dark:text-gray-100 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900 outline-none transition"
                    >
                      <option value="">Selecione</option>
                      <option>Chácara</option>
                      <option>Salão</option>
                      <option>Casa de festas</option>
                      <option>Sítio</option>
                      <option>Outro</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Capacidade e Área */}
              <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Capacidade (pessoas) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={capacidade}
                    onChange={(e) =>
                      setCapacidade(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    placeholder="Ex: 100"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900 outline-none transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Área (m²) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={area}
                    onChange={(e) =>
                      setArea(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    placeholder="Ex: 150"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900 outline-none transition"
                  />
                </div>

              </div>

              {/* Localização */}
              <div className="space-y-4 sm:grid sm:grid-cols-3 sm:gap-4">

                {/* Estado */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-100">
                    Estado *
                  </label>
                  <select
                    value={estado}
                    onChange={(e) => {
                      setEstado(e.target.value);
                      setCidade("");
                    }}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900 outline-none transition"
                  >
                    <option value="">Selecione o estado</option>
                    {estados.map((estado) => (
                      <option key={estado.id} value={estado.sigla}>
                        {estado.nome}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cidade */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-100">
                    Cidade *
                  </label>
                  <select
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    disabled={!estado}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900 outline-none transition disabled:opacity-50"
                  >
                    <option value="">Selecione a cidade</option>
                    {cidades.map((cidade) => (
                      <option key={cidade.id} value={cidade.nome}>
                        {cidade.nome}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Bairro */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-100">
                    Bairro *
                  </label>
                  <input
                    type="text"
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                    placeholder="Ex: Centro"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900 outline-none transition"
                  />
                </div>

                {/* Endereço */} <div className="space-y-1"> <label className="text-sm font-medium">Endereço *</label> <input type="text" value={endereco} onChange={(e) => setEndereco(e.target.value)} placeholder="Rua, número..." className="w-full rounded-xl border px-3 py-2" /> </div>

              </div>

              {/* Descrição do espaço */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Descrição do espaço *
                </label>
                <textarea
                  rows={4}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Descreva o espaço, ambientes, diferenciais, tipo de eventos, estrutura, etc."
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900 outline-none transition"
                />
              </div>

              {/* ───── MODO DE OPERAÇÃO ───── */}
              <section className="space-y-4 border border-gray-200 rounded-2xl p-4 sm:p-6 bg-gray-50 dark:bg-gray-900">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100">
                  Como este espaço funciona?
                </h3>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={modoBuffet}
                    onChange={(e) => setModoBuffet(e.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-sm sm:text-base">
                    Este espaço também funciona como <b>buffet completo</b>
                  </span>
                </label>

                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Buffets podem oferecer pacotes completos com cardápios e serviços.
                </p>
              </section>

              {modoBuffet && (
                <section className="space-y-4 border border-sky-200 dark:border-sky-900 rounded-2xl p-4 sm:p-6 bg-sky-50 dark:bg-sky-950/40">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100">
                    Sobre o buffet do espaço
                  </h3>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nível do serviço
                    </label>
                    <select
                      value={buffet.nivel}
                      onChange={(e) => setBuffet({ ...buffet, nivel: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-gray-900 dark:text-gray-100 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900 outline-none transition"
                    >
                      <option value="simples">Simples</option>
                      <option value="intermediario">Intermediário</option>
                      <option value="luxo">Luxo</option>
                      <option value="personalizado">Personalizado</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Descrição do buffet
                    </label>
                    <textarea
                      rows={3}
                      value={buffet.descricao}
                      onChange={(e) => setBuffet({ ...buffet, descricao: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900 outline-none transition"
                      placeholder="Explique o que está incluso: tipo de evento atendido, cardápio, equipe, diferenciais, etc."
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Valor de referência (a partir de) – R$
                    </label>
                   <input
  type="text"
  inputMode="numeric"
  placeholder="R$ 0,00"
  value={buffetPrecoTexto}
  onChange={(e) => {
    // Remove tudo que não for número
    const apenasNumeros = e.target.value.replace(/\D/g, "");

    // Campo vazio
    if (!apenasNumeros) {
      setBuffetPrecoTexto("");
      setBuffet({ ...buffet, precoBase: null });
      return;
    }

    // Converte para valor real
    const valorNumerico = Number(apenasNumeros) / 100;

    // Atualiza estado numérico
    setBuffet({
      ...buffet,
      precoBase: valorNumerico,
    });

    // Formata visualmente enquanto digita
    setBuffetPrecoTexto(
      valorNumerico.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
    );
  }}
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900 outline-none transition"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Os valores e cardápios finais serão definidos nos planos abaixo.
                  </p>
                </section>
              )}

              {/* ───── MODELO DE PREÇO ───── */}
              <section className="space-y-4 border border-gray-200 rounded-2xl p-4 sm:p-6 bg-gray-50 dark:bg-gray-900">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100">
                  Como você cobra pelo espaço?
                </h3>

                <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
                  <label
                    className={`flex gap-3 p-3 sm:p-4 rounded-2xl border cursor-pointer transition ${!temPlanos
                      ? "border-sky-500 bg-white dark:bg-gray-800 shadow-sm"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                      }`}
                  >
                    <input
                      type="radio"
                      checked={!temPlanos}
                      onChange={() => setTemPlanos(false)}
                      className="mt-1 accent-sky-500"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                        Valor fixo
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        Você define um valor único pelo espaço
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex gap-3 p-3 sm:p-4 rounded-2xl border cursor-pointer transition ${temPlanos
                      ? "border-sky-500 bg-white dark:bg-gray-800 shadow-sm"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                      }`}
                  >
                    <input
                      type="radio"
                      checked={temPlanos}
                      onChange={() => setTemPlanos(true)}
                      className="mt-1 accent-sky-500"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                        Pacotes de festa
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        Você cria planos completos para eventos
                      </p>
                    </div>
                  </label>
                </div>

                {!temPlanos && (
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Valor do espaço (R$) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={valor ?? ""}
                      onChange={(e) =>
                        setValor(e.target.value === "" ? null : Number(e.target.value))
                      }
                      placeholder="Ex: 4.500,00"
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900 outline-none transition"
                    />
                  </div>
                )}

                {/* PLANOS - Versão Mobile Otimizada */}
                {temPlanos && (
                  <div className="border border-dashed border-gray-300 rounded-xl p-3 sm:p-4 space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold">Pacotes de festa</h3>

                    {categoriasFesta.map((categoria, catIndex) => (
                      <div
                        key={categoria.id}
                        className="border border-dashed border-gray-300 rounded-xl p-3 sm:p-4 space-y-4 relative"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            const copia = [...categoriasFesta];
                            copia.splice(catIndex, 1);
                            setCategoriasFesta(copia);
                          }}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition text-sm"
                          title="Remover tipo de festa"
                        >
                          ✕
                        </button>

                        <input
                          type="text"
                          placeholder="Ex: Festa Infantil"
                          value={categoria.nome}
                          onChange={(e) => {
                            const copia = [...categoriasFesta];
                            copia[catIndex].nome = e.target.value;
                            setCategoriasFesta(copia);
                          }}
                          className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 sm:px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900 outline-none transition"
                        />

                        {/* PACOTES */}
                        {categoria.pacotes.map((pacote, pacIndex) => (
                          <div
                            key={pacote.id}
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 sm:p-6 space-y-5 relative shadow-sm"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                const copia = [...categoriasFesta];
                                copia[catIndex].pacotes.splice(pacIndex, 1);
                                setCategoriasFesta(copia);
                              }}
                              className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition text-base font-bold z-10"
                              title="Remover pacote"
                            >
                              ✕
                            </button>

                            <div className="flex justify-between items-center pr-6">
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Pacote {pacIndex + 1}
                              </h4>
                            </div>

                            <input
                              type="text"
                              placeholder="Nome do pacote"
                              value={pacote.nome}
                              onChange={(e) => {
                                const copia = [...categoriasFesta];
                                copia[catIndex].pacotes[pacIndex].nome = e.target.value;
                                setCategoriasFesta(copia);
                              }}
                              className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-base sm:text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900 outline-none transition"
                            />

                            <textarea
                              placeholder="Descrição do pacote"
                              value={pacote.descricao}
                              onChange={(e) => {
                                const copia = [...categoriasFesta];
                                copia[catIndex].pacotes[pacIndex].descricao = e.target.value;
                                setCategoriasFesta(copia);
                              }}
                              className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-base sm:text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900 outline-none transition"
                              rows={3}
                            />

                            {/* 🔥 CAMPO DE DURAÇÃO - ADICIONAR AQUI */}
{/* 🔥 CAMPO DE DURAÇÃO COM PADRÃO "horas" */}
<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
    Duração do evento *
  </label>
  <div className="relative">
    <input
      type="number"
      min="1"
      step="1"
      placeholder="Ex: 4"
      value={pacote.duracao ? pacote.duracao.replace(' horas', '') : ""}
      onChange={(e) => {
        const numero = e.target.value;
        console.log('✏️ Digitando duração:', numero);
        const copia = [...categoriasFesta];
        // Se tiver número, adiciona " horas", senão fica vazio
        copia[catIndex].pacotes[pacIndex].duracao = numero ? `${numero} horas` : "";
        setCategoriasFesta(copia);
      }}
      className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-base sm:text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900 outline-none transition pr-16"
    />
    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm pointer-events-none">
      horas
    </span>
  </div>
  <p className="text-xs text-gray-500 dark:text-gray-400">
    Digite apenas o número (ex: 4, 5, 6)
  </p>
</div>

                            {/* ITENS INCLUÍDOS - VERSÃO COMPLETA */}
                            <div className="border border-gray-200 rounded-xl p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                              <p className="font-medium text-sm text-gray-700 dark:text-gray-100">
                                Itens incluídos no pacote
                              </p>

                              {pacote.itens.map((item, i) => (
                                <div key={i} className="space-y-3">
                                  {/* Versão Mobile - Campos empilhados */}
                                  <div className="block sm:hidden space-y-3">
                                    <input
                                      type="text"
                                      placeholder="Categoria (ex: Entradas, Bebidas, Decoração)"
                                      value={item.titulo}
                                      onChange={(e) => {
                                        const copia = [...categoriasFesta];
                                        copia[catIndex].pacotes[pacIndex].itens[i].titulo = e.target.value;
                                        setCategoriasFesta(copia);
                                      }}
                                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Descrição (ex: Cachorro-quente, bolo, sucos)"
                                      value={item.descricao}
                                      onChange={(e) => {
                                        const copia = [...categoriasFesta];
                                        copia[catIndex].pacotes[pacIndex].itens[i].descricao = e.target.value;
                                        setCategoriasFesta(copia);
                                      }}
                                      className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const copia = [...categoriasFesta];
                                        copia[catIndex].pacotes[pacIndex].itens.splice(i, 1);
                                        setCategoriasFesta(copia);
                                      }}
                                      className="w-full text-red-500 hover:text-red-700 transition py-2.5 text-sm font-medium border border-red-200 rounded-lg bg-white dark:bg-gray-800"
                                    >
                                      Remover item
                                    </button>
                                  </div>

                                  {/* Versão Desktop - Campos lado a lado */}
                                  <div className="hidden sm:flex sm:gap-2">
                                    <input
                                      type="text"
                                      placeholder="Categoria (ex: Entradas, Bebidas, Decoração)"
                                      value={item.titulo}
                                      onChange={(e) => {
                                        const copia = [...categoriasFesta];
                                        copia[catIndex].pacotes[pacIndex].itens[i].titulo = e.target.value;
                                        setCategoriasFesta(copia);
                                      }}
                                      className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Descrição (ex: Cachorro-quente, bolo, sucos)"
                                      value={item.descricao}
                                      onChange={(e) => {
                                        const copia = [...categoriasFesta];
                                        copia[catIndex].pacotes[pacIndex].itens[i].descricao = e.target.value;
                                        setCategoriasFesta(copia);
                                      }}
                                      className="flex-1 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const copia = [...categoriasFesta];
                                        copia[catIndex].pacotes[pacIndex].itens.splice(i, 1);
                                        setCategoriasFesta(copia);
                                      }}
                                      className="text-red-500 hover:text-red-700 transition px-2 text-sm"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                </div>
                              ))}

                              <button
                                type="button"
                                onClick={() => {
                                  const copia = [...categoriasFesta];
                                  copia[catIndex].pacotes[pacIndex].itens.push({
                                    titulo: "",
                                    descricao: "",
                                  });
                                  setCategoriasFesta(copia);
                                }}
                                className="w-full sm:w-auto text-sm text-sky-600 font-medium py-2 border-t border-gray-200 pt-3 mt-2 text-center sm:text-left hover:text-sky-700 transition"
                              >
                                + Adicionar item
                              </button>
                            </div>

                            {/* INFORMAÇÕES ADICIONAIS */}
                            <textarea
                              placeholder={`Informações adicionais (opcional)
Ex:
• Duração do evento: 4 horas
• Cerveja não inclusa (pode levar por fora)
• Cortesia: mesa de doces simples
• Serviços extras podem ser contratados à parte`}
                              value={pacote.infoAdicional || ""}
                              onChange={(e) => {
                                const copia = [...categoriasFesta];
                                copia[catIndex].pacotes[pacIndex].infoAdicional = e.target.value;
                                setCategoriasFesta(copia);
                              }}
                              rows={4}
                              className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900 outline-none transition"
                            />

                            {/* PREÇOS */}
                            <div className="border rounded-xl p-4 space-y-4">
                              <p className="font-medium text-sm text-gray-700 dark:text-gray-100">
                                Valores por quantidade de convidados
                              </p>

                              {pacote.precos.map((p, i) => (
                                <div key={i} className="space-y-3">
                                  {/* Versão Mobile - Campos empilhados */}
                                  <div className="block sm:hidden space-y-3">
                                    <input
                                      type="number"
                                      placeholder="Número de convidados"
                                      value={p.convidados ?? ""}
                                      onChange={(e) => {
                                        const copia = [...categoriasFesta];
                                        copia[catIndex].pacotes[pacIndex].precos[i].convidados = Number(e.target.value);
                                        setCategoriasFesta(copia);
                                      }}
                                      className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition"
                                    />
                                    <input
                                      type="text"
                                      inputMode="numeric"
                                      placeholder="Valor (R$)"
                                      value={formatarMoeda(p.valor)}
                                      onChange={(e) => {
                                        const valorNumerico = Number(e.target.value.replace(/\D/g, "")) / 100;
                                        const copia = [...categoriasFesta];
                                        copia[catIndex].pacotes[pacIndex].precos[i].valor = isNaN(valorNumerico) ? undefined : valorNumerico;
                                        setCategoriasFesta(copia);
                                      }}
                                      className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const copia = [...categoriasFesta];
                                        copia[catIndex].pacotes[pacIndex].precos.splice(i, 1);
                                        setCategoriasFesta(copia);
                                      }}
                                      className="w-full text-red-500 font-bold py-2.5 text-sm border border-red-200 rounded-lg bg-white dark:bg-gray-800"
                                    >
                                      Remover faixa
                                    </button>
                                  </div>

                                  {/* Versão Desktop - Campos lado a lado */}
                                  <div className="hidden sm:flex sm:items-end sm:gap-3">
                                    <input
                                      type="number"
                                      placeholder="Convidados"
                                      value={p.convidados ?? ""}
                                      onChange={(e) => {
                                        const copia = [...categoriasFesta];
                                        copia[catIndex].pacotes[pacIndex].precos[i].convidados = Number(e.target.value);
                                        setCategoriasFesta(copia);
                                      }}
                                      className="w-full sm:w-32 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition"
                                    />
                                    <input
                                      type="text"
                                      inputMode="numeric"
                                      placeholder="R$ 0,00"
                                      value={formatarMoeda(p.valor)}
                                      onChange={(e) => {
                                        const valorNumerico = Number(e.target.value.replace(/\D/g, "")) / 100;
                                        const copia = [...categoriasFesta];
                                        copia[catIndex].pacotes[pacIndex].precos[i].valor = isNaN(valorNumerico) ? undefined : valorNumerico;
                                        setCategoriasFesta(copia);
                                      }}
                                      className="w-full sm:flex-1 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const copia = [...categoriasFesta];
                                        copia[catIndex].pacotes[pacIndex].precos.splice(i, 1);
                                        setCategoriasFesta(copia);
                                      }}
                                      className="text-red-500 font-bold px-2 text-sm"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                </div>
                              ))}

                              <button
                                type="button"
                                onClick={() => {
                                  const copia = [...categoriasFesta];
                                  copia[catIndex].pacotes[pacIndex].precos.push({});
                                  setCategoriasFesta(copia);
                                }}
                                className="w-full sm:w-auto text-sm text-sky-600 font-medium py-2 border-t border-gray-200 pt-3 mt-2 text-center sm:text-left hover:text-sky-700 transition"
                              >
                                + Adicionar faixa de preço
                              </button>
                            </div>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => {
                            const copia = [...categoriasFesta];
                            copia[catIndex].pacotes.push({
                               id: Date.now().toString(),
      nome: "",
      descricao: "",
      duracao: "", 
      infoAdicional: "",
      itens: [],
      precos: [],
                            });
                            setCategoriasFesta(copia);
                          }}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                        >
                          <span className="text-lg leading-none">+</span>
                          Adicionar pacote
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() =>
                        setCategoriasFesta([
                          ...categoriasFesta,
                          { id: Date.now().toString(), nome: "", pacotes: [] },
                        ])
                      }
                      className="w-full bg-sky-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-sky-600 transition"
                    >
                      + Adicionar tipo de festa
                    </button>
                  </div>
                )}
              </section>

              {/* Disponibilidade */}
              {/* <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Disponibilidade *
                </label>
                <select
                  value={disponivel}
                  onChange={(e) => setDisponivel(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-gray-900 dark:text-gray-100 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900 outline-none transition"
                >
                  <option value="true">Publicar no site (disponível para aluguel)</option>
                  <option value="false">Manter como rascunho (indisponível)</option>
                </select>
              </div> */}

              {/* Serviços Adicionais */}
              {/* <div className="rounded-2xl border border-gray-200 bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
                <h3 className="text-base font-semibold text-gray-800 mb-2 dark:text-gray-100">
                  Serviços adicionais (opcional)
                </h3>

                {!mostrarServicos && (
                  <button
                    type="button"
                    onClick={() => setMostrarServicos(true)}
                    className="text-sm text-sky-600 hover:text-sky-700 font-medium"
                  >
                    + Adicionar serviços
                  </button>
                )}

                {mostrarServicos && (
                  <div className="mt-4 space-y-3">
                    {servicos.map((s) => (
                      <div key={s.id} className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          placeholder="Ex: Buffet, DJ"
                          value={s.nome}
                          onChange={(e) => atualizarServico(s.id, "nome", e.target.value)}
                          className="flex-1 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 sm:px-4 py-2.5 text-sm"
                        />
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="R$"
                          value={s.preco ? formatarMoeda(s.preco) : ""}
                          onChange={(e) => {
                            const valorNumerico =
                              Number(e.target.value.replace(/\D/g, "")) / 100;

                            atualizarServico(s.id, "preco", isNaN(valorNumerico) ? null : valorNumerico);
                          }}
                          className="w-full sm:w-32 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 sm:px-4 py-2.5 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removerServico(s.id)}
                          className="text-sm text-red-500 hover:text-red-700"
                        >
                          Remover
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={adicionarServico}
                      className="text-sm text-sky-600 hover:text-sky-700 font-medium"
                    >
                      + Adicionar outro serviço
                    </button>
                  </div>
                )}
              </div> */}

              {/* Regras do local */}
              <div className="rounded-2xl border border-gray-200 bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
                <h3 className="text-base font-semibold text-gray-800 mb-1 dark:text-gray-100">
                  Regras do local
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Informe regras importantes que os clientes devem seguir (opcional)
                </p>

                <div className="space-y-3">
                  {regras.map((r, i) => (
                    <div key={i} className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        placeholder="Ex: Proibido fumar"
                        value={r}
                        onChange={(e) => atualizarRegra(i, e.target.value)}
                        className="flex-1 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 sm:px-4 py-2.5 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removerRegra(i)}
                        className="text-sm text-red-500 hover:text-red-700 transition"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={adicionarRegra}
                  className="mt-4 text-sm text-sky-600 hover:text-sky-700 font-medium transition"
                >
                  + Adicionar regra
                </button>
              </div>

              {/* Facilidades do local */}
              <div className="rounded-2xl border border-gray-200 bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
                <h3 className="text-base font-semibold text-gray-800 mb-1 dark:text-gray-100">
                  Diferenciais do local
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Informe comodidades que tornam seu espaço mais atrativo
                </p>

                <div className="space-y-3">
                  {facilidades.map((f, i) => (
                    <div key={i} className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        placeholder="Ex: Wi-Fi"
                        value={f}
                        onChange={(e) => atualizarFacilidade(i, e.target.value)}
                        className="flex-1 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 sm:px-4 py-2.5 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removerFacilidade(i)}
                        className="text-sm text-red-500 hover:text-red-700 transition"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={adicionarFacilidade}
                  className="mt-4 text-sm text-sky-600 hover:text-sky-700 font-medium transition"
                >
                  + Adicionar diferencial
                </button>
              </div>



              {/* Upload de fotos */}
              <div className="rounded-2xl border border-gray-200 bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
                <h3 className="text-base font-semibold text-gray-800 mb-1 dark:text-gray-100">
                  Fotos do espaço (máx. 10)
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Envie até <b>10 fotos</b>. Recomendamos de 5 a 8 fotos bem escolhidas.
                </p>

                <div className="mb-4 p-3 sm:p-4 rounded-xl bg-sky-50 border border-sky-200">
                  <p className="text-xs sm:text-sm text-sky-800 font-medium">
                    Fotos bonitas aumentam muito suas chances de reserva!
                  </p>
                  <ul className="text-xs sm:text-sm text-sky-700 mt-2 list-disc list-inside space-y-1">
                    <li>Use fotos claras e bem iluminadas</li>
                    <li>Mostre os principais ambientes do espaço</li>
                    <li>Evite fotos escuras, borradas ou com baixa qualidade</li>
                    <li>Espaços com boas fotos recebem até <b>3x mais reservas</b></li>
                  </ul>
                </div>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFotoChange}
                  className="w-full text-xs sm:text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-sky-100 file:text-sky-700 hover:file:bg-sky-200 transition"
                />
              </div>

              {message && (
                <p
                  className={`mt-4 text-xs sm:text-sm font-medium p-3 rounded-xl ${message.startsWith("✅")
                    ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                    : "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                    }`}
                >
                  {message}
                </p>
              )}

              {fotosExistentes.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                 {fotosExistentes.map((foto, index) => (
  <div key={index} className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 aspect-square">
    <img 
      src={foto} 
      alt={`Foto ${index + 1}`} 
      className="w-full h-full object-cover"
      onError={(e) => {
        // Se a imagem falhar, mostra um placeholder
        e.currentTarget.src = 'https://placehold.co/400x400?text=Imagem+Indisponível';
      }}
    />
    <button
      type="button"
      onClick={() => {
        const copia = [...fotosExistentes];
        copia.splice(index, 1);
        setFotosExistentes(copia);
      }}
      className="absolute top-1 right-1 bg-white/80 hover:bg-white text-red-500 rounded-full w-6 h-6 flex items-center justify-center text-sm transition"
    >
      ✕
    </button>
  </div>
))}
                </div>
              )}

              {fotosNovas.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {fotosNovas.map((foto, index) => (
                    <div
                      key={index}
                      className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 aspect-square"
                    >
                      <img src={URL.createObjectURL(foto)} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          const copia = [...fotosNovas];
                          copia.splice(index, 1);
                          setFotosNovas(copia);
                        }}
                        className="absolute top-1 right-1 bg-white/80 hover:bg-white text-red-500 rounded-full w-6 h-6 flex items-center justify-center text-sm transition"
                        title="Remover foto"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-sky-500 text-white py-3 rounded-xl font-semibold text-sm sm:text-base hover:bg-sky-600 transition"
              >
                {modo === "criar" ? "Cadastrar espaço" : "Salvar alterações"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
