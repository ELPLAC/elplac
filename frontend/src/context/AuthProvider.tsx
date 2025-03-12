"use client";
import { isTokenExpired } from "@/helpers/auth";
import { IAuthContext, IAuthProviderProps } from "@/types";
import { useRouter, usePathname } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string>("");
  const [roleAuth, setRoleAuth] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const verifyToken = async () => {
      if (typeof window !== "undefined") {
        const storageToken = localStorage.getItem("token");
        const storageRole = localStorage.getItem("role");

        if (storageToken && storageRole) {
          if (isTokenExpired(storageToken)) { 
            logout(); 
            router.push("/login");
            return;
          }
          setToken(storageToken);
          setRoleAuth(storageRole);
        }
        setLoading(false);
      }
    };

    verifyToken();
  }, [router]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (token && isTokenExpired(token)) {
        logout();
        if (pathname !== "/login") {
          router.push("/login");
        }
      }
    }, 300000);

    return () => clearInterval(interval);
  }, [token, pathname, router]);

  const logout = () => {
    setRoleAuth("");
    setToken("");
    if (typeof window !== "undefined") { 
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    }
  };

  return (
    <AuthContext.Provider
      value={{ token, setToken, logout, loading, roleAuth, setRoleAuth }}
    >
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
