"use client";

import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { baseUrl, myHeaders } from "../utils/api";
import { jwtDecode } from "jwt-decode";
import { AuthContextType, User } from "@/schemas/schemas";

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [csrfToken, setCsrfToken] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    getCsrfToken();

    if (token) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decoded: any = jwtDecode(token);
        console.log(decoded);
        setUser({
          _id: decoded.id,
          name: decoded.name,
          email: decoded.email,
          branch: decoded.branch,
          roll_number: decoded.rollNumber,
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

  const getCsrfToken = async () => {
    try {
      const res = await fetch(`${baseUrl}/csrf/`, {
        method: "GET",
        credentials: "include",
      }).catch((e) => {
        console.log(e);
      });
      const data = await res?.json();
      setCsrfToken(data.csrfToken);
      // return res.data.csrfToken;
    } catch (e) {
      console.error("Couldnt authorize your identity", e);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await getCsrfToken();

      myHeaders.append("X-CSRFToken", csrfToken);

      const res = await fetch(`${baseUrl}/auth/login/`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        credentials: "include",
        headers: myHeaders,
      }).catch((e) => {
        throw new Error(e);
      });
      const data = await res?.json();
      setUser(data.user);
      localStorage.setItem("token", data.token);
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
    roll_number: string,
    password: string,
    role: string
  ) => {
    try {
      await getCsrfToken();

      myHeaders.append("X-CSRFToken", csrfToken);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const res = await fetch(`${baseUrl}/auth/register/`, {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          branch,
          roll_number,
          password,
          role,
        }),
        credentials: "include",
        headers: myHeaders,
      }).catch((e) => {
        console.log(e);
      });
    } catch (err) {
      console.error("Register failed", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, csrfToken, login, logout, register }}>
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
