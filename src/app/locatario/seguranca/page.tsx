"use client";

import { useState } from "react";
import { Lock, Smartphone, ShieldCheck, LogOut, Save, ArrowLeft  } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";


export default function GerenciarSeguranca() {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [autenticacao2FA, setAutenticacao2FA] = useState(false);

  const handleAlterarSenha = () => {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      toast.error("Preencha todos os campos de senha.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      toast.error("As senhas não coincidem.");
      return;
    }

    toast.success("Senha alterada com sucesso!");
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");
  };

  const handleToggle2FA = () => {
    setAutenticacao2FA(!autenticacao2FA);
    toast.info(
      autenticacao2FA
        ? "Autenticação em duas etapas desativada."
        : "Autenticação em duas etapas ativada."
    );
  };

  const handleEncerrarSessoes = () => {
    toast.success("Todas as sessões ativas foram encerradas com sucesso!");
  };

  return ( 
       <div className="p-6">
                <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/locatario/perfil"
            className="text-sky-500 hover:text-sky-600 flex items-center gap-1"
          >
            <ArrowLeft size={18} /> Voltar
          </Link>
          <h1 className="text-2xl font-bold">Segurança da Conta</h1>
        </div>
        </div>

      {/* Alterar Senha */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="text-sky-500" size={22} />
          <h2 className="text-lg font-semibold">Alterar Senha</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="password"
            placeholder="Senha atual"
            value={senhaAtual}
            onChange={(e) => setSenhaAtual(e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
          />
          <input
            type="password"
            placeholder="Nova senha"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
          />
          <input
            type="password"
            placeholder="Confirmar nova senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
          />
        </div>

        <button
          onClick={handleAlterarSenha}
          className="mt-4 bg-sky-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-sky-600 transition flex items-center gap-2"
        >
          <Save size={16} /> Salvar Nova Senha
        </button>
      </div>

      {/* Autenticação em Duas Etapas */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <ShieldCheck className="text-sky-500" size={28} />
          <div>
            <h3 className="font-semibold">Autenticação em Duas Etapas (2FA)</h3>
            <p className="text-gray-500 text-sm">
              Adicione uma camada extra de segurança à sua conta.
            </p>
          </div>
        </div>
        <button
          onClick={handleToggle2FA}
          className={`px-5 py-2 rounded-xl font-medium transition ${
            autenticacao2FA
              ? "bg-red-100 text-red-600 hover:bg-red-200"
              : "bg-sky-100 text-sky-600 hover:bg-sky-200"
          }`}
        >
          {autenticacao2FA ? "Desativar" : "Ativar"}
        </button>
      </div>

      {/* Dispositivos Conectados */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Smartphone className="text-sky-500" size={22} />
          <h2 className="text-lg font-semibold">Dispositivos Conectados</h2>
        </div>

        <ul className="text-gray-700 text-sm space-y-3">
          <li className="flex items-center justify-between border-b pb-2">
            <span>Windows 11 • Chrome • Campo Grande - MS</span>
            <span className="text-gray-400 text-xs">Hoje às 12:30</span>
          </li>
          <li className="flex items-center justify-between border-b pb-2">
            <span>Android • App PlacyHub</span>
            <span className="text-gray-400 text-xs">Ontem às 21:10</span>
          </li>
        </ul>

        <button
          onClick={handleEncerrarSessoes}
          className="mt-4 text-red-500 hover:text-red-600 flex items-center gap-1 font-medium"
        >
          <LogOut size={16} /> Encerrar todas as sessões
        </button>
      </div>
    </div>
  );
}
