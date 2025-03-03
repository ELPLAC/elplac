// AuthProvider.tsx
"use client";
import { isTokenExpired } from "@/helpers/auth";
import { IAuthContext, IAuthProviderProps } from "@/types";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string>("");
  const [roleAuth, setRoleAuth] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const verifyToken = async () => {
      if (typeof window !== "undefined") {
        const storageToken: string | null = localStorage.getItem("token");
        const storageRole: string | null = localStorage.getItem("role");
        if (storageToken && storageRole) {
          setToken(storageToken);
          setRoleAuth(storageRole);
        }
        setLoading(false);
      }
    };

    verifyToken();
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      if (token && isTokenExpired(token)) {
        logout();
        router.push("/login");
      }
    }, 300000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const logout = () => {
    setRoleAuth("");
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider
      value={{ token, setToken, logout, loading, roleAuth, setRoleAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
