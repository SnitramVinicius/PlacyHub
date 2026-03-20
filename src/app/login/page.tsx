"use client";

import { Suspense } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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

  const handleVoltarHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">

      {/* Logo no topo */}
      <div className="flex justify-center pt-8 pb-4">
        <Link href="/">
          <img src="/placyhub.png" alt="PlacyHub Logo" className="h-12 w-auto" />
        </Link>
      </div>

      {/* Container flexível para centralizar o formulário */}
      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 sm:p-8 md:p-10 w-full max-w-md">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Bem-vindo ao PlacyHub
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Entre na sua conta para continuar
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 
                focus:outline-none focus:border-[#02b0f0] focus:ring-2 focus:ring-[#02b0f0]/20
                bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />

            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 
                focus:outline-none focus:border-[#02b0f0] focus:ring-2 focus:ring-[#02b0f0]/20
                bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />

            <a
              href="/esqueci-senha"
              className="text-sm text-[#02b0f0] hover:underline text-right"
            >
              Esqueceu sua senha?
            </a>

            <button
              type="submit"
              className="bg-[#02b0f0] hover:bg-[#0292cb] text-white py-2 rounded-lg transition"
            >
              Entrar
            </button>

            <div className="text-sm text-center mt-4 text-gray-600 dark:text-gray-400">
              Não tem uma conta?{" "}
              <a
                href="/cadastro/locatario"
                className="text-[#02b0f0] hover:underline font-medium"
              >
                Criar conta
              </a>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleLoginGoogle}
                className="flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 
                  py-2 px-4 rounded-lg w-full hover:bg-gray-50 dark:hover:bg-gray-700 transition
                  text-gray-700 dark:text-gray-200"
              >
                <FcGoogle size={20} /> Google
              </button>

              <button
                type="button"
                onClick={handleLoginFacebook}
                className="flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 
                  py-2 px-4 rounded-lg w-full hover:bg-gray-50 dark:hover:bg-gray-700 transition
                  text-gray-700 dark:text-gray-200"
              >
                <FaFacebook size={20} color="#1877F2" /> Facebook
              </button>
            </div>

            {/* Botão Voltar para Home dentro do formulário */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={handleVoltarHome}
                className="w-full flex items-center justify-center gap-2 
                  text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 
                  text-sm transition py-2"
              >
                <ArrowLeft size={16} />
                Voltar para a página inicial
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Componente principal com Suspense
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-500 dark:text-gray-400 animate-pulse">Carregando...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}