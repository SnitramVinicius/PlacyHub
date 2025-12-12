"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { ESPACOS as espacosSimulados, Espaco } from "@/data/espacos";

export default function ResultadosBusca() {
  const searchParams = useSearchParams();
  const cidadeParam = searchParams.get("cidade")?.replace("%2C", ",") ?? "Campo Grande, MS";
  const startDate = searchParams.get("start");
  const endDate = searchParams.get("end");

  // ORDENAR
  const [ordenacao, setOrdenacao] = useState("popularidade");

  // FILTROS
  const [tipo, setTipo] = useState("");
  const [precoFaixa, setPrecoFaixa] = useState("");

  // FAVORITOS
  const [favoritos, setFavoritos] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("placyhub_favoritos");
      if (raw) setFavoritos(JSON.parse(raw));
    } catch {}
  }, []);

  const toggleFavorito = (id: string) => {
    setFavoritos((prev) => {
      const novo = prev.includes(id)
        ? prev.filter((e) => e !== id)
        : [...prev, id];

      try {
        localStorage.setItem("placyhub_favoritos", JSON.stringify(novo));
      } catch {}

      return novo;
    });
  };

  const [loading, setLoading] = useState(true);
  const [resultados, setResultados] = useState<Espaco[]>([]);

  useEffect(() => {
    setLoading(true);

    const t = setTimeout(() => {
      let filtrados = espacosSimulados.filter(
        (espaco) => espaco.cidade.toLowerCase() === cidadeParam.toLowerCase()
      );

      if (tipo !== "") filtrados = filtrados.filter((e) => e.tipo === tipo);

      if (precoFaixa !== "") {
        if (precoFaixa === "1000+") {
          filtrados = filtrados.filter((e) => e.preco > 1000);
        } else {
          filtrados = filtrados.filter((e) => e.preco <= Number(precoFaixa));
        }
      }

      if (ordenacao === "preco") {
        filtrados.sort((a, b) => a.preco - b.preco);
      } else {
        filtrados.sort((a, b) => b.avaliacao - a.avaliacao);
      }

      setResultados(filtrados);
      setLoading(false);
    }, 400);

    return () => clearTimeout(t);
  }, [cidadeParam, ordenacao, tipo, precoFaixa]);

  const dataTexto = startDate
    ? endDate
      ? `${startDate} até ${endDate}`
      : startDate
    : "Nenhuma data selecionada";

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-1">Resultados da busca</h1>

      <p className="text-gray-600 mb-4">
        <strong>Cidade:</strong> {cidadeParam} <br />
        <strong>Data:</strong> {dataTexto}
      </p>

      {/* TOPO: contagem + ordenação */}
      {!loading && (
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-700">
            <strong>{resultados.length}</strong> espaços encontrados
          </p>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700">Ordenar por:</label>
            <select
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value)}
              className="border px-3 py-2 rounded-md text-sm"
            >
              <option value="popularidade">Mais populares</option>
              <option value="preco">Menor preço</option>
              <option value="nota">Melhor avaliação</option>
            </select>
          </div>
        </div>
      )}

      {/* FILTROS */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="border px-3 py-2 rounded-md text-sm"
          >
            <option value="">Todos os tipos</option>
            <option value="Chácara">Chácara</option>
            <option value="Salão">Salão</option>
            <option value="Casa de festas">Casa de festas</option>
            <option value="Sítio">Sítio</option>
            <option value="Outro">Outro</option>
          </select>

          <select
            value={precoFaixa}
            onChange={(e) => setPrecoFaixa(e.target.value)}
            className="border px-3 py-2 rounded-md text-sm"
          >
            <option value="">Faixa de preço</option>
            <option value="100">Até R$ 100</option>
            <option value="150">Até R$ 150</option>
            <option value="200">Até R$ 200</option>
            <option value="300">Até R$ 300</option>
            <option value="400">Até R$ 400</option>
            <option value="500">Até R$ 500</option>
            <option value="750">Até R$ 750</option>
            <option value="1000">Até R$ 1000</option>
            <option value="1000+">Acima de R$ 1000</option>
          </select>
        </div>
      )}

      <div className="h-[1px] bg-gray-200 mb-6"></div>

      {/* RESULTADOS */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-[230px]"></div>
          ))}
        </div>
      ) : (
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {resultados.map((espaco) => (
            <Link key={espaco.id} href={`/espaco/${espaco.id}`} className="shrink-0 w-[240px] mx-auto">
              <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition w-full">
                <div className="relative">
                  <img
                    src={espaco.imagem}
                    className="w-[240px] h-[160px] object-cover"
                  />

                  {/* FAVORITO */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorito(espaco.id);
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

                <div className="p-3">
                  <div className="flex justify-between items-start">
                    <div className="w-[70%]">
                      <p className="font-semibold text-[14px] leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                        {espaco.nome}
                      </p>
                      <p className="text-gray-500 text-xs -mt-0.5">{espaco.bairro}</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500 text-sm">★</span>
                      <span className="text-yellow-500 text-sm font-medium">
                        {espaco.avaliacao.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-500 text-sm mt-1">
                    R$ {espaco.preco} • 5 horas
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </section>
      )}

      {!loading && resultados.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          Nenhum espaço encontrado para <strong>{cidadeParam}</strong>.
        </p>
      )}
    </div>
  );
}
