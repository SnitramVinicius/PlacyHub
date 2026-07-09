import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "react-datepicker/dist/react-datepicker.css";
import { AuthProvider } from "@/context/AuthContext";
import NavbarWrapper from "@/components/NavbarWrapper";
import MobileTopBar from "@/components/MobileTopBar";
import { Toaster } from "sonner";
import { FavoritosProvider } from "@/context/FavoritosContext";
import { TemaProvider } from "@/context/TemaContext";
import HelpButton from "@/components/HelpButton";
import { Suspense } from "react";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PlacyHub",
  description: "Encontre e alugue espaços para festas e eventos.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "manifest",
        url: "/site.webmanifest",
      },
      {
        rel: "icon",
        url: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
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
        <AuthProvider>
          <TemaProvider>
            <FavoritosProvider>
              <Suspense fallback={null}>
                <NavbarWrapper />
              </Suspense>
              
              <MobileTopBar />
               <ReactQueryProvider>
              {children}
              </ReactQueryProvider>
              <Toaster />
              <HelpButton />
            </FavoritosProvider>
          </TemaProvider>
        </AuthProvider>
      </body>
    </html>
  );
}