"use client";

import { createContext, useState, ReactNode, useContext } from "react";
import API from "../utils/api";
import { AuthContextType, User, LoginResponse } from "../schemas/schemas";

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const res = await API.post<LoginResponse>("/auth/login", {
        email,
        password,
      });
      setUser(res.data.user);
      localStorage.setItem("token", res.data.token);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
