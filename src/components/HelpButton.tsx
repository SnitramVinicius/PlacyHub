"use client";

import { useState } from "react";
import { MessageCircle, Bug } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingHelpButton() {
  const [open, setOpen] = useState(false);

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
                onClick={() =>
                  window.location.href =
                    "mailto:support@placyhub.com?subject=Bug%20no%20site"
                }
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-xl shadow-lg transition"
              >
                <Bug size={18} /> Reportar Bug
              </button>

              <button
                onClick={() =>
                  window.location.href =
                    "mailto:support@placyhub.com?subject=Suporte%20PlacyHub"
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
    </>
  );
}
