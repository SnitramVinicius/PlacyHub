"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Moon, Sun, Bell, Mail, Check, Shield, ChevronRight } from "lucide-react";
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
}

export default function PreferenciasGerais() {
  const { tema, setTema } = useTema();
  const { user } = useAuth();
  
  // Apenas 3 opções principais de notificação
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: "reservas",
      tipo: "reservas",
      titulo: "Reservas",
      descricao: "Confirmações, cancelamentos e alterações nas reservas",
      email: true,
    },
    {
      id: "pagamentos",
      tipo: "pagamentos",
      titulo: "Pagamentos",
      descricao: "Status de pagamentos, recibos e repasses",
      email: true,
    },
    {
      id: "promocoes",
      tipo: "promocoes",
      titulo: "Novidades e Ofertas",
      descricao: "Promoções, novidades e conteúdos exclusivos",
      email: false,
    },
  ]);

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
        const newSettings = settings.map(setting => {
          const saved = data.find(s => s.tipo === setting.tipo);
          if (saved) {
            return {
              ...setting,
              email: saved.email ?? setting.email,
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

  const handleToggle = (id: string) => {
    setSettings(prev =>
      prev.map(setting =>
        setting.id === id
          ? { ...setting, email: !setting.email }
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
      for (const setting of settings) {
        const { error } = await supabase
          .from("user_notificacoes_settings")
          .upsert({
            user_id: user.id,
            tipo: setting.tipo,
            email: setting.email,
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <div className="relative mb-8 overflow-hidden bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl shadow-lg">
          <div className="relative p-6 md:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Preferências
                </h1>
                <p className="text-sky-100 text-sm mt-1">
                  Gerencie seu tema e notificações
                </p>
              </div>
              <Link
                href="/locatario/perfil"
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition flex items-center justify-center"
              >
                <ArrowLeft size={20} />
              </Link>
            </div>
          </div>
        </div>

        {/* Tema */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-sky-100 dark:bg-sky-900/30 rounded-xl">
              <Moon size={20} className="text-sky-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tema</h2>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setTema("claro")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                tema === "claro"
                  ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20 text-sky-600"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
              }`}
            >
              <Sun size={18} />
              <span>Claro</span>
              {tema === "claro" && <Check size={14} className="text-sky-500" />}
            </button>
            <button
              onClick={() => setTema("escuro")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                tema === "escuro"
                  ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20 text-sky-600"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
              }`}
            >
              <Moon size={18} />
              <span>Escuro</span>
              {tema === "escuro" && <Check size={14} className="text-sky-500" />}
            </button>
          </div>
        </div>

        {/* Notificações - Simplificadas */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-100 dark:bg-sky-900/30 rounded-xl">
                <Bell size={20} className="text-sky-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notificações</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receba por email</p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {settings.map((setting) => (
              <div
                key={setting.id}
                className="p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {setting.titulo}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {setting.descricao}
                    </p>
                  </div>

                  {/* Toggle simplificado */}
                  <label className="relative inline-flex items-center cursor-pointer ml-4 flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={setting.email}
                      onChange={() => handleToggle(setting.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 rounded-full peer peer-checked:bg-sky-500 transition-all duration-300"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-5"></div>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Segurança */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mt-6">
          <Link href="/locatario/seguranca">
            <div className="p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
                    <Shield size={20} className="text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Segurança da Conta</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Senha e autenticação</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
              </div>
            </div>
          </Link>
        </div>
        {/* Botão Salvar */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSalvar}
            className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-3 rounded-xl font-semibold transition"
          >
            Salvar Preferências
          </button>
        </div>
      </div>
    </div>
  );
}