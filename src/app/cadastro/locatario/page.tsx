"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, X, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { Role } from "@/types/role";
import { toast } from "sonner";

interface EstadoIBGE {
  id: number;
  sigla: string;
  nome: string;
}

export default function CadastroLocatario() {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [estados, setEstados] = useState<EstadoIBGE[]>([]);
  const [loadingEstados, setLoadingEstados] = useState(true);
  const [modalAberto, setModalAberto] = useState<"termos" | "privacidade" | null>(null);

  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const carregarEstados = async () => {
      try {
        const res = await fetch(
          "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
        );
        const data: EstadoIBGE[] = await res.json();
        setEstados(data.sort((a, b) => a.nome.localeCompare(b.nome)));
      } catch {
        toast.error("Erro ao carregar estados.");
      } finally {
        setLoadingEstados(false);
      }
    };
    carregarEstados();
  }, []);

  const validarSenha = (senha: string) =>
    /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(senha);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const usuario = {
      nome: formData.get("nome")?.toString().trim(),
      email: formData.get("email")?.toString().trim(),
      senha: formData.get("senha")?.toString(),
      confirmarSenha: formData.get("confirmarSenha")?.toString(),
      telefone: formData.get("telefone")?.toString().trim(),
      cidade: formData.get("cidade")?.toString().trim(),
      estado: formData.get("estado")?.toString(),
      dataNascimento: formData.get("dataNascimento")?.toString() || null,
      termos: formData.get("termos") === "on",
    };

    if (
      !usuario.nome ||
      !usuario.email ||
      !usuario.senha ||
      !usuario.confirmarSenha ||
      !usuario.telefone ||
      !usuario.cidade ||
      !usuario.estado
    ) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    if (!usuario.termos) {
      toast.error("Aceite os termos para continuar.");
      return;
    }

    if (usuario.senha !== usuario.confirmarSenha) {
      toast.error("As senhas não coincidem.");
      return;
    }

    if (!validarSenha(usuario.senha)) {
      toast.error(
        "Senha deve ter no mínimo 8 caracteres, uma letra maiúscula e um número."
      );
      return;
    }

    const payload = {
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      cidade: usuario.cidade,
      estado: usuario.estado,
      dataNascimento: usuario.dataNascimento,
      roles: ["LOCATARIO"],
    };

    localStorage.setItem("usuario", JSON.stringify(payload));

    login({
      name: payload.nome!,
      email: payload.email!,
      roles: payload.roles as Role[],
      telefone: payload.telefone,
      cidade: payload.cidade,
      estado: payload.estado,
    });

    toast.success("Conta criada com sucesso!");
    setTimeout(() => router.push("/"), 1500);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Logo no topo */}
      <div className="flex justify-center pt-6 pb-2">
        <Link href="/">
          <img src="/placyhub.png" alt="PlacyHub Logo" className="h-12 w-auto" />
        </Link>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 sm:py-6">
        {/* Botão Voltar */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 
            hover:text-sky-600 dark:hover:text-sky-400 transition-colors mb-4"
        >
          <ArrowLeft size={18} />
          <span>Voltar para o login</span>
        </Link>

        {/* Card do formulário */}
        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Crie sua conta no PlacyHub
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-6 sm:mb-8">
            Comece a alugar os melhores espaços da sua cidade.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Nome completo" name="nome" required />
              <Input label="E-mail" name="email" type="email" required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PasswordInput
                label="Senha"
                name="senha"
                show={mostrarSenha}
                toggle={() => setMostrarSenha(!mostrarSenha)}
                required
              />
              <PasswordInput
                label="Confirmar senha"
                name="confirmarSenha"
                show={mostrarConfirmarSenha}
                toggle={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Telefone" name="telefone" required />
              <Input label="Cidade" name="cidade" required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select 
                label="Estado" 
                name="estado" 
                disabled={loadingEstados}
                required
              >
                <option value="">
                  {loadingEstados ? "Carregando..." : "Selecione"}
                </option>
                {estados.map((uf) => (
                  <option key={uf.id} value={uf.sigla}>
                    {uf.nome} ({uf.sigla})
                  </option>
                ))}
              </Select>

              <Input
                label="Data de nascimento (opcional)"
                name="dataNascimento"
                type="date"
              />
            </div>

            <label className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
              <input type="checkbox" name="termos" className="mt-1" />
              <span>
                Aceito os{" "}
                <button
                  type="button"
                  onClick={() => setModalAberto("termos")}
                  className="text-sky-600 dark:text-sky-400 hover:underline"
                >
                  Termos de Uso
                </button>{" "}
                e a{" "}
                <button
                  type="button"
                  onClick={() => setModalAberto("privacidade")}
                  className="text-sky-600 dark:text-sky-400 hover:underline"
                >
                  Política de Privacidade
                </button>
              </span>
            </label>

            <button
              type="submit"
              className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-xl font-medium transition"
            >
              Criar conta
            </button>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-sky-600 dark:text-sky-400 hover:underline">
                Entrar
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Modal */}
      {modalAberto && (
        <Modal
          titulo={
            modalAberto === "termos"
              ? "Termos de Uso"
              : "Política de Privacidade"
          }
          onClose={() => setModalAberto(null)}
        />
      )}
    </div>
  );
}

/* 🔹 COMPONENTES */

function Input({ label, required, ...props }: any) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        {...props}
        className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2.5 
          focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition
          bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      />
    </div>
  );
}

function Select({ label, children, required, ...props }: any) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        {...props}
        className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2.5 
          focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition
          bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      >
        {children}
      </select>
    </div>
  );
}

function PasswordInput({ label, name, show, toggle, required }: any) {
  return (
    <div className="flex flex-col gap-1 relative">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={show ? "text" : "password"}
        name={name}
        className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2.5 pr-10 
          focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition
          bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute right-3 top-9 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

function Modal({ titulo, onClose }: { titulo: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          {titulo}
        </h2>

        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-3 max-h-[60vh] overflow-y-auto">
          <p>
            Este é um texto exemplo. Em produção, este conteúdo deve vir do
            backend ou CMS, permitindo versionamento e auditoria legal.
          </p>
          <p>
            Ao utilizar o PlacyHub, você concorda com as regras, políticas e boas
            práticas da plataforma.
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-xl font-medium transition"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}