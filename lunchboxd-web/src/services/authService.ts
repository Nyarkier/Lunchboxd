// Authentication service using mock backend users data
import type { User, AuthUser } from "../types/types";
import mockUsersData from "../../mock-backend/users.json";

// Create mutable copy of mock users data with proper typing
let mockUsers: User[] = (
  mockUsersData as Array<{
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    mobile: string;
    avatar: string;
    createdAt: string;
    role?: "user" | "admin";
  }>
).map((u) => ({
  ...u,
  role: (u.role || "user") as "user" | "admin",
}));

export const authenticateUser = async (
  username: string,
  password: string,
): Promise<AuthUser | null> => {
  const user = mockUsers.find(
    (u) =>
      (u.username === username || u.email === username) &&
      u.password === password,
  );

  if (user) {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      role: user.role || "user",
    };
  }

  return null;
};

export const registerUser = async (
  firstName: string,
  lastName: string,
  username: string,
  email: string,
  password: string,
): Promise<AuthUser | { error: string }> => {
  // Check if user already exists
  const existingUser = mockUsers.find(
    (u) => u.username === username || u.email === email,
  );

  if (existingUser) {
    return { error: "Username or email already exists" };
  }

  // Create new user
  const newUser: User = {
    id: (mockUsers.length + 1).toString(),
    firstName,
    lastName,
    username,
    email,
    password,
    mobile: "",
    avatar: null,
    createdAt: new Date().toISOString(),
    role: "user",
  };

  mockUsers.push(newUser);

  return {
    id: newUser.id,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    username: newUser.username,
    email: newUser.email,
    role: newUser.role,
  };
};

export const getUserById = async (id: string): Promise<AuthUser | null> => {
  const user = mockUsers.find((u) => u.id === id);

  if (user) {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      role: user.role || "user",
    };
  }

  return null;
};

export const getAllUsers = async (): Promise<User[]> => {
  return mockUsers;
};
