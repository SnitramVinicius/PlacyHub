"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

/* ================= TIPAGENS ================= */

interface Servico {
  id: number;
  nome: string;
  preco: string;
}

interface Espaco {
  id: string;
  nome_espaco: string;
  tipo_espaco: string;
  descricao: string;
  capacidade: number;
  area: number;
  valor: number;
  tipo_cobranca: string;
  tipo_reserva: string;
  endereco: string;
  disponivel: string;
  fotos?: File[];
  servicos?: Servico[];
  regras?: string[];
  facilidades?: string[];
}

/* ================= COMPONENTE ================= */

export default function EditarEspaco() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [espaco, setEspaco] = useState<Espaco | null>(null);
  const [fotos, setFotos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [mostrarServicos, setMostrarServicos] = useState(false);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [regras, setRegras] = useState<string[]>([]);
  const [facilidades, setFacilidades] = useState<string[]>([]);

  /* ================= SERVIÇOS ================= */

  const adicionarServico = () => {
    setServicos((prev) => [
      ...prev,
      { id: Date.now(), nome: "", preco: "" },
    ]);
  };

  const atualizarServico = (
    id: number,
    campo: keyof Servico,
    valor: string
  ) => {
    setServicos((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [campo]: valor } : s))
    );
  };

  const removerServico = (id: number) => {
    setServicos((prev) => prev.filter((s) => s.id !== id));
  };

  /* ================= REGRAS ================= */

  const adicionarRegra = () => setRegras((prev) => [...prev, ""]);

  const atualizarRegra = (i: number, valor: string) => {
    setRegras((prev) => prev.map((r, idx) => (idx === i ? valor : r)));
  };

  const removerRegra = (i: number) => {
    setRegras((prev) => prev.filter((_, idx) => idx !== i));
  };

  /* ================= FACILIDADES ================= */

  const adicionarFacilidade = () =>
    setFacilidades((prev) => [...prev, ""]);

  const atualizarFacilidade = (i: number, valor: string) => {
    setFacilidades((prev) => prev.map((f, idx) => (idx === i ? valor : f)));
  };

  const removerFacilidade = (i: number) => {
    setFacilidades((prev) => prev.filter((_, idx) => idx !== i));
  };

  /* ================= BUSCA DO ESPAÇO ================= */

  useEffect(() => {
    const dadosSalvos: Espaco[] =
      JSON.parse(localStorage.getItem("espacos") || "[]");

    const encontrado = dadosSalvos.find((e) => e.id === id);

    if (encontrado) {
      setEspaco(encontrado);
      setServicos(encontrado.servicos || []);
      setRegras(encontrado.regras || []);
      setFacilidades(encontrado.facilidades || []);
    }
  }, [id]);

  if (!espaco) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Carregando dados do espaço...
      </div>
    );
  }

  /* ================= FOTOS ================= */

  const handleFotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const selectedFiles = Array.from(event.target.files);

    if (selectedFiles.length > 5) {
      setMessage("⚠️ Apenas as 5 primeiras imagens foram mantidas.");
      setFotos(selectedFiles.slice(0, 5));
    } else {
      setFotos(selectedFiles);
    }
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const updatedData: any = {};

    formData.forEach((value, key) => {
      updatedData[key] = value;
    });

    updatedData.id = id;
    updatedData.fotos = fotos.length > 0 ? fotos : espaco.fotos;
    updatedData.servicos = servicos;
    updatedData.regras = regras;
    updatedData.facilidades = facilidades;

    const todos: Espaco[] =
      JSON.parse(localStorage.getItem("espacos") || "[]");

    const atualizados = todos.map((e) =>
      e.id === id ? updatedData : e
    );

    localStorage.setItem("espacos", JSON.stringify(atualizados));

    await new Promise((r) => setTimeout(r, 1000));

    setLoading(false);
    setMessage("✅ Alterações salvas com sucesso!");

    setTimeout(() => {
      router.push("/anfitriao/espacos");
    }, 1500);
  };

  /* ================= JSX ================= */

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10">
      <div className="w-full max-w-4xl p-8 rounded-2xl shadow-xl bg-white border">
        <Link
          href="/anfitriao/espacos"
          className="text-sky-500 hover:text-sky-600 flex items-center gap-1"
        >
          <ArrowLeft size={18} /> Voltar
        </Link>
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
                <label className="block text-sm font-medium text-gray-700">Nome do espaço</label>
                <input type="text" name="nome_espaco" defaultValue={espaco.nome_espaco} placeholder="Ex: Campo do Sorriso" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 mt-1 focus:ring-2 focus:ring-sky-500 outline-none" required />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Tipo</label>
                <select name="tipo_espaco" defaultValue={espaco.tipo_espaco} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 mt-1 focus:ring-2 focus:ring-sky-500 outline-none" required>
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
              <label className="block text-sm font-medium text-gray-700">Descrição</label>
              <textarea name="descricao" defaultValue={espaco.descricao} rows={3} placeholder="Fale um pouco sobre o espaço..." className="w-full border border-gray-300 rounded-xl px-4 py-2.5 mt-1 focus:ring-2 focus:ring-sky-500 outline-none resize-none" required></textarea>
            </div>

            {/* Capacidade, Área e Valor */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Capacidade (pessoas)</label>
                <input type="number" name="capacidade" defaultValue={espaco.capacidade} min="1" placeholder="Ex: 100" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 mt-1 focus:ring-2 focus:ring-sky-500 outline-none" required />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Área (m²)</label>
                <input type="number" name="area" defaultValue={espaco.area} min="1" placeholder="Ex: 150" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 mt-1 focus:ring-2 focus:ring-sky-500 outline-none" required />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Valor (R$)</label>
                <input type="number" name="valor" defaultValue={espaco.valor} min="0" step="0.01" placeholder="Ex: 500.00" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 mt-1 focus:ring-2 focus:ring-sky-500 outline-none" required />
              </div>
            </div>

            {/* Tipo de cobrança */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo de cobrança</label>
              <select name="tipo_cobranca" defaultValue={espaco.tipo_cobranca} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 mt-1 focus:ring-2 focus:ring-sky-500 outline-none" required>
                <option value="">Selecione</option>
                <option>Por hora</option>
                <option>Por diária</option>
                <option>Por evento</option>
              </select>
            </div>

            {/* Tipo de reserva */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo de reserva</label>
              <select name="tipo_reserva" defaultValue={espaco.tipo_reserva} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 mt-1 focus:ring-2 focus:ring-sky-500 outline-none" required>
                <option value="">Selecione</option>
                <option value="automatica">Confirmação automática</option>
                <option value="manual">Necessita aprovação do anfitrião</option>
              </select>
            </div>
            {/* Endereço */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Endereço</label>
              <input type="text" name="endereco" placeholder="Ex: Rua das Palmeiras, 123 - Campo Grande/MS" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 mt-1 focus:ring-2 focus:ring-sky-500 outline-none" required />
            </div>

            {/* Disponibilidade */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Disponibilidade</label>
              <select name="disponivel" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 mt-1 focus:ring-2 focus:ring-sky-500 outline-none" required>
                <option value="true">Publicar no site (disponível para aluguel)</option>
                <option value="false">Manter como rascunho (indisponível por enquanto)</option>
              </select>
            </div>

            {/* Serviços Adicionais */}
            
            <div className="mb-6">
              <button type="button" onClick={() => setMostrarServicos(true)} className="bg-sky-500 text-white px-4 py-2 rounded-xl hover:bg-sky-600 transition">Adicionar Serviços Adicionais</button>

              {mostrarServicos && (
                <div className="mt-4">
                  {servicos.map((s) => (
                    <div key={s.id} className="flex gap-2 mb-2">
                      <input type="text" placeholder="Nome do serviço ex: Buffet, DJ, Fotógrafo" value={s.nome} onChange={(e) => atualizarServico(s.id, "nome", e.target.value)} className="flex-1 border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none" />
                      <input type="number" placeholder="Preço (R$)" value={s.preco} onChange={(e) => atualizarServico(s.id, "preco", e.target.value)} className="w-28 border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none" />
                      <button type="button" onClick={() => removerServico(s.id)} className=" text-black  px-3 hover:text-[#03aeef]">X</button>
                    </div>
                  ))}
                  <button type="button" onClick={adicionarServico} className="mt-2 bg-sky-500 text-white px-4 py-2 rounded-xl hover:bg-sky-600 transition">Adicionar Serviço</button>
                </div>
              )}
            </div>

            {/* Regras do Local */}
            <div className="mb-6">
              {regras.map((r, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input type="text" placeholder="Ex: Proibido fumar" value={r} onChange={(e) => atualizarRegra(i, e.target.value)} className="flex-1 border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none" />
                  <button type="button" onClick={() => removerRegra(i)} className="text-black  px-3 hover:text-[#03aeef]">X</button>
                </div>
              ))}
              <button type="button" onClick={adicionarRegra} className="mt-2 bg-sky-500 text-white px-4 py-2 rounded-xl hover:bg-sky-600 transition">Adicionar Regras do Local</button>
            </div>

            {/* Facilidades */}
            <div className="mb-6">
              {facilidades.map((f, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input type="text" placeholder="Ex: Wi-Fi, Ar-condicionado" value={f} onChange={(e) => atualizarFacilidade(i, e.target.value)} className="flex-1 border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none" />
                  <button type="button" onClick={() => removerFacilidade(i)} className="text-black  px-3 hover:text-[#03aeef]">X</button>
                </div>
              ))}
              <button type="button" onClick={adicionarFacilidade} className="mt-2 bg-sky-500 text-white px-4 py-2 rounded-xl hover:bg-sky-600 transition">Adicionar Facilidades do Local</button>
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
