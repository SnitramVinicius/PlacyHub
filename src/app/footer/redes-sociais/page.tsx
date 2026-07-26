"use client";

import { Instagram, Facebook, ArrowLeft, Heart, Share2, Users, Linkedin, Youtube, Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function RedesSociais() {
  const [copiando, setCopiando] = useState(false);

  const handleCompartilhar = async () => {
    const url = window.location.origin;
    const texto = "🏠 PlacyHub - Encontre espaços incríveis para seus eventos!";
    
    // Verificar se o navegador suporta a API de compartilhamento
    if (navigator.share) {
      try {
        await navigator.share({
          title: "PlacyHub",
          text: texto,
          url: url,
        });
        toast.success("Obrigado por compartilhar!");
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          toast.error("Erro ao compartilhar");
        }
      }
    } else {
      // Fallback: copiar link para clipboard
      try {
        await navigator.clipboard.writeText(`${texto}\n${url}`);
        setCopiando(true);
        toast.success("Link copiado! Compartilhe com seus amigos 📋");
        setTimeout(() => setCopiando(false), 3000);
      } catch {
        toast.error("Não foi possível copiar o link");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      
      {/* Header com logo e botão voltar */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-gray-300 dark:hover:border-slate-600 hover:text-gray-700 dark:hover:text-gray-200 hover:shadow-sm transition-all duration-300 group"
            aria-label="Voltar"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform duration-300" />
          </Link>
          
          <Link href="/">
            <img src="/placyhub.png" alt="PlacyHub Logo" className="h-10 w-auto" />
          </Link>
          
          <div className="w-10"></div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 text-center py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Redes Sociais
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Conecte-se com o PlacyHub e acompanhe novidades, dicas, conteúdos 
          exclusivos e inspirações para elevar seus anúncios e experiências.
        </p>
      </div>

      {/* Grid de Redes Sociais */}
      <div className="max-w-4xl mx-auto px-4 py-12 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Instagram */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 hover:shadow-md transition-all group text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Instagram size={40} className="text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              Instagram
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Bastidores, novidades e inspirações.
            </p>
            <a 
              href="https://www.instagram.com/placyhub?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl font-medium hover:opacity-90 transition"
            >
              @placyhub
            </a>
          </div>

          {/* Facebook */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 hover:shadow-md transition-all group text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Facebook size={40} className="text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              Facebook
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Comunidade, interação e novidades.
            </p>
            <a 
              href="https://www.facebook.com/profile.php?id=61592029727623" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
            >
              facebook.com/placyhub
            </a>
          </div>

        </div>


        {/* CTA Compartilhar - COM FUNÇÃO */}
        <div className="mt-8 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Share2 size={24} className="text-sky-500" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Compartilhe o PlacyHub</h3>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Ajude outros a encontrar espaços incríveis compartilhando nossa plataforma!
            </p>
            <button
              onClick={handleCompartilhar}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-medium hover:from-sky-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {copiando ? (
                <>
                  <Check size={18} />
                  Link copiado!
                </>
              ) : (
                <>
                  <Share2 size={18} />
                  Compartilhar agora
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}