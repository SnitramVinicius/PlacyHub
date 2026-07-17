"use client";

import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [linkEnviado, setLinkEnviado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(0);


  const handleEnviarLink = async () => {
  if (!email) {
    toast.error("Digite seu e-mail");
    return;
  }

  setLoading(true);

  try {
const { error } = await supabase.auth.resetPasswordForEmail(
  email,
  {
    redirectTo: `${window.location.origin}/reset-password`,
  }
);


    if (error) {
      console.error(error);
      toast.error(error.message);
      return;
    }


    setLinkEnviado(true);
    setTempoRestante(30);


    const timer = setInterval(() => {
      setTempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);


    toast.success(
      "Link enviado! Verifique seu e-mail."
    );


  } catch (error) {

    console.error(error);
    toast.error("Erro ao enviar link");

  } finally {

    setLoading(false);

  }
};
  // const handleEnviarLink = async () => {
  //   if (!email) {
  //     toast.error("Digite seu e-mail");
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     const response = await fetch("/api/auth/forgot-password", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email }),
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       setLinkEnviado(true);
  //       setTempoRestante(30); // bloqueia 30s antes de reenviar
        
  //       // Iniciar timer
  //       const timer = setInterval(() => {
  //         setTempoRestante(prev => {
  //           if (prev <= 1) {
  //             clearInterval(timer);
  //             return 0;
  //           }
  //           return prev - 1;
  //         });
  //       }, 1000);
        
  //       toast.success(data.message || "Link enviado! Verifique seu e-mail.");
  //     } else {
  //       toast.error(data.error || "Erro ao enviar link");
  //     }
  //   } catch (error) {
  //     toast.error("Erro de conexão");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Botão Voltar para Login */}
      <div className="pt-6 px-4">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 
            hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-lg transition"
        >
          <ArrowLeft size={20} />
          <span>Voltar para o login</span>
        </Link>
      </div>

      {/* Container centralizado */}
      <div className="flex-1 flex justify-center items-center px-4">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 sm:p-8 md:p-10 w-full max-w-md">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 text-center mb-2">
            Recuperar Senha
          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
            Insira o e-mail cadastrado para receber o link de redefinição.
          </p>

          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 
              focus:outline-none focus:border-[#02b0f0] focus:ring-2 focus:ring-[#02b0f0]/20
              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-full"
            disabled={loading}
          />

          <button
            onClick={handleEnviarLink}
            disabled={tempoRestante > 0 || loading}
            className={`w-full py-2 rounded-lg text-white transition mt-4 flex items-center justify-center gap-2
              ${tempoRestante > 0 || loading
                ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                : "bg-[#02b0f0] hover:bg-[#0292cb]"
              }`}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Enviando...
              </>
            ) : tempoRestante > 0 ? (
              `Reenviar link em ${tempoRestante}s`
            ) : (
              "Enviar link de redefinição"
            )}
          </button>

          {linkEnviado && (
            <>
              <p className="text-[#02b0f0] dark:text-sky-400 text-sm text-center mt-4">
                Link enviado! Verifique seu e-mail.
              </p>

              <div className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
                Não recebeu o e-mail? Verifique sua caixa de spam ou entre em contato com o suporte:
                <ul className="list-disc list-inside mt-2 text-gray-700 dark:text-gray-300">
                  <li>
                    E-mail:{" "}
                    <a
                      href="mailto:suporte@placyhub.com"
                      className="text-[#02b0f0] dark:text-sky-400 hover:underline"
                    >
                      suporte@placyhub.com
                    </a>
                  </li>
                  <li>
                    WhatsApp:{" "}
                    <a
                      href="https://wa.me/5567999999999?text=Ol%C3%A1%2C%20preciso%20de%20suporte%20para%20recuperar%20minha%20senha"
                      target="_blank"
                      className="text-[#02b0f0] dark:text-sky-400 hover:underline"
                    >
                      Suporte via WhatsApp
                    </a>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}