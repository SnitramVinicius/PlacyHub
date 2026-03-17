"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { Role } from "@/types/role"; //
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
    <>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-semibold text-gray-800">
            Crie sua conta no PlacyHub
          </h1>
          <p className="text-gray-500 text-sm mt-1 mb-8">
            Comece a alugar os melhores espaços da sua cidade.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Nome completo" name="nome" />
              <Input label="E-mail" name="email" type="email" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PasswordInput
                label="Senha"
                name="senha"
                show={mostrarSenha}
                toggle={() => setMostrarSenha(!mostrarSenha)}
              />
              <PasswordInput
                label="Confirmar senha"
                name="confirmarSenha"
                show={mostrarConfirmarSenha}
                toggle={() =>
                  setMostrarConfirmarSenha(!mostrarConfirmarSenha)
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Telefone" name="telefone" />
              <Input label="Cidade" name="cidade" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select label="Estado" name="estado" disabled={loadingEstados}>
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

            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" name="termos" />
              Aceito os{" "}
              <button
                type="button"
                onClick={() => setModalAberto("termos")}
                className="text-sky-600 hover:underline"
              >
                Termos de Uso
              </button>{" "}
              e a{" "}
              <button
                type="button"
                onClick={() => setModalAberto("privacidade")}
                className="text-sky-600 hover:underline"
              >
                Política de Privacidade
              </button>
            </label>

            <button
              type="submit"
              className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-xl font-medium transition"
            >
              Criar conta
            </button>

            <p className="text-center text-sm text-gray-500">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-sky-600 hover:underline">
                Entrar
              </Link>
            </p>
          </form>
        </div>
      </div>

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
    </>
  );
}

/* 🔹 COMPONENTES */

function Input({ label, ...props }: any) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-600">{label}</label>
      <input
        {...props}
        className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
      />
    </div>
  );
}

function Select({ label, children, ...props }: any) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-600">{label}</label>
      <select
        {...props}
        className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
      >
        {children}
      </select>
    </div>
  );
}

function PasswordInput({ label, name, show, toggle }: any) {
  return (
    <div className="flex flex-col gap-1 relative">
      <label className="text-sm text-gray-600">{label}</label>
      <input
        type={show ? "text" : "password"}
        name={name}
        className="border border-gray-300 rounded-xl px-3 py-2 pr-10 focus:ring-2 focus:ring-sky-500 outline-none"
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute right-3 top-8 text-gray-500"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

function Modal({ titulo, onClose }: { titulo: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-semibold mb-4">{titulo}</h2>

        <div className="text-sm text-gray-600 space-y-3 max-h-[60vh] overflow-y-auto">
          <p>
            Este é um texto exemplo. Em produção, este conteúdo deve vir do
            backend ou CMS, permitindo versionamento e auditoria legal.
          </p>
          <p>
            Ao utilizar o PlacyHub, você concorda com as regras, políticas e boas
            práticas da plataforma.
          </p>
        </div>
      </div>
    </div>
  );
}
