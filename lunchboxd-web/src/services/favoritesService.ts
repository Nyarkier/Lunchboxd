// Favorites service using localStorage for persistence
import type { Restaurant, Favorite } from "../types/types";

const FAVORITES_STORAGE_KEY = "lunchboxd_favorites";

// Get favorites from localStorage
const getFavoritesFromStorage = (): Favorite[] => {
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to get favorites from localStorage:", error);
    return [];
  }
};

// Save favorites to localStorage
const saveFavoritesToStorage = (favorites: Favorite[]): void => {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error("Failed to save favorites to localStorage:", error);
  }
};

export const addFavorite = async (
  userId: string,
  restaurantId: string
): Promise<boolean> => {
  const favorites = getFavoritesFromStorage();
  const exists = favorites.find(
    (f) => f.userId === userId && f.restaurantId === restaurantId
  );

  if (!exists) {
    favorites.push({ userId, restaurantId });
    saveFavoritesToStorage(favorites);
    return true;
  }

  return false;
};

export const removeFavorite = async (
  userId: string,
  restaurantId: string
): Promise<boolean> => {
  const favorites = getFavoritesFromStorage();
  const index = favorites.findIndex(
    (f) => f.userId === userId && f.restaurantId === restaurantId
  );

  if (index > -1) {
    favorites.splice(index, 1);
    saveFavoritesToStorage(favorites);
    return true;
  }

  return false;
};

export const isFavorite = async (
  userId: string,
  restaurantId: string
): Promise<boolean> => {
  const favorites = getFavoritesFromStorage();
  return !!favorites.find(
    (f) => f.userId === userId && f.restaurantId === restaurantId
  );
};

export const getUserFavorites = async (
  userId: string,
  restaurants: Restaurant[]
): Promise<Restaurant[]> => {
  const favorites = getFavoritesFromStorage();
  const userFavoriteIds = favorites
    .filter((f) => f.userId === userId)
    .map((f) => f.restaurantId);

  return restaurants.filter((r) => userFavoriteIds.includes(r.id));
};

export const getAllFavorites = async (): Promise<Favorite[]> => {
  return getFavoritesFromStorage();
};
