"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar2 from "@/components/navbar2";
import { useAuth } from "@/context/AuthContext";
import { toast, Toaster } from "sonner";

export default function CadastroLocatario() {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const searchParams = useSearchParams();
  const planoSelecionado = searchParams.get("plano");

  const planoInfo: Record<string, { nome: string; preco: string; descricao: string }> = {
    basico: { nome: "Plano Básico", preco: "Grátis", descricao: "Ideal para iniciantes." },
    premium: { nome: "Plano Premium", preco: "R$ 69,90/mês", descricao: "Mais visibilidade e suporte." },
  };
  const plano = planoSelecionado && planoInfo[planoSelecionado];

  useEffect(() => {
    if (!planoSelecionado) console.warn("Nenhum plano selecionado — vindo direto para o cadastro.");
  }, [planoSelecionado]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const usuario = {
      nome: formData.get("nome")?.toString().trim(),
      email: formData.get("email")?.toString().trim(),
      senha: formData.get("senha")?.toString(),
      confirmarSenha: formData.get("confirmarSenha")?.toString(),
      telefone: formData.get("telefone")?.toString().trim(),
      cpf: formData.get("cpf")?.toString().trim(),
      cidade: formData.get("cidade")?.toString().trim(),
      estado: formData.get("estado")?.toString(),
      termos: formData.get("termos") === "on",
    };

    // 🔹 Validações modernas com toasts
    if (!usuario.nome || !usuario.email || !usuario.senha || !usuario.confirmarSenha || !usuario.telefone || !usuario.cpf || !usuario.cidade || !usuario.estado) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (!usuario.termos) {
      toast.error("Você precisa aceitar os termos de uso e política de privacidade");
      return;
    }

    if (usuario.senha !== usuario.confirmarSenha) {
      toast.error("As senhas não coincidem");
      return;
    }

    // 🔹 Salva no localStorage (simulação)
    localStorage.setItem("usuario", JSON.stringify(usuario));

    // 🔹 Atualiza contexto e faz login
    login({ name: usuario.nome!, email: usuario.email! });

    toast.success("Conta criada com sucesso!");
    router.push("/anfitriao/espacos/novo"); 
  };

  return (
    <>
      <Toaster position="top-right" richColors />

      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-full max-w-4xl flex flex-col md:flex-row justify-between p-6 rounded-2xl shadow-md bg-white">
          {/* Coluna Esquerda */}
          <div className="flex-1 p-6">
            {plano && (
              <div className="mb-6 p-4 border border-sky-200 bg-sky-50 rounded-xl">
                <p className="text-sm text-sky-600 mb-1 font-medium">💼 Você está se cadastrando no:</p>
                <p className="text-lg font-semibold text-sky-700">
                  {plano.nome} — <span className="font-normal">{plano.preco}</span>
                </p>
                <p className="text-gray-500 text-sm">{plano.descricao}</p>
              </div>
            )}

            <h2 className="text-2xl font-semibold text-gray-800 mb-1">Crie sua conta no PlacyHub!</h2>
            <p className="text-gray-500 mb-6">Preencha seus dados para começar a alugar os seus espaços.</p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Nome */}
              <div>
                <label className="block text-sm text-gray-700">Nome completo</label>
                <input type="text" name="nome" className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none" placeholder="Ex: Vinicius Martins"/>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm text-gray-700">E-mail</label>
                <input type="email" name="email" className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none" placeholder="exemplo@email.com"/>
              </div>

              {/* Senha / Confirmar senha */}
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <label className="block text-sm text-gray-700">Senha</label>
                  <input type={mostrarSenha ? "text" : "password"} name="senha" className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none" placeholder="••••••••"/>
                  <button type="button" className="absolute right-3 top-8 text-gray-500" onClick={() => setMostrarSenha(!mostrarSenha)}>
                    {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="flex-1 relative">
                  <label className="block text-sm text-gray-700">Confirmar senha</label>
                  <input type={mostrarConfirmarSenha ? "text" : "password"} name="confirmarSenha" className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none" placeholder="••••••••"/>
                  <button type="button" className="absolute right-3 top-8 text-gray-500" onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}>
                    {mostrarConfirmarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Telefone / CPF */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm text-gray-700">Telefone</label>
                  <input type="tel" name="telefone" className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none" placeholder="(67) 99999-9999"/>
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-700">CPF</label>
                  <input type="text" name="cpf" className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none" placeholder="000.000.000-00"/>
                </div>
              </div>

              {/* Cidade / Estado */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm text-gray-700">Cidade</label>
                  <input type="text" name="cidade" className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none" placeholder="Campo Grande"/>
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-700">Estado</label>
                  <select name="estado" className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none">
                    <option value="">Selecione</option>
                    <option>MS</option>
                    <option>SP</option>
                    <option>RJ</option>
                  </select>
                </div>
              </div>

              {/* Termos */}
              <div className="flex items-center gap-2 mt-4">
                <input type="checkbox" id="termos" name="termos" className="w-4 h-4"/>
                <label htmlFor="termos" className="text-sm text-gray-600">
                  Aceito os <Link href="/termos" className="text-sky-600 hover:underline">Termos de Uso</Link> e a <Link href="/privacidade" className="text-sky-600 hover:underline">Política de Privacidade</Link>.
                </label>
              </div>

              <button type="submit" className="w-full bg-sky-500 text-white py-2 rounded-xl font-semibold hover:bg-sky-600 transition">
                Criar Conta
              </button>

              <div className="flex items-center gap-2 justify-center text-sm text-gray-500">
                Já tem uma conta? <Link href="/login" className="text-sky-600 hover:underline">Entrar</Link>
              </div>
            </form>
          </div>

          {/* Coluna Direita */}
          <div className="hidden md:flex flex-col justify-center p-6 bg-sky-50 border border-sky-200 rounded-2xl w-1/3">
            <h3 className="text-lg font-semibold text-sky-700 mb-2">Quero Alugar um Espaço</h3>
            <p className="text-gray-600 text-sm mb-4">Para quem busca o local perfeito para sua festa ou evento.</p>
            <Link href="/cadastro/locatario" className="bg-white border border-sky-400 text-sky-700 py-2 px-4 rounded-xl text-center font-semibold hover:bg-sky-100 transition">
              Cadastrar como Locatário
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
