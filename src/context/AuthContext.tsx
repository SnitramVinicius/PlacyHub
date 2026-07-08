"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { Role } from "@/types/role";
import crypto from 'crypto';

/**
 * ===============================
 * TYPES
 * ===============================
 */
interface User {
  id?: string;
  name: string;
  email?: string;

  roles: Role[];

  is_admin?: boolean;

  telefone?: string;
  cidade?: string;
  estado?: string;
  cpf?: string;
  fotoUrl?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (novosDados: Partial<User>) => void;
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
   * CARREGAR USUÁRIO DO STORAGE
   * ===============================
   */
  const refreshUser = () => {
    const raw = localStorage.getItem("placyhub_user_dev");
    if (!raw) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const parsedUser = JSON.parse(raw);
      setUser(parsedUser);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * ===============================
   * BOOTSTRAP - Carrega usuário e favoritos
   * ===============================
   */
  useEffect(() => {
    refreshUser();
    
    // Carregar favoritos
    const saved = localStorage.getItem("placyhub_favoritos");
    if (saved) {
      setFavoritos(JSON.parse(saved));
    }
  }, []);

  /**
   * ===============================
   * SALVAR FAVORITOS
   * ===============================
   */
  useEffect(() => {
    localStorage.setItem("placyhub_favoritos", JSON.stringify(favoritos));
  }, [favoritos]);

  /**
   * ===============================
   * LOGIN COM SUPABASE
   * ===============================
   */
  const login = async (email: string, senha: string): Promise<boolean> => {
    setLoading(true);

    try {
      const { data, error } = await supabase
  .from("users")
 .select(`
    id,
    email,
    name,
    telefone,
    cidade,
    estado,
    cpf,
    foto_url,
    senha,
    roles,
    is_admin
  `)
  .eq("email", email)
  .maybeSingle();

      if (error || !data) {
        console.error("Erro ao buscar usuário:", error);
        toast.error("E-mail ou senha incorretos");
        setLoading(false);
        return false;
      }

     const senhaHash = crypto.createHash('sha256').update(senha).digest('hex');
const senhaCorreta = data.senha === senhaHash;

if (!senhaCorreta) {
  toast.error("E-mail ou senha incorretos");
  setLoading(false);
  return false;
}

      const userData: User = {
  id: data.id,
  name: data.name,
  email: data.email,

  roles: data.roles ?? ["LOCATARIO"],

  is_admin: data.is_admin,

  telefone: data.telefone,
  cidade: data.cidade,
  estado: data.estado,
  cpf: data.cpf,
  fotoUrl: data.foto_url,
};
      setUser(userData);
      localStorage.setItem("placyhub_user_dev", JSON.stringify(userData));

try {
  const response = await fetch("/api/security/register-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionToken: `manual_${Date.now()}`,
      userAgent: navigator.userAgent,
      ipAddress: "",
      userId: userData.id,  // 🔥 Enviar o userId manualmente
    }),
  });
  const result = await response.json();
} catch (sessionError) {
  console.error("❌ Erro ao registrar sessão:", sessionError);
}

      toast.success(`Bem-vindo, ${userData.name}!`);
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Erro no login:", err);
      toast.error("Erro ao fazer login");
      setLoading(false);
      return false;
    }
  };

  /**
   * ===============================
   * LOGOUT
   * ===============================
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("placyhub_user_dev");
    toast.success("Logout realizado com sucesso!");
  };

  /**
   * ===============================
   * VIRAR ANFITRIÃO
   * ===============================
   */
  const virarAnfitriao = async (cpf: string) => {
    if (!user || !user.id) {
      toast.error("Usuário não autenticado");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from("users")
       .update({
    cpf,
    roles: ["LOCATARIO", "ANFITRIAO"],
    is_anfitriao: true // pode manter por compatibilidade
})
        .eq("id", user.id);

      if (error) {
        console.error("Erro ao virar anfitrião:", error);
        toast.error("Erro ao atualizar perfil");
        setLoading(false);
        return;
      }

      const updatedUser: User = {
        ...user,
        cpf,
        roles: Array.from(new Set([...user.roles, "ANFITRIAO"])),
      };

      setUser(updatedUser);
      localStorage.setItem("placyhub_user_dev", JSON.stringify(updatedUser));
      toast.success("Agora você é um anfitrião!");
    } catch (err) {
      console.error("Erro:", err);
      toast.error("Erro ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  /**
   * ===============================
   * ATUALIZAR USUÁRIO
   * ===============================
   */
  const updateUser = (novosDados: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...novosDados };
    setUser(updatedUser);
    localStorage.setItem("placyhub_user_dev", JSON.stringify(updatedUser));
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
   * DERIVADOS
   * ===============================
   */
  const isAnfitriao = !!user?.roles?.includes("ANFITRIAO");
  const isLocatario = !!user?.roles?.includes("LOCATARIO");

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateUser,
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