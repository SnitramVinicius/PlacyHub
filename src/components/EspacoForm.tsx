"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

/* =========================
   TIPOS
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
  preco: string;
}

export interface EspacoFormData {
  id?: string;
  nome_espaco: string;
  tipo_espaco: string;
  tipo_reserva: string;
  capacidade: number;
  area: number;
  endereco: string;
  descricao: string;
  disponivel: string;

  modoBuffet: boolean;
  temPlanos: boolean;
  valor: number | null;
//   usarFinalSemana?: boolean;
// valorFinalSemana?: number | null;
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
  dias: number[]; // 0=Dom, 1=Seg ... 6=Sab
  valor: number | null;
}
/* =========================
   PROPS
========================= */

interface EspacoFormProps {
  modo: "criar" | "editar";
  dadosIniciais?: EspacoFormData | null;
  onSubmit: (dados: EspacoFormData) => void;
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
  const [tipoReserva, setTipoReserva] = useState("");
  const [capacidade, setCapacidade] = useState<number | "">("");
  const [area, setArea] = useState<number | "">("");
  const [endereco, setEndereco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [disponivel, setDisponivel] = useState("true");
const [mostrarServicos, setMostrarServicos] = useState(false);
  const [modoBuffet, setModoBuffet] = useState(false);
  const [temPlanos, setTemPlanos] = useState(false);
  const [valor, setValor] = useState<number | null>(null);

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

  /* =========================
     CARREGAR DADOS (EDITAR)
  ========================= */

  useEffect(() => {
    console.log("DADOS INICIAIS:", dadosIniciais);
    if (!dadosIniciais) return;

    
    setNomeEspaco(dadosIniciais.nome_espaco);
    setTipoEspaco(dadosIniciais.tipo_espaco);
    setTipoReserva(dadosIniciais.tipo_reserva);
    setCapacidade(dadosIniciais.capacidade);
    setArea(dadosIniciais.area);
    setEndereco(dadosIniciais.endereco);
    setDescricao(dadosIniciais.descricao);
    setDisponivel(dadosIniciais.disponivel);

    setModoBuffet(dadosIniciais.modoBuffet);
   setTemPlanos(dadosIniciais.temPlanos ?? false);
    setValor(dadosIniciais.valor);

    if (dadosIniciais.buffet) {
      setBuffet(dadosIniciais.buffet);
    }
if (dadosIniciais.gruposDiasSemana?.length) {
  setUsarGruposDias(true);
  setGruposDiasSemana(dadosIniciais.gruposDiasSemana);
} else {
  setUsarGruposDias(false);
  setGruposDiasSemana([]);
}

// ===== DATAS ESPECIAIS =====
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

  /* =========================
     SUBMIT
  ========================= */

const handleFotoChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const files = e.currentTarget.files;
  if (!files) return;

  setFotosNovas((prev) => [
    ...prev,
    ...Array.from(files),
  ]);
};

const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
  e?.preventDefault();

  if (!nomeEspaco.trim()) {
    toast.error("Informe o nome do espaço");
    return;
  }

  const dados: EspacoFormData = {
    id: dadosIniciais?.id,
    nome_espaco: nomeEspaco,
    tipo_espaco: tipoEspaco,
    tipo_reserva: tipoReserva,
    capacidade: Number(capacidade),
    area: Number(area),
    endereco,
    descricao,
    disponivel,

    modoBuffet,
    temPlanos,
    valor: temPlanos ? null : valor,
gruposDiasSemana: usarGruposDias ? gruposDiasSemana : [],
datasEspeciais: usarDatasEspeciais ? datasEspeciais : [],

    buffet: modoBuffet ? buffet : null,
    categoriasFesta: temPlanos ? categoriasFesta : [],

    servicos,
    regras,
    facilidades,
    fotos: fotosExistentes,
  };

  onSubmit(dados);
};

  const adicionarServico = () => {
  setServicos((prev) => [
    ...prev,
    { id: Date.now().toString(), nome: "", preco: "" },
  ]);
};

const atualizarServico = (
  id: string,
  campo: "nome" | "preco",
  valor: string
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
  setRegras((prev) =>
    prev.map((r, i) => (i === index ? valor : r))
  );
};

const removerRegra = (index: number) => {
  setRegras((prev) => prev.filter((_, i) => i !== index));
};

const adicionarFacilidade = () => {
  setFacilidades((prev) => [...prev, ""]);
};

const atualizarFacilidade = (index: number, valor: string) => {
  setFacilidades((prev) =>
    prev.map((f, i) => (i === index ? valor : f))
  );
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
  setDatasEspeciais((prev) =>
    prev.filter((_, i) => i !== index)
  );
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
    prev.map((g) =>
      g.id === id ? { ...g, [campo]: valor } : g
    )
  );
};

const removerGrupoDias = (id: string) => {
  setGruposDiasSemana((prev) =>
    prev.filter((g) => g.id !== id)
  );
};

  /* =========================
     JSX
  ========================= */

  return (



  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
  <div className="max-w-5xl mx-auto px-4">
    <div className="bg-white dark:bg-gray-800 
border border-gray-100 dark:border-gray-700 
rounded-3xl shadow-sm p-10">

      <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-8">
        {modo === "criar" ? "Cadastrar novo espaço" : "Editar espaço"}
      </h1>

<p className="text-gray-500 dark:text-gray-400 mt-2 mb-10 max-w-2xl">
  Preencha as informações abaixo para publicar seu espaço e começar a receber reservas.
</p>
          <form className="space-y-6" onSubmit={handleSubmit}>
  {/* ───── INFORMAÇÕES BÁSICAS ───── */}
<section className="space-y-8 border-gray-100">
  <div className="space-y-1">
    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
      Informações básicas
    </h2>
    <p className="text-sm text-gray-500 dark:text-gray-400">
      Dados principais que aparecerão no anúncio
    </p>
  </div>


  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-100">
        Nome do espaço
      </label>
      <input
        type="text"
  value={nomeEspaco}
  onChange={(e) => setNomeEspaco(e.target.value)}
  placeholder="Ex: Campo do Sorriso"
  required
        className="
w-full
rounded-xl
border border-gray-200 dark:border-gray-600
bg-white dark:bg-gray-700
px-4 py-3
text-sm
text-gray-900  dark:text-gray-100
placeholder:text-gray-400
focus:border-sky-500
focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900
outline-none
transition
"
      />
    </div>

    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-100">
        Tipo do espaço
      </label>
      <select
        value={tipoEspaco}
  onChange={(e) => setTipoEspaco(e.target.value)}
  required
        className="
w-full
rounded-xl
border border-gray-200 dark:border-gray-600
bg-white dark:bg-gray-700
px-4 py-3
text-sm
text-gray-900  dark:text-gray-100
placeholder:text-gray-400
focus:border-sky-500
focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900
outline-none
transition
"
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

{/* Capacidade, Área e Valor */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Capacidade (pessoas)
                </label>
                <input
                    type="number"
  min="1"
  value={capacidade}
  onChange={(e) =>
    setCapacidade(e.target.value === "" ? "" : Number(e.target.value))
  }
  placeholder="Ex: 100"
  required
                  className="
w-full
rounded-xl
border border-gray-200 dark:border-gray-600
bg-white dark:bg-gray-700
px-4 py-3
text-sm
text-gray-900  dark:text-gray-100
placeholder:text-gray-400
focus:border-sky-500
focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900
outline-none
transition
"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Área (m²)
                </label>
                <input
  type="number"
  min="1"
  value={area}
  onChange={(e) =>
    setArea(e.target.value === "" ? "" : Number(e.target.value))
  }
  placeholder="Ex: 150"
 className="
w-full
rounded-xl
border border-gray-200 dark:border-gray-600
bg-white dark:bg-gray-700
px-4 py-3
text-sm
text-gray-900  dark:text-gray-100
placeholder:text-gray-400
focus:border-sky-500
focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900
outline-none
transition
"
  required
/>

              </div>
            </div>
            
             {/* Endereço */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Endereço
              </label>
              <input
                type="text"
  value={endereco}
  onChange={(e) => setEndereco(e.target.value)}
  placeholder="Ex: Rua das Palmeiras, 123 - Campo Grande/MS"
                className="
w-full
rounded-xl
border border-gray-200 dark:border-gray-600
bg-white dark:bg-gray-700
px-4 py-3
text-sm
text-gray-900  dark:text-gray-100
placeholder:text-gray-400
focus:border-sky-500
focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900
outline-none
transition
"
                required
              />
            </div>

            {/* Descrição do espaço */}
<div>
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
    Descrição do espaço
  </label>
  <textarea
    rows={4}
    value={descricao}
onChange={(e) => setDescricao(e.target.value)}
    placeholder="Descreva o espaço, ambientes, diferenciais, tipo de eventos, estrutura, etc."
className="
w-full
rounded-xl
border border-gray-200 dark:border-gray-600
bg-white dark:bg-gray-800
px-4 py-3
text-sm
text-gray-900 dark:text-gray-100
placeholder:text-gray-400
focus:border-sky-500
focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900
outline-none
transition
"
    required
  />
</div>


            {/* ───── MODO DE OPERAÇÃO ───── */}
<section className="space-y-6 border border-gray-200 rounded-3xl p-6 bg-gray-50 dark:bg-gray-900">
  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
    Como este espaço funciona?
  </h3>

  <label className="flex items-center gap-3 cursor-pointer">
  <input
  type="checkbox"
  checked={modoBuffet}
  onChange={(e) => setModoBuffet(e.target.checked)}
  
/>
    <span>
      Este espaço também funciona como <b>buffet completo</b>
    </span>
  </label>

<p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl">
    Buffets podem oferecer pacotes completos com cardápios e serviços.
  </p>
</section>

{modoBuffet && (
<section className="space-y-6 border border-sky-200 dark:border-sky-900 rounded-3xl p-6 bg-sky-50 dark:bg-sky-950/40 mt-6">

   <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
      Sobre o buffet do espaço
    </h3>

    {/* Nível do buffet */}
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Nível do serviço
      </label>
      <select
      value={buffet.nivel}
onChange={(e) =>
  setBuffet({ ...buffet, nivel: e.target.value })
}
   className="
w-full
rounded-xl
border border-gray-200 dark:border-gray-600
bg-white dark:bg-gray-800
px-4 py-3
text-sm
text-gray-900 dark:text-gray-100
placeholder:text-gray-400
focus:border-sky-500
focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900
outline-none
transition
"
      >
        <option value="simples">Simples</option>
        <option value="intermediario">Intermediário</option>
        <option value="luxo">Luxo</option>
        <option value="personalizado">Personalizado</option>
      </select>
    </div>

    {/* Descrição */}
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Descrição do buffet
      </label>
      <textarea
        rows={3}
        value={buffet.descricao}
        onChange={(e) =>
          setBuffet({ ...buffet, descricao: e.target.value })
        }
    className="
w-full
rounded-xl
border border-gray-200 dark:border-gray-600
bg-white dark:bg-gray-800
px-4 py-3
text-sm
text-gray-900 dark:text-gray-100
placeholder:text-gray-400
focus:border-sky-500
focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900
outline-none
transition
"
        placeholder="Explique o que está incluso: tipo de evento atendido, cardápio, equipe, diferenciais, etc."
      />
    </div>

    {/* Preço base */}
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Valor de referência (a partir de)
      </label>
      <input
  type="text"
  inputMode="numeric"
  placeholder="R$ 0,00"
 value={buffet.precoBase ? formatarMoeda(buffet.precoBase) : ""}
  onChange={(e) => {
    const valorNumerico = Number(
      e.target.value.replace(/\D/g, "")
    ) / 100;

    setBuffet({
  ...buffet,
  precoBase: valorNumerico,
});
  }}
  className="
w-full
rounded-xl
border border-gray-200 dark:border-gray-600
bg-white dark:bg-gray-700
px-4 py-3
text-sm
text-gray-900 dark:text-gray-100 
placeholder:text-gray-400
focus:border-sky-500
focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900
outline-none
transition
"
/>
    </div>
<p className="text-xs text-gray-500 dark:text-gray-400">
  Os valores e cardápios finais serão definidos nos planos abaixo.
</p>
  </section>
)}


            
{/* ───── MODELO DE PREÇO ───── */}
<section className="space-y-6 border border-gray-200 rounded-3xl p-6 bg-gray-50 dark:bg-gray-900">

  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
    Como você cobra pelo espaço?
  </h3>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

    {/* VALOR FIXO */}
    <label
     className={`flex gap-3 p-4 rounded-2xl border cursor-pointer transition
  ${temPlanos
    ? "border-sky-500 bg-white dark:bg-gray-800 shadow-sm"
    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"}
`}
    >
      <input
        type="radio"
        checked={!temPlanos}
        onChange={() => setTemPlanos(false)}
        className="mt-1 accent-sky-500"
      />

      <div>
        <p className="font-medium text-gray-900 dark:text-gray-100">
          Valor fixo
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Você define um valor único pelo espaço
        </p>
      </div>
    </label>

    {/* PACOTES */}
    <label
      className={`flex gap-3 p-4 rounded-2xl border cursor-pointer transition
  ${temPlanos
    ? "border-sky-500 bg-white dark:bg-gray-800 shadow-sm"
    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"}
`}
    >
      <input
        type="radio"
        checked={temPlanos}
        onChange={() => setTemPlanos(true)}
        className="mt-1 accent-sky-500"
      />

      <div>
        <p className="font-medium text-gray-900 dark:text-gray-100">
          Pacotes de festa
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Você cria planos completos para eventos
        </p>
      </div>
    </label>

  </div>

  {/* VALOR FIXO */}
  {!temPlanos && (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Valor do espaço (R$)
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
    className="
w-full
rounded-xl
border border-gray-200 dark:border-gray-600
bg-white dark:bg-gray-800
px-4 py-3
text-sm
text-gray-900 dark:text-gray-100
placeholder:text-gray-400
focus:border-sky-500
focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900
outline-none
transition
"
        required
      />
    </div>
  )}

  {/* PLANOS */}
 {temPlanos && (
  <div className="border border-dashed border-gray-300 rounded-xl p-4 space-y-4 relative">
    <h3 className="text-lg font-semibold">Pacotes de festa</h3>

    {categoriasFesta.map((categoria, catIndex) => (
      
      <div
        key={categoria.id}
        className="border border-dashed border-gray-300 rounded-xl p-4 space-y-4"
      >
<button
  type="button"
  onClick={() => {
    const copia = [...categoriasFesta];
    copia.splice(catIndex, 1);

    // 🔥 ATUALIZA OS DOIS ESTADOS
setCategoriasFesta(copia);
  }}
  className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition"
  title="Remover tipo de festa"
>
  ✕
</button>
        {/* NOME DA CATEGORIA */}
        <input
          type="text"
          placeholder="Ex: Festa Infantil"
          value={categoria.nome}
onChange={(e) => {
  const copia = [...categoriasFesta];
  copia[catIndex].nome = e.target.value;
  setCategoriasFesta(copia);
}}
      className="
w-full
rounded-xl
border border-gray-200 dark:border-gray-600
bg-white dark:bg-gray-800
px-4 py-3
text-sm
text-gray-900 dark:text-gray-100
placeholder:text-gray-400
focus:border-sky-500
focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900
outline-none
transition
"
        />

        {/* PACOTES */}
        {categoria.pacotes.map((pacote, pacIndex) => (
          
          <div
            key={pacote.id}
            className="bg-white dark:bg-gray-800
border border-gray-200 dark:border-gray-700 rounded-2xl p-6 space-y-6 relative shadow-sm"
          >
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
  className="absolute top-3 right-3 text-red-500 hover:text-red-700 trasnsition"
  title="Remover pacote"
>
  ✕
</button>
<div className="flex justify-between items-center">
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
          className="
w-full
rounded-xl
border border-gray-200 dark:border-gray-600
bg-white dark:bg-gray-800
px-4 py-3
text-sm
text-gray-900 dark:text-gray-100
placeholder:text-gray-400
focus:border-sky-500
focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900
outline-none
transition
"
            />

            <textarea
              placeholder="Descrição do pacote"
              value={pacote.descricao}
  onChange={(e) => {
  const copia = [...categoriasFesta];
  copia[catIndex].pacotes[pacIndex].descricao = e.target.value;
  setCategoriasFesta(copia);
}}
          className="
w-full
rounded-xl
border border-gray-200 dark:border-gray-600
bg-white dark:bg-gray-800
px-4 py-3
text-sm
text-gray-900 dark:text-gray-100
placeholder:text-gray-400
focus:border-sky-500
focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900
outline-none
transition
"
            />


{/* ITENS INCLUÍDOS NO PACOTE */}
<div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
  <p className="font-medium text-sm text-gray-700 dark:text-gray-100">
    Itens incluídos no pacote
  </p>

  {pacote.itens.map((item, i) => (
    <div key={i} className="flex gap-2">
      <input
        type="text"
        placeholder="Categoria (ex: Entradas, Bebidas, Decoração)"
        value={item.titulo}
     onChange={(e) => {
  const copia = [...categoriasFesta];
  copia[catIndex].pacotes[pacIndex].itens[i].titulo = e.target.value;
  setCategoriasFesta(copia);
}}
        className="w-full rounded-xl border border-gray-200 dark:border-gray-700
bg-white dark:bg-gray-800 px-2 py-1 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition"
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
    className="
w-full
rounded-xl
border border-gray-200 dark:border-gray-600
bg-white dark:bg-gray-800
px-4 py-3
text-sm
text-gray-900 dark:text-gray-100
placeholder:text-gray-400
focus:border-sky-500
focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900
outline-none
transition
"
      />

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
        className="text-red-500 hover:text-red-700 trasnsition px-2"
      >
        ✕
      </button>
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
    className="text-sm text-sky-600 font-medium"
  >
    + Adicionar item
  </button>
</div>

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
  className="
w-full
rounded-xl
border border-gray-200 dark:border-gray-600
bg-white dark:bg-gray-700
px-4 py-3
text-sm
text-gray-900 dark:text-gray-100
placeholder:text-gray-400
focus:border-sky-500
focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900
outline-none
transition
"
/>

            {/* PREÇOS */}
            <div className="border rounded-xl p-3 space-y-2">
              <p className="font-medium text-sm text-gray-700 dark:text-gray-100">
                Valores por quantidade de convidados
              </p>

              {pacote.precos.map((p, i) => (
                <div key={i} className="flex items-end gap-3">
                  <input
                    type="number"
                    placeholder="Convidados"
                    value={p.convidados ?? ""}
               onChange={(e) => {
  const copia = [...categoriasFesta];
copia[catIndex].pacotes[pacIndex].precos[i].convidados = Number(e.target.value);
  setCategoriasFesta(copia);
}}
                    className="
w-full
rounded-xl
border border-gray-200 dark:border-gray-600
bg-white dark:bg-gray-700
px-4 py-3
text-sm
text-gray-900 dark:text-gray-100
placeholder:text-gray-400
focus:border-sky-500
focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900
outline-none
transition
"
                  />

              <input
  type="text"
  inputMode="numeric"
  placeholder="R$ 0,00"
  value={formatarMoeda(p.valor)}
onChange={(e) => {
  const valorNumerico =
    Number(e.target.value.replace(/\D/g, "")) / 100;

  const copia = [...categoriasFesta];
  copia[catIndex].pacotes[pacIndex].precos[i].valor =
    isNaN(valorNumerico) ? undefined : valorNumerico;

  setCategoriasFesta(copia);
}}
  className="
w-full
rounded-xl
border border-gray-200 dark:border-gray-600
bg-white dark:bg-gray-700
px-4 py-3
text-sm
text-gray-900 dark:text-gray-100 
placeholder:text-gray-400
focus:border-sky-500
focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900
outline-none
transition
"
/>

              <button
  type="button"
  onClick={() => {
    const copia = [...categoriasFesta];
    copia[catIndex].pacotes[pacIndex].precos.splice(i, 1);
    setCategoriasFesta(copia);
  }}
  className="text-red-500 font-bold px-2"
>
  ✕
</button>
                </div>
              ))}

              <button
                type="button"
               onClick={() => {
  const copia = [...categoriasFesta];
  copia[catIndex].pacotes[pacIndex].precos.push({});
  setCategoriasFesta(copia);
}}
                className="text-sm text-sky-600 font-medium"
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
      infoAdicional: "",
      itens: [],
      precos: [],
    });
    setCategoriasFesta(copia);
    setBuffet((prev) => ({
      ...prev,
      categoriasFesta: copia,
    }));
  }}
  className="
    flex items-center gap-2
    px-4 py-2
    border border-gray-300
    rounded-xl
    text-sm font-medium
    text-gray-700
    hover:bg-gray-100
    transition
  "
>
  <span className="text-lg leading-none ">+</span>
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
        className="bg-sky-500 text-white px-4 py-2 rounded-xl"
      >
        + Adicionar tipo de festa
      </button>

    </div>
)}
</section>

          
            {/* Tipo de reserva */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tipo de reserva
              </label>
              <select
                value={tipoReserva}
  onChange={(e) => setTipoReserva(e.target.value)}
            className="
w-full
rounded-xl
border border-gray-200 dark:border-gray-600
bg-white dark:bg-gray-800
px-4 py-3
text-sm
text-gray-900 dark:text-gray-100
placeholder:text-gray-400
focus:border-sky-500
focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900
outline-none
transition
"
                required
              >
                <option value="">Selecione</option>
                <option value="automatica">
                  Confirmação automática
                </option>
                <option value="manual">
                  Necessita aprovação do anfitrião
                </option>
              </select>
            </div>

           

            {/* Disponibilidade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Disponibilidade
              </label>
              <select
                 value={disponivel}
  onChange={(e) => setDisponivel(e.target.value)}
                className="
w-full
rounded-xl
border border-gray-200 dark:border-gray-600
bg-white dark:bg-gray-700
px-4 py-3
text-sm
text-gray-900 dark:text-gray-100
placeholder:text-gray-400
focus:border-sky-500
focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900
outline-none
transition
"
                required
              >
                <option value="true">
                  Publicar no site (disponível para aluguel)
                </option>
                <option value="false">
                  Manter como rascunho (indisponível)
                </option>
              </select>
            </div>

            {/* Serviços Adicionais */}
            <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 dark:bg-gray-900 p-6">
  <h3 className="text-base font-semibold text-gray-800 mb-4 dark:text-gray-100">
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
        <div key={s.id} className="flex gap-2">
          <input
            type="text"
            placeholder="Ex: Buffet, DJ"
            value={s.nome}
            onChange={(e) =>
              atualizarServico(s.id, "nome", e.target.value)
            }
            className="
flex-1
rounded-xl
border border-gray-200 dark:border-gray-600
bg-white dark:bg-gray-800
px-4 py-3
text-sm
text-gray-900 dark:text-gray-100
placeholder:text-gray-400
focus:border-sky-500
focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900
outline-none
transition
"
          />
          <input
            type="number"
            placeholder="R$"
            value={s.preco}
            onChange={(e) =>
              atualizarServico(s.id, "preco", e.target.value)
            }
            className="flex-1
rounded-xl
border border-gray-200 dark:border-gray-600
bg-white dark:bg-gray-800 w-32
px-4 py-3
text-sm
text-gray-900 dark:text-gray-100
placeholder:text-gray-400
focus:border-sky-500
focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900
outline-none
transition
"
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
</div>

            {/* Regras */}
 {/* Regras do local */}
<div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 dark:bg-gray-900 p-6">
  <h3 className="text-base font-semibold text-gray-800 mb-1 dark:text-gray-100">
    Regras do local
  </h3>
  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
    Informe regras importantes que os clientes devem seguir (opcional)
  </p>

  <div className="space-y-3">
    {regras.map((r, i) => (
      <div key={i} className="flex gap-2">
        <input
          type="text"
          placeholder="Ex: Proibido fumar"
          value={r}
          onChange={(e) => atualizarRegra(i, e.target.value)}
          className="
           flex-1
rounded-xl
border border-gray-200 dark:border-gray-600
bg-white dark:bg-gray-800
px-4 py-3
text-sm
text-gray-900 dark:text-gray-100
placeholder:text-gray-400
focus:border-sky-500
focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900
outline-none
transition
"
        />

        <button
          type="button"
          onClick={() => removerRegra(i)}
          className="
            text-sm
            text-red-500
            hover:text-red-700
            transition
          "
        >
          Remover
        </button>
      </div>
    ))}
  </div>

  <button
    type="button"
    onClick={adicionarRegra}
    className="
      mt-4
      text-sm
      text-sky-600
      hover:text-sky-700
      font-medium
      transition
    "
  >
    + Adicionar regra
  </button>
</div>
       {/* Facilidades do local */}
<div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 dark:bg-gray-900 p-6">
  <h3 className="text-base font-semibold text-gray-800 mb-1 dark:text-gray-100">
    Diferenciais do local
  </h3>
  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
    Informe comodidades que tornam seu espaço mais atrativo
  </p>

  <div className="space-y-3">
    {facilidades.map((f, i) => (
      <div key={i} className="flex gap-2">
        <input
          type="text"
          placeholder="Ex: Wi-Fi, Ar-condicionado, Estacionamento"
          value={f}
          onChange={(e) =>
            atualizarFacilidade(i, e.target.value)
          }
          className="
            flex-1
rounded-xl
border border-gray-200 dark:border-gray-600
bg-white dark:bg-gray-800
px-4 py-3
text-sm
text-gray-900 dark:text-gray-100
placeholder:text-gray-400
focus:border-sky-500
focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900
outline-none
transition
"
        />

        <button
          type="button"
          onClick={() => removerFacilidade(i)}
          className="
            text-sm
            text-red-500
            hover:text-red-700
            transition
          "
        >
          Remover
        </button>
      </div>
    ))}
  </div>

  <button
    type="button"
    onClick={adicionarFacilidade}
    className="
      mt-4
      text-sm
      text-sky-600
      hover:text-sky-700
      font-medium
      transition
    "
  >
    + Adicionar diferencial
  </button>
</div>

         {/* Upload de fotos */}
<div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 dark:bg-gray-900 p-6">
<h3 className="text-base font-semibold text-gray-800 mb-1 dark:text-gray-100">
  Fotos do espaço (máx. 10)
</h3>
<p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
  Envie até <b>10 fotos</b>. Recomendamos de 5 a 8 fotos bem escolhidas.
</p>

  {/* Dica sobre fotos */}
  <div className="mb-4 p-4 rounded-xl bg-sky-50 border border-sky-200">
    <p className="text-sm text-sky-800 font-medium">
      Fotos bonitas aumentam muito suas chances de reserva!
    </p>
    <ul className="text-sm text-sky-700 mt-2 list-disc list-inside space-y-1">
      <li>Use fotos claras e bem iluminadas</li>
      <li>Mostre os principais ambientes do espaço</li>
      <li>Evite fotos escuras, borradas ou com baixa qualidade</li>
      <li>
        Espaços com boas fotos recebem até <b>3x mais reservas</b>
      </li>
    </ul>
  </div>

  <input
    type="file"
    multiple
    accept="image/*"
    onChange={handleFotoChange}
    className="
      w-full
      text-sm text-gray-500 dark:text-gray-400
      file:mr-4
      file:py-2
      file:px-4
      file:rounded-full
      file:border-0
      file:text-sm
      file:font-semibold
      file:bg-sky-100
      file:text-sky-700
      hover:file:bg-sky-200
      transition
    "
  />
</div>

{message && (
  <p
    className={`mt-4 text-sm font-medium p-3 rounded-xl ${
      message.startsWith("✅")
        ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
        : "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
    }`}
  >
    {message}
  </p>
)}

{fotosExistentes.length > 0 && (
  <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
    {fotosExistentes.map((foto, index) => (
      <div
        key={index}
        className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700
bg-white dark:bg-gray-800"
      >
        <img
          src={foto}
          alt={`Foto ${index + 1}`}
          className="h-24 w-full object-cover"
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
  <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
    {fotosNovas.map((foto, index) => (
      <div
        key={index}
        className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700
bg-white dark:bg-gray-800"
      >
        <img
          src={URL.createObjectURL(foto)}
          alt={`Foto ${index + 1}`}
          className="h-24 w-full object-cover"
        />

        <button
          type="button"
          onClick={() => {
            const copia = [...fotosNovas];
copia.splice(index, 1);
setFotosNovas(copia);
          }}
          className="
            absolute top-1 right-1
            bg-white/80
            hover:bg-white
            text-red-500
            rounded-full
            w-6 h-6
            flex items-center justify-center
            text-sm
            transition
          "
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
        className="w-full bg-sky-500 text-white py-3 rounded-xl font-semibold"
      >
        {modo === "criar" ? "Cadastrar espaço" : "Salvar alterações"}
      </button>
          </form>
    </div>
    
  </div>
  
</div>

  );
  
}
