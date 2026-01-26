import { useState, useEffect, type ReactNode } from "react";
import { authenticateUser, registerUser } from "../services/authService";
import { AuthContext, type AuthContextType } from "./AuthContextTypes";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  avatar?: string | null;
  role?: "user" | "admin";
}

export type { AuthContextType };

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse stored user:", err);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (usernameOrEmail: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Use authService from mock-backend
      const authUser = await authenticateUser(usernameOrEmail, password);

      if (!authUser) {
        throw new Error("Invalid username/email or password");
      }

      const userData: User = {
        id: authUser.id,
        email: authUser.email,
        firstName: authUser.firstName,
        lastName: authUser.lastName,
        username: authUser.username,
        role: authUser.role || "user",
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An error occurred during login";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string,
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      // Use authService from mock-backend
      const result = await registerUser(
        firstName,
        lastName,
        username,
        email,
        password,
      );

      if ("error" in result) {
        throw new Error(result.error);
      }

      const userData: User = {
        id: result.id,
        email: result.email,
        firstName: result.firstName,
        lastName: result.lastName,
        username: result.username,
        role: result.role || "user",
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An error occurred during signup";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem("user");
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isLoading,
    error,
    login,
    signup,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
