// API Client Service - REAL BACKEND ONLY
import type { Restaurant, FilterOptions, FilterCriteria } from "../types/types";

// Docker/Vite will use this URL to talk to your Python container
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/**
 * Fetch restaurants with filtering
 */
export const fetchRestaurants = async (
  criteria?: FilterCriteria
): Promise<Restaurant[]> => {
  return fetchRestaurantsAPI(criteria);
};

/**
 * Fetch a single restaurant by ID
 */
export const fetchRestaurantById = async (
  id: string
): Promise<Restaurant | null> => {
  return fetchRestaurantByIdAPI(id);
};

/**
 * Fetch filter options (categories and budgets)
 */
export const fetchFilterOptions = async (): Promise<FilterOptions> => {
  return fetchFilterOptionsAPI();
};

// ============================================================================
// REAL API IMPLEMENTATIONS
// ============================================================================

async function fetchRestaurantsAPI(
  criteria?: FilterCriteria
): Promise<Restaurant[]> {
  const params = new URLSearchParams();

  if (criteria?.searchQuery) params.append("search", criteria.searchQuery);
  if (criteria?.category && criteria.category !== "All") params.append("category", criteria.category);
  if (criteria?.budgets?.length) params.append("budgets", criteria.budgets.join(","));
  if (criteria?.sides?.length) params.append("sides", criteria.sides.join(","));

  // Ensure we don't double-slash (e.g., api//restaurants)
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const url = `${baseUrl}/restaurants?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.restaurants || data; 
  } catch (error) {
    console.error("Failed to fetch restaurants from API:", error);
    // Return empty array on error so the UI doesn't crash
    return [];
  }
}

async function fetchRestaurantByIdAPI(id: string): Promise<Restaurant | null> {
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const url = `${baseUrl}/restaurants/${id}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch restaurant ${id} from API:`, error);
    return null;
  }
}

async function fetchFilterOptionsAPI(): Promise<FilterOptions> {
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const url = `${baseUrl}/filters`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch filter options from API:", error);
    // Return safe defaults if API fails
    return { categories: ["All"], budgets: [] };
  }
}