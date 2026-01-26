// Admin service for handling restaurant requests, contact messages, and admin operations
import type {
  RestaurantRequest,
  ContactMessage,
  User,
  Restaurant,
  Review,
} from "../types/types";
import adminData from "../../mock-backend/admin-data.json";

// Create mutable copies of mock data
// These are module-level variables that get mutated by the functions below
const restaurantRequests: RestaurantRequest[] =
  (adminData.restaurantRequests as RestaurantRequest[]) || [];
const contactMessages: ContactMessage[] =
  (adminData.contactMessages as ContactMessage[]) || [];

// Restaurant Requests
export const getRestaurantRequests = async (): Promise<RestaurantRequest[]> => {
  return restaurantRequests;
};

export const getRestaurantRequestById = async (
  id: string,
): Promise<RestaurantRequest | null> => {
  return restaurantRequests.find((r) => r.id === id) || null;
};

export const createRestaurantRequest = async (
  request: Omit<RestaurantRequest, "id" | "submittedAt" | "status">,
): Promise<RestaurantRequest> => {
  const newRequest: RestaurantRequest = {
    ...request,
    id: `req_${Date.now()}`,
    submittedAt: new Date().toISOString(),
    status: "pending",
  };

  restaurantRequests.push(newRequest);
  return newRequest;
};

export const updateRestaurantRequestStatus = async (
  id: string,
  status: "pending" | "approved" | "rejected",
): Promise<RestaurantRequest | null> => {
  const request = restaurantRequests.find((r) => r.id === id);
  if (request) {
    request.status = status;
    return request;
  }
  return null;
};

export const deleteRestaurantRequest = async (id: string): Promise<boolean> => {
  const index = restaurantRequests.findIndex((r) => r.id === id);
  if (index > -1) {
    restaurantRequests.splice(index, 1);
    return true;
  }
  return false;
};

// Contact Messages
export const getContactMessages = async (): Promise<ContactMessage[]> => {
  return contactMessages;
};

export const getContactMessageById = async (
  id: string,
): Promise<ContactMessage | null> => {
  return contactMessages.find((m) => m.id === id) || null;
};

export const createContactMessage = async (
  message: Omit<ContactMessage, "id" | "submittedAt" | "status">,
): Promise<ContactMessage> => {
  const newMessage: ContactMessage = {
    ...message,
    id: `msg_${Date.now()}`,
    submittedAt: new Date().toISOString(),
    status: "unread",
  };

  contactMessages.push(newMessage);
  return newMessage;
};

export const updateContactMessageStatus = async (
  id: string,
  status: "unread" | "read",
): Promise<ContactMessage | null> => {
  const message = contactMessages.find((m) => m.id === id);
  if (message) {
    message.status = status;
    return message;
  }
  return null;
};

export const deleteContactMessage = async (id: string): Promise<boolean> => {
  const index = contactMessages.findIndex((m) => m.id === id);
  if (index > -1) {
    contactMessages.splice(index, 1);
    return true;
  }
  return false;
};

// Dashboard statistics
export const getDashboardStats = async () => {
  const pendingRequests = restaurantRequests.filter(
    (r) => r.status === "pending",
  ).length;
  const approvedRequests = restaurantRequests.filter(
    (r) => r.status === "approved",
  ).length;
  const unreadMessages = contactMessages.filter(
    (m) => m.status === "unread",
  ).length;

  return {
    totalRestaurantRequests: restaurantRequests.length,
    pendingRequests,
    approvedRequests,
    totalContactMessages: contactMessages.length,
    unreadMessages,
  };
};

// User Management
export const getAllUsers = async (): Promise<User[]> => {
  // In a real app, this would fetch from backend
  try {
    const response = await fetch("/mock-backend/users.json");
    const users = await response.json();
    return users.filter((u: User) => u.role !== "admin");
  } catch {
    return [];
  }
};

export const getUserById = async (id: string): Promise<User | null> => {
  const users = await getAllUsers();
  return users.find((u) => u.id === id) || null;
};

export const getUserActivity = async (userId: string) => {
  // Returns mock activity data for a user
  return {
    userId,
    lastLogin: new Date().toISOString(),
    reviewsCount: Math.floor(Math.random() * 20),
    favoritesCount: Math.floor(Math.random() * 10),
    joinDate: new Date(
      2024,
      Math.random() * 12,
      Math.random() * 28,
    ).toISOString(),
  };
};

// Restaurant Management
export const getAllRestaurants = async (): Promise<Restaurant[]> => {
  try {
    const response = await fetch("/mock-backend/data.json");
    const data = await response.json();
    return data.restaurants || [];
  } catch {
    return [];
  }
};

export const getRestaurantById = async (
  id: string,
): Promise<Restaurant | null> => {
  const restaurants = await getAllRestaurants();
  return restaurants.find((r) => r.id === id) || null;
};

export const getPendingRestaurants = async (): Promise<RestaurantRequest[]> => {
  return restaurantRequests.filter((r) => r.status === "pending");
};

// Review Management
export const getAllReviews = async (): Promise<Review[]> => {
  try {
    const response = await fetch("/mock-backend/data.json");
    const data = await response.json();
    return data.reviews || [];
  } catch {
    return [];
  }
};

export const getReviewsByRestaurant = async (
  restaurantId: string,
): Promise<Review[]> => {
  const allReviews = await getAllReviews();
  return allReviews.filter((r) => r.restaurantId === restaurantId);
};

export const getReviewsByUser = async (userId: string): Promise<Review[]> => {
  const allReviews = await getAllReviews();
  return allReviews.filter((r) => r.userId === userId);
};

export const deleteReview = async (reviewId: string): Promise<boolean> => {
  // In a real app, this would call the backend API
  // For now, we'll just return true to indicate success
  console.log(`Deleted review: ${reviewId}`);
  return true;
};

export const flagReviewForModeration = async (
  reviewId: string,
  reason?: string,
): Promise<boolean> => {
  // In a real app, this would call the backend API
  console.log(`Flagged review ${reviewId} for moderation. Reason: ${reason}`);
  return true;
};

export const getReviewsRequiringModeration = async (): Promise<Review[]> => {
  // In a real app, this would return reviews flagged by users or low ratings
  const allReviews = await getAllReviews();
  return allReviews.filter((r) => r.rating < 2);
};
