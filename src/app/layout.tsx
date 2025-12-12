import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import NavbarWrapper from "@/components/NavbarWrapper";
import { Toaster } from "react-hot-toast";
import { FavoritosProvider } from "@/context/FavoritosContext";
import { TemaProvider } from "@/context/TemaContext";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PlacyHub",
  description: "Encontre e alugue espaços para festas e eventos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
<TemaProvider>
  <body>
    <AuthProvider>
      <FavoritosProvider>
        <NavbarWrapper />
        {children}
        <Toaster />
      </FavoritosProvider>
    </AuthProvider>
  </body>
</TemaProvider>
    </html>
  );
}
