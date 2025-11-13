"use client";

import { useState, useEffect } from "react";
import Navbar2 from "@/components/navbar2";

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
    if (!email) return alert("Digite seu e-mail");

    // Aqui você chamaria a API de envio de link
    setLinkEnviado(true);
    setTempoRestante(30); // bloqueia 30s antes de reenviar
  };

  return (
    <>


      <section className="flex justify-center items-center min-h-screen px-4 bg-white">
        <div className="bg-white shadow-md rounded-2xl p-10 w-full max-w-md flex flex-col gap-6">
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            Recuperar Senha
          </h1>

          <p className="text-sm text-gray-500 text-center">
            Insira o e-mail cadastrado para receber o link de redefinição.
          </p>

          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#02b0f0] w-full"
          />

          <button
            onClick={handleEnviarLink}
            disabled={tempoRestante > 0}
            className={`w-full py-2 rounded-lg text-white transition ${
              tempoRestante > 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#02b0f0] hover:bg-[#0292cb]"
            }`}
          >
            {tempoRestante > 0
              ? `Reenviar link em ${tempoRestante}s`
              : "Enviar link de redefinição"}
          </button>

          {linkEnviado && (
            <>
              <p className="text-[#02b0f0] text-sm text-center">
                Link enviado! Verifique seu e-mail.
              </p>

              <div className="text-sm text-gray-600 mt-4 text-center">
                Não recebeu o e-mail? Você também pode entrar em contato com o suporte:
                <ul className="list-disc list-inside mt-2 text-gray-700">
                  <li>
                    E-mail:{" "}
                    <a
                      href="mailto:suporte@placyhub.com"
                      className="text-[#02b0f0] hover:underline"
                    >
                      suporte@placyhub.com
                    </a>
                  </li>
                  <li>
                    WhatsApp:{" "}
                    <a
                      href="https://wa.me/5567999999999?text=Ol%C3%A1%2C%20preciso%20de%20suporte%20para%20recuperar%20minha%20senha"
                      target="_blank"
                      className="text-[#02b0f0] hover:underline"
                    >
                      Suporte via WhatsApp
                    </a>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
