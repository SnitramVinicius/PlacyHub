"use client";

import React, { useState, useEffect, useRef, use } from "react";
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

registerLocale("pt-BR", ptBR);

const Mapa = dynamic(() => import("@/components/Mapa"), { ssr: false });
// Tipagem alterada: params pode ser uma Promise
export default function EspacoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const espaco = ESPACOS.find((e) => e.id === id);
  if (!espaco) return <p className="text-center mt-10">Espaço não encontrado.</p>;

  // ====== PREÇOS ======
const precoSelecionado = espaco.preco;

  const { user } = useAuth();
  const isLogged = !!user;
  const { favoritos, toggleFavorito } = useFavoritos();

  const [modalAberto, setModalAberto] = useState(false);
  const [modalReservaAberto, setModalReservaAberto] = useState(false);
  const descricaoPadrao = "Descrição não cadastrada. Em breve mais detalhes deste espaço.";

  const [rangeReserva, setRangeReserva] = useState<[Date | null, Date | null]>([null, null]);
  const [startReserva, endReserva] = rangeReserva;

  const [eventoMultiDia, setEventoMultiDia] = useState(false);

const diasReserva =
  startReserva && endReserva
    ? Math.max(
        1,
        Math.ceil((endReserva.getTime() - startReserva.getTime()) / (1000 * 60 * 60 * 24))
      )
    : 0;

  const horaRef = useRef<HTMLInputElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const [editandoReserva, setEditandoReserva] = useState(false);

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
  const [horaReserva, setHoraReserva] = useState("");
  const [qtdPessoas, setQtdPessoas] = useState(1);
  const [reservando, setReservando] = useState(false);

  const handleAbrirModalReserva = () => {
    if (!isLogged) {
      toast.error("Você precisa estar logado para reservar este espaço!");
      return;
    }
    setModalReservaAberto(true);
  };

const handleConfirmarReserva = async () => {
  if (!startReserva || !endReserva) {
    toast.error("Selecione o período completo!");
    return;
  }

  if (!horaReserva) {
    toast.error("Escolha a hora da reserva!");
    return;
  }

  setReservando(true);

  try {
    const total = precoSelecionado * (diasReserva || 1);

    const response = await fetch("/api/pagamento", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        total,
        espacoId: espaco.id,
        nomeEspaco: espaco.nome,
        dataInicio: startReserva.toISOString(),
        dataFim: endReserva.toISOString(),
        hora: horaReserva,
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


  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      {/* BOTÃO VOLTAR */}
      <div className="flex w-full mb-8">
        <Link
          href="/"
          className="flex items-center gap-2 ml-auto border border-gray-300 px-4 py-2 rounded-full shadow-sm bg-white text-gray-700 font-medium hover:bg-gray-100 hover:shadow-md hover:border-gray-400 transition-all duration-200"
        >
          <ArrowLeft size={18} /> Voltar
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
            className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalAberto(false)}
              className="absolute top-4 right-4 p-2 bg-white text-black hover:bg-gray-200 rounded-full shadow-md z-50"
            >
              <X size={24} />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
              {espaco.imagens.map((foto, index) => (
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
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-8 relative overflow-y-auto max-h-[90vh] border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão fechar */}
            <button
              onClick={() => setModalReservaAberto(false)}
              className="absolute top-5 right-5 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
            >
              <X size={24} />
            </button>

            {/* Título */}
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Confirmar Alteração</h2>

            {/* Resumo da reserva */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
              <p className="font-semibold text-gray-700 mb-2 flex justify-between items-center">
                Sua reserva
                <button
                  className="text-[#02aeee] underline hover:text-[#0284c7] text-sm"
                  onClick={() => setEditandoReserva(!editandoReserva)}
                >
                  {editandoReserva ? "Fechar" : "Editar"}
                </button>
              </p>

              <p className="text-gray-600">
                Datas: {startReserva?.toLocaleDateString()} – {endReserva?.toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                Quantidade de pessoas: {qtdPessoas}
              </p>
              <p className="text-gray-600">Horário: {horaReserva}</p>

              {/* Telinha de edição */}
              {editandoReserva && (
                <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Calendário */}
                    <div className="flex-1">
                      <label className="block text-gray-700 font-medium mb-1">Selecione as datas</label>
                      <DatePicker
                        selectsRange
                        startDate={startReserva}
                        endDate={endReserva}
                        onChange={(update) => {
                          setRangeReserva(update);
                          if (update[1]) setActiveCalendar(false);
                        }}
                        inline
                        locale="pt-BR"
                        minDate={new Date()}
                      />
                    </div>

                    {/* Hora e quantidade de pessoas */}
                    <div className="flex flex-col gap-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Horário</label>
                        <input
                          ref={horaRef}
                          type="time"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm cursor-pointer"
                          value={horaReserva}
                          onChange={(e) => setHoraReserva(e.target.value)}
                          onClick={(e) => e.target.showPicker?.()}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Quantidade de pessoas</label>
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder={`máx. ${espaco.capacidade}`}
                        />
                      </div>
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
<div className="border-t border-gray-200 pt-4 mb-6 flex flex-col md:flex-row gap-6 items-start">

  {/* Texto */}
  <div className="flex-1 space-y-2 text-gray-700">
    <p className="font-semibold text-gray-800">{espaco.nome}</p>
    <p className="text-gray-600">Espaço inteiro: apartamento</p>

    {/* Avaliação correta puxando do espaço */}
    <p className="text-gray-600">
      {espaco.avaliacao.toFixed(1)} de 5 na avaliação
    </p>

    {/* Preços — automático baseado no período + plano */}
    <p className="text-gray-700 font-medium">
      {diasReserva} {diasReserva === 1 ? "noite" : "noites"} x R$ {precoSelecionado.toFixed(2)} ={" "}
      R$ {(diasReserva * precoSelecionado).toFixed(2)}
    </p>

    <p className="text-gray-800 font-bold">
      Total (BRL): R$ {(diasReserva * precoSelecionado).toFixed(2)}
    </p>
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
            <div className="border-t border-gray-200 pt-4 mb-6 space-y-4 text-gray-700 text-sm">
              {/* Política de cancelamento */}
              <div className="p-4 rounded-xl border border-gray-200 shadow-sm">
                <p className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  Política de Cancelamento
                </p>
                <p className="text-gray-700">
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
                <p className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  Regras Básicas
                </p>
                <ul className="list-disc ml-6 space-y-1 text-gray-700">
                  <li>Mantenha a cordialidade e o respeito com todos os envolvidos.</li>
                  <li>Siga as instruções e regras estabelecidas pelo anfitrião.</li>
                  <li>Cuide do espaço como se fosse seu.</li>
                </ul>
              </div>

              {/* Políticas gerais */}
              <div className="p-4 rounded-xl border border-gray-200 shadow-sm">
                <p className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  Políticas e Termos
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Ao confirmar a reserva, você concorda com as políticas da PlacyHub, incluindo:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-700">
                  <li>Regras do espaço estabelecidas pelo anfitrião.</li>
                  <li>Política de reembolso e remarcação.</li>
                  <li>Termos de serviço e termos de pagamento da PlacyHub.</li>
                </ul>
                <p className="text-gray-700 mt-2">
                  Também concorda que a PlacyHub pode processar o pagamento caso haja danos ou descumprimento das regras.
                </p>
              </div>
            </div>
            
{/* AVISO DE VISTORIA */}
<div className="border border-yellow-300 bg-yellow-50 rounded-xl p-4 text-sm text-yellow-900">
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
            <p className="text-gray-700 leading-relaxed">{espaco.descricao ?? descricaoPadrao}</p>
            <p className="text-gray-600 mt-2">
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
          <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-semibold mb-3">Facilidades incluídas</h2>
              <ul className="space-y-1 text-gray-700">
                {(espaco.facilidades ?? []).map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-3">Regras do local</h2>
              <ul className="space-y-1 text-gray-700">
                {(espaco.regras ?? []).map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
          </section>

          {/* SERVIÇOS ADICIONAIS */}
          {espaco.servicosAdicionais && (
            <section>
              <h2 className="text-2xl font-semibold mb-3">Serviços adicionais</h2>
              <ul className="list-disc text-gray-700 ml-6">
                {espaco.servicosAdicionais.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {/* AVALIAÇÕES */}
          <section className="bg-white rounded-2xl shadow-md p-6 mt-10">
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
                    <p className="text-gray-700 text-sm mt-1">{a.comentario}</p>
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
          <Mapa
            espacos={[
              {
                ...espaco,
                latitude: espaco.latitude ?? -20.48,
                longitude: espaco.longitude ?? -54.64,
              },
            ]}
          />
        </div>

        {/* CARD LATERAL */}
        <aside className="md:col-span-1">
          <div className="sticky top-28 bg-white shadow-xl rounded-2xl p-7 border border-gray-200 space-y-6 relative">

                <>
                  <p className="text-3xl font-bold text-[#02aeee]">
  R$ {espaco.preco.toFixed(2)}
</p>
                  <div>
                 <label className="font-semibold text-sm">Data do evento</label>

<div
  onClick={() => setActiveCalendar(!activeCalendar)}
  className="w-full px-3 py-2 border border-gray-300 rounded-lg cursor-pointer bg-white"
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
  <div className="absolute z-50 mt-2 shadow-lg rounded-lg bg-white p-3" ref={calendarRef}>
    <DatePicker
      inline
      locale="pt-BR"
      minDate={new Date()}

      /* Alterna entre range e 1 dia */
      selectsRange={eventoMultiDia}
      /* quando não é multi-dia, passa a data selecionada (ou undefined) */
      selected={!eventoMultiDia ? (startReserva ?? undefined) : undefined}
      startDate={startReserva ?? undefined}
      endDate={eventoMultiDia ? (endReserva ?? undefined) : undefined}

      onChange={(update: Date | [Date | null, Date | null]) => {
        if (!eventoMultiDia) {
          // Evento de 1 dia → update é uma Date
          const date = update as Date;
          setRangeReserva([date, date]); // guarda start e end iguais
          setActiveCalendar(false);
        } else {
          // Evento de vários dias → update é [start, end]
          const range = update as [Date | null, Date | null];
          setRangeReserva(range);
          if (range[1]) setActiveCalendar(false); // fecha quando escolher o fim
        }
      }}
    />

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
)}


                  </div>

                  <div className="flex gap-4">
  <div className="flex-1 relative">
    <label className="block text-sm font-semibold mb-1">Horário</label>

    <input
      ref={horaRef}
      type="time"
      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm cursor-pointer"
      value={horaReserva}
      onChange={(e) => setHoraReserva(e.target.value)}
      onClick={(e) => e.target.showPicker?.()}
    />
  </div>

  <div className="flex-1">
    <label className="block text-sm font-semibold mb-1">Qtd. Pessoas</label>

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
      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
      placeholder={`máx. ${espaco.capacidade}`}
    />
  </div>
</div>

<button onClick={handleAbrirModalReserva} className="w-full bg-[#02aeee] text-white py-3 rounded-xl font-semibold hover:bg-[#0295D4] transition" > Reservar Agora </button>
                </>
          </div>
        </aside>
      </div>
    </main>
  );
}