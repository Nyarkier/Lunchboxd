// Authentication service using REAL Python API
import type { User, AuthUser } from "../types/types";

// Get API URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/**
 * Log in a user through the real API
 */
export const authenticateUser = async (
  username: string,
  password: string,
): Promise<AuthUser | null> => {
  const url = `${API_BASE_URL}/login`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    // Assuming backend returns { user: AuthUser, token: string }
    return data.user || data;
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
};

/**
 * Register a new user through the real API
 */
export const registerUser = async (
  firstName: string,
  lastName: string,
  username: string,
  email: string,
  password: string,
): Promise<AuthUser | { error: string }> => {
  const url = `${API_BASE_URL}/users`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, username, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.detail || "Registration failed" };
    }

    return data;
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Server connection failed" };
  }
};

/**
 * Get user profile by ID from the API
 */
export const getUserById = async (id: string): Promise<AuthUser | null> => {
  const url = `${API_BASE_URL}/users/${id}`;

  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    return null;
  }
};

/**
 * Admin: Get all users from the API
 */
export const getAllUsers = async (): Promise<User[]> => {
  const url = `${API_BASE_URL}/users`;

  try {
    const response = await fetch(url);
    if (!response.ok) return [];
    const data = await response.json();
    return data.users || data;
  } catch (error) {
    console.error("Error fetching all users:", error);
    return [];
  }
};