// User service - supports both mock and backend API
import type { User } from "../types/types";
import mockBackendData from "../../mock-backend/data.json";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

// Helper to get auth token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const USERS_STORAGE_KEY = "lunchboxd_users";

// Get users from mock backend and localStorage
const getUsersFromBackend = (): User[] => {
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error("Failed to parse stored users:", error);
    }
  }
  // Return mock users (stored separately since data.json doesn't have users field)
  const mockUsers = (mockBackendData as Record<string, unknown>).users as
    | User[]
    | undefined;
  return mockUsers || [];
};

// Update users in memory and localStorage (mock mode)
const updateBackendUsers = (users: User[]) => {
  (mockBackendData as Record<string, unknown>).users = users;
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error("Failed to save users to localStorage:", error);
  }
};

export const getUserById = async (userId: string): Promise<User | null> => {
  if (USE_MOCK) {
    const users = getUsersFromBackend();
    return users.find((u) => u.id === userId) || null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to get user:", error);
    return null;
  }
};

export const updateUserProfile = async (
  userId: string,
  updates: {
    firstName?: string;
    lastName?: string;
    username?: string;
    avatar?: string;
  },
): Promise<User> => {
  if (USE_MOCK) {
    const users = getUsersFromBackend();
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      throw new Error("User not found");
    }

    const updatedUser = {
      ...users[userIndex],
      ...updates,
    };

    users[userIndex] = updatedUser;
    updateBackendUsers(users);

    // Update localStorage user
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const updatedStoredUser = {
          ...user,
          firstName: updates.firstName || user.firstName,
          lastName: updates.lastName || user.lastName,
          username: updates.username || user.username,
        };
        localStorage.setItem("user", JSON.stringify(updatedStoredUser));
      } catch (error) {
        console.error("Failed to update stored user:", error);
      }
    }

    return updatedUser;
  }

  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update user");
  }

  const updatedUser = await response.json();

  // Update localStorage user
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      const updatedStoredUser = {
        ...user,
        firstName: updates.firstName || user.firstName,
        lastName: updates.lastName || user.lastName,
        username: updates.username || user.username,
      };
      localStorage.setItem("user", JSON.stringify(updatedStoredUser));
    } catch (error) {
      console.error("Failed to update stored user:", error);
    }
  }

  return updatedUser;
};

export const updateUserPassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<boolean> => {
  if (USE_MOCK) {
    const users = getUsersFromBackend();
    const user = users.find((u) => u.id === userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Verify current password
    if (user.password !== currentPassword) {
      throw new Error("Current password is incorrect");
    }

    // Update password
    user.password = newPassword;
    updateBackendUsers(users);

    return true;
  }

  const response = await fetch(`${API_BASE_URL}/users/${userId}/password`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update password");
  }

  return true;
};

export const getUserAvatar = (user: User | null): string => {
  if (!user) return "https://i.pravatar.cc/150?u=default";
  return user.avatar || `https://i.pravatar.cc/150?u=${user.id}`;
};
