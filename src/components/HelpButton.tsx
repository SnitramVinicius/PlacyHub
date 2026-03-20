"use client";

import { useState } from "react";
import { MessageCircle, Bug } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingHelpButton() {
  const [open, setOpen] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [descricaoBug, setDescricaoBug] = useState("");

  const enviarBug = () => {
    if (!descricaoBug.trim()) {
      alert("Descreva o problema antes de enviar.");
      return;
    }

    const pagina = window.location.href;
    const navegador = navigator.userAgent;

    const mensagem = `
🐞 Reporte de problema - PlacyHub

Página: ${pagina}
Navegador: ${navegador}

Descrição:
${descricaoBug}

Horário: ${new Date().toLocaleString()}
`;

    const url = `https://wa.me/5567996696791?text=${encodeURIComponent(mensagem)}`;

    window.open(url, "_blank");

    setDescricaoBug("");
    setOpenReport(false);
  };

  return (
    <>
      {/* Botão flutuante */}
      <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 flex flex-col items-end gap-2 sm:gap-3 z-50">

        {/* Botões secundários */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="flex flex-col gap-2 sm:gap-3 items-end"
            >
              <button
                onClick={() => setOpenReport(true)}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 px-3 sm:px-4 rounded-xl shadow-lg text-sm sm:text-base"
              >
                <Bug size={16} /> 
                <span className="hidden sm:inline">Reportar Bug</span>
              </button>

              <button
                onClick={() =>
                  window.location.href =
                    "https://wa.me/5567996696791?text=Olá,%20preciso%20de%20ajuda%20no%20PlacyHub"
                }
                className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white py-2 px-3 sm:px-4 rounded-xl shadow-lg text-sm sm:text-base"
              >
                <MessageCircle size={16} />
                <span className="hidden sm:inline">Suporte</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botão principal */}
        <motion.button
          onClick={() => setOpen(!open)}
          className="bg-sky-500 hover:bg-sky-600 text-white w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-xl flex items-center justify-center"
          animate={{ rotate: open ? 45 : 0 }}
        >
          {open ? (
            <span className="text-xl sm:text-2xl font-bold leading-none">×</span>
          ) : (
            <MessageCircle size={20} />
          )}
        </motion.button>
      </div>

      {/* Modal */}
      {openReport && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-2 sm:px-4">

          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200 dark:border-slate-700">

            <h2 className="text-base sm:text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
              Reportar problema
            </h2>

            <textarea
              value={descricaoBug}
              onChange={(e) => setDescricaoBug(e.target.value)}
              placeholder="Descreva o que aconteceu..."
              className="w-full border border-gray-200 rounded-lg p-3 h-28 sm:h-32 text-sm resize-none"
            />

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Você poderá anexar mídia no WhatsApp.
            </p>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setOpenReport(false)}
                className="px-3 sm:px-4 py-2 text-sm text-gray-600 dark:text-gray-300"
              >
                Cancelar
              </button>

              <button
                onClick={enviarBug}
                className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}