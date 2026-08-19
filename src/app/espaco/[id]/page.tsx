"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter,useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, X, Heart, ChevronLeft, ChevronRight, Clock, MessageCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useFavoritos } from "@/context/FavoritosContext";
import DatePicker, { registerLocale } from "react-datepicker";
import { ptBR } from "date-fns/locale";
import { obterValorParaData } from "@/utils/precificacao";
import { calcularValorPeriodo } from "@/utils/precificacao";
import { TAXAS, arredondarMoeda } from "@/config/taxa";
import ImageGallery from "@/components/Espaco/ImageGallery";
registerLocale("pt-BR", ptBR);
// const Mapa = dynamic(() => import("@/components/Mapa"), { ssr: false });

declare global {
  interface Window {
    MP_DEVICE_SESSION_ID?: string;
  }
}

export default function EspacoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [espaco, setEspaco] = useState<any>(null);
const [loading, setLoading] = useState(true);

const dataDisponivel = (date: Date) => {
  const dataStr = formatarData(date);
  return !datasBloqueadas.includes(dataStr);
};
  const getMenorPrecoBuffet = (espaco: any) => {
    let menor = Infinity;

    espaco.buffet?.tiposFesta.forEach((tipo: any) => {
      tipo.pacotes.forEach((pacote: any) => {
        pacote.valores.forEach((v: any) => {
          if (v.preco < menor) menor = v.preco;
        });
      });
    });

    return menor === Infinity ? 0 : menor;
  };

  const [tipoAberto, setTipoAberto] = useState<string | null>(null);
  const [pacoteSelecionado, setPacoteSelecionado] = useState<any>(null);
  const [valorSelecionado, setValorSelecionado] = useState<any>(null);
  const { user } = useAuth();
  const isLogged = !!user?.id;
  const { favoritos, toggleFavorito } = useFavoritos();

  const [modalAberto, setModalAberto] = useState(false);
  const [modalReservaAberto, setModalReservaAberto] = useState(false);
  const descricaoPadrao = "Descrição não cadastrada. Em breve mais detalhes deste espaço.";
  const [modalPrecosAberto, setModalPrecosAberto] = useState(false);
  const [rangeReserva, setRangeReserva] = useState<[Date | null, Date | null]>([null, null]);
  const [startReserva, endReserva] = rangeReserva;
  const [eventoMultiDia, setEventoMultiDia] = useState(false);
  const [datasBloqueadas, setDatasBloqueadas] = useState<string[]>([]);

const formatarData = (data: Date) => {
  return `${data.getFullYear()}-${String(
    data.getMonth() + 1
  ).padStart(2,"0")}-${String(
    data.getDate()
  ).padStart(2,"0")}`;
};
  const calendarRef = useRef<HTMLDivElement>(null);
  const [editandoReserva, setEditandoReserva] = useState(false);
  const [abrirSelecaoMobile, setAbrirSelecaoMobile] = useState(false);
  const [avaliacoes, setAvaliacoes] = useState<
    { usuario: string; nota: number; comentario: string; data: string }[]
  >([]);
const notaMedia = useMemo(() => {
  return avaliacoes.length
    ? avaliacoes.reduce((acc, a) => acc + a.nota, 0) / avaliacoes.length
    : 0;
}, [avaliacoes]);

useEffect(() => {
  async function buscarAvaliacoes() {
    if (!espaco?.id) return;
   const { data: avaliacoesData, error: avaliacoesError } = await supabase
  .from("avaliacoes")
  .select("id, nota, comentario, created_at, user_id")
  .eq("espaco_id", espaco.id)
  .eq("tipo", "cliente_para_espaco")
  .order("created_at", { ascending: false });

    if (avaliacoesError) {
      console.error("Erro ao buscar avaliações:", avaliacoesError);
      return;
    }

    if (!avaliacoesData || avaliacoesData.length === 0) {
      setAvaliacoes([]);
      return;
    }

    const userIds = [...new Set(avaliacoesData.map(av => av.user_id))];
    const { data: usersData, error: usersError } = await supabase
      .from("users")
      .select("id, name")
      .in("id", userIds);

    if (usersError) {
      console.error("Erro ao buscar usuários:", usersError);

      const avaliacoesFormatadas = avaliacoesData.map((av: any) => ({
        usuario: "Usuário",
        nota: av.nota,
        comentario: av.comentario,
        data: new Date(av.created_at).toLocaleDateString("pt-BR"),
      }));
      setAvaliacoes(avaliacoesFormatadas);
      return;
    }

    // Criar um mapa de usuários
    const userMap = new Map();
    usersData?.forEach((user: any) => {
      userMap.set(user.id, user.name);
    });

    // Formatar as avaliações
    const avaliacoesFormatadas = avaliacoesData.map((av: any) => ({
      usuario: userMap.get(av.user_id) || "Usuário",
      nota: av.nota,
      comentario: av.comentario,
      data: new Date(av.created_at).toLocaleDateString("pt-BR"),
    }));

    setAvaliacoes(avaliacoesFormatadas);
  }

  buscarAvaliacoes();
}, [espaco?.id]);

useEffect(() => {
  async function carregarDatasBloqueadas() {
    if (!espaco?.id) return;

    try {
      // Buscar bloqueios manuais
      const [
  { data: bloqueios, error: bloqueiosError },
  { data: reservas, error: reservasError },
] = await Promise.all([
  supabase
    .from("bloqueios")
    .select("data_inicio, data_fim, espaco_id")
    .or(`espaco_id.eq.${espaco.id},espaco_id.is.null`),

  supabase
    .from("reservas")
    .select("data_inicio, data_fim")
    .eq("espaco_id", espaco.id)
    .eq("pagamento_status", "approved")
    .neq("status", "cancelada"),
]);

if (bloqueiosError) throw bloqueiosError;
if (reservasError) throw reservasError;

      const datas: string[] = [];

      const expandirPeriodo = (inicio: string, fim: string) => {
        const atual = new Date(inicio + "T12:00:00");
        const final = new Date(fim + "T12:00:00");

        while (atual <= final) {
          datas.push(
 `${atual.getFullYear()}-${String(atual.getMonth()+1).padStart(2,"0")}-${String(atual.getDate()).padStart(2,"0")}`
);
          atual.setDate(atual.getDate() + 1);
        }
      };

      bloqueios?.forEach((b) =>
        expandirPeriodo(b.data_inicio, b.data_fim)
      );

      reservas?.forEach((r) =>
        expandirPeriodo(r.data_inicio, r.data_fim)
      );
      setDatasBloqueadas([...new Set(datas)]);
    } catch (error) {
      console.error("Erro ao carregar bloqueios:", error);
    }
  }

  carregarDatasBloqueadas();
}, [espaco?.id]);

  useEffect(() => {
async function carregarEspaco() {
 if(!id){
 setLoading(false);
 return;
}

  setLoading(true);

  const { data, error } = await supabase
    .from("spaces")
    .select(`
      *,
      espaco_servicos (
        nome,
        preco
      ),
      espaco_regras (
        texto
      ),
      espaco_facilidades (
        texto
      ),
      espaco_buffet (
        nivel,
        descricao,
        preco_base
      ),
      espaco_categorias (
        id,
        nome,
        ordem,
        pacotes:espaco_pacotes (
          id,
          nome,
          descricao,
          info_adicional,
          ordem,
          duracao,
          itens:espaco_itens_pacote (
            titulo,
            descricao,
            ordem
          ),
          precos:espaco_precos_pacote (
            convidados,
            valor,
            ordem
          )
        )
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Erro ao carregar espaço:", error);
    setLoading(false);
    return;
  }


  
// Transformar os dados do buffet para o formato esperado
const buffetData = data.espaco_buffet && Object.keys(data.espaco_buffet).length > 0 ? {
  descricao: data.espaco_buffet.descricao,
  nivel: data.espaco_buffet.nivel,
  precoBase: data.espaco_buffet.preco_base,
  tiposFesta: data.espaco_categorias?.map((cat: any) => ({
    nome: cat.nome,
    pacotes: cat.pacotes?.map((pact: any) => ({
      nome: pact.nome,
      descricao: pact.descricao,
      duracao: pact.duracao || "4 horas",
      itensInclusos: pact.itens?.map((item: any) => 
        item.descricao ? `${item.titulo}: ${item.descricao}` : item.titulo
      ) || [],
      valores: pact.precos?.map((preco: any) => ({
  convidados: preco.convidados,
  preco: preco.valor / 100
})) || []
    })) || []
  })) || []
} : null;

  setEspaco({
    ...data,
    imagens: data.imagens || [],
    facilidades: data.espaco_facilidades?.map((f: any) => f.texto) || [],
    regras: data.espaco_regras?.map((r: any) => r.texto) || [],
    servicosAdicionais: data.espaco_servicos?.map((s: any) => `${s.nome} - R$ ${s.preco}`) || [],
    buffet: buffetData,  // 🔥 Adicionar os dados do buffet
  });

  setLoading(false);
}

  carregarEspaco();
}, [id]);

  const [activeCalendar, setActiveCalendar] = useState(false);

const getDayClassName = (date: Date) => {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const dataAtual = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const dataStr = `${dataAtual.getFullYear()}-${String(
    dataAtual.getMonth() + 1
  ).padStart(2, "0")}-${String(dataAtual.getDate()).padStart(2, "0")}`;

  const bloqueada = datasBloqueadas.includes(dataStr);
  const passada = dataAtual < hoje;

  if (bloqueada) {
    return "!bg-gray-500 !text-white cursor-not-allowed rounded-full";
  }

  if (passada) {
    return "!bg-gray-200 !text-gray-400 cursor-not-allowed rounded-full";
  }

  return "hover:bg-blue-100 rounded-full";
};

  useEffect(() => {
  if (!activeCalendar) return;

  // Pequeno delay para evitar que o clique que ABRIU o calendário
  // seja interpretado como clique fora
  const timeoutId = setTimeout(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setActiveCalendar(false);
      }
    };

    const handleScroll = () => {
      setActiveCalendar(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);

    // Cleanup para esses event listeners
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, 10);

  return () => {
    clearTimeout(timeoutId);
  };
}, [activeCalendar]);

 useEffect(() => {
  document.body.style.overflow =
    modalAberto || modalReservaAberto || abrirSelecaoMobile
      ? "hidden"
      : "auto";

  return () => {
    document.body.style.overflow = "auto";
  };
}, [modalAberto, modalReservaAberto, abrirSelecaoMobile]);

  const handleFavoritoClick = (espacoId: string) => {
    if (!isLogged) {
      toast.error("Você precisa estar logado para adicionar aos favoritos!");
      return;
    }
    toggleFavorito(espacoId);
    if (favoritos.includes(espacoId)) {
      toast.success("Espaço removido dos favoritos!");
    } else {
      toast.success("Espaço adicionado aos favoritos!");
    }
  };

  const cpfValido = (cpf?: string) => {
    const numeros = cpf?.replace(/\D/g, "") ?? "";

    if (!/^\d{11}$/.test(numeros) || /^(\d)\1{10}$/.test(numeros)) {
      return false;
    }

    const calcularDigito = (base: string, pesoInicial: number) => {
      const soma = base.split("").reduce(
        (total, digito, indice) => total + Number(digito) * (pesoInicial - indice),
        0
      );
      const resto = (soma * 10) % 11;
      return resto === 10 ? 0 : resto;
    };

    const primeiroDigito = calcularDigito(numeros.slice(0, 9), 10);
    const segundoDigito = calcularDigito(numeros.slice(0, 10), 11);

    return (
      primeiroDigito === Number(numeros[9]) &&
      segundoDigito === Number(numeros[10])
    );
  };

  const handleCompartilharWhatsApp = () => {
    if (!espaco) return;

    const urlAtual = new URL(window.location.href);
    const basePublica = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "");
    const linkDoEspaco = basePublica
      ? `${basePublica}${urlAtual.pathname}${urlAtual.search}${urlAtual.hash}`
      : window.location.href;
    const localizacao = [espaco.cidade, espaco.estado]
      .filter(Boolean)
      .join(" - ");
    const mensagem = [
      `Olha este espaço que encontrei na PlacyHub: ${espaco.nome_espaco}.`,
      localizacao ? `Localização: ${localizacao}.` : "",
      linkDoEspaco,
    ]
      .filter(Boolean)
      .join("\n");

    window.open(
      `https://wa.me/?text=${encodeURIComponent(mensagem)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const perfilCompleto = () => {
    if (!user) return false;

    const nomeValido = (user.name?.trim().split(" ").filter(Boolean).length ?? 0) >= 2;
    const emailValido = /^\S+@\S+\.\S+$/.test(user.email?.trim() ?? "");
    const documentoValido = cpfValido(user.cpf);
    const telefoneValido = (user.telefone?.replace(/\D/g, "").length ?? 0) >= 10;
    const nascimentoValido = Boolean(user.dataNascimento);
    const cepValido = (user.cep?.replace(/\D/g, "").length ?? 0) === 8;
    const enderecoValido = Boolean(
      user.rua?.trim() &&
        user.numero?.trim() &&
        user.bairro?.trim() &&
        user.cidade?.trim() &&
        /^[A-Z]{2}$/i.test(user.estado?.trim() ?? "")
    );

    return (
      nomeValido &&
      emailValido &&
      documentoValido &&
      telefoneValido &&
      nascimentoValido &&
      cepValido &&
      enderecoValido
    );
  };

  const [qtdPessoas, setQtdPessoas] = useState(1);
  const [reservando, setReservando] = useState(false);
const [isMobile,setIsMobile] = useState(false);

useEffect(() => {
  const checkIsMobile = () => {
    setIsMobile(window.innerWidth < 768);
  };

  // Executa ao abrir a página
  checkIsMobile();

  // Atualiza se mudar o tamanho da tela
  window.addEventListener("resize", checkIsMobile);

  return () => {
    window.removeEventListener("resize", checkIsMobile);
  };
}, []);

  const [showBottomBar, setShowBottomBar] = useState(true);
const lastScrollY = useRef(0);

useEffect(() => {
  if (!isMobile) return;

  const handleScroll = () => {
    if (modalReservaAberto) return; // 🔥 trava total

    const currentScrollY = window.scrollY;

    if (currentScrollY < 50) {
      setShowBottomBar(true);
    } else if (currentScrollY > lastScrollY.current) {
      setShowBottomBar(false);
    } else {
      setShowBottomBar(true);
    }

    lastScrollY.current = currentScrollY;
  };

  window.addEventListener("scroll", handleScroll);

  return () => window.removeEventListener("scroll", handleScroll);
}, [isMobile, modalReservaAberto]);
useEffect(() => {
  if (modalReservaAberto) {
    setShowBottomBar(false);
  }
}, [modalReservaAberto]);

useEffect(() => {
  const script = document.createElement("script");

  script.src = "https://www.mercadopago.com/v2/security.js";
  script.async = true;
  script.setAttribute("view", "checkout");

  script.onload = () => {
    console.log("✅ Mercado Pago Security.js carregado");

    const deviceId = (window as any).MP_DEVICE_SESSION_ID;

    console.log("📱 MP_DEVICE_SESSION_ID:", deviceId);
  };

  script.onerror = () => {
    console.error("❌ Erro ao carregar Security.js do Mercado Pago");
  };

  document.body.appendChild(script);

  return () => {
    document.body.removeChild(script);
  };
}, []);

 const handleAbrirModalReserva = () => {
    if (!isLogged) {
      toast.error("Você precisa estar logado para reservar este espaço!");
      return;
    }

      if (!perfilCompleto()) {
      toast.error(
        "Complete seus dados pessoais e endereço antes de seguir para o pagamento."
      );
      router.push("/locatario/perfil");
      return;
    }

    if (!startReserva) {
      toast.error("Selecione a data do evento!");
      return;
    }

    if (isBuffet && !valorSelecionado) {
      toast.error("Selecione um pacote com quantidade de convidados!");
      return;
    }

    if (!isBuffet) {
      if (!qtdPessoas || qtdPessoas < 1) {
        toast.error("Informe a quantidade de pessoas!");
        return;
      }

      const capacidadeMaxima = espaco?.capacidade || 100;
  if (qtdPessoas > capacidadeMaxima) {
    toast.error(`Máximo permitido: ${capacidadeMaxima} pessoas`);
    return;
  }
    }

    setModalReservaAberto(true);
  };

const handleConfirmarReserva = async () => {
 
  if (!startReserva) {
    toast.error("Selecione a data do evento!");
    return;
  }

  const dataFormatada = formatarData(startReserva);

  if (datasBloqueadas.includes(dataFormatada)) {
    toast.error("Essa data já está reservada ou bloqueada.");
    return;
  }

  if (eventoMultiDia && startReserva && endReserva) {
    let dataAtual = new Date(startReserva);
    while (dataAtual <= endReserva) {
      const dataString = dataAtual.toISOString().split("T")[0];
      if (datasBloqueadas.includes(dataString)) {
        toast.error("O período selecionado contém datas indisponíveis.");
        return;
      }
      dataAtual.setDate(dataAtual.getDate() + 1);
    }
  }

  if (isBuffet && !valorSelecionado) {
    toast.error("Selecione um pacote antes de continuar!");
    return;
  }

  if (!isBuffet) {
    if (!qtdPessoas || qtdPessoas < 1) {
      toast.error("Informe a quantidade de pessoas!");
      return;
    }
      const capacidadeMaxima = espaco?.capacidade || 100;
  if (qtdPessoas > capacidadeMaxima) {
    toast.error(`Máximo permitido: ${capacidadeMaxima} pessoas`);
    return;
  }
  }

  const deviceId = window.MP_DEVICE_SESSION_ID;
  if (!deviceId) {
    toast.error("A verificação de segurança ainda está carregando. Aguarde alguns segundos e tente novamente.");
    return;
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    toast.error("Sua sessão expirou. Entre novamente para continuar.");
    router.push("/login");
    return;
  }

  // O Checkout Pro não garante retorno automático para pagamentos Pix.
  // Mantemos a PlacyHub aberta e exibimos o checkout em uma aba separada.
  const checkoutWindow = window.open("", "placyhub-mercado-pago");
  if (checkoutWindow) {
    checkoutWindow.document.title = "Abrindo pagamento...";
    checkoutWindow.document.body.innerHTML =
      '<p style="font-family:Arial,sans-serif;padding:24px">Abrindo o pagamento seguro...</p>';
  }

  setReservando(true);
const diasReserva =
startReserva && endReserva
? Math.max(
    1,
    Math.floor(
      (endReserva.getTime() - startReserva.getTime())
      / 86400000
    ) + 1
  )
: 1;

try {
const {
  valorBase,
  taxaCliente,
  total,
} = resumoPreco;


    const dataInicioReserva = formatarData(startReserva);
    const dataFimReserva = endReserva
      ? formatarData(endReserva)
      : dataInicioReserva;
    const limiteReservaPendente = new Date(Date.now() - 15 * 60 * 1000).toISOString();

    const { data: reservaPendente, error: reservaPendenteError } = await supabase
      .from("reservas")
      .select("*")
      .eq("espaco_id", espaco.id)
      .eq("user_id", user?.id)
      .eq("data_inicio", dataInicioReserva)
      .eq("data_fim", dataFimReserva)
      .eq("qtd_pessoas", qtdPessoas)
      .eq("valor_total", total)
      .eq("status", "pendente")
      .gte("created_at", limiteReservaPendente)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (reservaPendenteError) throw reservaPendenteError;

    let reservaData = reservaPendente;
    if (!reservaData) {
      const { data: novaReserva, error: reservaError } = await supabase
        .from("reservas")
        .insert({
        espaco_id: espaco.id,
        user_id: user?.id,
        data_inicio: dataInicioReserva,
        data_fim: dataFimReserva,
        status: "pendente",
        qtd_pessoas: qtdPessoas,
        valor_base: valorBase,
        taxa_placyhub: taxaCliente,
        comissao_placyhub: comissaoPlacyHub,
        repasse_anfitriao: repasseAnfitriao,
        valor_total: total,
        created_at: new Date().toISOString(),
        pacote_nome: pacoteSelecionado?.nome || null,
        convidados_pacote: valorSelecionado?.convidados || null,
      })
        .select()
        .single();

      if (reservaError) throw reservaError;
      reservaData = novaReserva;
    }

    if (!reservaData) throw new Error("Não foi possível criar ou recuperar a reserva.");


    // 🔥 2. PEGAR DEVICE ID DO MERCADO PAGO
console.log("DEVICE ID ANTES DO PAGAMENTO:", deviceId);

// 🔥 3. CRIAR PAGAMENTO COM O ID DA RESERVA

const response = await fetch("/api/pagamento", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.access_token}`,
  },
  body: JSON.stringify({
    reservaId: reservaData.id,
    deviceId,
  }),
});

    if (!response.ok) {
      checkoutWindow?.close();
      const text = await response.text();
      console.error("Erro API:", text);
      toast.error("Erro ao criar pagamento. Tente novamente.");
      return;
    }

    const result = await response.json();

    if (result.url) {
      setModalReservaAberto(false);
      if (checkoutWindow) {
        checkoutWindow.location.href = result.url;
        router.push("/locatario/reservas?pagamento=aguardando");
      } else {
        window.location.href = result.url;
      }
    }
    else {
      checkoutWindow?.close();
      toast.error("Erro ao criar pagamento. Tente novamente.");
    }
  } catch (err) {
    checkoutWindow?.close();
    console.error(err);
    toast.error("Erro ao criar reserva. Tente novamente.");
  } finally {
  setReservando(false);
}
};

const isBuffet = useMemo(() => {
  return !!espaco?.buffet &&
    espaco.buffet.tiposFesta?.length > 0;
}, [espaco]);

const precoBaseDinamico = useMemo(() => {
  if (!espaco) return 0;

  return startReserva
    ? obterValorParaData(startReserva, espaco)
    : (espaco.preco ?? 0) / 100;
}, [startReserva, espaco]);

const precoSelecionado = useMemo(() => {
  return isBuffet
    ? valorSelecionado?.preco ?? getMenorPrecoBuffet(espaco)
    : precoBaseDinamico;
}, [
  isBuffet,
  valorSelecionado,
  espaco,
  precoBaseDinamico
]);

const resumoPreco = useMemo(() => {

  if (!espaco) {
    return {
      valorBase: 0,
      taxaCliente: 0,
      total: 0,
    };
  }

  const valorBase = isBuffet
    ? valorSelecionado?.preco ?? 0
    : startReserva && endReserva
      ? calcularValorPeriodo(startReserva, endReserva, espaco)
      : 0;

  const valorBaseArredondado = arredondarMoeda(valorBase);
  const taxaCliente = arredondarMoeda(valorBaseArredondado * TAXAS.locatario);

  return {
    valorBase: valorBaseArredondado,
    taxaCliente,
    total: arredondarMoeda(valorBaseArredondado + taxaCliente),
  };

}, [
 isBuffet,
 valorSelecionado,
 startReserva,
 endReserva,
 espaco,
]);


const {
 valorBase,
 taxaCliente,
 total: totalCalculado,
} = resumoPreco;


const comissaoPlacyHub = useMemo(() => {
 return arredondarMoeda(valorBase * TAXAS.anfitriao);
}, [valorBase]);


const repasseAnfitriao = useMemo(() => {
 return arredondarMoeda(valorBase - comissaoPlacyHub);
}, [valorBase, comissaoPlacyHub]);


const imagens = useMemo(() => {
 if (!espaco) return [];

 return [
   ...(espaco.imagem ? [espaco.imagem] : []),
   ...(espaco.imagens || []),
 ];
}, [espaco]);


const reservaCompleta = useMemo(() => {
 return isBuffet
 ? !!startReserva && !!valorSelecionado
 : !!startReserva && qtdPessoas > 0;
}, [
 isBuffet,
 startReserva,
 valorSelecionado,
 qtdPessoas
]);


  if (loading) {
  return (
    <p className="text-center mt-10">
      Carregando espaço...
    </p>
  );
}

if (!espaco) {
  return (
    <p className="text-center mt-10">
      Espaço não encontrado.
    </p>
  );
}



const diasReserva =
  startReserva
    ? endReserva
      ? Math.max(
          1,
          Math.ceil(
            (endReserva.getTime() - startReserva.getTime()) /
            86400000
          ) + 1
        )
      : 1
    : 0;


const handleVoltar = () => {
 if(window.history.length > 1){
   router.back();
 }else{
   router.push("/");
 }
};

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 pb-24 text-gray-900 dark:text-gray-100">
      {/* BOTÃO VOLTAR - Corrigido */}
      <div className="w-full mb-8 flex justify-start">
         <button
    onClick={handleVoltar}
    className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-gray-300 dark:hover:border-slate-600 hover:text-gray-700 dark:hover:text-gray-200 hover:shadow-sm transition-all duration-300 group"
    aria-label="Voltar"
  >
    <ArrowLeft
      size={18}
      className="group-hover:-translate-x-0.5 transition-transform duration-300"
    />
  </button>
      </div>
      
      <h1 className="text-4xl font-bold mb-6">{espaco.nome_espaco}</h1>

<ImageGallery imagens={imagens} />
    
      {modalReservaAberto && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setModalReservaAberto(false)}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-3xl w-full p-8 relative overflow-y-auto max-h-[90vh] border border-gray-100 dark:border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão fechar */}
            <button
              onClick={() => setModalReservaAberto(false)}
              className="absolute top-5 right-5 p-2 bg-white dark:bg-slate-700 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-slate-600 transition"
            >
              <X size={24} />
            </button>

            {/* Título */}
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Confirmar Reserva</h2>

            {/* Resumo da reserva */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-slate-700 rounded-xl border border-gray-200 dark:border-slate-600 shadow-sm">
              <p className="font-semibold text-gray-700 dark:text-gray-200 mb-2 flex justify-between items-center">
                Sua reserva
                <button
                  className="text-[#02aeee] underline hover:text-[#0284c7] text-sm"
                  onClick={() => setEditandoReserva(!editandoReserva)}
                >
                  {editandoReserva ? "Fechar" : "Editar"}
                </button>
              </p>

              <p className="text-gray-600 dark:text-gray-300">
                Datas: {startReserva?.toLocaleDateString()} – {endReserva?.toLocaleDateString()}
              </p>
{isBuffet ? (
  <>
    <p className="text-gray-600 dark:text-gray-300">
      Tipo de festa: {tipoAberto}
    </p>
    <p className="text-gray-600 dark:text-gray-300">
      Pacote: {pacoteSelecionado?.nome}
    </p>
    <p className="text-gray-600 dark:text-gray-300">
      Convidados: {valorSelecionado?.convidados}
    </p>
    <p className="text-gray-600 dark:text-gray-300">
      Duração: {pacoteSelecionado?.duracao}
    </p>
  </>
) : (
  <p className="text-gray-600 dark:text-gray-300">
    Quantidade de pessoas: {qtdPessoas}
  </p>
)}

{isBuffet && pacoteSelecionado && (
  <div className="mt-4 border-t pt-4">
    <p className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
      O que está incluso:
    </p>

    <div className="grid grid-cols-2 gap-2">
      {pacoteSelecionado.itensInclusos.map((item: string, i: number) => (
        <div
          key={i}
          className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-slate-700 px-3 py-2 rounded-lg"
        >
          ✔ {item}
        </div>
      ))}
    </div>
  </div>
)}

              {/* Telinha de edição */}
              {editandoReserva && (
                <div className="mt-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Calendário */}
                    <div className="flex-1">
                      <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">Selecione a data</label>
                    <DatePicker
  selectsRange
  startDate={startReserva ?? undefined}
  endDate={endReserva ?? undefined}
  filterDate={dataDisponivel}
  onChange={(update: [Date | null, Date | null]) => {
    setRangeReserva(update);

    if (update && update[1]) {
      setActiveCalendar(false);
    }
  }}
  inline
  locale="pt-BR"
  minDate={new Date()}
   dayClassName={getDayClassName}
/>
                    </div>

                    {/* Hora e quantidade de pessoas */}
                    <div className="flex flex-col gap-4">
{!isBuffet && (
  <div>
    <label className="block text-sm font-semibold mb-1">
      Qtd. Pessoas
    </label>


   <input
      type="number"
      min={1}
      max={espaco?.capacidade || 100}
      value={qtdPessoas === 0 ? "" : qtdPessoas}
      onChange={(e) => {
        let v = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
        
        if (e.target.value === "") {
          setQtdPessoas(0);
          return;
        }
        
        if (isNaN(v)) v = 0;
        if (v < 0) v = 0;
        
        setQtdPessoas(v);
      }}
      onBlur={(e) => {
        let v = qtdPessoas;
        if (v < 1 || isNaN(v)) v = 1;
        
        setQtdPessoas(v);
      }}
      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-900 rounded-lg text-sm"
      placeholder={`máx. ${espaco?.capacidade || 100} pessoas`}
    />
  </div>
)}
                    </div>
                  </div>

                  {/* Botão confirmar */}
                  <button
                    onClick={() => setEditandoReserva(false)}
                    className="w-full mt-4 bg-[#02aeee] text-white py-2 rounded-xl font-semibold hover:bg-[#0284c7] transition"
                  >
                    Confirmar
                  </button>
                </div>
              )}

            </div>

     {/* Resumo do espaço com foto */}
<div className="border-t border-gray-200 dark:border-slate-700 pt-4 mb-6 flex flex-col md:flex-row gap-6 items-start">

  {/* Texto */}
  <div className="flex-1 space-y-2 text-gray-700 dark:text-gray-200">
   <div className="flex items-center gap-3">
  <p className="font-semibold text-gray-800 dark:text-gray-100 text-lg">
    {espaco.nome}
  </p>
</div>
<p className="text-gray-600 dark:text-gray-300">
  {espaco.tipo ?? "Tipo não informado"}
</p>

    {/* Avaliação correta puxando do espaço */}
    <p className="text-gray-600 dark:text-gray-300">
      {notaMedia.toFixed(1)} de 5 na avaliação
    </p>

    {/* Preços — automático baseado no período + plano */}
{isBuffet ? (
<>
<p className="text-gray-500 text-sm">
Valor do pacote
</p>

<p className="text-xl font-bold">
{valorBase.toLocaleString("pt-BR",{
 style:"currency",
 currency:"BRL"
})}
</p>

<p className="text-gray-700">
Taxa PlacyHub:
{" "}
{taxaCliente.toLocaleString("pt-BR",{
 style:"currency",
 currency:"BRL"
})}
</p>

<p className="text-2xl font-bold">
Total:
{" "}
{totalCalculado.toLocaleString("pt-BR",{
 style:"currency",
 currency:"BRL"
})}
</p>
</>
) : (
  <>
<p className="text-gray-700 dark:text-gray-200 font-medium">
  Total para {diasReserva} {diasReserva === 1 ? "dia" : "dias"}
</p>

<p className="text-gray-800 dark:text-gray-100 font-bold text-xl">
  {totalCalculado.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })}
</p>
<p className="text-gray-700 dark:text-gray-300">
  Valor do espaço:
  {" "}
  {valorBase.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })}
</p>

<p className="text-gray-700 dark:text-gray-300">
  Taxa de serviço PlacyHub:
  {" "}
 {taxaCliente.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })}
</p>

<p className="text-gray-900 dark:text-white font-bold text-xl">
  Total:
  {" "}
  {totalCalculado.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })}
</p>
  </>
)}
</div>
  {/* Imagem */}
  <div className="flex-shrink-0 w-full md:w-48 h-32 md:h-36 rounded-xl overflow-hidden shadow-sm">
    <img
  src={
    espaco.imagem ||
    imagens[0] ||
    "/images/placeholder-space.jpg"
  }
      alt={espaco.nome}
      className="w-full h-full object-cover"
    />
  </div>
</div>


            {/* Políticas e regras clean */}
            <div className="border-t border-gray-200 pt-4 mb-6 space-y-4 text-gray-700 dark:text-gray-200 text-sm">
              {/* Política de cancelamento */}
              <div className="p-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
                <p className="font-semibold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
                  Política de Cancelamento
                </p>
                <p className="text-gray-700 dark:text-gray-200">
                  Consulte as regras de cancelamento antes de concluir sua reserva.
                 <Link
    href="/footer/cancelamentos"
    className="text-[#02aeee] underline cursor-pointer hover:text-[#0284c7] ml-1"
  >
    Saiba mais
  </Link>
                </p>
              </div>

              {/* Regras básicas */}
              <div className="p-4 rounded-xl border border-gray-200 shadow-sm">
                <p className="font-semibold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
                  Regras Básicas
                </p>
                <ul className="list-disc ml-6 space-y-1 text-gray-700 dark:text-gray-200">
                  <li>Mantenha a cordialidade e o respeito com todos os envolvidos.</li>
                  <li>Siga as instruções e regras estabelecidas pelo anfitrião.</li>
                  <li>Cuide do espaço como se fosse seu.</li>
                </ul>
              </div>

              {/* Políticas gerais */}
              <div className="p-4 rounded-xl border border-gray-200 shadow-sm">
                <p className="font-semibold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
                  Políticas e Termos
                </p>
                <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                  Ao confirmar a reserva, você concorda com as políticas da PlacyHub, incluindo:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-700 dark:text-gray-200">
                  <li>Regras do espaço estabelecidas pelo anfitrião.</li>
                  <li>Política de reembolso e remarcação.</li>
                  <li>Termos de serviço e termos de pagamento da PlacyHub.</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-200 mt-2">
                  Também concorda que a PlacyHub pode processar o pagamento caso haja danos ou descumprimento das regras.
                </p>
              </div>
            </div>
            
{/* AVISO DE VISTORIA */}
<div className="border border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/30 rounded-xl p-4 text-sm text-yellow-900 dark:text-yellow-200">
  <p className="font-semibold mb-1">
    Vistoria do espaço
  </p>
  <p className="leading-relaxed">
    Todos os espaços passam por uma vistoria <strong>antes</strong> e
    <strong> após</strong> cada locação.
    <br />
    Caso sejam constatadas avarias, danos ou uso inadequado do espaço e de seus
    itens, o locatário poderá ser <strong>responsabilizado pelos custos de
    reparo ou reposição</strong>, conforme análise das evidências registradas.
  </p>
</div>

            {/* Botão confirmar */}
          <button
  onClick={handleConfirmarReserva}
  className="w-full mt-2 bg-gradient-to-r from-[#02aeee] to-[#0284c7] text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:opacity-90 transition"
>
  Confirmar e Pagar
</button>
          </div>
        </div>
      )}
      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-6">
        <div className="md:col-span-2 space-y-10">
          {/* DESCRIÇÃO */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">Descrição</h2>
           <p className="text-gray-700 dark:text-gray-200 leading-relaxed break-words">{espaco.descricao ?? descricaoPadrao}</p>
            <p className="text-gray-600 dark:text-gray-300 mt-2 ">
              {espaco.cidade} — {espaco.bairro}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Por segurança, o endereço completo e o contato do anfitrião são liberados após a confirmação do pagamento.
            </p>
          </section>
          


          {/* FACILIDADES + REGRAS */}
        {(espaco.facilidades && espaco.facilidades.length > 0) ||
 (espaco.regras && espaco.regras.length > 0) ? (

  <section className="grid grid-cols-1 md:grid-cols-2 gap-10">

    {/* FACILIDADES */}
    {espaco.facilidades && espaco.facilidades.length > 0 && (
      <div>
        <h2 className="text-2xl font-semibold mb-3">
          Facilidades incluídas
        </h2>
        <ul className="space-y-1 text-gray-700 dark:text-gray-200 ">
          {(espaco.facilidades || []).map((item: any, i: number) => (
            <li key={i}>• {item}</li>
          ))}
        </ul>
      </div>
    )}

    {/* REGRAS */}
    
    {espaco.regras && espaco.regras.length > 0 && (
      <div>
        <h2 className="text-2xl font-semibold mb-3">
          Regras do local
        </h2>
        <ul className="space-y-1 text-gray-700 dark:text-gray-200 ">
          {(espaco.regras || []).map((item: any, i: number) => (
            <li key={i}>• {item}</li>
          ))}
        </ul>
      </div>
    )}

  </section>

) : null}

     {espaco.servicosAdicionais && espaco.servicosAdicionais.length > 0 && (
  <section>
    <h2 className="text-2xl font-semibold mb-3">Serviços adicionais</h2>
    <ul className="list-disc text-gray-700 dark:text-gray-200 ml-6 ">
      {(espaco.servicosAdicionais || []).map((item: any, i: number) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  </section>
)}

          {isBuffet && (
 <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 space-y-6">
  <h2 className="text-2xl font-semibold">Buffet e Pacotes</h2>

 <p className="text-gray-600 dark:text-gray-300 ">
    {espaco.buffet?.descricao}
  </p>

 {(espaco.buffet?.tiposFesta || []).map((tipo: any, i: number) => {
    const aberto = tipoAberto === tipo.nome;

    return (
      <div key={i} className="border rounded-xl overflow-hidden">
        
        {/* HEADER CLICÁVEL */}
        <button
          onClick={() =>
            setTipoAberto(aberto ? null : tipo.nome)
          }
          className="w-full text-left px-5 py-4 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 transition flex justify-between items-center"
        >
          <span className="text-xl font-semibold text-[#02aeee]">
            {tipo.nome}
          </span>

          <span
            className={`transition-transform duration-300 ${
              aberto ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </button>

        {/* CONTEÚDO (só aparece se estiver aberto) */}
        {aberto && (
          <div className="p-5 space-y-4">
            {(tipo.pacotes || []).map((pacote: any, j: number) => (
              <div
                key={j}
                className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-lg">
                      {pacote.nome}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {pacote.descricao}
                    </p>
                  </div>

                    <div className="flex justify-between items-start">
  <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1">
    <Clock size={12} />
    {pacote.duracao}
  </span>
</div>
                </div>

 {/* Itens inclusos */}
<div>
  <p className="font-medium text-sm mb-2 text-gray-800 dark:text-gray-100">Inclui:</p>
  <div className="flex flex-col gap-2">
    {pacote.itensInclusos.map((item: any, k: number) => {
      // Verifica se o item é um objeto (com titulo e descricao)
      if (typeof item === 'object' && item !== null) {
        return (
          <div key={k} className="flex flex-col bg-white dark:bg-slate-800 border dark:border-slate-600 rounded-lg p-2">
            <span className="font-semibold text-sm">{item.titulo}</span>
            <span className="text-xs text-gray-500 mt-0.5">{item.descricao}</span>
          </div>
        );
      } else {
        // Fallback para o formato antigo (string)
        return (
          <div key={k} className="bg-white dark:bg-slate-800 border dark:border-slate-600 rounded-lg p-2">
            <span className="text-sm">{item}</span>
          </div>
        );
      }
    })}
  </div>
</div>

                {/* Valores */}
                <div className="border-t pt-3">
                  <p className="font-medium text-sm mb-2">
                    Valores:
                  </p>

                 <div className="space-y-2">
  {(pacote.valores || [])
    .sort(
      (a: any, b: any) =>
        a.convidados - b.convidados
    )
    .map((valor: any, x: number) => {
                        const selecionado =
                          pacoteSelecionado?.nome ===
                            pacote.nome &&
                          valorSelecionado?.convidados ===
                            valor.convidados;

                        return (
                          <div
                            key={x}
                            onClick={() => {
                              setPacoteSelecionado(
                                pacote
                              );
                              setValorSelecionado(valor);
                              setQtdPessoas(
                                valor.convidados
                              );
                            }}
                            className={`flex justify-between items-center border border-gray-200 dark:border-slate-600 rounded-lg px-4 py-2 cursor-pointer transition
                            ${
                              selecionado
                                ? "bg-[#02aeee] text-white border-[#02aeee]"
                                : "hover:shadow-sm"
                            }`}
                          >
                            <span>
                              {valor.convidados} convidados
                            </span>

                            <span className="font-bold">
                              {valor.preco.toLocaleString(
                                "pt-BR",
                                {
                                  style: "currency",
                                  currency: "BRL",
                                }
                              )}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  })}
</section>
)}


          {/* AVALIAÇÕES */}
          <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 mt-10">
            
            <h2 className="text-2xl font-semibold mb-4">Avaliações</h2>

        {/* Nota Média */}
<div className="flex items-center gap-4 mb-6">
  <div className="flex items-center gap-4 mb-6">
  {avaliacoes.length > 0 ? (
    <>
      <div className="text-4xl font-bold text-[#02aeee]">
        {notaMedia.toFixed(1)}
      </div>

      <div className="flex flex-col">
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={20}
              className={
                i < Math.round(notaMedia)
                  ? "text-yellow-500"
                  : "text-gray-300"
              }
              fill={
                i < Math.round(notaMedia)
                  ? "#facc15"
                  : "none"
              }
            />
          ))}
        </div>

        <span className="text-gray-500 text-sm">
          {avaliacoes.length} avaliações
        </span>
      </div>
    </>
  ) : (
    <span className="text-gray-500">
      Este espaço ainda não possui avaliações
    </span>
  )}
</div>
</div>

            {/* Comentários */}
            <div className="space-y-4">
              {avaliacoes.map((a, i) => (
                <div key={i} className="flex gap-3 items-start border-b border-gray-100 pb-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white">
                    {a.usuario?.charAt(0) || "U"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{a.usuario}</span>
                      <span className="text-gray-400 text-xs">{a.data}</span>
                    </div>
                    <div className="flex gap-1 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < a.nota ? "text-yellow-500" : "text-gray-300"}
                          fill={i < a.nota ? "#facc15" : "none"}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700  text-sm mt-1 dark:text-gray-100">{a.comentario}</p>
                  </div>
                </div>
              ))}
            </div>

          </section>

{/* MAPA - VERSÃO COMPLETA COM FALLBACK */}
{/* <div className="mt-10">
  {espaco.latitude && espaco.longitude ? (
    <>
      <h2 className="text-2xl font-semibold mb-4">Localização</h2>
      <MapaEspacos
        espacos={[
          {
            id: espaco.id,
            nome: espaco.nome,
            endereco: `${espaco.endereco || espaco.cidade || ""}, ${espaco.bairro || ""}`,
            latitude: Number(espaco.latitude),
            longitude: Number(espaco.longitude),
          },
        ]}
      />
    </>
  ) : (
    <div className="bg-gray-100 dark:bg-slate-800 rounded-2xl p-8 text-center">
      <p className="text-gray-500 dark:text-gray-400">
        🗺️ Mapa indisponível para este espaço.
      </p>
    </div>
  )}
</div> */}
        </div>

        {/* CARD LATERAL */}
        <aside className="hidden md:block md:col-span-1">
          <div className="sticky top-28 bg-white dark:bg-slate-800 shadow-xl rounded-2xl p-7 border border-gray-200 dark:border-slate-700 space-y-6 relative">

           <>
{isBuffet ? (
  // ========== BUFFET ==========
  <div>
    <p className="text-3xl font-bold text-[#02aeee]">
      {(valorSelecionado?.preco || getMenorPrecoBuffet(espaco)).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}
    </p>
    {valorSelecionado && (
      <p className="text-xs text-gray-500 mt-1">
        {pacoteSelecionado?.nome} • {valorSelecionado.convidados} convidados
      </p>
    )}
    {!valorSelecionado && (
      <p className="text-xs text-gray-500 mt-1">
        Selecione um pacote
      </p>
    )}
  </div>
) : (
  // ========== ESPAÇO NORMAL ==========
  <div>
    <p className="text-3xl font-bold text-[#02aeee]">
  {precoBaseDinamico.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })}
</p>
    {diasReserva > 0 && (
      <p className="text-xs text-gray-500 mt-1">
        Total para {diasReserva} {diasReserva === 1 ? "dia" : "dias"}
      </p>
    )}
  </div>
)}
                  <div>
                 <label className="font-semibold text-sm">Data do evento</label>

<div
  onClick={(e) => {
    e.stopPropagation();
    setActiveCalendar(!activeCalendar);
  }}
  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg cursor-pointer bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
>
  {!startReserva ? (
    "Selecione a data"
  ) : !eventoMultiDia ? (
    startReserva.toLocaleDateString("pt-BR")
  ) : !endReserva ? (
    `${startReserva.toLocaleDateString("pt-BR")} –`
  ) : (
    `${startReserva.toLocaleDateString("pt-BR")} – ${endReserva.toLocaleDateString("pt-BR")}`
  )}
</div>


{activeCalendar && (
  <div
    className="absolute z-50 mt-2 shadow-lg rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-3"
    ref={calendarRef}
  >
    {eventoMultiDia ? (
      <DatePicker
        inline
        locale="pt-BR"
        minDate={new Date()}
        filterDate={dataDisponivel}
        selectsRange
        startDate={startReserva ?? undefined}
        endDate={endReserva ?? undefined}
        onChange={(update: [Date | null, Date | null]) => {
          setRangeReserva(update);
          if (update[1]) setActiveCalendar(false);
        }}
         dayClassName={getDayClassName}
      />
    ) : (
      <DatePicker
        inline
        locale="pt-BR"
        minDate={new Date()}
        filterDate={dataDisponivel}
        selected={startReserva ?? undefined}
        onChange={(date: Date | null) => {
          if (date) {
            setRangeReserva([date, date]);
            setActiveCalendar(false);
          }
        }}
         dayClassName={getDayClassName}
      />
    )}
  </div>
)}

    {/* BOTÃO de alternância */}
    <div className="mt-3 flex items-center gap-2">
      <input
        type="checkbox"
        checked={eventoMultiDia}
        onChange={(e) => {
          setEventoMultiDia(e.target.checked);
          if (!e.target.checked) {
            // Voltou para 1 dia → se já existir start, define end igual ao start
            if (startReserva) setRangeReserva([startReserva, startReserva]);
            else setRangeReserva([null, null]);
          }
        }}
      />
      <span className="text-sm">Evento com mais de um dia</span>
    </div>
  </div>


                  

                  {isBuffet ? (
  <div>
    <label className="block text-sm font-semibold mb-1">
      Qtd. Pessoas
    </label>

    <input
      type="number"
      value={valorSelecionado?.convidados || qtdPessoas}
      disabled
      className="w-full px-3 py-2 border border-gray-200 bg-gray-100 text-gray-500 rounded-lg text-sm cursor-not-allowed"
    />

    <p className="text-xs text-gray-400 mt-1">
      Definido pelo pacote selecionado
    </p>
  </div>
) : (
  // ========== ESPAÇO NORMAL ==========
  <div>
    <label className="block text-sm font-semibold mb-1">
      Qtd. Pessoas
    </label>


     <input
      type="number"
      min={1}
      max={espaco?.capacidade || 1000}
      value={qtdPessoas === 0 ? "" : qtdPessoas}
      onChange={(e) => {
        let v = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
        
        if (e.target.value === "") {
          setQtdPessoas(0);
          return;
        }
        
        if (isNaN(v)) v = 0;
        if (v < 0) v = 0;
        
        setQtdPessoas(v);
      }}
      onBlur={(e) => {
        let v = qtdPessoas;
        if (v < 1 || isNaN(v)) v = 1;
               setQtdPessoas(v);
      }}
      className="w-full border p-3 rounded-xl"
    />
  </div>
)}
<button
onClick={handleAbrirModalReserva}
disabled={!isLogged || !reservaCompleta}
className={`w-full py-3 rounded-xl font-semibold ${
reservaCompleta && isLogged
? "bg-[#02aeee] text-white"
: "bg-gray-300 text-gray-500"
}`}
>
Reservar Agora
</button>
                </>
          </div>
        </aside>
      </div>

{isMobile && abrirSelecaoMobile && (
  <div className="fixed inset-0 z-[100] bg-white dark:bg-slate-900 flex flex-col">

    {/* HEADER */}
    <div className="sticky top-0 bg-white dark:bg-slate-900 border-b px-5 py-4 flex items-center justify-between z-10">
      <h2 className="text-xl font-bold">
        Reservar espaço
      </h2>

      <button
        onClick={() => setAbrirSelecaoMobile(false)}
      >
        <X size={26} />
      </button>
    </div>

    {/* CONTEÚDO */}
    <div className="flex-1 overflow-y-auto p-5">

  {/* RESUMO DO ESPAÇO */}
  <div className="mb-6 bg-gray-50 dark:bg-slate-800 rounded-2xl p-4 border border-gray-200 dark:border-slate-700">

    <div className="flex gap-4">

      <img
        src={
          espaco.imagem ||
          imagens[0] ||
          "/images/placeholder-space.jpg"
        }
        alt={espaco.nome}
        className="w-28 h-24 rounded-xl object-cover"
      />

      <div className="flex-1">

        <h3 className="font-semibold text-lg">
          {espaco.nome}
        </h3>

        <p className="text-sm text-gray-500">
          {espaco.tipo ?? "Espaço para eventos"}
        </p>

        <div className="flex items-center gap-1 mt-2">

          <Star
            size={16}
            fill="#facc15"
            className="text-yellow-400"
          />

          <span className="font-medium">
            {notaMedia.toFixed(1)}
          </span>

          <span className="text-gray-500 text-sm">
            ({avaliacoes.length})
          </span>

        </div>

        <p className="text-sm text-gray-500 mt-2">
          {espaco.cidade} • {espaco.bairro}
        </p>

      </div>

    </div>

  </div>

 {/* CARD DATA */}
<div className="mb-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm">

  <div className="flex items-center justify-between mb-4">

    <div>
      <p className="text-sm text-gray-500">
        Data do evento
      </p>

      <p className="font-semibold text-lg">
        {startReserva
          ? endReserva
            ? `${startReserva.toLocaleDateString("pt-BR")} - ${endReserva.toLocaleDateString("pt-BR")}`
            : startReserva.toLocaleDateString("pt-BR")
          : "Selecione uma data"}
      </p>
    </div>

    <div className="text-[#02aeee] font-medium text-sm">
      {eventoMultiDia ? "Mais de 1 dia" : "1 dia"}
    </div>

  </div>

  {eventoMultiDia ? (
    <DatePicker
      inline
      locale="pt-BR"
      minDate={new Date()}
      selectsRange
      filterDate={dataDisponivel}
      startDate={startReserva ?? undefined}
      endDate={endReserva ?? undefined}
      onChange={(update: any) => {
        setRangeReserva(update);
      }}
      dayClassName={getDayClassName}
    />
  ) : (
    <DatePicker
      inline
      locale="pt-BR"
      minDate={new Date()}
      selected={startReserva ?? undefined}
      filterDate={dataDisponivel}
      onChange={(date: Date | null) => {
        if (date) setRangeReserva([date, date]);
      }}
      dayClassName={getDayClassName}
    />
  )}

  <div className="flex items-center gap-2 mt-4">

    <input
      type="checkbox"
      checked={eventoMultiDia}
      onChange={(e) => setEventoMultiDia(e.target.checked)}
    />

    <span className="text-sm">
      Evento com mais de um dia
    </span>

  </div>

</div>

      {/* PESSOAS */}
    {/* CARD PESSOAS */}
{!isBuffet && (
  <div className="mb-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm">

    <div className="mb-4">
      <p className="text-sm text-gray-500">
        Quantidade de pessoas
      </p>

      <p className="font-semibold text-lg">
        {qtdPessoas > 0
          ? `${qtdPessoas} ${qtdPessoas === 1 ? "pessoa" : "pessoas"}`
          : "Informe a quantidade"}
      </p>
    </div>

    <input
      type="number"
      min={1}
      max={espaco?.capacidade || 1000}
      value={qtdPessoas === 0 ? "" : qtdPessoas}
      onChange={(e) => {
        const valor = e.target.value;

        if (valor === "") {
          setQtdPessoas(0);
          return;
        }

        let v = parseInt(valor, 10);

        if (isNaN(v)) v = 0;

        setQtdPessoas(v);
      }}
      onBlur={() => {
        if (qtdPessoas < 1 || isNaN(qtdPessoas)) {
          setQtdPessoas(1);
        }

        if (
          espaco?.capacidade &&
          qtdPessoas > espaco.capacidade
        ) {
          setQtdPessoas(espaco.capacidade);
        }
      }}
      className="w-full border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-3 text-lg bg-white dark:bg-slate-900"
    />

    <p className="text-xs text-gray-500 mt-2">
      Capacidade máxima: {espaco?.capacidade || 1000} pessoas
    </p>

  </div>
)}

      {/* BOTÃO CONFIRMAR */}
      <button
        onClick={() => {
          setAbrirSelecaoMobile(false);
        }}
        className="w-full bg-[#02aeee] text-white py-4 rounded-xl font-semibold"
      >
        Confirmar
          </button>
    </div>
  </div>
)}


{isMobile && !modalReservaAberto && !abrirSelecaoMobile && (
 <div
  className={`fixed left-0 w-full bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 p-4 z-50 flex items-center justify-between transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
  ${showBottomBar ? "translate-y-0" : "translate-y-full"}`}
  style={{ bottom: 0 }}
>

    {/* PREÇO */}
   <div>
  <p className="text-xs text-gray-500">
    {startReserva
      ? `${startReserva.toLocaleDateString()} ${
          endReserva ? " - " + endReserva.toLocaleDateString() : ""
        }`
      : "Selecionar data"}
  </p>

  <p className="font-bold text-sm text-gray-900 dark:text-white">
    {isBuffet
      ? `${valorSelecionado?.convidados || 0} convidados`
      : `${qtdPessoas} pessoas`}
  </p>

  <p className="font-bold text-lg text-gray-900 dark:text-white">
    {isBuffet
      ? precoBaseDinamico.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })
      : precoBaseDinamico.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
  </p>
</div>

    {/* BOTÃO */}
<div className="flex items-center gap-2">

  {/* BOTÃO EDITAR / SELECIONAR */}
  <button
    onClick={() => {
      if (!isLogged) {
        toast.error("Você precisa estar logado!");
        return;
      }

      setAbrirSelecaoMobile(true);
    }}
    className="px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 text-sm font-medium"
  >
    {startReserva ? "Editar" : "Selecionar"}
  </button>

  {/* BOTÃO RESERVAR */}
 <button
  onClick={handleAbrirModalReserva}
  disabled={!isLogged || !reservaCompleta}
  className={`px-5 py-3 rounded-xl font-semibold ${
    reservaCompleta
      ? "bg-[#02aeee] text-white"
      : "bg-gray-300 text-gray-500"
  }`}
>
  Reservar
</button>

</div>
  </div>
)}

      <section className="mt-12 border-t border-gray-200 pt-8 dark:border-slate-700">
        <button
          type="button"
          onClick={handleCompartilharWhatsApp}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-green-600 px-4 py-3 font-semibold text-green-700 transition hover:bg-green-50 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-950/30"
          aria-label="Compartilhar este espaço pelo WhatsApp"
        >
          <MessageCircle size={20} aria-hidden="true" />
          Compartilhar este espaço pelo WhatsApp
        </button>
      </section>

    </main>
  );
}
