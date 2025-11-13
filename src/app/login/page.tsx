"use client";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Toaster, toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !senha) {
      toast.error("Preencha todos os campos");
      return;
    }

    // Simulação de login
    setTimeout(() => {
      router.push("/"); // redireciona para a home
    }, 800);
  };

  const handleLoginGoogle = () => {
    toast("Login com Google não implementado ainda 😅", { description: "Simulação apenas" });
  };

  const handleLoginFacebook = () => {
    toast("Login com Facebook não implementado ainda 😅", { description: "Simulação apenas" });
  };

  return (
    <>
      <Toaster position="top-right" richColors />

      <section className="flex justify-center items-center min-h-screen px-4">
        <div className="bg-white shadow-md rounded-2xl p-10 w-full max-w-4xl flex flex-col md:flex-row justify-between gap-10">
          
          {/* Coluna da esquerda */}
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Bem-vindo(a) ao PlacyHub!
            </h1>
            <p className="text-sm text-gray-500 mb-3">Entrar na sua conta</p>

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

              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={handleLoginGoogle}
                  className="flex items-center justify-center gap-2 border border-gray-300 py-2 px-4 rounded-lg w-full hover:bg-gray-50"
                >
                  <FcGoogle size={20} /> Entrar com Google
                </button>
                <button
                  type="button"
                  onClick={handleLoginFacebook}
                  className="flex items-center justify-center gap-2 border border-gray-300 py-2 px-4 rounded-lg w-full hover:bg-gray-50"
                >
                  <FaFacebook size={20} color="#1877F2" /> Entrar com Facebook
                </button>
              </div>
            </form>
          </div>

          {/* Coluna da direita */}
          <div className="flex-1 flex flex-col justify-center p-6 text-center gap-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Ainda não tem conta?
            </h2>

            <div className="space-y-4">
              <div className="bg-[#ecf7fb] border border-[#02b0f0] rounded-xl p-4">
                <h3 className="font-medium text-gray-800">
                  Quero Alugar um Espaço
                </h3>
                <p className="text-sm text-[#a7acad] mb-3">
                  Para quem busca o local perfeito para sua festa ou evento.
                </p>
                <a
                  href="/cadastro/locatario"
                  className="bg-[#02b0f0] text-white py-2 px-4 rounded-lg hover:bg-[#0292cb] transition"
                >
                  Continuar como Locatário
                </a>
              </div>

              <div className="bg-[#ecf7fb] border border-[#02b0f0] rounded-xl p-4">
                <h3 className="font-medium text-gray-800">
                  Quero Alugar Meu Espaço
                </h3>
                <p className="text-sm text-[#a7acad] mb-3">
                  Para quem tem um salão, sítio ou espaço e deseja rentabilizá-lo.
                </p>
                <a
                  href="/anfitriao/cadastro"
                  className="bg-[#02b0f0] text-white py-2 px-4 rounded-lg hover:bg-[#0292cb] transition"
                >
                  Continuar como Anfitrião
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
