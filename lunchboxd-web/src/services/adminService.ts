// Admin service - supports both mock and backend API
import type {
  RestaurantRequest,
  ContactMessage,
  User,
  Restaurant,
  Review,
} from "../types/types";
import adminData from "../../mock-backend/admin-data.json";

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

// Create mutable copies of mock data (mock mode)
const restaurantRequests: RestaurantRequest[] =
  (adminData.restaurantRequests as RestaurantRequest[]) || [];
const contactMessages: ContactMessage[] =
  (adminData.contactMessages as ContactMessage[]) || [];

// Restaurant Requests
export const getRestaurantRequests = async (): Promise<RestaurantRequest[]> => {
  if (USE_MOCK) {
    return restaurantRequests;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/admin/restaurant-requests`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    return data.requests || [];
  } catch (error) {
    console.error("Failed to get restaurant requests:", error);
    return [];
  }
};

export const getRestaurantRequestById = async (
  id: string,
): Promise<RestaurantRequest | null> => {
  if (USE_MOCK) {
    return restaurantRequests.find((r) => r.id === id) || null;
  }

  const requests = await getRestaurantRequests();
  return requests.find((r) => r.id === id) || null;
};

export const createRestaurantRequest = async (
  request: Omit<RestaurantRequest, "id" | "submittedAt" | "status">,
): Promise<RestaurantRequest> => {
  if (USE_MOCK) {
    const newRequest: RestaurantRequest = {
      ...request,
      id: `req_${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: "pending",
    };
    restaurantRequests.push(newRequest);
    return newRequest;
  }

  const response = await fetch(`${API_BASE_URL}/admin/restaurant-requests`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("Failed to create restaurant request");
  }

  const data = await response.json();
  return data.request;
};

export const updateRestaurantRequestStatus = async (
  id: string,
  status: "pending" | "approved" | "rejected",
): Promise<RestaurantRequest | null> => {
  if (USE_MOCK) {
    const request = restaurantRequests.find((r) => r.id === id);
    if (request) {
      request.status = status;
      return request;
    }
    return null;
  }

  const endpoint =
    status === "approved"
      ? `${API_BASE_URL}/admin/restaurant-requests/${id}/approve`
      : `${API_BASE_URL}/admin/restaurant-requests/${id}/reject`;

  try {
    const response = await fetch(endpoint, {
      method: "PUT",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      return null;
    }

    return await getRestaurantRequestById(id);
  } catch (error) {
    console.error("Failed to update restaurant request status:", error);
    return null;
  }
};

export const deleteRestaurantRequest = async (id: string): Promise<boolean> => {
  if (USE_MOCK) {
    const index = restaurantRequests.findIndex((r) => r.id === id);
    if (index > -1) {
      restaurantRequests.splice(index, 1);
      return true;
    }
    return false;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/restaurant-requests/${id}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      },
    );
    return response.ok;
  } catch (error) {
    console.error("Failed to delete restaurant request:", error);
    return false;
  }
};

// Contact Messages
export const getContactMessages = async (): Promise<ContactMessage[]> => {
  if (USE_MOCK) {
    return contactMessages;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/admin/messages`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    return data.messages || [];
  } catch (error) {
    console.error("Failed to get contact messages:", error);
    return [];
  }
};

export const getContactMessageById = async (
  id: string,
): Promise<ContactMessage | null> => {
  if (USE_MOCK) {
    return contactMessages.find((m) => m.id === id) || null;
  }

  const messages = await getContactMessages();
  return messages.find((m) => m.id === id) || null;
};

export const createContactMessage = async (
  message: Omit<ContactMessage, "id" | "submittedAt" | "status">,
): Promise<ContactMessage> => {
  if (USE_MOCK) {
    const newMessage: ContactMessage = {
      ...message,
      id: `msg_${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: "unread",
    };
    contactMessages.push(newMessage);
    return newMessage;
  }

  const response = await fetch(`${API_BASE_URL}/admin/messages`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(message),
  });

  if (!response.ok) {
    throw new Error("Failed to create contact message");
  }

  const data = await response.json();
  return data.message;
};

export const updateContactMessageStatus = async (
  id: string,
  status: "unread" | "read",
): Promise<ContactMessage | null> => {
  if (USE_MOCK) {
    const message = contactMessages.find((m) => m.id === id);
    if (message) {
      message.status = status;
      return message;
    }
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/admin/messages/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      return null;
    }

    return await getContactMessageById(id);
  } catch (error) {
    console.error("Failed to update contact message status:", error);
    return null;
  }
};

export const deleteContactMessage = async (id: string): Promise<boolean> => {
  if (USE_MOCK) {
    const index = contactMessages.findIndex((m) => m.id === id);
    if (index > -1) {
      contactMessages.splice(index, 1);
      return true;
    }
    return false;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/admin/messages/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return response.ok;
  } catch (error) {
    console.error("Failed to delete contact message:", error);
    return false;
  }
};

// Dashboard statistics
export const getDashboardStats = async () => {
  if (USE_MOCK) {
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
  }

  // Get data from API
  const [requests, messages] = await Promise.all([
    getRestaurantRequests(),
    getContactMessages(),
  ]);

  const pendingRequests = requests.filter((r) => r.status === "pending").length;
  const approvedRequests = requests.filter(
    (r) => r.status === "approved",
  ).length;
  const unreadMessages = messages.filter((m) => m.status === "unread").length;

  return {
    totalRestaurantRequests: requests.length,
    pendingRequests,
    approvedRequests,
    totalContactMessages: messages.length,
    unreadMessages,
  };
};

// User Management
export const getAllUsers = async (): Promise<User[]> => {
  if (USE_MOCK) {
    try {
      const response = await fetch("/mock-backend/users.json");
      const users = await response.json();
      return users.filter((u: User) => u.role !== "admin");
    } catch {
      return [];
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      return [];
    }
    const users = await response.json();
    return users.filter((u: User) => u.role !== "admin");
  } catch (error) {
    console.error("Failed to get all users:", error);
    return [];
  }
};

export const getUserById = async (id: string): Promise<User | null> => {
  if (USE_MOCK) {
    const users = await getAllUsers();
    return users.find((u) => u.id === id) || null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
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

export const getUserActivity = async (userId: string) => {
  // Returns mock activity data for a user (no backend endpoint for this)
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
  if (USE_MOCK) {
    try {
      const response = await fetch("/mock-backend/data.json");
      const data = await response.json();
      return data.restaurants || [];
    } catch {
      return [];
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}/restaurants`);
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    return data.restaurants || [];
  } catch (error) {
    console.error("Failed to get all restaurants:", error);
    return [];
  }
};

export const getRestaurantById = async (
  id: string,
): Promise<Restaurant | null> => {
  if (USE_MOCK) {
    const restaurants = await getAllRestaurants();
    return restaurants.find((r) => r.id === id) || null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/restaurants/${id}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data.restaurant;
  } catch (error) {
    console.error("Failed to get restaurant:", error);
    return null;
  }
};

export const getPendingRestaurants = async (): Promise<RestaurantRequest[]> => {
  const requests = await getRestaurantRequests();
  return requests.filter((r) => r.status === "pending");
};

// Review Management
export const getAllReviews = async (): Promise<Review[]> => {
  if (USE_MOCK) {
    try {
      const response = await fetch("/mock-backend/data.json");
      const data = await response.json();
      return data.reviews || [];
    } catch {
      return [];
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    return data.reviews || [];
  } catch (error) {
    console.error("Failed to get all reviews:", error);
    return [];
  }
};

export const getReviewsByRestaurant = async (
  restaurantId: string,
): Promise<Review[]> => {
  if (USE_MOCK) {
    const allReviews = await getAllReviews();
    return allReviews.filter((r) => r.restaurantId === restaurantId);
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/reviews/restaurant/${restaurantId}`,
    );
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    return data.reviews || [];
  } catch (error) {
    console.error("Failed to get reviews by restaurant:", error);
    return [];
  }
};

export const getReviewsByUser = async (userId: string): Promise<Review[]> => {
  const allReviews = await getAllReviews();
  return allReviews.filter((r) => r.userId === userId);
};

export const deleteReview = async (reviewId: string): Promise<boolean> => {
  if (USE_MOCK) {
    console.log(`Deleted review: ${reviewId}`);
    return true;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return response.ok;
  } catch (error) {
    console.error("Failed to delete review:", error);
    return false;
  }
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
