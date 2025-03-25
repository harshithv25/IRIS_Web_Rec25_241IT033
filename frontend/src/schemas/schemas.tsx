import { ReactNode } from "react";

export interface User {
  _id?: string;
  name: string;
  email: string;
  branch: string;
  roll_number: string;
  role: string;
  password?: string;
}

export interface AuthContextType {
  user: User | null;
  csrfToken: string | undefined;
  login: (
    email: string,
    password: string
  ) => Promise<{ isErr: boolean; errMessage: string }>;
  logout: () => void;
  register: (
    name: string,
    email: string,
    branch: string,
    roll_number: string,
    password: string,
    role: string
  ) => Promise<{ isErr: boolean; errMessage: string }>;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  uid: string;
}

export interface CSRFResponse {
  csrfToken: string;
}

export interface AuroraProps {
  colorStops?: string[];
  amplitude?: number;
  blend?: number;
  time?: number;
  speed?: number;
}

export interface GradientTextProps {
  children: ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
}

export interface CounterProps {
  to: number;
  from?: number;
  direction?: "up" | "down";
  delay?: number;
  duration?: number;
  className?: string;
  startWhen?: boolean;
  separator?: string;
  onStart?: () => void;
  onEnd?: () => void;
}
