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

  const mensagem = `
🐞 Reporte de problema - PlacyHub

Página: ${pagina}

const navegador = navigator.userAgent;

Descrição:
${descricaoBug}

Horário: ${new Date().toLocaleString()}

Se possível, anexe uma imagem ou vídeo do problema.
`;

  const url = `https://wa.me/5567996696791?text=${encodeURIComponent(mensagem)}`;

  window.open(url, "_blank");

  setDescricaoBug("");
  setOpenReport(false);
};

  return (

    
    <>
      <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-50">
        {/* Botões secundários com animação */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex flex-col gap-3 items-end"
            >
        <button
  onClick={() => setOpenReport(true)}
  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-xl shadow-lg transition"
>
  <Bug size={18} /> Reportar Bug
</button>

              <button
              onClick={() =>
    window.location.href =
      "https://wa.me/5567996696791?text=Olá,%20preciso%20de%20ajuda%20no%20PlacyHub"
  }
                className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded-xl shadow-lg transition"
              >
                <MessageCircle size={18} /> Suporte
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botão principal com animação de rotação */}
        <motion.button
          onClick={() => setOpen(!open)}
          className="bg-sky-500 hover:bg-sky-600 text-white w-16 h-16 rounded-full shadow-xl flex items-center justify-center transition"
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.div
            key={open ? "close" : "open"}
            initial={{ rotate: -45, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 45, opacity: 0 }}
          >
            {open ? <span className="text-2xl font-bold leading-none">×</span> : <MessageCircle size={22} />}
          </motion.div>
        </motion.button>
      </div>

      {openReport && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 w-full max-w-md shadow-xl border border-gray-200 dark:border-slate-700">

      <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
        Reportar problema
      </h2>

      <textarea
        value={descricaoBug}
        onChange={(e) => setDescricaoBug(e.target.value)}
        placeholder="Descreva o que aconteceu..."
        className="w-full border border-gray-200 rounded-lg p-3 h-32 text-sm"
      />

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Se possível, anexe uma imagem ou vídeo do problema após abrir o WhatsApp.
      </p>

      <div className="flex justify-end gap-2 mt-4">

        <button
          onClick={() => setOpenReport(false)}
          className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300"
        >
          Cancelar
        </button>

        <button
          onClick={enviarBug}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
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
