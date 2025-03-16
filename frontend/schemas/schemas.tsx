export interface User {
  _id: string;
  name: string;
  email: string;
  branch: string;
  rollNumber: string;
  role: "user" | "admin";
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (
    name: string,
    email: string,
    branch: string,
    rollNumber: string,
    password: string,
    role: "user" | "admin"
  ) => Promise<void>;
}

export interface LoginResponse {
  token: string;
  user: User;
}
