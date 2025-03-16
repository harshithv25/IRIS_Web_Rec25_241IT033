"use client";

import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import API from "../utils/api";
import { AuthContextType, User, LoginResponse } from "../schemas/schemas";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        console.log(decoded);
        setUser({
          _id: decoded.id,
          name: decoded.name,
          email: decoded.email,
          branch: decoded.branch,
          rollNumber: decoded.rollNumber,
          role: decoded.role,
        });
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    } else {
      setUser(null);
      localStorage.removeItem("token");
    }
  }, []);

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

  const register = async (
    name: string,
    email: string,
    branch: string,
    rollNumber: string,
    password: string,
    role: "user" | "admin"
  ) => {
    try {
      await API.post("/auth/register", {
        name,
        email,
        branch,
        rollNumber,
        password,
        role,
      }).then(() => {
        return 1;
      });
    } catch (err) {
      console.error("Register failed", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

// lets us access user anywhere in the application.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
