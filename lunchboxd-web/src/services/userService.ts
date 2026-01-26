import type { User } from "../types/types";
import mockBackendData from "../../mock-backend/data.json";

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

// Update users in memory and localStorage
const updateBackendUsers = (users: User[]) => {
  (mockBackendData as Record<string, unknown>).users = users;
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error("Failed to save users to localStorage:", error);
  }
};

export const getUserById = async (userId: string): Promise<User | null> => {
  const users = getUsersFromBackend();
  return users.find((u) => u.id === userId) || null;
};

export const updateUserProfile = async (
  userId: string,
  updates: {
    firstName?: string;
    lastName?: string;
    username?: string;
    avatar?: string;
  }
): Promise<User> => {
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
};

export const updateUserPassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<boolean> => {
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
};

export const getUserAvatar = (user: User | null): string => {
  if (!user) return "https://i.pravatar.cc/150?u=default";
  return user.avatar || `https://i.pravatar.cc/150?u=${user.id}`;
};
