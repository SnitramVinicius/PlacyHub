"use client";

import { useEffect, useState } from "react";
import {
  Lock,
  Smartphone,
  ShieldCheck,
  LogOut,
  Save,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function GerenciarSeguranca() {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [autenticacao2FA, setAutenticacao2FA] = useState(false);
  const [devices, setDevices] = useState<any[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    async function loadDevices() {
      try {
        const res = await fetch("/api/security/devices");
        const data = await res.json();
        if (res.ok) setDevices(data.devices);
      } catch {}
    }
    loadDevices();
  }, []);

  const handleAlterarSenha = async () => {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      toast.error("Preencha todos os campos de senha.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      toast.error("As senhas não coincidem.");
      return;
    }

    try {
      const response = await fetch("/api/security/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senhaAtual, novaSenha }),
      });

      if (!response.ok) {
        toast.error("Erro ao alterar senha.");
        return;
      }

      toast.success("Senha alterada com sucesso!");
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");
    } catch {
      toast.error("Erro de conexão.");
    }
  };

  const handleToggle2FA = async () => {
    try {
      const response = await fetch("/api/security/two-factor", {
        method: "POST",
      });

      if (!response.ok) {
        toast.error("Erro ao alterar 2FA");
        return;
      }

      setAutenticacao2FA(!autenticacao2FA);
      toast.success(
        autenticacao2FA
          ? "Autenticação em duas etapas desativada."
          : "Autenticação em duas etapas ativada."
      );
    } catch {
      toast.error("Erro de conexão");
    }
  };

  const handleEncerrarDispositivo = async (id: string) => {
    try {
      const res = await fetch("/api/security/devices", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        toast.error("Erro ao encerrar dispositivo");
        return;
      }

      setDevices((prev) => prev.filter((d) => d.id !== id));
      toast.success("Dispositivo encerrado");
    } catch {
      toast.error("Erro de conexão");
    }
  };

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Cabeçalho com botão voltar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        
        {/* BOTÃO VOLTAR */}
                  <div className="w-full mb-8 flex justify-end">
                    <Link
                      href="/locatario/perfil"
                      className="flex items-center justify-center
                      w-10 h-10 rounded-full
                      bg-white dark:bg-slate-800
                      border border-gray-200 dark:border-slate-700
                      text-gray-500 dark:text-gray-400
                      hover:bg-gray-50 dark:hover:bg-slate-700
                      hover:border-gray-300 dark:hover:border-slate-600
                      hover:text-gray-700 dark:hover:text-gray-200
                      hover:shadow-sm
                      transition-all duration-300
                      group"
                      aria-label="Voltar"
                    >
                      <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform duration-300" />
                    </Link>
                  </div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
          Segurança da Conta
        </h1>
      </div>

      {/* Alterar Senha */}
      <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl shadow mb-4 md:mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="text-sky-500" size={22} />
          <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">
            Alterar Senha
          </h2>
        </div>
        
        <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-3 md:gap-4">
          <input
            type="password"
            placeholder="Senha atual"
            value={senhaAtual}
            onChange={(e) => setSenhaAtual(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 md:py-2 
              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
              focus:ring-2 focus:ring-sky-500 outline-none transition"
          />
          <input
            type="password"
            placeholder="Nova senha"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 md:py-2 
              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
              focus:ring-2 focus:ring-sky-500 outline-none transition"
          />
          <input
            type="password"
            placeholder="Confirmar nova senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 md:py-2 
              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
              focus:ring-2 focus:ring-sky-500 outline-none transition"
          />
        </div>
        
        <button
          onClick={handleAlterarSenha}
          className="mt-4 w-full md:w-auto bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 md:py-2 rounded-xl font-semibold transition flex items-center justify-center gap-2"
        >
          <Save size={16} />
          <span>Salvar Nova Senha</span>
        </button>
      </div>

      {/* 2FA */}
      <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl shadow mb-4 md:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <ShieldCheck className="text-sky-500" size={26} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Autenticação em Duas Etapas
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Proteja sua conta com uma camada extra de segurança
              </p>
            </div>
          </div>

          <button
            onClick={handleToggle2FA}
            className={`w-full sm:w-auto px-4 py-3 md:py-2 rounded-xl text-sm font-medium transition ${
              autenticacao2FA
                ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
                : "bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 hover:bg-sky-200 dark:hover:bg-sky-900/50"
            }`}
          >
            {autenticacao2FA ? "Desativar 2FA" : "Ativar 2FA"}
          </button>
        </div>
      </div>

      {/* DISPOSITIVOS */}
      <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl shadow">
        <div className="flex items-center gap-2 mb-4">
          <Smartphone className="text-sky-500" size={22} />
          <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">
            Dispositivos Conectados
          </h2>
        </div>

        {devices.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
            Nenhum dispositivo registrado.
          </p>
        )}

        <ul className="space-y-3">
          {devices.map((device) => (
            <li
              key={device.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-gray-200 dark:border-gray-700 rounded-xl p-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    📱 {device.name || "Dispositivo"}
                  </span>
                  {device.atual && (
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full">
                      Dispositivo atual
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {device.userAgent}
                </p>

                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  Último acesso: {new Date(device.lastAccess).toLocaleString()}
                </p>
              </div>

              {!device.atual && (
                <button
                  onClick={() => handleEncerrarDispositivo(device.id)}
                  className="flex items-center justify-center gap-1 px-4 py-2 sm:px-3 sm:py-1 text-sm sm:text-xs font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition whitespace-nowrap"
                >
                  <LogOut size={14} />
                  <span>Encerrar</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}