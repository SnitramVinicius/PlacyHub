"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

function ResetPasswordContent() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

 useEffect(() => {

  const verificarRecuperacao = async () => {

    const {
      data: {
        session
      }
    } = await supabase.auth.getSession();


    if(!session){
      setError("Link inválido ou expirado");
      return;
    }

  };


  verificarRecuperacao();


}, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError("");
    
    if (!newPassword || !confirmPassword) {
      setError("Preencha todos os campos");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }
    
    if (newPassword.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres");
      return;
    }
    
    setLoading(true);
    
    try {

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });


  if(error){
    setError(error.message);
    return;
  }


  setSuccess(true);

  toast.success("Senha alterada com sucesso!");


  setTimeout(() => {
    router.push("/login");
  },3000);


} catch(error){

  setError("Erro ao alterar senha");

} finally {

  setLoading(false);

}
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Senha alterada! ✅
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Sua senha foi alterada com sucesso. Você será redirecionado para o login.
          </p>
          <Link
            href="/login"
            className="inline-block bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Ir para o login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        {/* Botão voltar */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-6 transition"
        >
          <ArrowLeft size={18} />
          Voltar para o login
        </Link>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Redefinir Senha
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Digite sua nova senha
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center gap-2">
            <AlertCircle size={16} className="text-red-500" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nova senha
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Digite sua nova senha"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20
                bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirmar nova senha
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme sua nova senha"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20
                bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              disabled={loading}
            />
          </div>

          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-xs text-yellow-800 dark:text-yellow-300 flex items-center gap-2">
              ⚠️ A senha deve ter no mínimo 6 caracteres
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-lg font-semibold transition 
              disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Alterando...
              </>
            ) : (
              "Alterar senha"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}