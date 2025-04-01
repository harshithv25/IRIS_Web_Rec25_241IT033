/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createContext, useState, ReactNode, useContext, useEffect } from "react";
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
        const decoded: any = jwtDecode(token);

        if (decoded.exp * 1000 < Date.now()) {
          console.log("Token expired");
          setUser(null);
          localStorage.removeItem("token"); // Clear expired token
        } else {
          setUser({
            _id: decoded._id,
            name: decoded.name,
            email: decoded.email,
            branch: decoded.branch,
            roll_number: decoded.roll_number,
            role: decoded.role,
          });
        }
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
      const res = await fetch(`${baseUrl}/users/csrf/`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Unable to provide a valid token");
      }

      const data = await res?.json();
      setCsrfToken(data.csrfToken);
    } catch {
      throw new Error("Couldnt authorize your identity");
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await getCsrfToken();

      myHeaders.append("X-CSRFToken", csrfToken);

      const res = await fetch(`${baseUrl}/users/login/`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        credentials: "include",
        headers: myHeaders,
      });

      if (!res.ok) {
        const err = await res.json();
        return { isErr: true, errMessage: err.error };
      }

      const data = await res.json();
      setUser(data.user);
      localStorage.setItem("token", data.token);
      return { isErr: false, errMessage: "" };
    } catch (error: any) {
      console.error("Login failed", error);
      return { isErr: true, errMessage: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  const register = async (name: string, email: string, branch: string, roll_number: string, password: string, role: string) => {
    try {
      await getCsrfToken();

      myHeaders.append("X-CSRFToken", csrfToken);

      const res = await fetch(`${baseUrl}/users/register/`, {
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
      });

      if (!res.ok) {
        const err = await res.json();
        return { isErr: true, errMessage: err.error };
      } else {
        return { isErr: false, errMessage: "" };
      }
    } catch (err: any) {
      console.error("Register failed", err);
      return { isErr: true, errMessage: err.message };
    }
  };

  return <AuthContext.Provider value={{ user, csrfToken, login, logout, register }}>{children}</AuthContext.Provider>;
};

// lets us access user anywhere in the application.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// in the create court form i need to make a few changes.
// const availableSlots = [
//   "11:00-12:00",
//   "12:00-13:00",
//   "13:00-14:00",
//   "14:00-15:00",
//   "15:00-16:00",
//   "16:00-17:00",
//   "17:00-18:00",
//   "18:00-19:00",
//   "19:00-20:00",
//   "20:00-21:00",
//   "21:00-22:00",
//   "22:00-23:00",
// ];

// I need it to display the hours in the ui but when sending the data to the backend i want it to send it with that days timestamp (of that hour) lets say i book it for 11-12 for tomorrow i need it to show [timestampof11amthenextday - timestampof12noonthenextday] but ofcourse when it is displayed, i want it to display just the hour. use moment js to achieve this.
