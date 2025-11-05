"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/navbar";

export default function EditarEspaco() {
  const { id } = useParams(); // Pega o ID da URL
  const router = useRouter();
  const [espaco, setEspaco] = useState(null);
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Busca o espaço existente
  useEffect(() => {
    const dadosSalvos = JSON.parse(localStorage.getItem("espacos")) || [];
    const espacoEncontrado = dadosSalvos.find((e) => e.id === id);
    if (espacoEncontrado) {
      setEspaco(espacoEncontrado);
    }
  }, [id]);

  if (!espaco) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Carregando dados do espaço...
      </div>
    );
  }

  const handleFotoChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length > 5) {
      setMessage("⚠️ Apenas as 5 primeiras imagens foram mantidas.");
      setFotos(selectedFiles.slice(0, 5));
    } else {
      setFotos(selectedFiles);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(event.target);
    const updatedData = {};
    formData.forEach((value, key) => (updatedData[key] = value));
    updatedData.id = id;
    updatedData.fotos = fotos.length > 0 ? fotos : espaco.fotos;

    // Atualiza o espaço salvo no localStorage
    const todos = JSON.parse(localStorage.getItem("espacos")) || [];
    const atualizados = todos.map((e) => (e.id === id ? updatedData : e));
    localStorage.setItem("espacos", JSON.stringify(atualizados));

    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setMessage("✅ Alterações salvas com sucesso!");

    // Redireciona após 2 segundos
    setTimeout(() => {
      router.push("/anfitriao/dashboard");
    }, 1500);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center py-10">
        <div className="w-full max-w-4xl p-8 rounded-2xl shadow-xl bg-white border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">
            Editar Espaço
          </h2>
          <p className="text-gray-500 mb-6">
            Atualize as informações do seu espaço abaixo.
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Nome e Tipo */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Nome do espaço
                </label>
                <input
                  type="text"
                  name="nome_espaco"
                  defaultValue={espaco.nome_espaco}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 mt-1 focus:ring-2 focus:ring-sky-500 outline-none"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Tipo
                </label>
                <select
                  name="tipo_espaco"
                  defaultValue={espaco.tipo_espaco}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 mt-1 focus:ring-2 focus:ring-sky-500 outline-none"
                  required
                >
                  <option>Chácara</option>
                  <option>Salão</option>
                  <option>Casa de festas</option>
                  <option>Sítios</option>
                  <option>Outros</option>
                </select>
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Descrição detalhada
              </label>
              <textarea
                name="descricao"
                rows={3}
                defaultValue={espaco.descricao}
                minLength={100}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 mt-1 focus:ring-2 focus:ring-sky-500 outline-none resize-none"
                required
              ></textarea>
            </div>

            {/* Capacidade, Cobrança e Valor */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Capacidade de Pessoas
                </label>
                <input
                  type="number"
                  name="capacidade"
                  defaultValue={espaco.capacidade}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 mt-1 focus:ring-2 focus:ring-sky-500 outline-none"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Tipo de Cobrança
                </label>
                <select
                  name="tipo_cobranca"
                  defaultValue={espaco.tipo_cobranca}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 mt-1 focus:ring-2 focus:ring-sky-500 outline-none"
                  required
                >
                  <option>Hora</option>
                  <option>Diária</option>
                  <option>Evento (Pacote)</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Valor (R$)
                </label>
                <input
                  type="number"
                  name="valor"
                  step="any"
                  defaultValue={espaco.valor}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 mt-1 focus:ring-2 focus:ring-sky-500 outline-none"
                  required
                />
              </div>
            </div>

            {/* Endereço */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Endereço Completo
                </label>
                <input
                  type="text"
                  name="endereco"
                  defaultValue={espaco.endereco}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 mt-1 focus:ring-2 focus:ring-sky-500 outline-none"
                  required
                />
              </div>
              <div className="flex-1 md:max-w-[35%]">
                <label className="block text-sm font-medium text-gray-700">
                  Cidade
                </label>
                <input
                  type="text"
                  name="cidade"
                  defaultValue={espaco.cidade}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 mt-1 focus:ring-2 focus:ring-sky-500 outline-none"
                  required
                />
              </div>
              <div className="flex-1 md:max-w-[20%]">
                <label className="block text-sm font-medium text-gray-700">
                  Estado
                </label>
                <select
                  name="estado"
                  defaultValue={espaco.estado}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 mt-1 focus:ring-2 focus:ring-sky-500 outline-none"
                  required
                >
                  <option>MS</option>
                  <option>SP</option>
                  <option>RJ</option>
                  <option>MG</option>
                  <option>PR</option>
                  <option>RS</option>
                  <option>SC</option>
                </select>
              </div>
            </div>

{/* Disponibilidade */}
<div>
  <label className="block text-sm font-medium text-gray-700">
    Disponibilidade
  </label>
  <select
    name="disponivel"
    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 mt-1 focus:ring-2 focus:ring-sky-500 outline-none"
    required
  >
    <option value="true">Publicar no site (disponível para aluguel)</option>
    <option value="false">Manter como rascunho (indisponível por enquanto)</option>
  </select>
</div>

            {/* Upload de Fotos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Substituir fotos (máx. 5)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFotoChange}
                className="w-full text-sm text-gray-500
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-full file:border-0
                           file:text-sm file:font-semibold
                           file:bg-sky-50 file:text-sky-700
                           hover:file:bg-sky-100 transition"
              />
            </div>

            {message && (
              <p
                className={`text-sm font-medium p-3 rounded-xl ${
                  message.startsWith("✅")
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-500 text-white py-2 rounded-xl font-semibold hover:bg-sky-600 transition"
            >
              {loading ? "Salvando..." : "Salvar Alterações"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
