"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Star, X, Heart } from "lucide-react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { ESPACOS } from "@/data/espacos";
import { useAuth } from "@/context/AuthContext";
import { useFavoritos } from "@/context/FavoritosContext";
import DatePicker, { registerLocale } from "react-datepicker";
import { ptBR } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "next/navigation";
import { obterValorParaData } from "@/utils/precificacao";
import { calcularValorPeriodo } from "@/utils/precificacao";

registerLocale("pt-BR", ptBR);

const Mapa = dynamic(() => import("@/components/Mapa"), { ssr: false });
// Tipagem alterada: params pode ser uma Promise
export default function EspacoPage() {
  const params = useParams();
  const id = params?.id as string;

  const espaco = ESPACOS.find((e) => e.id === id);

  if (!espaco) {
    return <p className="text-center mt-10">Espaço não encontrado.</p>;
  }

const isBuffet = !!espaco.buffet;


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
  const isLogged = !!user;
  const { favoritos, toggleFavorito } = useFavoritos();

  const [modalAberto, setModalAberto] = useState(false);
  const [modalReservaAberto, setModalReservaAberto] = useState(false);
  const descricaoPadrao = "Descrição não cadastrada. Em breve mais detalhes deste espaço.";

const [modalPrecosAberto, setModalPrecosAberto] = useState(false);

  const [rangeReserva, setRangeReserva] = useState<[Date | null, Date | null]>([null, null]);
  const [startReserva, endReserva] = rangeReserva;

 const [eventoMultiDia, setEventoMultiDia] = useState(false);

  const [datasBloqueadas, setDatasBloqueadas] = useState<string[]>([]);

// 🔥 PREÇO DINÂMICO BASEADO NA DATA
const precoBaseDinamico = startReserva
  ? obterValorParaData(startReserva, espaco)
  : espaco.preco ?? 0;

// ====== PREÇOS ======
const precoSelecionado = isBuffet
  ? valorSelecionado?.preco ?? getMenorPrecoBuffet(espaco)
  : precoBaseDinamico;

const diasReserva =
  startReserva && endReserva
    ? Math.max(
        1,
        Math.ceil((endReserva.getTime() - startReserva.getTime()) / (1000 * 60 * 60 * 24))
      )
    : 0;


  const totalCalculado =
  startReserva && endReserva
    ? calcularValorPeriodo(startReserva, endReserva, espaco)
    : 0;

  const calendarRef = useRef<HTMLDivElement>(null);

  const [editandoReserva, setEditandoReserva] = useState(false);

const [abrirSelecaoMobile, setAbrirSelecaoMobile] = useState(false);

  // Avaliações internas
  const [avaliacoes, setAvaliacoes] = useState<
    { usuario: string; nota: number; comentario: string; data: string }[]
  >([]);

  const notaMedia = avaliacoes.length
    ? avaliacoes.reduce((acc, a) => acc + a.nota, 0) / avaliacoes.length
    : 0;

  useEffect(() => {
    setAvaliacoes([
      { usuario: "Maria", nota: 5, comentario: "Excelente espaço!", data: "2025-12-01" },
      { usuario: "João", nota: 4, comentario: "Gostei muito!", data: "2025-12-03" },
      { usuario: "Ana", nota: 3, comentario: "Bom, mas poderia melhorar.", data: "2025-12-04" },
    ]);
  }, [espaco?.id]);

  // 🔒 Simulação de datas já reservadas
useEffect(() => {
  setDatasBloqueadas([
    "2026-03-10",
    "2026-03-15",
    "2026-03-20",
  ]);
}, []);

  // Estado do calendário
  const [activeCalendar, setActiveCalendar] = useState(false);

  useEffect(() => {
    if (!activeCalendar) return;

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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [activeCalendar]);

  useEffect(() => {
    document.body.style.overflow = modalAberto || modalReservaAberto ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [modalAberto, modalReservaAberto]);

  // Favorito com alerta
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

  // Reserva
  const [qtdPessoas, setQtdPessoas] = useState(1);
  const [reservando, setReservando] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  handleResize();
  window.addEventListener("resize", handleResize);

  return () => window.removeEventListener("resize", handleResize);
}, []);

const handleAbrirModalReserva = () => {
  // 🔐 Precisa estar logado
  if (!isLogged) {
    toast.error("Você precisa estar logado para reservar este espaço!");
    return;
  }

  // 📅 Precisa selecionar data
  if (!startReserva) {
    toast.error("Selecione a data do evento!");
    return;
  }

  // 🥘 Se for buffet → precisa selecionar pacote
  if (isBuffet && !valorSelecionado) {
    toast.error("Selecione um pacote com quantidade de convidados!");
    return;
  }

  // 🏢 Se NÃO for buffet → validar quantidade
  if (!isBuffet) {
    if (!qtdPessoas || qtdPessoas < 1) {
      toast.error("Informe a quantidade de pessoas!");
      return;
    }

    if (qtdPessoas > espaco.capacidade) {
      toast.error(`Máximo permitido: ${espaco.capacidade} pessoas`);
      return;
    }
  }

  // ✅ Se passou por tudo, abre o modal
  setModalReservaAberto(true);
};

 const handleConfirmarReserva = async () => {
  //  Validar data
  if (!startReserva) {
    toast.error("Selecione a data do evento!");
    return;
  }
const dataFormatada = startReserva.toISOString().split("T")[0];

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


  // 🥘 Buffet precisa de pacote
  if (isBuffet && !valorSelecionado) {
    toast.error("Selecione um pacote antes de continuar!");
    return;
  }

  // 🏢 Espaço normal valida quantidade
  if (!isBuffet) {
    if (!qtdPessoas || qtdPessoas < 1) {
      toast.error("Informe a quantidade de pessoas!");
      return;
    }

    if (qtdPessoas > espaco.capacidade) {
      toast.error(`Máximo permitido: ${espaco.capacidade} pessoas`);
      return;
    }
  }

  setReservando(true);

  try {
const total = isBuffet
  ? precoSelecionado
  : startReserva && endReserva
    ? calcularValorPeriodo(startReserva, endReserva, espaco)
    : 0;

    const response = await fetch("/api/pagamento", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        total,
        espacoId: espaco.id,
        nomeEspaco: espaco.nome,
        dataInicio: startReserva.toISOString(),
        dataFim: endReserva ? endReserva.toISOString() : startReserva.toISOString(),
        diasReserva,
        qtdPessoas,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Erro API:", text);
      toast.error("Erro ao criar pagamento. Tente novamente.");
      return;
    }

    const result = await response.json();

    if (result.url) {
      window.location.href = result.url; // abre Mercado Pago
    } else {
      toast.error("Erro ao criar pagamento. Tente novamente.");
    }
  } catch (err) {
    console.error(err);
    toast.error("Erro ao criar pagamento. Tente novamente.");
  } finally {
    setReservando(false);
    setModalReservaAberto(false);
  }


};


  if (!espaco) return <p className="text-center mt-10">Espaço não encontrado.</p>;

 const reservaCompleta = isBuffet
  ? startReserva && valorSelecionado
  : startReserva && qtdPessoas > 0;

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 pb-24 text-gray-900 dark:text-gray-100">
    {/* BOTÃO VOLTAR */}
<div className="w-full mb-8 flex justify-end">
                              <Link
                                href="/"
                                className="flex items-center justify-center
                                w-10 h-10 rounded-full
                                bg-white dark:bg-slate-800
                                border border-gray-200 dark:border-slate-700
                                text-gray-500 dark:text-gray-400
                                hover:bg-gray-50 dark:hover:bg-slate-700
                                hover:border-gray-300 dark:hover:border-slate-600
                                hover:text-gray-700 dark:hover:text-gray-200
                                hover:shadow-sm
                                transition-all duration-300
                                group"
                                aria-label="Voltar"
                              >
                                <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform duration-300" />
                              </Link>
                            </div>
      <h1 className="text-4xl font-bold mb-6">{espaco.nome}</h1>

      {/* IMAGEM PRINCIPAL */}
      <div className="relative rounded-2xl overflow-hidden shadow-xl mb-4">
        <img src={espaco.imagem} alt={espaco.nome} className="w-full h-[450px] object-cover" />
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleFavoritoClick(espaco.id);
          }}
          className="absolute top-2 right-2 rounded-full p-[6px] transition"
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center transition
              ${favoritos.includes(espaco.id) ? "bg-red-600" : "bg-white/80"}`}
          >
            <Heart
              size={18}
              className={favoritos.includes(espaco.id) ? "text-white" : "text-red-600"}
              fill={favoritos.includes(espaco.id) ? "white" : "transparent"}
            />
          </div>
        </button>
      </div>

      {/* BOTÃO GALERIA */}
      {espaco.imagens && espaco.imagens.length > 0 && (
        <button
          onClick={() => setModalAberto(true)}
          className="mb-6 px-6 py-2 bg-[#02aeee] text-white font-semibold rounded-lg hover:bg-[#0295d4] transition"
        >
          Ver galeria ({espaco.imagens.length})
        </button>
      )}

      {/* MODAL GALERIA */}
      {modalAberto && (
        <div
          className="fixed inset-0 z-9999 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setModalAberto(false)}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalAberto(false)}
              className="absolute top-4 right-4 p-2 bg-white text-black hover:bg-gray-200 rounded-full shadow-md z-50"
            >
              <X size={24} />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
              {espaco.imagens?.map((foto, index) => (
                <img
                  key={index}
                  src={foto}
                  alt={`Foto ${index + 1} de ${espaco.nome}`}
                  className="w-full h-48 md:h-64 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>
      )}
      {/* NOVO MODAL DE RESERVA */}
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
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Confirmar Alteração</h2>

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
  excludeDates={
    Array.isArray(datasBloqueadas)
      ? datasBloqueadas.map((data) => new Date(data + "T00:00:00"))
      : []
  }
  onChange={(update: [Date | null, Date | null]) => {
    setRangeReserva(update);

    if (update && update[1]) {
      setActiveCalendar(false);
    }
  }}
  inline
  locale="pt-BR"
  minDate={new Date()}
/>
                    </div>

                    {/* Hora e quantidade de pessoas */}
                    <div className="flex flex-col gap-4">
{!isBuffet && (

                      <div>
                        <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">Quantidade de pessoas</label>
                        <input
                          type="number"
                          min={1}
                          max={espaco.capacidade}
                          value={qtdPessoas}
                          onChange={(e) => {
                            let v = Number(e.target.value);
                            if (v < 1) v = 1;
                            if (v > espaco.capacidade) v = espaco.capacidade;
                            setQtdPessoas(v);
                          }}
                          className="w-full px-3 py-2 border-gray-300 dark:border-slate-600 dark:bg-slate-900 rounded-lg text-sm"
                          placeholder={`máx. ${espaco.capacidade}`}
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
      {espaco.avaliacao.toFixed(1)} de 5 na avaliação
    </p>

    {/* Preços — automático baseado no período + plano */}
{isBuffet ? (
  <>
    <p className="text-gray-500 text-sm">
      Valor fechado do pacote
    </p>

    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
      {precoSelecionado.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
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
<p className="text-gray-800 dark:text-gray-100 font-bold">
  Total (BRL):{" "}
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
      src={espaco.imagem}
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
            <p className="text-gray-700 dark:text-gray-200 leading-relaxed ">{espaco.descricao ?? descricaoPadrao}</p>
            <p className="text-gray-600 dark:text-gray-300 mt-2 ">
              {espaco.cidade} — {espaco.bairro}
            </p>

            <div className="flex items-center gap-1 mt-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={i < Math.floor(espaco.avaliacao) ? "text-yellow-500" : "text-gray-300"}
                  fill={i < Math.floor(espaco.avaliacao) ? "#facc15" : "none"}
                />
              ))}
            </div>
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
          {espaco.facilidades.map((item, i) => (
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
          {espaco.regras.map((item, i) => (
            <li key={i}>• {item}</li>
          ))}
        </ul>
      </div>
    )}

  </section>

) : null}

          {/* SERVIÇOS ADICIONAIS */}
          {espaco.servicosAdicionais && (
            <section>
              <h2 className="text-2xl font-semibold mb-3">Serviços adicionais</h2>
              <ul className="list-disc text-gray-700 dark:text-gray-200 ml-6 ">
                {espaco.servicosAdicionais.map((item, i) => (
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

  {espaco.buffet?.tiposFesta.map((tipo, i) => {
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
            {tipo.pacotes.map((pacote, j) => (
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

                  <span className="text-sm bg-[#02aeee] text-white px-3 py-1 rounded-full">
                    {pacote.duracao}
                  </span>
                </div>

                {/* Itens inclusos */}
                <div>
                  <p className="font-medium text-sm mb-1 text-gray-800 dark:text-gray-100 ">Inclui:</p>
                  <div className="flex flex-wrap gap-2">
                    {pacote.itensInclusos.map((item, k) => (
                      <span
                        key={k}
                        className="text-xs bg-white dark:bg-slate-800 border dark:border-slate-600 px-2 py-1 rounded-full"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Valores */}
                <div className="border-t pt-3">
                  <p className="font-medium text-sm mb-2">
                    Valores:
                  </p>

                  <div className="space-y-2">
                    {pacote.valores
                      .sort(
                        (a, b) =>
                          a.convidados - b.convidados
                      )
                      .map((valor, x) => {
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
  {/* Número grande */}
  <div className="text-4xl font-bold text-[#02aeee]">
    {espaco.avaliacao.toFixed(1)}
  </div>

  {/* Estrelas + quantidade */}
  <div className="flex flex-col">
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={20}
          className={i < Math.round(espaco.avaliacao) ? "text-yellow-500" : "text-gray-300"}
          fill={i < Math.round(espaco.avaliacao) ? "#facc15" : "none"}
        />
      ))}
    </div>

    {/* Se você tem as avaliações reais */}
    <span className="text-gray-500 text-sm">
      {avaliacoes.length} avaliações
    </span>
  </div>
</div>

            {/* Comentários */}
            <div className="space-y-4">
              {avaliacoes.map((a, i) => (
                <div key={i} className="flex gap-3 items-start border-b border-gray-100 pb-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white">
                    {a.usuario[0]}
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

            {isLogged && (
              <button
                onClick={() => toast("Abrir modal para adicionar avaliação")}
                className="mt-4 w-full py-2 bg-[#02aeee] text-white rounded-lg font-medium hover:bg-[#0295d4] transition"
              >
                Avaliar Espaço
              </button>
            )}
          </section>

          {/* MAPA */}
          {/* <Mapa
  espacos={[
    {
      ...espaco,
      latitude: espaco.latitude ?? -20.48,
      longitude: espaco.longitude ?? -54.64,
    },
  ]}
/> */}
        </div>

        {/* CARD LATERAL */}
        <aside className="hidden md:block md:col-span-1">
          <div className="sticky top-28 bg-white dark:bg-slate-800 shadow-xl rounded-2xl p-7 border border-gray-200 dark:border-slate-700 space-y-6 relative">

                <>
{isBuffet ? (
  <p className="text-3xl font-bold text-[#02aeee]">
    A partir de R$ {getMenorPrecoBuffet(espaco).toFixed(2)}
  </p>
) : (
  <p className="text-3xl font-bold text-[#02aeee]">
    R$ {precoBaseDinamico.toFixed(2)}
  </p>
)}
                  <div>
                 <label className="font-semibold text-sm">Data do evento</label>

<div
  onClick={() => setActiveCalendar(!activeCalendar)}
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
        excludeDates={
          Array.isArray(datasBloqueadas)
            ? datasBloqueadas.map(
                (data) => new Date(data + "T00:00:00")
              )
            : []
        }
        selectsRange
        startDate={startReserva ?? undefined}
        endDate={endReserva ?? undefined}
        onChange={(update: [Date | null, Date | null]) => {
          setRangeReserva(update);
          if (update[1]) setActiveCalendar(false);
        }}
      />
    ) : (
      <DatePicker
        inline
        locale="pt-BR"
        minDate={new Date()}
        excludeDates={
          Array.isArray(datasBloqueadas)
            ? datasBloqueadas.map(
                (data) => new Date(data + "T00:00:00")
              )
            : []
        }
        selected={startReserva ?? undefined}
        onChange={(date: Date | null) => {
          if (date) {
            setRangeReserva([date, date]);
            setActiveCalendar(false);
          }
        }}
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
      value={qtdPessoas}
      disabled
      className="w-full px-3 py-2 border border-gray-200 bg-gray-100 text-gray-500 rounded-lg text-sm cursor-not-allowed"
    />

    <p className="text-xs text-gray-400 mt-1">
      Definido pelo pacote selecionado
    </p>
  </div>
) : (
  <div>
    <label className="block text-sm font-semibold mb-1">
      Qtd. Pessoas
    </label>

    <input
      type="number"
      min={1}
      max={espaco.capacidade}
      value={qtdPessoas}
      onChange={(e) => {
        let v = Number(e.target.value);
        if (v < 1) v = 1;
        if (v > espaco.capacidade) v = espaco.capacidade;
        setQtdPessoas(v);
      }}
      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-900 rounded-lg text-sm"
      placeholder={`máx. ${espaco.capacidade}`}
    />
  </div>
)}
<button onClick={handleAbrirModalReserva} className="w-full bg-[#02aeee] text-white py-3 rounded-xl font-semibold hover:bg-[#0295D4] transition" > Reservar Agora </button>
                </>
          </div>
        </aside>
      </div>

{isMobile && abrirSelecaoMobile && (
  <div className="fixed inset-0 z-[100] bg-black/50 flex items-end animate-slideUp">

    {/* CONTEÚDO */}
    <div className="bg-white dark:bg-slate-900 w-full rounded-t-2xl p-5 max-h-[90vh] overflow-y-auto">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Selecionar reserva</h2>
        <button onClick={() => setAbrirSelecaoMobile(false)}>
          <X size={24} />
        </button>
      </div>

      {/* DATA */}
      <div className="mb-4">
        <p className="font-medium mb-2">Data</p>

       {eventoMultiDia ? (
  <DatePicker
    inline
    locale="pt-BR"
    minDate={new Date()}
    selectsRange
    startDate={startReserva ?? undefined}
    endDate={endReserva ?? undefined}
    onChange={(update: any) => {
      setRangeReserva(update);
    }}
  />
) : (
  <DatePicker
    inline
    locale="pt-BR"
    minDate={new Date()}
    selected={startReserva ?? undefined}
    onChange={(date: Date | null) => {
      if (date) setRangeReserva([date, date]);
    }}
  />
)}

        {/* MULTI DIA */}
        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={eventoMultiDia}
            onChange={(e) => setEventoMultiDia(e.target.checked)}
          />
          <span className="text-sm">Mais de um dia</span>
        </div>
      </div>

      {/* PESSOAS */}
      {!isBuffet && (
        <div className="mb-4">
          <p className="font-medium mb-2">Quantidade de pessoas</p>
          <input
            type="number"
            min={1}
            max={espaco.capacidade}
           value={qtdPessoas === 0 ? "" : qtdPessoas}
            onChange={(e) => setQtdPessoas(Number(e.target.value))}
            className="w-full border p-3 rounded-xl"
          />
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


{isMobile && (
  <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 p-4 z-50 flex items-center justify-between">

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
      ? precoSelecionado.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })
      : totalCalculado.toLocaleString("pt-BR", {
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
  disabled={!reservaCompleta}
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

    </main>
  );
}