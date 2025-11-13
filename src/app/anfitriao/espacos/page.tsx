"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit3, PauseCircle, CalendarDays } from "lucide-react";

interface Espaco {
  id: string;
  nome: string;
  tipo: string;
  descricao: string;
  capacidade: number;
  tipoCobranca: string;
  valor: number;
  endereco: string;
  cidade: string;
  estado: string;
  fotos: string[];
  disponivel: boolean;
  criadoEm: string;
  tipoConfirmacao?: "automatica" | "manual";
  servicos?: { nome: string; preco: number }[];
  regras?: string[];
  facilidades?: string[];
}

export default function Espacos() {
  const router = useRouter();
  const [espacos, setEspacos] = useState<Espaco[]>([]);

  useEffect(() => {
    const salvos = JSON.parse(localStorage.getItem("espacos") || "[]");
    setEspacos(salvos);
  }, []);

  const excluirEspaco = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este espaço?")) {
      const novosEspacos = espacos.filter((e) => e.id !== id);
      setEspacos(novosEspacos);
      localStorage.setItem("espacos", JSON.stringify(novosEspacos));
    }
  };

  const alternarDisponibilidade = (id: string) => {
    const atualizados = espacos.map((e) =>
      e.id === id ? { ...e, disponivel: !e.disponivel } : e
    );
    setEspacos(atualizados);
    localStorage.setItem("espacos", JSON.stringify(atualizados));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Meus Espaços</h1>
        <Link
          href="/anfitriao/espacos/novo"
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-xl font-semibold transition"
        >
          + Cadastrar Novo Espaço
        </Link>
      </div>

      {espacos.length === 0 ? (
        <p className="text-gray-600 italic">
          Você ainda não cadastrou nenhum espaço.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {espacos.map((espaco) => {
            const imagemCapa =
              espaco.fotos && espaco.fotos.length > 0
                ? espaco.fotos[0]
                : "/img/placeholder-espaco.jpg";

            return (
              <div
                key={espaco.id}
                className="border p-4 rounded-lg shadow-md hover:shadow-xl transition duration-300"
              >
                <img
                  src={imagemCapa}
                  alt={espaco.nome}
                  className="w-full h-40 object-cover mb-4 rounded-lg"
                />

                <h2 className="text-xl font-bold text-gray-800 mb-1">
                  {espaco.nome}
                </h2>
                <p className="text-sm text-gray-500 mb-3">
                  {espaco.tipo} | Criado em:{" "}
                  {new Date(espaco.criadoEm).toLocaleDateString()}
                </p>

                <div className="text-sm space-y-1">
                  <p>
                    📍 <b>Localização:</b> {espaco.cidade} - {espaco.estado}
                  </p>
                  <p>
                    👥 <b>Capacidade:</b> {espaco.capacidade} pessoas
                  </p>
                  <p>
                    💰 <b>Valor:</b> R$ {espaco.valor} / {espaco.tipoCobranca}
                  </p>
                  <p>
                    ✅ <b>Disponível:</b>{" "}
                    <span
                      className={
                        espaco.disponivel
                          ? "text-green-600 font-medium"
                          : "text-red-600 font-medium"
                      }
                    >
                      {espaco.disponivel ? "Sim" : "Não"}
                    </span>
                  </p>
                  <p>
                    ⚙️ <b>Confirmação:</b>{" "}
                    <span
                      className={
                        espaco.tipoConfirmacao === "automatica"
                          ? "text-green-600 font-medium"
                          : "text-amber-600 font-medium"
                      }
                    >
                      {espaco.tipoConfirmacao === "automatica"
                        ? "Automática"
                        : "Manual"}
                    </span>
                  </p>
                </div>

                {/* Serviços */}
                {espaco.servicos && espaco.servicos.length > 0 && (
                  <div className="mt-3">
                    <b>Serviços Adicionais:</b>
                    <ul className="list-disc list-inside text-gray-700 text-sm">
                      {espaco.servicos.map((s, i) => (
                        <li key={i}>
                          {s.nome} - R$ {s.preco}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Regras */}
                {espaco.regras && espaco.regras.length > 0 && (
                  <div className="mt-2">
                    <b>Regras do Local:</b>
                    <ul className="list-disc list-inside text-gray-700 text-sm">
                      {espaco.regras.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Facilidades */}
                {espaco.facilidades && espaco.facilidades.length > 0 && (
                  <div className="mt-2">
                    <b>Facilidades:</b>
                    <ul className="list-disc list-inside text-gray-700 text-sm">
                      {espaco.facilidades.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="mt-3 text-gray-700 italic line-clamp-2">
                  {espaco.descricao}
                </p>

                <div className="flex items-center justify-between mt-4 border-t pt-3">
                  <button
                    onClick={() =>
                      router.push(`/anfitriao/espacos/${espaco.id}/editar`)
                    }
                    className="flex items-center gap-1 text-sm text-sky-600 hover:text-sky-700 font-medium"
                  >
                    <Edit3 size={16} /> Editar
                  </button>

                  <button
                    onClick={() =>
                      router.push(`/anfitriao/espacos/${espaco.id}/reservas`)
                    }
                    className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700 font-medium"
                  >
                    <CalendarDays size={16} /> Reservas
                  </button>

                  <button
                    onClick={() => alternarDisponibilidade(espaco.id)}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 font-medium"
                  >
                    <PauseCircle size={16} />{" "}
                    {espaco.disponivel ? "Pausar" : "Ativar"}
                  </button>

                  <button
                    onClick={() => excluirEspaco(espaco.id)}
                    className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    🗑️ Excluir
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
