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
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/locatario/perfil"
          className="text-sky-500 hover:text-sky-600 flex items-center gap-1"
        >
          <ArrowLeft size={18} /> Voltar
        </Link>
        <h1 className="text-2xl font-bold">Segurança da Conta</h1>
      </div>
      {/* Alterar Senha */}{" "}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        {" "}
        <div className="flex items-center gap-2 mb-4">
          {" "}
          <Lock className="text-sky-500" size={22} />{" "}
          <h2 className="text-lg font-semibold">Alterar Senha</h2>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {" "}
          <input
            type="password"
            placeholder="Senha atual"
            value={senhaAtual}
            onChange={(e) => setSenhaAtual(e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
          />{" "}
          <input
            type="password"
            placeholder="Nova senha"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
          />{" "}
          <input
            type="password"
            placeholder="Confirmar nova senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
          />{" "}
        </div>{" "}
        <button
          onClick={handleAlterarSenha}
          className="mt-4 bg-sky-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-sky-600 transition flex items-center gap-2"
        >
          {" "}
          <Save size={16} /> Salvar Nova Senha{" "}
        </button>{" "}
      </div>
      {/* 2FA */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-sky-500" size={26} />
          <div>
            <h3 className="font-semibold">Autenticação em Duas Etapas</h3>
            <p className="text-sm text-gray-500">
              Proteja sua conta com uma camada extra.
            </p>
          </div>
        </div>

        <button
          onClick={handleToggle2FA}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
            autenticacao2FA
              ? "bg-red-100 text-red-600 hover:bg-red-200"
              : "bg-sky-100 text-sky-600 hover:bg-sky-200"
          }`}
        >
          {autenticacao2FA ? "Desativar" : "Ativar"}
        </button>
      </div>
      {/* DISPOSITIVOS */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <div className="flex items-center gap-2 mb-4">
          <Smartphone className="text-sky-500" />
          <h2 className="font-semibold text-lg">Dispositivos Conectados</h2>
        </div>

        {devices.length === 0 && (
          <p className="text-sm text-gray-500">
            Nenhum dispositivo registrado.
          </p>
        )}

        <ul className="space-y-4">
          {devices.map((device) => (
            <li
              key={device.id}
              className="flex justify-between items-center border rounded-xl p-4"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">
                  📱 Dispositivo
                </p>
                <p className="text-xs text-gray-500 truncate max-w-md">
                  {device.userAgent}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Último acesso: {new Date(device.lastAccess).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => handleEncerrarDispositivo(device.id)}
                className="
                  flex items-center gap-1
                  px-3 py-1
                  text-xs font-medium
                  text-red-600
                  border border-red-200
                  rounded-lg
                  hover:bg-red-50
                  transition
                "
              >
                <LogOut size={12} />
                Encerrar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
