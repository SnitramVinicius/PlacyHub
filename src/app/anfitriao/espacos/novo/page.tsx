"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";

export default function NovoEspaco() {
  const router = useRouter();
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
    const data = {};
    formData.forEach((value, key) => (data[key] = value));

    const novoEspaco = {
      id: Date.now().toString(),
      ...data,
      fotos: fotos.map((f) => f.name),
    };

    // 🔹 Salvar no localStorage (simulando um banco local)
    const espacosSalvos = JSON.parse(localStorage.getItem("espacos")) || [];
    espacosSalvos.push(novoEspaco);
    localStorage.setItem("espacos", JSON.stringify(espacosSalvos));

    await new Promise((r) => setTimeout(r, 1500));

    setLoading(false);
    setMessage("✅ Espaço cadastrado com sucesso!");

    // 🔹 Redirecionar para o dashboard após 1s
    setTimeout(() => {
      router.push("/anfitriao/dashboard");
    }, 1000);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-white py-10">
        <div className="w-full max-w-4xl p-8 rounded-2xl shadow-xl bg-white border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">
            Cadastrar Novo Espaço
          </h2>
          <p className="text-gray-500 mb-6">
            Preencha as informações do seu espaço para começar a receber reservas.
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
                  placeholder="Ex: Campo do Sorriso"
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
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 mt-1 focus:ring-2 focus:ring-sky-500 outline-none"
                  required
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

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <textarea
                name="descricao"
                rows={3}
                placeholder="Fale um pouco sobre o espaço..."
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 mt-1 focus:ring-2 focus:ring-sky-500 outline-none resize-none"
                required
              ></textarea>
            </div>

            {/* Capacidade e Valor */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Capacidade (pessoas)
                </label>
                <input
                  type="number"
                  name="capacidade"
                  min="1"
                  placeholder="Ex: 100"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 mt-1 focus:ring-2 focus:ring-sky-500 outline-none"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Valor (R$)
                </label>
                <input
                  type="number"
                  name="valor"
                  min="0"
                  step="0.01"
                  placeholder="Ex: 500.00"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 mt-1 focus:ring-2 focus:ring-sky-500 outline-none"
                  required
                />
              </div>
            </div>

            {/* Tipo de cobrança */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipo de cobrança
              </label>
              <select
                name="tipo_cobranca"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 mt-1 focus:ring-2 focus:ring-sky-500 outline-none"
                required
              >
                <option value="">Selecione</option>
                <option>Por hora</option>
                <option>Por diária</option>
                <option>Por evento</option>
              </select>
            </div>

            {/* Endereço */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Endereço
              </label>
              <input
                type="text"
                name="endereco"
                placeholder="Ex: Rua das Palmeiras, 123 - Campo Grande/MS"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 mt-1 focus:ring-2 focus:ring-sky-500 outline-none"
                required
              />
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

            {/* Upload de fotos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fotos do espaço (máx. 5)
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
              {loading ? "Cadastrando..." : "Cadastrar Espaço"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
