"use client";

import { useEffect, useState } from "react";
import { Instagram, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

const DISMISSED_STORAGE_KEY = "placyhub_instagram_invite_seen";
const INSTAGRAM_URL =
  "https://www.instagram.com/placyhub?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";

export default function InstagramInviteModal() {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (loading || user || localStorage.getItem(DISMISSED_STORAGE_KEY)) {
      return;
    }

    const timeout = window.setTimeout(() => setOpen(true), 800);
    return () => window.clearTimeout(timeout);
  }, [loading, user]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      localStorage.setItem(DISMISSED_STORAGE_KEY, "true");
    }
  };

  const handleInstagramClick = () => {
    localStorage.setItem(DISMISSED_STORAGE_KEY, "true");
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-md overflow-hidden border-0 bg-white p-0 text-center dark:bg-gray-900"
      >
        <button
          type="button"
          onClick={() => handleOpenChange(false)}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
          aria-label="Fechar convite"
        >
          <X size={20} />
        </button>

        <div className="bg-gradient-to-br from-fuchsia-600 via-rose-500 to-amber-400 px-6 pb-8 pt-10 text-white">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 shadow-lg backdrop-blur-sm">
            <Instagram size={34} aria-hidden="true" />
          </div>
        </div>

        <div className="px-6 pb-7 pt-6">
          <DialogTitle className="text-xl font-bold leading-snug text-gray-900 dark:text-white">
            Vai planejar uma festa? Lembre da PlacyHub para encontrar o espaço ideal.
          </DialogTitle>
          <DialogDescription className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
            Siga nosso Instagram e receba inspirações, novidades e espaços para o seu próximo evento.
          </DialogDescription>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            onClick={handleInstagramClick}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-fuchsia-600 to-rose-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-fuchsia-700 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
          >
            <Instagram size={19} aria-hidden="true" />
            Seguir @placyhub
          </a>

          <button
            type="button"
            onClick={() => handleOpenChange(false)}
            className="mt-3 text-sm font-medium text-gray-500 transition hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Agora não
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
