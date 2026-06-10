import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "react-datepicker/dist/react-datepicker.css";
import { AuthProvider } from "@/context/AuthContext";
import NavbarWrapper from "@/components/NavbarWrapper";
import { Toaster } from "sonner";
import { FavoritosProvider } from "@/context/FavoritosContext";
import { TemaProvider } from "@/context/TemaContext";
import HelpButton from "@/components/HelpButton";
import { Suspense } from "react";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PlacyHub",
  description: "Encontre e alugue espaços para festas e eventos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const tema = localStorage.getItem("tema");
                if (tema === "escuro") {
                  document.documentElement.classList.add("dark");
                }
              })();
            `,
          }}
        />
      </head>

      <body>
        <TemaProvider>
          <AuthProvider>
            <FavoritosProvider>
              <Suspense fallback={null}>
  <NavbarWrapper />
</Suspense>
              {children}
              <Toaster />
              <HelpButton />
            </FavoritosProvider>
          </AuthProvider>
        </TemaProvider>
      </body>
    </html>
  );
}