"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [linkEnviado, setLinkEnviado] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(0);

  // Timer de reenviar link
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (tempoRestante > 0) {
      timer = setTimeout(() => setTempoRestante(tempoRestante - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [tempoRestante]);

  const handleEnviarLink = () => {
    if (!email) return toast.error("Digite seu e-mail");

    // Aqui você chamaria a API de envio de link
    setLinkEnviado(true);
    setTempoRestante(30); // bloqueia 30s antes de reenviar
  };

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
          />

          <button
            onClick={handleEnviarLink}
            disabled={tempoRestante > 0}
            className={`w-full py-2 rounded-lg text-white transition mt-4 ${
              tempoRestante > 0
                ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                : "bg-[#02b0f0] hover:bg-[#0292cb]"
            }`}
          >
            {tempoRestante > 0
              ? `Reenviar link em ${tempoRestante}s`
              : "Enviar link de redefinição"}
          </button>

          {linkEnviado && (
            <>
              <p className="text-[#02b0f0] dark:text-sky-400 text-sm text-center mt-4">
                Link enviado! Verifique seu e-mail.
              </p>

              <div className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
                Não recebeu o e-mail? Você também pode entrar em contato com o suporte:
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