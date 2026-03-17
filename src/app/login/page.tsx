"use client";

import { Suspense } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

// Componente interno que usa useSearchParams
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const redirectTo = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !senha) {
      toast.error("Preencha todos os campos");
      return;
    }

    setTimeout(() => {
      const nomeTemporario = email.split("@")[0];
      const nomeFormatado =
        nomeTemporario.charAt(0).toUpperCase() + nomeTemporario.slice(1);

      login({
        name: nomeFormatado,
        email,
        roles: ["LOCATARIO"],
        telefone: "",
        cidade: "",
        estado: "",
        cpf: "",
      });

      router.push(redirectTo);
    }, 600);
  };

  const handleLoginGoogle = () => {
    toast("Login com Google ainda não implementado");
  };

  const handleLoginFacebook = () => {
    toast("Login com Facebook ainda não implementado");
  };

  return (
    <section className="flex justify-center items-center min-h-screen px-4">
      <div className="bg-white shadow-md rounded-2xl p-10 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Bem-vindo ao PlacyHub
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Entre na sua conta para continuar
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#02b0f0]"
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#02b0f0]"
          />

          <a
            href="/esqueci-senha"
            className="text-sm text-[#02b0f0] hover:underline text-right"
          >
            Esqueceu sua senha?
          </a>

          <button
            type="submit"
            className="bg-[#02b0f0] text-white py-2 rounded-lg hover:bg-[#0292cb] transition"
          >
            Entrar
          </button>

          <div className="text-sm text-center mt-4">
            Não tem uma conta?{" "}
            <a
              href="/cadastro/locatario"
              className="text-[#02b0f0] hover:underline font-medium"
            >
              Criar conta
            </a>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleLoginGoogle}
              className="flex items-center justify-center gap-2 border border-gray-300 py-2 px-4 rounded-lg w-full hover:bg-gray-50"
            >
              <FcGoogle size={20} /> Google
            </button>

            <button
              type="button"
              onClick={handleLoginFacebook}
              className="flex items-center justify-center gap-2 border border-gray-300 py-2 px-4 rounded-lg w-full hover:bg-gray-50"
            >
              <FaFacebook size={20} color="#1877F2" /> Facebook
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

// Componente principal com Suspense
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500 animate-pulse">Carregando...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}