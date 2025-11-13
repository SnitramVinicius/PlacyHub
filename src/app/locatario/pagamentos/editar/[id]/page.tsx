"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { toast, Toaster } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function EditarMetodoPagamento() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id;

  // Lê parâmetros da URL (ex: ?tipo=Pix&descricao=vinicius@email.com)
  const tipoParam = searchParams.get("tipo") || "Cartão";
  const descricaoParam = searchParams.get("descricao") || "";

  const [tipo, setTipo] = useState<"Cartão" | "Pix" | "Boleto">(tipoParam as any);
  const [descricao, setDescricao] = useState(descricaoParam);
  const [padrao, setPadrao] = useState(false);

  // Campos específicos
  const [nomeTitular, setNomeTitular] = useState("");
  const [numeroCartao, setNumeroCartao] = useState("");
  const [validade, setValidade] = useState("");
  const [cvv, setCvv] = useState("");
  const [chavePix, setChavePix] = useState("");
  const [tipoChave, setTipoChave] = useState("Email");

  useEffect(() => {
    setTipo(tipoParam as any);
    setDescricao(descricaoParam);
  }, [tipoParam, descricaoParam]);

  const handleSalvar = () => {
    toast.success("Método de pagamento atualizado com sucesso!");
    setTimeout(() => {
      router.push("/locatario/pagamentos");
    }, 1500);
  };

  return (
    <div className="p-6">
      <Toaster position="top-right" richColors />

      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/locatario/pagamentos"
            className="text-sky-500 hover:text-sky-600 flex items-center gap-1"
          >
            <ArrowLeft size={18} /> Voltar
          </Link>
          <h1 className="text-2xl font-bold">Editar Método de pagameno </h1>
        </div>
      </div>

      {/* Formulário */}
      <div className="bg-white rounded-2xl shadow p-6 max-w-lg mx-auto">
        {/* Tipo */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Tipo de pagamento</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as any)}
            className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
          >
            <option value="Cartão">Cartão</option>
            <option value="Pix">Pix</option>
            <option value="Boleto">Boleto</option>
          </select>
        </div>

        {/* Campos dinâmicos */}
        {tipo === "Cartão" && (
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Nome no Cartão</label>
              <input
                type="text"
                value={nomeTitular}
                onChange={(e) => setNomeTitular(e.target.value)}
                className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
                placeholder="Ex: Vinícius M. Silva"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Número do Cartão</label>
              <input
                type="text"
                value={numeroCartao}
                onChange={(e) => setNumeroCartao(e.target.value)}
                className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
                placeholder="**** **** **** 1234"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Validade</label>
                <input
                  type="text"
                  value={validade}
                  onChange={(e) => setValidade(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
                  placeholder="MM/AA"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">CVV</label>
                <input
                  type="password"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
                  placeholder="***"
                />
              </div>
            </div>
          </div>
        )}

        {tipo === "Pix" && (
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Tipo de Chave Pix</label>
              <select
                value={tipoChave}
                onChange={(e) => setTipoChave(e.target.value)}
                className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
              >
                <option>Email</option>
                <option>CPF</option>
                <option>Telefone</option>
                <option>Chave Aleatória</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">Chave Pix</label>
              <input
                type="text"
                value={chavePix || descricao}
                onChange={(e) => setChavePix(e.target.value)}
                className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
                placeholder="Ex: vinicius@email.com"
              />
            </div>
          </div>
        )}

        {tipo === "Boleto" && (
          <div className="text-gray-600 text-sm bg-gray-50 p-4 rounded-xl border mt-4">
            <p>
              O pagamento por boleto será gerado automaticamente quando você realizar uma reserva.  
              Nenhum dado adicional é necessário.
            </p>
          </div>
        )}

        {/* Descrição */}
        <div className="mt-6">
          <label className="block font-medium mb-1">Descrição</label>
          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
            placeholder="Ex: Cartão Visa Pessoal"
          />
        </div>

        {/* Padrão */}
        <div className="flex items-center gap-2 my-6">
          <input
            id="padrao"
            type="checkbox"
            checked={padrao}
            onChange={(e) => setPadrao(e.target.checked)}
          />
          <label htmlFor="padrao" className="text-sm">
            Definir como método padrão
          </label>
        </div>

        {/* Botão */}
        <button
          onClick={handleSalvar}
          className="w-full bg-sky-500 text-white py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-sky-600 transition font-medium"
        >
          <Save size={18} /> Salvar Alterações
        </button>
      </div>
    </div>
  );
}
