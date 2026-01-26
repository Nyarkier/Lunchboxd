import { useEffect, useState } from "react";
import {
  getRestaurantRequests,
  getContactMessages,
} from "../services/adminService";
import type { RestaurantRequest, ContactMessage } from "../types/types";

export interface AdminStats {
  totalUsers: number;
  totalRestaurants: number;
  pendingRequests: number;
  totalReviews: number;
  unreadMessages: number;
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalRestaurants: 0,
    pendingRequests: 0,
    totalReviews: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load all required data
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const restaurants = JSON.parse(
          localStorage.getItem("restaurants") || "[]",
        );
        const reviews = JSON.parse(localStorage.getItem("reviews") || "[]");

        // Get pending requests from adminService
        const allRequests = await getRestaurantRequests();
        const pendingRequests = allRequests.filter(
          (req: RestaurantRequest) => req.status === "pending",
        ).length;

        // Get unread messages from adminService
        const messages = await getContactMessages();
        const unreadMessages = messages.filter(
          (msg: ContactMessage) => msg.status === "unread",
        ).length;

        setStats({
          totalUsers: users.length || 0,
          totalRestaurants: restaurants.length || 0,
          pendingRequests: pendingRequests,
          totalReviews: reviews.length || 0,
          unreadMessages: unreadMessages,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load stats");
        console.error("Error loading admin stats:", err);

        // Set fallback values on error
        setStats({
          totalUsers: 0,
          totalRestaurants: 0,
          pendingRequests: 0,
          totalReviews: 0,
          unreadMessages: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return { stats, loading, error };
}
