"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Moon, Sun, Bell, MessageCircle, Mail, Check, Shield, Star, Calendar, Gift, User, Home, CreditCard, ChevronRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useTema } from "@/context/TemaContext";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

interface NotificationSetting {
  id: string;
  tipo: string;
  titulo: string;
  descricao: string;
  email: boolean;
  whatsapp: boolean;
  icon: React.ReactNode;
  color: string;
  apenasAnfitriao?: boolean;
  apenasLocatario?: boolean;
}

export default function PreferenciasGerais() {
  const { tema, setTema } = useTema();
  const { user, isAnfitriao, isLocatario } = useAuth();
  const [settings, setSettings] = useState<NotificationSetting[]>([
    // ========== NOTIFICAÇÕES PARA ANFITRIÃO ==========
    {
      id: "reservas_anfitriao",
      tipo: "reservas",
      titulo: "Novas reservas no seu espaço",
      descricao: "Alertas quando alguém reservar seu espaço",
      email: true,
      whatsapp: true,
      icon: <Calendar size={20} />,
      color: "text-blue-500",
      apenasAnfitriao: true,
    },
    {
      id: "avaliacoes_anfitriao",
      tipo: "avaliacoes",
      titulo: "Avaliações do seu espaço",
      descricao: "Notificações sobre novas avaliações que seu espaço recebeu",
      email: true,
      whatsapp: false,
      icon: <Star size={20} />,
      color: "text-yellow-500",
      apenasAnfitriao: true,
    },

    // ========== NOTIFICAÇÕES PARA LOCATÁRIO ==========
    {
      id: "reservas_locatario",
      tipo: "reservas",
      titulo: "Minhas reservas",
      descricao: "Alertas sobre confirmações, cancelamentos e status das suas reservas",
      email: true,
      whatsapp: true,
      icon: <Calendar size={20} />,
      color: "text-blue-500",
      apenasLocatario: true,
    },
    {
      id: "pagamentos_locatario",
      tipo: "pagamentos",
      titulo: "Pagamentos",
      descricao: "Notificações sobre pagamentos, recibos e repasses",
      email: true,
      whatsapp: true,
      icon: <CreditCard size={20} />,
      color: "text-green-500",
      apenasLocatario: true,
    },
    {
      id: "avaliacoes_locatario",
      tipo: "avaliacoes",
      titulo: "Avaliações sobre você",
      descricao: "Notificações sobre avaliações que você recebeu como cliente",
      email: true,
      whatsapp: false,
      icon: <Star size={20} />,
      color: "text-yellow-500",
      apenasLocatario: true,
    },

    // ========== NOTIFICAÇÕES PARA AMBOS ==========
    {
      id: "promocoes",
      tipo: "promocoes",
      titulo: "Promoções e Novidades",
      descricao: "Ofertas e novidades exclusivas do PlacyHub",
      email: true,
      whatsapp: false,
      icon: <Gift size={20} />,
      color: "text-pink-500",
    },
    {
      id: "seguranca",
      tipo: "seguranca",
      titulo: "Segurança da Conta",
      descricao: "Avisos sobre login, senha e alterações importantes",
      email: true,
      whatsapp: true,
      icon: <Shield size={20} />,
      color: "text-emerald-500",
    },
  ]);

  // Filtrar configurações baseado no tipo de usuário
  const filteredSettings = settings.filter(setting => {
    if (setting.apenasAnfitriao && !isAnfitriao) return false;
    if (setting.apenasLocatario && !isLocatario) return false;
    return true;
  });

  // Carregar configurações do usuário do banco
  useEffect(() => {
    if (user?.id) {
      loadUserSettings();
    }
  }, [user]);

  const loadUserSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("user_notificacoes_settings")
        .select("*")
        .eq("user_id", user?.id);

      if (error && error.code !== "PGRST116") {
        console.error("Erro ao carregar configurações:", error);
        return;
      }

      if (data && data.length > 0) {
        const newSettings = filteredSettings.map(setting => {
          const saved = data.find(s => s.tipo === setting.tipo);
          if (saved) {
            return {
              ...setting,
              email: saved.email ?? setting.email,
              whatsapp: saved.whatsapp ?? setting.whatsapp,
            };
          }
          return setting;
        });
        setSettings(newSettings);
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const handleToggle = (id: string, channel: "email" | "whatsapp") => {
    setSettings(prev =>
      prev.map(setting =>
        setting.id === id
          ? { ...setting, [channel]: !setting[channel] }
          : setting
      )
    );
  };

  const handleSalvar = async () => {
    if (!user?.id) {
      toast.error("Usuário não autenticado");
      return;
    }

    try {
      for (const setting of filteredSettings) {
        const { error } = await supabase
          .from("user_notificacoes_settings")
          .upsert({
            user_id: user.id,
            tipo: setting.tipo,
            email: setting.email,
            whatsapp: setting.whatsapp,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id, tipo'
          });

        if (error) {
          console.error("Erro ao salvar:", error);
          toast.error("Erro ao salvar configurações");
          return;
        }
      }

      toast.success("Preferências salvas com sucesso!");
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao salvar preferências");
    }
  };

  const getActiveChannelsCount = (setting: NotificationSetting) => {
    let count = 0;
    if (setting.email) count++;
    if (setting.whatsapp) count++;
    return count;
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
                  Preferências da Conta
                </h1>
                <p className="text-sky-100 text-sm md:text-base">
                  Gerencie suas configurações de tema e notificações
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


        {/* Tema - Card redesenhado */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-sky-100 dark:bg-sky-900/30 rounded-xl">
              <Moon size={22} className="text-sky-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Aparência</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Escolha o tema que prefere</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setTema("claro")}
              className={`flex-1 flex items-center justify-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                tema === "claro"
                  ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400"
                  : "border-gray-200 dark:border-gray-700 hover:border-sky-200 dark:hover:border-sky-800"
              }`}
            >
              <Sun size={20} />
              <span className="font-medium">Claro</span>
              {tema === "claro" && <Check size={16} className="ml-auto text-sky-500" />}
            </button>
            <button
              onClick={() => setTema("escuro")}
              className={`flex-1 flex items-center justify-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                tema === "escuro"
                  ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400"
                  : "border-gray-200 dark:border-gray-700 hover:border-sky-200 dark:hover:border-sky-800"
              }`}
            >
              <Moon size={20} />
              <span className="font-medium">Escuro</span>
              {tema === "escuro" && <Check size={16} className="ml-auto text-sky-500" />}
            </button>
          </div>
        </div>

        {/* Notificações - Cards redesenhados */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-100 dark:bg-sky-900/30 rounded-xl">
                  <Bell size={22} className="text-sky-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notificações</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {isAnfitriao ? "Como anfitrião, você recebe alertas sobre seus espaços" : "Como locatário, você recebe alertas sobre suas reservas"}
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1"><Mail size={12} /> Email</span>
                <span className="flex items-center gap-1"><MessageCircle size={12} /> WhatsApp</span>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredSettings.map((setting) => (
              <div
                key={setting.id}
                className="p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-2 rounded-xl bg-gray-100 dark:bg-gray-700 ${setting.color}`}>
                      {setting.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {setting.titulo}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {setting.descricao}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-400">
                          {getActiveChannelsCount(setting)} de 2 canais ativos
                        </span>
                        <div className="flex gap-1">
                          {setting.email && <Mail size={12} className="text-sky-500" />}
                          {setting.whatsapp && <MessageCircle size={12} className="text-green-500" />}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Toggles redesenhados */}
                  <div className="flex items-center gap-4 ml-12 md:ml-0">
                    {/* Email Toggle */}
                    <label className="flex flex-col items-center gap-1 cursor-pointer group/toggle">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={setting.email}
                          onChange={() => handleToggle(setting.id, "email")}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-6 bg-gray-200 dark:bg-gray-600 rounded-full peer peer-checked:bg-sky-500 transition-all duration-300"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-4"></div>
                      </div>
                      <Mail size={14} className={`${setting.email ? "text-sky-500" : "text-gray-400"} transition-colors`} />
                      <span className="text-xs text-gray-500 hidden sm:inline">Email</span>
                    </label>

                    {/* WhatsApp Toggle */}
                    <label className="flex flex-col items-center gap-1 cursor-pointer group/toggle">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={setting.whatsapp}
                          onChange={() => handleToggle(setting.id, "whatsapp")}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-6 bg-gray-200 dark:bg-gray-600 rounded-full peer peer-checked:bg-green-500 transition-all duration-300"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-4"></div>
                      </div>
                      <MessageCircle size={14} className={`${setting.whatsapp ? "text-green-500" : "text-gray-400"} transition-colors`} />
                      <span className="text-xs text-gray-500 hidden sm:inline">WhatsApp</span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

 {/* ========== SEGURANÇA DA CONTA - Card redesenhado ========== */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mt-6">
          <Link href="/locatario/seguranca">
            <div className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
                    <Shield size={22} className="text-red-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Segurança da Conta</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Senha, autenticação em duas etapas e dispositivos conectados
                    </p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </div>
            </div>
          </Link>
        </div>

        {/* Botão Salvar - redesenhado */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSalvar}
            className="group relative overflow-hidden bg-gradient-to-r from-sky-500 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Check size={18} />
              Salvar Preferências
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </div>
  );
}