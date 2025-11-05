"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit3, PauseCircle, CalendarDays } from "lucide-react";

interface Espaco {
  id: string;
  nome: string;
  fotos?: string[];
  reservas?: number;
  ganhos?: number;
}

export default function DashboardAnfitriao() {
  const router = useRouter();
  const [espacos, setEspacos] = useState<Espaco[]>([]);

  // 🔹 Carrega os espaços do localStorage
  useEffect(() => {
    const salvos = JSON.parse(localStorage.getItem("espacos") || "[]");
    setEspacos(salvos);
  }, []);

  const handleNovoEspaco = () => {
    router.push("/anfitriao/espacos/novo");
  };

  const excluirEspaco = (id: string) => {
  if (confirm("Tem certeza que deseja excluir este espaço?")) {
    const novosEspacos = espacos.filter((e) => e.id !== id);
    setEspacos(novosEspacos);
    localStorage.setItem("espacos", JSON.stringify(novosEspacos));
  }
};
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Cabeçalho */}
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Painel do Anfitrião</h1>
        <button
          onClick={handleNovoEspaco}
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-xl font-semibold transition"
        >
          <Plus size={20} />
          Cadastrar Novo Espaço
        </button>
      </header>

      {/* 🔹 Resumo */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl shadow-sm text-center">
          <h3 className="text-gray-500 text-sm">Total de Espaços</h3>
          <p className="text-2xl font-bold text-gray-800">{espacos.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm text-center">
          <h3 className="text-gray-500 text-sm">Reservas</h3>
          <p className="text-2xl font-bold text-gray-800">
            {espacos.reduce((acc, e) => acc + (e.reservas || 0), 0)}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm text-center">
          <h3 className="text-gray-500 text-sm">Ganhos (R$)</h3>
          <p className="text-2xl font-bold text-green-600">
            {espacos
              .reduce((acc, e) => acc + (e.ganhos || 0), 0)
              .toLocaleString("pt-BR")}
          </p>
        </div>
      </section>

      {/* 🔹 Meus Espaços */}
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Meus Espaços</h2>
        {espacos.length === 0 ? (
          <p className="text-gray-600 italic">
            Você ainda não cadastrou nenhum espaço.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {espacos.map((espaco) => (
              <div
                key={espaco.id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition"
              >
                <img
                  src={
                    espaco.fotos && espaco.fotos.length > 0
                      ? espaco.fotos[0]
                      : "/images/sem-foto.jpg"
                  }
                  alt={espaco.nome}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 rounded-2xl shadow-sm bg-white border border-gray-100 hover:shadow-md transition">
  {/* Nome e tipo */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
    <h3 className="text-lg font-semibold text-gray-800">{espaco.nome}</h3>
    <p className="text-sm text-gray-500 mt-1 sm:mt-0">
      {espaco.tipo} | Criado em:{" "}
      {new Date(espaco.criadoEm).toLocaleDateString("pt-BR")}
    </p>
  </div>

  {/* Informações do espaço */}
  <div className="mt-3 text-sm space-y-1 text-gray-700">
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
  </div>

  {/* Descrição */}
  <p className="mt-3 text-gray-600 italic line-clamp-2">
    {espaco.descricao}
  </p>

  {/* Ações */}
  <div className="flex items-center justify-between mt-4 border-t pt-3">
    <button
      onClick={() => router.push(`/anfitriao/espacos/${espaco.id}/editar`)}
      className="flex items-center gap-1 text-sm text-sky-600 hover:text-sky-700 font-medium"
    >
      <Edit3 size={16} /> Editar
    </button>

    <button className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700 font-medium">
      <CalendarDays size={16} /> Reservas
    </button>

    <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 font-medium">
      <PauseCircle size={16} /> Pausar
    </button>

    <button
  onClick={() => excluirEspaco(espaco.id)}
  className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium"
>
  🗑️ Excluir
</button>
  </div>
</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 🔹 Reservas Recentes */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Reservas Recentes
        </h2>
        <div className="overflow-x-auto bg-white rounded-2xl shadow-sm">
          <table className="w-full text-sm text-gray-600">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Espaço</th>
                <th className="px-4 py-3 text-left">Cliente</th>
                <th className="px-4 py-3 text-left">Data</th>
                <th className="px-4 py-3 text-left">Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-4 py-3">Chácara Campo do Sol</td>
                <td className="px-4 py-3">Maria Santos</td>
                <td className="px-4 py-3">15/11/2025</td>
                <td className="px-4 py-3 text-green-600 font-medium">
                  R$ 350,00
                </td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-3">Salão Bella Festa</td>
                <td className="px-4 py-3">João Lima</td>
                <td className="px-4 py-3">20/11/2025</td>
                <td className="px-4 py-3 text-green-600 font-medium">
                  R$ 500,00
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
