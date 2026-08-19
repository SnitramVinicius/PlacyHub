import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LEGAL_LAST_UPDATED, LegalContent } from "@/components/legal/LegalContent";

export default function PoliticaPrivacidade() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="Voltar para a página inicial" className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition hover:text-gray-700 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-400"><ArrowLeft size={18} aria-hidden="true" /></Link>
          <Link href="/" aria-label="PlacyHub — página inicial"><Image src="/placyhub.png" alt="PlacyHub" width={160} height={40} className="h-10 w-auto" priority /></Link>
          <div className="w-10" aria-hidden="true" />
        </div>
      </header>
      <header className="mx-auto max-w-4xl px-4 py-10 text-center md:py-14">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">Política de Privacidade</h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">Saiba quais dados a PlacyHub trata, por que eles são necessários e como exercer seus direitos.</p>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Última atualização: {LEGAL_LAST_UPDATED}</p>
      </header>
      <div className="mx-auto max-w-4xl px-4 pb-20"><LegalContent type="privacidade" /></div>
    </main>
  );
}
