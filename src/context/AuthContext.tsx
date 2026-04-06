"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import type { Role } from "@/types/role";

/**
 * ===============================
 * TYPES
 * ===============================
 */
interface User {
  name: string;
  email?: string;
  roles: Role[];
  telefone?: string;
  cidade?: string;
  estado?: string;
  cpf?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean; // 🔴 FALTAVA ISSO

  login: (userData: User) => void;
  logout: () => void;

  favoritos: string[];
  toggleFavorito: (id: string) => void;

  virarAnfitriao: (cpf: string) => Promise<void>;
  refreshUser: () => void;

  isAnfitriao: boolean;
  isLocatario: boolean;
}

/**
 * ===============================
 * CONTEXT
 * ===============================
 */
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

/**
 * ===============================
 * PROVIDER
 * ===============================
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [favoritos, setFavoritos] = useState<string[]>([]);

  /**
   * ===============================
   * FONTE ÚNICA DA VERDADE (LOCAL)
   * ===============================
   */
const refreshUser = () => {
  const raw = localStorage.getItem("placyhub_user_dev");
 console.log("REFRESH USER RAW:", raw);
  if (!raw) {
    setUser(null);
    setLoading(false);
    return;
  }

  try {
    setUser(JSON.parse(raw));
  } catch {
    setUser(null);
  } finally {
    setLoading(false);
  }
};

  /**
   * ===============================
   * BOOTSTRAP
   * ===============================
   */
  useEffect(() => {
    refreshUser();
  }, []);

  /**
   * ===============================
   * FAVORITOS
   * ===============================
   */
  useEffect(() => {
    const saved = localStorage.getItem("placyhub_favoritos");
    if (saved) {
      setFavoritos(JSON.parse(saved));
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
   * LOGIN DEV (OBRIGATÓRIO TER ROLES)
   */
  const login = (userData: User) => {
    const normalizedUser: User = {
      ...userData,
      roles: userData.roles?.length
        ? userData.roles
        : ["LOCATARIO"],
    };

    setUser(normalizedUser);
    localStorage.setItem(
      "placyhub_user_dev",
      JSON.stringify(normalizedUser)
    );
  };

  /**
   * LOGOUT DEV
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("placyhub_user_dev");
  };

  /**
   * ===============================
   * VIRAR ANFITRIÃO (LOCAL)
   * ===============================
   */
  const virarAnfitriao = async (cpf: string) => {
    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    const updatedUser: User = {
      ...user,
      cpf,
      roles: Array.from(
        new Set([...user.roles, "ANFITRIAO"])
      ),
    };

    setUser(updatedUser);
    localStorage.setItem(
      "placyhub_user_dev",
      JSON.stringify(updatedUser)
    );
  };

  /**
   * ===============================
   * FAVORITOS
   * ===============================
   */
  const toggleFavorito = (id: string) => {
    setFavoritos((prev) =>
      prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id]
    );
  };

  /**
   * ===============================
   * DERIVADOS (NAVBAR / UX)
   * ===============================
   */
  const isAnfitriao = !!user?.roles?.includes("ANFITRIAO");
  const isLocatario = !!user?.roles?.includes("LOCATARIO");

  return (
 <AuthContext.Provider
  value={{
    user,
    loading, // ✅ ADICIONADO
    login,
    logout,
    favoritos,
    toggleFavorito,
    virarAnfitriao,
    refreshUser,
    isAnfitriao,
    isLocatario,
  }}
>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * ===============================
 * HOOK
 * ===============================
 */
export const useAuth = () => useContext(AuthContext);
