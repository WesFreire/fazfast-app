"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Usuario, ClientePerfil, ProfissionalPerfil } from "@/types/types";
import { setCookie, destroyCookie, parseCookies } from "nookies"; 

interface AuthContextType {
  user: Usuario | null;
  roleData: ClientePerfil | ProfissionalPerfil | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (tokenData: { access: string; refresh: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [roleData, setRoleData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Função auxiliar para buscar dados do usuário
  async function fetchUserProfile(token: string) {
    try {
      const response = await fetch("http://localhost:8000/api/me/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        // Assume que o Backend retorna { user: {...}, role_data: {...} } conforme ajustamos na etapa anterior
        setUser(data.user);
        setRoleData(data.role_data);
      } else {
        logout(); // Token inválido
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // 1. Verificar login ao carregar a página
  useEffect(() => {
    const { "access": token } = parseCookies();

    if (token) {
      fetchUserProfile(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  // 2. Função de Login (chamada pelo formulário)
  async function login(tokenData: { access: string; refresh: string }) {
    setCookie(null, "access", tokenData.access, {
      maxAge: 30 * 24 * 60 * 60, // 30 dias
      path: "/",
    });
    setCookie(null, "refresh", tokenData.refresh, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    await fetchUserProfile(tokenData.access);
  }

  // 3. Função de Logout
  function logout() {
    destroyCookie(null, "access");
    destroyCookie(null, "refresh");
    setUser(null);
    setRoleData(null);
    router.push("/");
  }

  return (
    <AuthContext.Provider value={{ user, roleData, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// O Hook personalizado
export function useAuth() {
  return useContext(AuthContext);
}