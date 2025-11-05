"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import Navbar from "@/components/navbar";

export default function CadastroLocatario() {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  return (
    <>
    <Navbar/>
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-full max-w-4xl flex flex-col md:flex-row justify-between p-6 rounded-2xl shadow-md bg-white">
        {/* Coluna Esquerda */}
        <div className="flex-1 p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">
            Crie sua conta no PlacyHub!
          </h2>
          <p className="text-gray-500 mb-6">
            Preencha seus dados para começar a alugar os melhores espaços.
          </p>

          <form className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700">Nome completo</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                placeholder="Ex: Vinicius Martins"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700">E-mail</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                placeholder="exemplo@email.com"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1 relative">
                <label className="block text-sm text-gray-700">Senha</label>
                <input
                  type={mostrarSenha ? "text" : "password"}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-3 top-8 text-gray-500"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                >
                  {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="flex-1 relative">
                <label className="block text-sm text-gray-700">Confirmar senha</label>
                <input
                  type={mostrarConfirmarSenha ? "text" : "password"}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-3 top-8 text-gray-500"
                  onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                >
                  {mostrarConfirmarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm text-gray-700">Telefone</label>
                <input
                  type="tel"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                  placeholder="(67) 99999-9999"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-700">CPF</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                  placeholder="000.000.000-00"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm text-gray-700">Cidade</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                  placeholder="Campo Grande"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-700">Estado</label>
                <select className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none">
                  <option value="">Selecione</option>
                  <option>MS</option>
                  <option>SP</option>
                  <option>RJ</option>
                  <option>MG</option>
                  <option>PR</option>
                  <option>RS</option>
                  <option>SC</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <input type="checkbox" id="termos" className="w-4 h-4" />
              <label htmlFor="termos" className="text-sm text-gray-600">
                Aceito os{" "}
                <Link href="/termos" className="text-sky-600 hover:underline">
                  Termos de Uso
                </Link>{" "}
                e a{" "}
                <Link href="/privacidade" className="text-sky-600 hover:underline">
                  Política de Privacidade
                </Link>
                .
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-sky-500 text-white py-2 rounded-xl font-semibold hover:bg-sky-600 transition"
            >
              Criar Conta
            </button>

            <div className="flex items-center gap-2 justify-center text-sm text-gray-500">
              Já tem uma conta?
              <Link href="/login" className="text-sky-600 hover:underline">
                Entrar
              </Link>
            </div>
          </form>

          <div className="mt-6">
            <div className="flex items-center justify-center gap-4">
              <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-xl hover:bg-gray-100 transition">
                <img src="/google.svg" alt="Google" className="w-5 h-5" />
                Entrar com Google
              </button>
              <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-xl hover:bg-gray-100 transition">
                <img src="/facebook.svg" alt="Facebook" className="w-5 h-5" />
                Entrar com Facebook
              </button>
            </div>
          </div>
        </div>

        {/* Coluna Direita */}
        <div className="hidden md:flex flex-col justify-center p-6 bg-sky-50 border border-sky-200 rounded-2xl w-1/3">
          <h3 className="text-lg font-semibold text-sky-700 mb-2">Sou Anfitrião</h3>
          <p className="text-gray-600 text-sm mb-4">
            Tem um salão, chácara ou espaço e quer rentabilizá-lo?
          </p>
          <Link
            href="/anfitriao/cadastro"
            className="bg-white border border-sky-400 text-sky-700 py-2 px-4 rounded-xl text-center font-semibold hover:bg-sky-100 transition"
          >
            Cadastrar como Anfitrião
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
