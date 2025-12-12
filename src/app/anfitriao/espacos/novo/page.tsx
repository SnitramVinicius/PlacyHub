"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import Navbar2 from "@/components/navbar2";

export default function NovoEspaco() {
  const router = useRouter();
  const [fotos, setFotos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Serviços
  const [servicos, setServicos] = useState([
    { id: Date.now().toString(), nome: "", preco: "" },
  ]);
  const [mostrarServicos, setMostrarServicos] = useState(false);

  // Regras
  const [regras, setRegras] = useState([""]);

  // Facilidades
  const [facilidades, setFacilidades] = useState([""]);

  // ░░░ Políticas de Preço / Cancelamento (AGORA NO TOPO - CORRETO) ░░░
  const [habilitarPoliticas, setHabilitarPoliticas] = useState(false);
  const [descontoNaoReemb, setDescontoNaoReemb] = useState(10); 
  const [descontoReemb, setDescontoReemb] = useState(3); 
  const [diasCancelamentoGratis, setDiasCancelamentoGratis] = useState(3);

  // ── Funções de fotos ──
  const handleFotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length > 5) {
      toast.warning("⚠️ Apenas as 5 primeiras imagens foram mantidas.");
      setFotos(selectedFiles.slice(0, 5));
    } else {
      setFotos(selectedFiles);
    }
  };

  // ── Funções de serviços ──
  const adicionarServico = () =>
    setServicos([
      ...servicos,
      { id: Date.now().toString(), nome: "", preco: "" },
    ]);

  const removerServico = (id: string) =>
    setServicos(servicos.filter((s) => s.id !== id));

  const atualizarServico = (
    id: string,
    campo: "nome" | "preco",
    valor: string
  ) =>
    setServicos(
      servicos.map((s) =>
        s.id === id ? { ...s, [campo]: valor } : s
      )
    );

  // ── Funções de regras ──
  const adicionarRegra = () => setRegras([...regras, ""]);

  const atualizarRegra = (index: number, valor: string) => {
    const novasRegras = [...regras];
    novasRegras[index] = valor;
    setRegras(novasRegras);
  };

  const removerRegra = (index: number) =>
    setRegras(regras.filter((_, i) => i !== index));

  // ── Funções de facilidades ──
  const adicionarFacilidade = () =>
    setFacilidades([...facilidades, ""]);

  const atualizarFacilidade = (index: number, valor: string) => {
    const novasFacilidades = [...facilidades];
    novasFacilidades[index] = valor;
    setFacilidades(novasFacilidades);
  };

  const removerFacilidade = (index: number) =>
    setFacilidades(facilidades.filter((_, i) => i !== index));

  // ── Submit do formulário ──
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const data: Record<string, string> = {};
    formData.forEach(
      (value, key) => (data[key] = value.toString().trim())
    );

    // 🔹 Validações
    const camposObrigatorios = [
      "nome_espaco",
      "tipo_espaco",
      "descricao",
      "capacidade",
      "area",
      "valor",
      "tipo_cobranca",
      "tipo_reserva",
      "endereco",
      "disponivel",
    ];

    for (let campo of camposObrigatorios) {
      if (!data[campo]) {
        toast.error("Preencha todos os campos obrigatórios.");
        setLoading(false);
        return;
      }
    }

    if (
      Number(data.capacidade) <= 0 ||
      Number(data.area) <= 0 ||
      Number(data.valor) < 0
    ) {
      toast.error(
        "Capacidade, área e valor devem ser números válidos."
      );
      setLoading(false);
      return;
    }

    if (fotos.length === 0) {
      toast.error("Adicione pelo menos uma foto do espaço.");
      setLoading(false);
      return;
    }

    const novoEspaco = {
      id: Date.now().toString(),
      ...data,
      fotos: fotos.map((f) => f.name),

      // Serviços, regras e facilidades
      servicos: servicos.filter((s) => s.nome.trim() !== ""),
      regras: regras.filter((r) => r.trim() !== ""),
      facilidades: facilidades.filter((f) => f.trim() !== ""),

      // ░░░ Políticas de preço / cancelamento ░░░
      politicas: {
        habilitar: habilitarPoliticas,
        descontoNaoReemb,
        descontoReemb,
        diasCancelamentoGratis,
      },
    };

    const espacosSalvos = JSON.parse(
      localStorage.getItem("espacos") || "[]"
    );
    espacosSalvos.push(novoEspaco);
    localStorage.setItem(
      "espacos",
      JSON.stringify(espacosSalvos)
    );

    await new Promise((r) => setTimeout(r, 1500));

    setLoading(false);
    toast.success("Espaço cadastrado com sucesso!");

    setTimeout(() => {
      router.push("/anfitriao/espacos");
    }, 1000);
  };

  return (
    <>
      <Toaster position="top-right" richColors />

      <div className="min-h-screen flex flex-col items-center justify-center bg-white py-10">
        <div className="w-full max-w-4xl p-8 rounded-2xl shadow-xl bg-white border border-gray-100">

          <h2 className="text-2xl font-semibold text-gray-800 mb-1">
            Cadastrar Novo Espaço
          </h2>
          <p className="text-gray-500 mb-6">
            Preencha as informações do seu espaço para começar a
            receber reservas.
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

            {/* Capacidade, Área e Valor */}
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
                  Área (m²)
                </label>
                <input
                  type="number"
                  name="area"
                  min="1"
                  placeholder="Ex: 150"
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

            {/* Tipo de reserva */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipo de reserva
              </label>
              <select
                name="tipo_reserva"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 mt-1 focus:ring-2 focus:ring-sky-500 outline-none"
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
                <option value="true">
                  Publicar no site (disponível para aluguel)
                </option>
                <option value="false">
                  Manter como rascunho (indisponível)
                </option>
              </select>
            </div>

            {/* Serviços Adicionais */}
            <div className="mb-6">
              <button
                type="button"
                onClick={() => setMostrarServicos(true)}
                className="bg-sky-500 text-white px-4 py-2 rounded-xl hover:bg-sky-600 transition"
              >
                Adicionar Serviços Adicionais
              </button>

              {mostrarServicos && (
                <div className="mt-4">
                  {servicos.map((s) => (
                    <div
                      key={s.id}
                      className="flex gap-2 mb-2"
                    >
                      <input
                        type="text"
                        placeholder="Nome do serviço ex: Buffet, DJ, Fotógrafo"
                        value={s.nome}
                        onChange={(e) =>
                          atualizarServico(
                            s.id,
                            "nome",
                            e.target.value
                          )
                        }
                        className="flex-1 border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Preço (R$)"
                        value={s.preco}
                        onChange={(e) =>
                          atualizarServico(
                            s.id,
                            "preco",
                            e.target.value
                          )
                        }
                        className="w-28 border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          removerServico(s.id)
                        }
                        className="text-black px-3 hover:text-[#03aeef]"
                      >
                        X
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={adicionarServico}
                    className="mt-2 bg-sky-500 text-white px-4 py-2 rounded-xl hover:bg-sky-600 transition"
                  >
                    Adicionar Serviço
                  </button>
                </div>
              )}
            </div>

            {/* Regras */}
            <div className="mb-6">
              {regras.map((r, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Ex: Proibido fumar"
                    value={r}
                    onChange={(e) =>
                      atualizarRegra(i, e.target.value)
                    }
                    className="flex-1 border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      removerRegra(i)
                    }
                    className="text-black px-3 hover:text-[#03aeef]"
                  >
                    X
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={adicionarRegra}
                className="mt-2 bg-sky-500 text-white px-4 py-2 rounded-xl hover:bg-sky-600 transition"
              >
                Adicionar Regras do Local
              </button>
            </div>

            {/* Facilidades */}
            <div className="mb-6">
              {facilidades.map((f, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Ex: Wi-Fi, Ar-condicionado"
                    value={f}
                    onChange={(e) =>
                      atualizarFacilidade(
                        i,
                        e.target.value
                      )
                    }
                    className="flex-1 border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      removerFacilidade(i)
                    }
                    className="text-black px-3 hover:text-[#03aeef]"
                  >
                    X
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={adicionarFacilidade}
                className="mt-2 bg-sky-500 text-white px-4 py-2 rounded-xl hover:bg-sky-600 transition"
              >
                Adicionar Facilidades do Local
              </button>
            </div>

            {/* ░░░ POLÍTICAS DE CANCELAMENTO E PREÇO ░░░ */}
            <div className="mb-6 border border-gray-300 rounded-xl p-4">
              <label className="block text-base font-semibold text-gray-800 mb-2">
                Políticas de preço e cancelamento
              </label>

              {/* Habilitar */}
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  checked={habilitarPoliticas}
                  onChange={(e) =>
                    setHabilitarPoliticas(
                      e.target.checked
                    )
                  }
                />
                <span className="text-sm text-gray-700">
                  Ativar opções de preço (Não
                  Reembolsável / Reembolsável)
                </span>
              </div>

              {habilitarPoliticas && (
                <div className="space-y-4 pl-2">
                  {/* Desconto Não reembolsável */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Desconto para plano Não
                      Reembolsável (%)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={descontoNaoReemb}
                      onChange={(e) =>
                        setDescontoNaoReemb(
                          Number(e.target.value)
                        )
                      }
                      className="w-32 border border-gray-300 rounded-xl px-3 py-2 mt-1"
                    />
                  </div>

                  {/* Desconto Reembolsável */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Desconto para plano
                      Reembolsável (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={descontoReemb}
                      onChange={(e) =>
                        setDescontoReemb(
                          Number(e.target.value)
                        )
                      }
                      className="w-32 border border-gray-300 rounded-xl px-3 py-2 mt-1"
                    />
                  </div>

                  {/* Cancelamento gratuito */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Cancelamento gratuito até
                      quantos dias antes?
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={diasCancelamentoGratis}
                      onChange={(e) =>
                        setDiasCancelamentoGratis(
                          Number(e.target.value)
                        )
                      }
                      className="w-32 border border-gray-300 rounded-xl px-3 py-2 mt-1"
                    />
                  </div>
                </div>
              )}
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
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 transition"
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
              {loading
                ? "Cadastrando..."
                : "Cadastrar Espaço"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
