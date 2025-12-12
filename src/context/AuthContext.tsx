"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface User {
  name: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  favoritos: string[];
  toggleFavorito: (id: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  favoritos: [],
  toggleFavorito: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // FAVORITOS
  const [favoritos, setFavoritos] = useState<string[]>([]);

  // Carregar do localStorage ao iniciar
  useEffect(() => {
    const saved = localStorage.getItem("placyhub_favoritos");
    if (saved) setFavoritos(JSON.parse(saved));
  }, []);

  // Salvar no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem("placyhub_favoritos", JSON.stringify(favoritos));
  }, [favoritos]);

  const login = (userData: User) => setUser(userData);
  const logout = () => setUser(null);

  const toggleFavorito = (id: string) => {
    setFavoritos((prev) =>
      prev.includes(id)
        ? prev.filter((f) => f !== id) // remove
        : [...prev, id] // adiciona
    );
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, favoritos, toggleFavorito }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
