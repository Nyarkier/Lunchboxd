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
  if (USE_MOCK) {
    const favorites = getFavoritesFromStorage();
    const exists = favorites.find(
      (f) => f.userId === userId && f.restaurantId === restaurantId,
    );

    if (!exists) {
      favorites.push({ userId, restaurantId });
      saveFavoritesToStorage(favorites);
      return true;
    }

    return false;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users/favorites`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ userId, restaurantId }),
    });

    return response.ok;
  } catch (error) {
    console.error("Failed to add favorite:", error);
    return false;
  }
};

export const removeFavorite = async (
  userId: string,
  restaurantId: string,
): Promise<boolean> => {
  if (USE_MOCK) {
    const favorites = getFavoritesFromStorage();
    const index = favorites.findIndex(
      (f) => f.userId === userId && f.restaurantId === restaurantId,
    );

    if (index > -1) {
      favorites.splice(index, 1);
      saveFavoritesToStorage(favorites);
      return true;
    }

    return false;
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
    console.error("Failed to remove favorite:", error);
    return false;
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
      return false;
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
    console.error("Failed to check favorite:", error);
    return false;
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
      return [];
    }

    const data = await response.json();
    // Backend returns favorites with populated restaurantId
    return (data.favorites || []).map(
      (f: { restaurantId: Restaurant }) => f.restaurantId,
    );
  } catch (error) {
    console.error("Failed to get user favorites:", error);
    return [];
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
