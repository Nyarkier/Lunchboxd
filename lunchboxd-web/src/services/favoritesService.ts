// Favorites service - supports both mock and backend API
import type { Restaurant, Favorite } from "../types/types";

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

const FAVORITES_STORAGE_KEY = "lunchboxd_favorites";

// Get favorites from localStorage (mock mode)
const getFavoritesFromStorage = (): Favorite[] => {
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to get favorites from localStorage:", error);
    return [];
  }
};

// Save favorites to localStorage (mock mode)
const saveFavoritesToStorage = (favorites: Favorite[]): void => {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error("Failed to save favorites to localStorage:", error);
  }
};

export const addFavorite = async (
  userId: string,
  restaurantId: string,
): Promise<boolean> => {
  // Always save to localStorage for offline support
  const favorites = getFavoritesFromStorage();
  const exists = favorites.find(
    (f) => f.userId === userId && f.restaurantId === restaurantId,
  );
  if (!exists) {
    favorites.push({ userId, restaurantId });
    saveFavoritesToStorage(favorites);
  }

  if (USE_MOCK) {
    return !exists;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users/favorites`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ userId, restaurantId }),
    });

    return response.ok;
  } catch (error) {
    console.warn("Failed to sync favorite with API, saved locally:", error);
    return true; // Return true since we saved locally
  }
};

export const removeFavorite = async (
  userId: string,
  restaurantId: string,
): Promise<boolean> => {
  // Always remove from localStorage for offline support
  const favorites = getFavoritesFromStorage();
  const index = favorites.findIndex(
    (f) => f.userId === userId && f.restaurantId === restaurantId,
  );
  if (index > -1) {
    favorites.splice(index, 1);
    saveFavoritesToStorage(favorites);
  }

  if (USE_MOCK) {
    return index > -1;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/users/favorites/${userId}/${restaurantId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      },
    );

    return response.ok;
  } catch (error) {
    console.warn("Failed to sync unfavorite with API, removed locally:", error);
    return true; // Return true since we removed locally
  }
};

export const isFavorite = async (
  userId: string,
  restaurantId: string,
): Promise<boolean> => {
  if (USE_MOCK) {
    const favorites = getFavoritesFromStorage();
    return !!favorites.find(
      (f) => f.userId === userId && f.restaurantId === restaurantId,
    );
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users/favorites/${userId}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      // Fallback to localStorage
      console.warn("Failed to check favorite from API, using local storage");
      const favorites = getFavoritesFromStorage();
      return !!favorites.find(
        (f) => f.userId === userId && f.restaurantId === restaurantId,
      );
    }

    const data = await response.json();
    const favorites = data.favorites || [];
    return favorites.some(
      (f: { restaurantId: { _id: string } | string }) =>
        (typeof f.restaurantId === "object"
          ? f.restaurantId._id
          : f.restaurantId) === restaurantId,
    );
  } catch (error) {
    console.warn(
      "Failed to check favorite from API, using local storage:",
      error,
    );
    // Fallback to localStorage
    const favorites = getFavoritesFromStorage();
    return !!favorites.find(
      (f) => f.userId === userId && f.restaurantId === restaurantId,
    );
  }
};

export const getUserFavorites = async (
  userId: string,
  restaurants: Restaurant[],
): Promise<Restaurant[]> => {
  if (USE_MOCK) {
    const favorites = getFavoritesFromStorage();
    const userFavoriteIds = favorites
      .filter((f) => f.userId === userId)
      .map((f) => f.restaurantId);

    return restaurants.filter((r) => userFavoriteIds.includes(r.id));
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users/favorites/${userId}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      console.warn(
        "Failed to get user favorites from API, using local storage",
      );
      const favorites = getFavoritesFromStorage();
      const userFavoriteIds = favorites
        .filter((f) => f.userId === userId)
        .map((f) => f.restaurantId);
      return restaurants.filter((r) => userFavoriteIds.includes(r.id));
    }

    const data = await response.json();
    // Backend returns favorites with populated restaurantId
    return (data.favorites || []).map(
      (f: { restaurantId: Restaurant }) => f.restaurantId,
    );
  } catch (error) {
    console.warn(
      "Failed to get user favorites from API, using local storage:",
      error,
    );
    // Fallback to localStorage
    const favorites = getFavoritesFromStorage();
    const userFavoriteIds = favorites
      .filter((f) => f.userId === userId)
      .map((f) => f.restaurantId);
    return restaurants.filter((r) => userFavoriteIds.includes(r.id));
  }
};

export const getAllFavorites = async (): Promise<Favorite[]> => {
  if (USE_MOCK) {
    return getFavoritesFromStorage();
  }

  // In real API mode, this would require admin access
  // For now, return from localStorage as fallback
  return getFavoritesFromStorage();
};
