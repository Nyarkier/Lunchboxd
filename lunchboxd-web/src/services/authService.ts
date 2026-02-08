// Authentication service using backend API
import type { User, AuthUser } from "../types/types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const authenticateUser = async (
  username: string,
  password: string,
): Promise<AuthUser | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Login failed");
    }

    const data = await response.json();

    // Store token in localStorage
    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    return {
      id: data.user.id,
      firstName: data.user.firstName,
      lastName: data.user.lastName,
      username: data.user.username,
      email: data.user.email,
      role: data.user.role || "user",
    };
  } catch (error) {
    console.error("Authentication error:", error);
    throw error;
  }
};

export const registerUser = async (
  firstName: string,
  lastName: string,
  username: string,
  email: string,
  password: string,
): Promise<AuthUser | { error: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, lastName, username, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error || "Registration failed" };
    }

    // Registration successful, now log the user in to get token and user data
    const loginResult = await authenticateUser(username, password);
    if (!loginResult) {
      return { error: "Registration succeeded, but login failed" };
    }

    return loginResult;
  } catch (error) {
    console.error("Registration error:", error);
    return {
      error: error instanceof Error ? error.message : "Registration failed",
    };
  }
};

export const getUserById = async (id: string): Promise<AuthUser | null> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const user = await response.json();
    return {
      id: user.id || user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      role: user.role || "user",
    };
  } catch (error) {
    console.error("Get user error:", error);
    return null;
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Get all users error:", error);
    return [];
  }
};
