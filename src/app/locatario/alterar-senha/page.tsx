"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, AlertCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
// import { hashPassword, isPasswordReused, savePasswordToHistory } from "@/lib/passwordUtils";

export default function AlterarSenhaPage() {
  const router = useRouter();
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();


  if (!novaSenha || !confirmarSenha) {
    toast.error("Preencha todos os campos");
    return;
  }


  if (novaSenha !== confirmarSenha) {
    toast.error("As senhas não coincidem");
    return;
  }


  const senhaRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  if (!senhaRegex.test(novaSenha)) {
    toast.error(
      "A senha deve ter no mínimo 8 caracteres, uma letra maiúscula e um número"
    );
    return;
  }


  setLoading(true);


  try {

    const {
      data:{user}
    } = await supabase.auth.getUser();


    if(!user){
      toast.error("Usuário não autenticado");
      return;
    }



    const {error} = await supabase.auth.updateUser({
      password: novaSenha
    });


    if(error){
      toast.error(error.message);
      return;
    }


    toast.success("Senha alterada com sucesso!");


    setTimeout(()=>{
      router.push("/locatario/seguranca");
    },1500);



  } catch(error){

    console.error(error);
    toast.error("Erro ao alterar senha");

  } finally{

    setLoading(false);

  }

};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-lg mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <div className="relative mb-8 overflow-hidden bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl shadow-lg">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white mb-2">
                  Alterar Senha
                </h1>
                <p className="text-sky-100 text-sm">
                  Mantenha sua conta segura com uma senha forte
                </p>
              </div>
              <Link
                href="/locatario/seguranca"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300 group"
                aria-label="Voltar"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            

            {/* Nova Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nova senha
              </label>
              <div className="relative">
                <input
                  type={mostrarNovaSenha ? "text" : "password"}
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  placeholder="Digite sua nova senha"
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 pr-10 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
                >
                  {mostrarNovaSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirmar Nova Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirmar nova senha
              </label>
              <div className="relative">
                <input
                  type={mostrarConfirmarSenha ? "text" : "password"}
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  placeholder="Confirme sua nova senha"
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 pr-10 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
                >
                  {mostrarConfirmarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Requisitos da senha */}
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-xs text-yellow-800 dark:text-yellow-300 flex items-center gap-2">
                <AlertCircle size={14} />
                A senha deve ter no mínimo 8 caracteres, uma letra maiúscula e um número.
              </p>
            </div>

            {/* Botão Salvar */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {loading ? (
                "Alterando..."
              ) : (
                <>
                  <Save size={18} />
                  Alterar senha
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}