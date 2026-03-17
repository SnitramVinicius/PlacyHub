"use client";

import { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { pt } from "date-fns/locale/pt";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("pt", pt);

interface Espaco {
  id: string;
  nome: string;
  preco: number; // valor numérico
  tipoCobranca: "dia" | "hora";
  duracao: string;
  avaliacao: number;
  descricao: string;
  endereco: string;
  latitude: number;
  longitude: number;
  capacidade: number;
  area: string;
  facilidades: string[];
  regras: string[];
  servicosAdicionais: string[];
}

interface AgendarProps {
  espaco: Espaco;
}

export default function Agendar({ espaco }: AgendarProps) {
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [dataRange, setDataRange] = useState<[Date | null, Date | null]>([null, null]);
  const [horaInicio, setHoraInicio] = useState("08:00");
  const [horaFim, setHoraFim] = useState("12:00");

  const [dataInicio, dataFim] = dataRange;

  // Cálculo de dias
  const dias =
    dataInicio && dataFim
      ? Math.ceil((dataFim.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24)) + 1
      : 1;

  // Cálculo de horas
  const totalHoras =
    horaInicio && horaFim
      ? (() => {
          const [hi, mi] = horaInicio.split(":").map(Number);
          const [hf, mf] = horaFim.split(":").map(Number);
          let total = hf + mf / 60 - (hi + mi / 60);
          if (total <= 0) total += 24;
          return total;
        })()
      : 0;

  const total =
    espaco.tipoCobranca === "hora" ? totalHoras * espaco.preco : dias * espaco.preco;

  const handleAgendar = () => {
    if (!dataInicio || !dataFim) {
      alert("Selecione o intervalo de datas.");
      return;
    }
    if (!horaInicio || !horaFim) {
      alert("Selecione o horário do evento.");
      return;
    }

    const mensagem = `Evento agendado de ${dataInicio.toLocaleDateString("pt-BR")} a ${dataFim.toLocaleDateString(
      "pt-BR"
    )}, das ${horaInicio} às ${horaFim}.\nTotal: R$ ${total.toFixed(2)}`;

    alert(mensagem);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-white rounded-2xl shadow-lg w-full max-w-3xl mx-auto mt-10 transition-all duration-300">
      <h2 className="text-xl font-semibold text-gray-700 mb-4"></h2>

      {/* Botão principal */}
      <button
        onClick={() => setMostrarCalendario(!mostrarCalendario)}
        className="h-12 w-full bg-[#02aeee] text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
      >
        Escolha a data e horário do seu evento
      </button>

      {/* Calendário + Horário + Botão Agendar */}
      {mostrarCalendario && (
        <>
          <div className="flex flex-col md:flex-row justify-center items-start gap-10 bg-[#f8fafc] w-full p-8 rounded-2xl shadow-inner transition-all duration-300">
            {/* Calendário */}
            <div className="flex flex-col items-center w-full md:w-1/2">
              <h2 className="font-semibold mb-3 text-gray-700 text-lg">Selecione o período:</h2>
              <DatePicker
                selectsRange
                startDate={dataInicio}
                endDate={dataFim}
                onChange={(update) => setDataRange(update)}
                locale="pt"
                dateFormat="dd/MM/yyyy"
                minDate={new Date()}
                inline
              />
              {dias > 0 && <p className="mt-3 text-gray-600 text-sm">{dias} dia(s) selecionado(s)</p>}
            </div>

            {/* Horário */}
            <div className="flex flex-col items-center w-full md:w-1/2 mt-4 md:mt-0">
              <h2 className="font-semibold mb-3 text-gray-700 text-lg">Escolha o horário:</h2>
              <div className="flex gap-4">
                <input
                  type="time"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  className="border rounded-lg p-2"
                />
                <input
                  type="time"
                  value={horaFim}
                  onChange={(e) => setHoraFim(e.target.value)}
                  className="border rounded-lg p-2"
                />
              </div>
              {totalHoras > 0 && (
                <p className="mt-3 text-gray-600 text-sm">{totalHoras.toFixed(2)} hora(s) selecionada(s)</p>
              )}
            </div>

            {/* Total */}
            {total > 0 && (
              <div className="mt-6 text-center md:w-full">
                <p className="text-gray-700 text-base font-medium">Valor total estimado:</p>
                <p className="text-xl font-bold text-[#02aeee]">R$ {total.toFixed(2)}</p>
              </div>
            )}
          </div>

          {/* Botão Agendar */}
          <button
            onClick={handleAgendar}
            className="h-12 w-full bg-[#02aeee] text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 mt-4"
          >
            Agendar
          </button>
        </>
      )}
    </div>
  );
}
