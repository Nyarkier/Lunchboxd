import { createContext } from "react";

export interface AuthContextType {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    avatar?: string | null;
    role?: "user" | "admin";
  } | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  signup: (
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
