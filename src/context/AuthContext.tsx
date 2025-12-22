"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import type { Role } from "@/types/role";

interface User {
  name: string;
  email?: string;
  roles: Role[];
  telefone?: string;
  cidade?: string;
  estado?: string;
}

interface AuthContextType {
  user: User | null;

  login: (userData: User) => void;
  logout: () => void;

  // FAVORITOS (frontend-only, permitido)
  favoritos: string[];
  toggleFavorito: (id: string) => void;

  // USUÁRIO
  virarAnfitriao: () => Promise<void>;
  isAnfitriao: boolean;
  isLocatario: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [favoritos, setFavoritos] = useState<string[]>([]);

  /**
   * ===============================
   * BOOTSTRAP DO USUÁRIO (BACKEND)
   * ===============================
   * Fonte principal da verdade
   */
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");

        if (res.ok) {
          const data = await res.json();

          if (data.user) {
            setUser(data.user);

            // 🔴 TEMPORÁRIO (DEV)
            // REMOVER quando login + JWT + cookie estiverem 100%
            localStorage.setItem(
              "placyhub_user_dev",
              JSON.stringify(data.user)
            );

            return;
          }
        }

        /**
         * 🔴 FALLBACK TEMPORÁRIO (DEV ONLY)
         * USADO APENAS enquanto backend não está finalizado
         * ❌ REMOVER quando o backend estiver pronto
         */
        const localUser = localStorage.getItem("placyhub_user_dev");
        if (localUser) {
          setUser(JSON.parse(localUser));
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    }

    loadUser();
  }, []);

  /**
   * ===============================
   * FAVORITOS (PODE usar localStorage)
   * ===============================
   */
  useEffect(() => {
    const savedFavoritos = localStorage.getItem("placyhub_favoritos");
    if (savedFavoritos) {
      setFavoritos(JSON.parse(savedFavoritos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("placyhub_favoritos", JSON.stringify(favoritos));
  }, [favoritos]);

  /**
   * ===============================
   * AUTH ACTIONS
   * ===============================
   */

  /**
   * Login
   * Backend futuramente cria o cookie JWT
   */
  const login = (userData: User) => {
    setUser(userData);

    // 🔴 TEMPORÁRIO (DEV ONLY)
    // REMOVER quando backend estiver pronto
    localStorage.setItem(
      "placyhub_user_dev",
      JSON.stringify(userData)
    );
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });

    setUser(null);

    // 🔴 TEMPORÁRIO (DEV ONLY)
    // REMOVER quando backend estiver pronto
    localStorage.removeItem("placyhub_user_dev");
  };

  /**
   * ===============================
   * VIRAR ANFITRIÃO
   * ===============================
   */
  const virarAnfitriao = async () => {
    await fetch("/api/auth/virar-anfitriao", { method: "POST" });

    const res = await fetch("/api/auth/me");
    const data = await res.json();

    if (data.user) {
      setUser(data.user);

      // 🔴 TEMPORÁRIO (DEV ONLY)
      localStorage.setItem(
        "placyhub_user_dev",
        JSON.stringify(data.user)
      );
    }
  };

  /**
   * ===============================
   * FAVORITOS
   * ===============================
   */
  const toggleFavorito = (id: string) => {
    setFavoritos((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  /**
   * ===============================
   * DERIVADOS (UX)
   * ===============================
   */
  const isAnfitriao = !!user?.roles.includes("ANFITRIAO");
  const isLocatario = !!user?.roles.includes("LOCATARIO");

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        favoritos,
        toggleFavorito,
        virarAnfitriao,
        isAnfitriao,
        isLocatario,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
