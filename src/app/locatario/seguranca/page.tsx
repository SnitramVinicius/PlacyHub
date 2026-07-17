"use client";

import { useEffect, useState } from "react";
import {
  Lock,
  Smartphone,
  ShieldCheck,
  LogOut,
  ArrowLeft,
  Check,
  AlertCircle,
  Laptop,
  Smartphone as PhoneIcon,
  Tablet,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function GerenciarSeguranca() {

  const { user } = useAuth();

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
        const userId = user?.id;

if (!userId) {
  console.log("Usuário não encontrado");
  return;
}
        if (!userId) {
          console.log("Usuário não encontrado");
          return;
        }
        
        const res = await fetch(`/api/security/devices?userId=${userId}`);
        const data = await res.json();
        
        if (res.ok && data.devices) {
          setDevices(data.devices);
          console.log("Dispositivos carregados:", data.devices.length);
        }
      } catch (error) {
        console.error("Erro ao carregar dispositivos:", error);
      }
    }
    loadDevices();
  }, []);

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
      const userId = user?.id;
      
      const res = await fetch("/api/security/devices", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, userId }),
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

  const getDeviceIcon = (name: string) => {
    if (name?.toLowerCase().includes("mobile") || name?.toLowerCase().includes("iphone") || name?.toLowerCase().includes("android")) {
      return <PhoneIcon size={18} />;
    }
    if (name?.toLowerCase().includes("tablet") || name?.toLowerCase().includes("ipad")) {
      return <Tablet size={18} />;
    }
    return <Laptop size={18} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
        {/* Header com gradiente */}
        <div className="relative mb-8 overflow-hidden bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl shadow-lg">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative p-6 md:p-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Segurança da Conta
                </h1>
                <p className="text-sky-100 text-sm md:text-base">
                  Proteja sua conta com camadas extras de segurança
                </p>
              </div>
              <Link
                href="/locatario/perfil"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300 group"
                aria-label="Voltar"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>

        {/* 🔥 ALTERAR SENHA - Card com botão para página dedicada */}
        <Link
          href="/locatario/alterar-senha"
          className="block bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 overflow-hidden hover:shadow-md transition-all group"
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-sky-100 dark:bg-sky-900/30 rounded-xl">
                  <Lock size={22} className="text-sky-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Alterar Senha
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Mantenha sua senha sempre atualizada
                  </p>
                </div>
              </div>
              <div className="text-gray-400 group-hover:text-sky-500 group-hover:translate-x-1 transition-all">
                →
              </div>
            </div>
          </div>
        </Link>

        {/* 2FA - Card redesenhado */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                  <ShieldCheck size={22} className="text-purple-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                    Autenticação em Duas Etapas
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Proteja sua conta com uma camada extra de segurança
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${autenticacao2FA ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                      {autenticacao2FA ? '✓ Protegido' : '○ Desprotegido'}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleToggle2FA}
                className={`group relative overflow-hidden px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  autenticacao2FA
                    ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                    : "bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-600 hover:to-blue-700 shadow-md"
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {autenticacao2FA ? "Desativar 2FA" : "Ativar 2FA"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* DISPOSITIVOS - Card redesenhado */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                <Smartphone size={22} className="text-emerald-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Dispositivos Conectados
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Gerencie os dispositivos que têm acesso à sua conta
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {devices.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <Smartphone size={28} className="text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  Nenhum dispositivo registrado.
                </p>
              </div>
            )}

            <div className="space-y-3">
              {devices.map((device) => (
                <div
                  key={device.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`p-2 rounded-xl ${device.atual ? 'bg-sky-100 dark:bg-sky-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
                      {getDeviceIcon(device.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-2 mb-1">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {device.name || "Dispositivo"}
                        </span>
                        {device.atual && (
                          <span className="text-xs bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 px-2 py-0.5 rounded-full">
                            Atual
                          </span>
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {device.userAgent?.substring(0, 80)}...
                      </p>

                      {device.location && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                          📍 {device.location}
                        </p>
                      )}

                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                        Último acesso: {new Date(device.lastAccess).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {!device.atual && (
                    <button
                      onClick={() => handleEncerrarDispositivo(device.id)}
                      className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all whitespace-nowrap"
                    >
                      <LogOut size={16} />
                      <span>Encerrar</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}